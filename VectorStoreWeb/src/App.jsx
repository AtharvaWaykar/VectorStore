import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Box,
  Boxes,
  Camera,
  Database,
  Download,
  Home,
  Loader2,
  LogOut,
  Map,
  Mic,
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Square,
  Trash2,
  Upload,
  Wand2,
} from 'lucide-react';
import { embedText, getEmbeddingModelLabel } from './lib/embeddings.js';
import { getMissingSupabaseEnv, isSupabaseConfigured, supabase } from './lib/supabase.js';
import {
  buildEmbeddingText,
  cosineSimilarity,
  keywordScore,
  normalizeLabel,
  parseVector,
  toPgVector,
} from './lib/search.js';

const DEFAULT_ROOMS = ['Garage', 'Kitchen', 'Bedroom', 'Office', 'Living Room', 'Basement'];
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'locations', label: 'Rooms', icon: Map },
  { id: 'capture', label: 'Add', icon: PackagePlus },
  { id: 'assistant', label: 'Assistant', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
];
const EMPTY_FORM = {
  name: '',
  description: '',
  qty: '1',
  unit: '',
  roomName: 'Garage',
  boxName: '',
  status: 'In Stock',
};

function mapItem(row) {
  return {
    id: row.id,
    name: row.name || '',
    description: row.description || '',
    qty: row.qty || '',
    unit: row.unit || '',
    status: row.status || 'In Stock',
    source: row.source || 'web',
    addedAt: row.added_at,
    updatedAt: row.updated_at,
    roomId: row.room_id || row.rooms?.id || null,
    boxId: row.box_id || row.boxes?.id || null,
    roomName: row.room_name || row.rooms?.name || 'Unassigned',
    boxName: row.box_name || row.boxes?.name || '',
    embedding: row.embedding,
    score: row.score ?? null,
  };
}

function normalizeNameForCompare(value) {
  return normalizeLabel(value).toLowerCase();
}

function sortItems(items, sortMode) {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sortMode === 'name') return a.name.localeCompare(b.name);
    if (sortMode === 'room') return `${a.roomName} ${a.boxName} ${a.name}`.localeCompare(`${b.roomName} ${b.boxName} ${b.name}`);
    if (sortMode === 'status') return `${a.status} ${a.name}`.localeCompare(`${b.status} ${b.name}`);
    if (sortMode === 'qty') return (Number(b.qty) || 0) - (Number(a.qty) || 0);
    if (sortMode === 'match') return (b.score ?? 0) - (a.score ?? 0);
    return new Date(b.updatedAt || b.addedAt || 0) - new Date(a.updatedAt || a.addedAt || 0);
  });
  return sorted;
}

function extractJson(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function fallbackCommand(text, rooms, boxes, defaultRoom) {
  const clean = normalizeLabel(text);
  const lower = clean.toLowerCase();
  const room = rooms.find(candidate => lower.includes(candidate.name.toLowerCase()))?.name || defaultRoom || 'Unassigned';
  const box = boxes.find(candidate => lower.includes(candidate.name.toLowerCase()))?.name || '';

  if (lower.startsWith('delete ') || lower.startsWith('remove ')) {
    return { intent: 'delete', name: clean.replace(/^(delete|remove)\s+/i, ''), room, box };
  }

  if (lower.startsWith('find ') || lower.startsWith('search ') || lower.startsWith('where ')) {
    return { intent: 'search', query: clean.replace(/^(find|search|where is|where are|where)\s+/i, '') || clean };
  }

  if (lower.startsWith('move ')) {
    const [, itemPart = clean, destinationPart = ''] = clean.match(/^move\s+(.+?)\s+(?:to|into|in)\s+(.+)$/i) || [];
    const destinationLower = destinationPart.toLowerCase();
    const destinationRoom = rooms.find(candidate => destinationLower.includes(candidate.name.toLowerCase()))?.name || room;
    const destinationBox = boxes.find(candidate => destinationLower.includes(candidate.name.toLowerCase()))?.name || box;
    return {
      intent: 'move',
      name: itemPart,
      room: destinationRoom,
      box: destinationBox,
    };
  }

  if (lower.startsWith('add ') || lower.startsWith('store ') || lower.startsWith('put ')) {
    let name = clean.replace(/^(add|store|put)\s+/i, '');
    name = name.split(/\s+(in|into|inside|to)\s+/i)[0] || name;
    return {
      intent: 'add',
      items: [{ name, qty: 1, room, box }],
    };
  }

  return { intent: 'search', query: clean };
}

function formatLocation(item) {
  const room = normalizeLabel(item?.roomName || item?.room || 'Unassigned');
  const box = normalizeLabel(item?.boxName || item?.box || '');
  return box ? `${room} / ${box}` : room;
}

function formatItemChange(item) {
  const qty = normalizeLabel(item?.qty || '1');
  const unit = normalizeLabel(item?.unit || '');
  return `${item.name} (${qty}${unit ? ` ${unit}` : ''}) in ${formatLocation(item)}`;
}

export default function App() {
  if (!isSupabaseConfigured) return <SetupRequired />;
  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let live = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!live) return;
      setSession(data.session || null);
      setAuthLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      live = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (authLoading) return <FullScreenStatus label="Checking session" />;
  if (!session) return <AuthScreen />;
  return <InventoryApp session={session} />;
}

function InventoryApp({ session }) {
  const user = session.user;
  const importInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const [activePage, setActivePage] = useState('home');
  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [roomFilter, setRoomFilter] = useState('all');
  const [boxFilter, setBoxFilter] = useState('all');
  const [sortMode, setSortMode] = useState('updated');
  const [roomForm, setRoomForm] = useState('');
  const [boxForm, setBoxForm] = useState({ roomId: '', name: '' });
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraItems, setCameraItems] = useState([]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([
    { role: 'assistant', content: 'Ask me to add, find, or remove inventory. I can use your rooms and boxes as context.' },
  ]);
  const [settings, setSettings] = useState(() => ({
    defaultRoom: window.localStorage.getItem('vectorstore.defaultRoom') || 'Garage',
    ttsEnabled: window.localStorage.getItem('vectorstore.ttsEnabled') === 'true',
    preferCloudVectorSearch: window.localStorage.getItem('vectorstore.preferCloudVectorSearch') !== 'false',
  }));
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const defaultRoom = settings.defaultRoom || rooms[0]?.name || 'Garage';

  const fetchEverything = useCallback(async () => {
    setLoading(true);
    setError('');

    const [roomsResult, boxesResult, itemsResult] = await Promise.all([
      supabase.from('rooms').select('id,name,created_at').order('name'),
      supabase.from('boxes').select('id,name,room_id,rooms(id,name)').order('name'),
      supabase
        .from('items')
        .select('id,name,description,qty,unit,status,source,added_at,updated_at,embedding,room_id,box_id,rooms(id,name),boxes(id,name)')
        .order('updated_at', { ascending: false }),
    ]);

    if (roomsResult.error || boxesResult.error || itemsResult.error) {
      setError(roomsResult.error?.message || boxesResult.error?.message || itemsResult.error?.message);
      setLoading(false);
      return;
    }

    let nextRooms = roomsResult.data || [];
    if (nextRooms.length === 0) {
      const { data, error: insertError } = await supabase
        .from('rooms')
        .insert(DEFAULT_ROOMS.map(name => ({ user_id: user.id, name })))
        .select('id,name,created_at')
        .order('name');

      if (insertError) setError(insertError.message);
      else nextRooms = data || [];
    }

    setRooms(nextRooms);
    setBoxes(boxesResult.data || []);
    setItems((itemsResult.data || []).map(mapItem));
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchEverything();
  }, [fetchEverything]);

  useEffect(() => {
    if (!rooms.length) return;
    const hasDefaultRoom = rooms.some(room => room.name === settings.defaultRoom);
    const nextDefaultRoom = hasDefaultRoom ? settings.defaultRoom : rooms[0].name;

    if (!hasDefaultRoom) {
      setSettings(current => ({ ...current, defaultRoom: nextDefaultRoom }));
    }
    if (!form.roomName || !rooms.some(room => room.name === form.roomName)) {
      setForm(current => ({ ...current, roomName: nextDefaultRoom, boxName: '' }));
    }
    if (!boxForm.roomId || !rooms.some(room => room.id === boxForm.roomId)) {
      setBoxForm(current => ({ ...current, roomId: rooms[0].id }));
    }
  }, [boxForm.roomId, form.roomName, rooms, settings.defaultRoom]);

  useEffect(() => {
    if (!form.boxName) return;
    const room = rooms.find(candidate => candidate.name === form.roomName);
    const boxStillAvailable = room && boxes.some(box => box.room_id === room.id && box.name === form.boxName);
    if (!boxStillAvailable) setForm(current => ({ ...current, boxName: '' }));
  }, [boxes, form.boxName, form.roomName, rooms]);

  useEffect(() => {
    window.localStorage.setItem('vectorstore.defaultRoom', settings.defaultRoom || '');
    window.localStorage.setItem('vectorstore.ttsEnabled', String(settings.ttsEnabled));
    window.localStorage.setItem('vectorstore.preferCloudVectorSearch', String(settings.preferCloudVectorSearch));
  }, [settings]);

  useEffect(() => {
    if (videoRef.current && cameraStream) videoRef.current.srcObject = cameraStream;
  }, [cameraStream]);

  useEffect(() => () => {
    cameraStream?.getTracks().forEach(track => track.stop());
    recognitionRef.current?.stop?.();
  }, [cameraStream]);

  const inventorySummary = useMemo(() => {
    const totalUnits = items.reduce((sum, item) => {
      const parsed = Number(item.qty);
      return sum + (Number.isFinite(parsed) ? parsed : 1);
    }, 0);
    return { items: items.length, units: totalUnits, rooms: rooms.length, boxes: boxes.length };
  }, [boxes.length, items, rooms.length]);

  const boxesForSelectedRoom = useMemo(() => {
    const room = rooms.find(candidate => candidate.name === form.roomName);
    if (!room) return [];
    return boxes.filter(box => box.room_id === room.id);
  }, [boxes, form.roomName, rooms]);
  const selectedRoomBoxes = roomFilter === 'all'
    ? boxes
    : boxes.filter(box => box.rooms?.name === roomFilter || rooms.find(room => room.id === box.room_id)?.name === roomFilter);
  const visibleItems = useMemo(() => {
    const base = searchResults || items;
    const filtered = base.filter(item => {
      const roomOk = roomFilter === 'all' || item.roomName === roomFilter;
      const boxOk = boxFilter === 'all' || item.boxName === boxFilter;
      return roomOk && boxOk;
    });
    return sortItems(filtered, searchResults && sortMode === 'updated' ? 'match' : sortMode);
  }, [boxFilter, items, roomFilter, searchResults, sortMode]);

  async function ensureRoom(name) {
    const roomName = normalizeLabel(name || 'Unassigned');
    const existing = rooms.find(room => normalizeNameForCompare(room.name) === normalizeNameForCompare(roomName));
    if (existing) return existing;

    const { data, error: roomError } = await supabase
      .from('rooms')
      .upsert({ user_id: user.id, name: roomName }, { onConflict: 'user_id,name' })
      .select('id,name,created_at')
      .single();

    if (roomError) throw roomError;
    setRooms(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
    return data;
  }

  async function ensureBox(name, room) {
    const boxName = normalizeLabel(name);
    if (!boxName) return null;
    const existing = boxes.find(box => box.room_id === room.id && normalizeNameForCompare(box.name) === normalizeNameForCompare(boxName));
    if (existing) return existing;

    const { data: roomBoxes, error: lookupError } = await supabase
      .from('boxes')
      .select('id,name,room_id,rooms(id,name)')
      .eq('room_id', room.id);

    if (lookupError) throw lookupError;
    const persistedExisting = (roomBoxes || []).find(box => normalizeNameForCompare(box.name) === normalizeNameForCompare(boxName));
    if (persistedExisting) {
      setBoxes(current => {
        const exists = current.some(box => box.id === persistedExisting.id);
        return exists ? current : [...current, persistedExisting].sort((a, b) => a.name.localeCompare(b.name));
      });
      return persistedExisting;
    }

    const { data, error: boxError } = await supabase
      .from('boxes')
      .upsert({ user_id: user.id, room_id: room.id, name: boxName }, { onConflict: 'user_id,room_id,name' })
      .select('id,name,room_id,rooms(id,name)')
      .single();

    if (boxError) throw boxError;
    setBoxes(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
    return data;
  }

  async function addItemFromData(itemData) {
    const name = normalizeLabel(itemData.name);
    if (!name) throw new Error('Item name is required.');
    const room = await ensureRoom(itemData.roomName || itemData.room || defaultRoom);
    const box = await ensureBox(itemData.boxName || itemData.box, room);
    const itemForEmbedding = { ...itemData, name, roomName: room.name, boxName: box?.name || '' };
    const embedding = await embedText(buildEmbeddingText(itemForEmbedding));

    const { data, error: insertError } = await supabase
      .from('items')
      .insert({
        user_id: user.id,
        room_id: room.id,
        box_id: box?.id || null,
        name,
        description: normalizeLabel(itemData.description),
        qty: normalizeLabel(itemData.qty || '1'),
        unit: normalizeLabel(itemData.unit),
        status: normalizeLabel(itemData.status || 'In Stock'),
        source: itemData.source || 'web',
        embedding: toPgVector(embedding),
      })
      .select('id,name,description,qty,unit,status,source,added_at,updated_at,embedding,room_id,box_id,rooms(id,name),boxes(id,name)')
      .single();

    if (insertError) throw insertError;
    return mapItem(data);
  }

  async function handleAddItem(event, source = 'web') {
    event?.preventDefault();
    setWorking(true);
    setError('');
    setMessage('');
    try {
      const stored = await addItemFromData({ ...form, source });
      setItems(current => [stored, ...current]);
      setSearchResults(null);
      setForm(current => ({ ...EMPTY_FORM, roomName: current.roomName, boxName: current.boxName }));
      setMessage(`Saved ${formatItemChange(stored)}.`);
    } catch (addError) {
      setError(addError.message || String(addError));
    } finally {
      setWorking(false);
    }
  }

  async function performSearch(searchText, { announce = true, updateResults = true } = {}) {
    const cleanQuery = normalizeLabel(searchText);
    if (!cleanQuery) {
      setSearchResults(null);
      return [];
    }
    const queryEmbedding = await embedText(cleanQuery);
    if (settings.preferCloudVectorSearch) {
      const rpcName = import.meta.env.VITE_MATCH_ITEMS_RPC || 'match_items';
      const { data, error: rpcError } = await supabase.rpc(rpcName, {
        query_embedding: toPgVector(queryEmbedding),
        match_count: 40,
        min_similarity: 0.25,
      });
      if (!rpcError && Array.isArray(data)) {
        const result = data.map(mapItem);
        if (updateResults) setSearchResults(result);
        if (announce) setMessage(`Found ${result.length} cloud result${result.length === 1 ? '' : 's'}.`);
        return result;
      }
    }

    const fallback = items
      .map(item => {
        const vector = parseVector(item.embedding);
        const semantic = vector.length ? cosineSimilarity(queryEmbedding, vector) : 0;
        const keyword = keywordScore(cleanQuery, item);
        return { ...item, score: Math.max(semantic, keyword) };
      })
      .filter(item => item.score >= 0.18)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    if (updateResults) setSearchResults(fallback);
    if (announce) setMessage(`Found ${fallback.length} local result${fallback.length === 1 ? '' : 's'}.`);
    return fallback;
  }

  async function handleSearch(event) {
    event?.preventDefault();
    setWorking(true);
    setError('');
    setMessage('');
    try {
      await performSearch(query);
    } catch (searchError) {
      setError(searchError.message || String(searchError));
    } finally {
      setWorking(false);
    }
  }

  async function handleDelete(id) {
    setWorking(true);
    setError('');
    setMessage('');
    const { error: deleteError } = await supabase.from('items').delete().eq('id', id);
    if (deleteError) setError(deleteError.message);
    else {
      setItems(current => current.filter(item => item.id !== id));
      setSearchResults(current => current?.filter(item => item.id !== id) || null);
      setMessage('Item deleted.');
    }
    setWorking(false);
  }

  async function handleAddRoom(event) {
    event.preventDefault();
    setWorking(true);
    setError('');
    try {
      const room = await ensureRoom(roomForm);
      setRoomForm('');
      setSettings(current => ({ ...current, defaultRoom: current.defaultRoom || room.name }));
      setMessage(`Room saved: ${room.name}.`);
    } catch (roomError) {
      setError(roomError.message || String(roomError));
    } finally {
      setWorking(false);
    }
  }

  async function handleDeleteRoom(roomId) {
    setWorking(true);
    setError('');
    setMessage('');
    const { error: deleteError } = await supabase.from('rooms').delete().eq('id', roomId);
    if (deleteError) setError(deleteError.message);
    else {
      await fetchEverything();
      setMessage('Room removed. Items from that room are now unassigned.');
    }
    setWorking(false);
  }

  async function handleAddBox(event) {
    event.preventDefault();
    const room = rooms.find(candidate => candidate.id === boxForm.roomId);
    if (!room) return setError('Choose a room for the box.');
    setWorking(true);
    setError('');
    try {
      const box = await ensureBox(boxForm.name, room);
      setBoxForm(current => ({ ...current, name: '' }));
      setMessage(`Box saved: ${box.name}.`);
    } catch (boxError) {
      setError(boxError.message || String(boxError));
    } finally {
      setWorking(false);
    }
  }

  async function handleDeleteBox(boxId) {
    setWorking(true);
    setError('');
    setMessage('');
    const { error: deleteError } = await supabase.from('boxes').delete().eq('id', boxId);
    if (deleteError) setError(deleteError.message);
    else {
      await fetchEverything();
      setMessage('Box removed. Items from that box remain in their room.');
    }
    setWorking(false);
  }

  function findInventoryItem(name) {
    const target = normalizeNameForCompare(name);
    if (!target) return null;
    return items.find(item => {
      const itemName = normalizeNameForCompare(item.name);
      return itemName === target || itemName.includes(target) || target.includes(itemName);
    }) || null;
  }

  async function moveItemByAction(action) {
    const match = findInventoryItem(action.name || action.item || action.itemName);
    if (!match) return `I could not find ${action.name || action.item || 'that item'} to move.`;

    const previousLocation = formatLocation(match);
    const nextRoomName = action.toRoom || action.roomName || action.room || match.roomName || defaultRoom;
    const nextBoxName = action.toBox || action.boxName || action.box || '';
    const room = await ensureRoom(nextRoomName);
    const box = await ensureBox(nextBoxName, room);
    const movedItem = {
      ...match,
      roomName: room.name,
      boxName: box?.name || '',
    };
    const embedding = await embedText(buildEmbeddingText(movedItem));

    const { data, error: moveError } = await supabase
      .from('items')
      .update({
        room_id: room.id,
        box_id: box?.id || null,
        embedding: toPgVector(embedding),
      })
      .eq('id', match.id)
      .select('id,name,description,qty,unit,status,source,added_at,updated_at,embedding,room_id,box_id,rooms(id,name),boxes(id,name)')
      .single();

    if (moveError) throw moveError;
    const updated = mapItem(data);
    setItems(current => current.map(item => item.id === updated.id ? updated : item));
    setSearchResults(current => current?.map(item => item.id === updated.id ? { ...updated, score: item.score } : item) || null);
    return `Moved ${updated.name} from ${previousLocation} to ${formatLocation(updated)}.`;
  }

  async function executeCommand(action, originLabel = 'assistant') {
    if (!action || !action.intent) throw new Error('Assistant did not return an inventory action.');
    if (action.intent === 'add') {
      const nextItems = Array.isArray(action.items) ? action.items : [action];
      const stored = [];
      for (const item of nextItems) {
        stored.push(await addItemFromData({
          name: item.name,
          qty: item.qty || '1',
          unit: item.unit || '',
          roomName: item.room || item.roomName || defaultRoom,
          boxName: item.box || item.boxName || '',
          description: item.description || '',
          status: item.status || 'In Stock',
          source: originLabel,
        }));
      }
      setItems(current => [...stored, ...current]);
      return `Added ${stored.map(formatItemChange).join('; ')}.`;
    }

    if (action.intent === 'search') {
      const found = await performSearch(action.query || action.name || '', { announce: false, updateResults: false });
      return found.length
        ? `Found ${found.length} item${found.length === 1 ? '' : 's'}: ${found.slice(0, 5).map(item => `${item.name} in ${item.roomName}${item.boxName ? ` / ${item.boxName}` : ''}`).join('; ')}.`
        : 'No matching items found.';
    }

    if (action.intent === 'move') {
      return moveItemByAction(action);
    }

    if (action.intent === 'delete') {
      const match = findInventoryItem(action.name);
      if (!match) return `I could not find ${action.name || 'that item'} to remove.`;
      await supabase.from('items').delete().eq('id', match.id);
      setItems(current => current.filter(item => item.id !== match.id));
      setSearchResults(current => current?.filter(item => item.id !== match.id) || null);
      return `Removed ${formatItemChange(match)}.`;
    }

    return 'I can add, search, move, or delete inventory items.';
  }

  async function askAssistant(text, originLabel = 'assistant') {
    const clean = normalizeLabel(text);
    if (!clean) return;
    setWorking(true);
    setError('');
    setMessage('');
    setAssistantMessages(current => [...current, { role: 'user', content: clean }]);
    try {
      const systemPrompt = `You manage a home inventory. Return only JSON: {"action":{"intent":"add|search|move|delete|unknown","items":[{"name":string,"qty":number|string,"room":string,"box":string,"description":string}],"query":string,"name":string,"room":string,"box":string,"toRoom":string,"toBox":string},"dialogue":string}. For move, set name to the item and room/box or toRoom/toBox to the destination. Known rooms: ${rooms.map(room => room.name).join(', ')}. Known boxes: ${boxes.map(box => `${box.name} (${box.rooms?.name || rooms.find(room => room.id === box.room_id)?.name || 'room'})`).join(', ')}.`;
      const { data, error: fnError } = await supabase.functions.invoke('llm', {
        body: { text: clean, systemPrompt },
      });
      let parsed = fnError ? null : extractJson(data?.raw);
      if (!parsed?.action) {
        const localAction = fallbackCommand(clean, rooms, boxes, defaultRoom);
        parsed = {
          action: localAction,
          dialogue: fnError ? 'The LLM function is not available yet, so I used the local parser.' : 'I handled that with the local parser.',
        };
      }
      const actionReply = await executeCommand(parsed.action, originLabel);
      const reply = [parsed.dialogue, actionReply].filter(Boolean).join(' ');
      setAssistantMessages(current => [...current, { role: 'assistant', content: reply }]);
      if (settings.ttsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(reply));
      }
    } catch (assistantError) {
      const reply = assistantError.message || String(assistantError);
      setAssistantMessages(current => [...current, { role: 'assistant', content: reply }]);
      setError(reply);
    } finally {
      setWorking(false);
    }
  }

  function startVoice(writeTranscript = setAssistantInput) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not available in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setVoiceStatus('recording');
    recognition.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0]?.transcript || '').join(' ').trim();
      writeTranscript(transcript);
    };
    recognition.onerror = event => {
      setVoiceStatus('idle');
      setError(event.error || 'Voice recognition failed.');
    };
    recognition.onend = () => setVoiceStatus('idle');
    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopVoice() {
    recognitionRef.current?.stop?.();
    setVoiceStatus('idle');
  }

  async function startCamera() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setCameraStream(stream);
    } catch (cameraError) {
      setError(cameraError.message || 'Camera access failed.');
    }
  }

  function stopCamera() {
    cameraStream?.getTracks().forEach(track => track.stop());
    setCameraStream(null);
  }

  async function scanCameraFrame() {
    if (!videoRef.current || !canvasRef.current) return;
    setWorking(true);
    setError('');
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 960;
      canvas.height = video.videoHeight || 1280;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
      const { data, error: fnError } = await supabase.functions.invoke('cv', { body: { imageBase64 } });
      if (fnError) throw new Error(fnError.message || 'Camera AI function is not available.');
      const detected = Array.isArray(data?.items) ? data.items : [];
      setCameraItems(detected.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        name: normalizeLabel(item.name),
        qty: String(item.qty || 1),
        roomName: form.roomName || defaultRoom,
        boxName: form.boxName || '',
      })).filter(item => item.name));
      setMessage(`Detected ${detected.length} item${detected.length === 1 ? '' : 's'}.`);
    } catch (scanError) {
      setError(`${scanError.message || scanError} Deploy the cv Edge Function and set GROQ_API_KEY to use camera recognition.`);
    } finally {
      setWorking(false);
    }
  }

  async function saveCameraItems() {
    setWorking(true);
    setError('');
    try {
      const stored = [];
      for (const item of cameraItems) {
        stored.push(await addItemFromData({ ...item, source: 'camera' }));
      }
      setItems(current => [...stored, ...current]);
      setCameraItems([]);
      setMessage(`Saved ${stored.map(formatItemChange).join('; ')}.`);
    } catch (saveError) {
      setError(saveError.message || String(saveError));
    } finally {
      setWorking(false);
    }
  }

  function handleExport() {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      items: items.map(({ embedding, score, ...item }) => item),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `vectorstore-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file) {
    if (!file) return;
    setWorking(true);
    setError('');
    setMessage('');
    try {
      const parsed = JSON.parse(await file.text());
      const importedItems = Array.isArray(parsed.items) ? parsed.items : [];
      if (!importedItems.length) throw new Error('No items were found in that backup file.');
      const stored = [];
      for (const item of importedItems) {
        if (!normalizeLabel(item.name)) continue;
        stored.push(await addItemFromData({
          name: item.name,
          description: item.description || '',
          qty: item.qty || '1',
          unit: item.unit || '',
          status: item.status || 'In Stock',
          roomName: item.roomName || item.room || 'Unassigned',
          boxName: item.boxName || item.box || '',
          source: 'import',
        }));
      }
      await fetchEverything();
      setSearchResults(null);
      setMessage(`Imported ${stored.length} item${stored.length === 1 ? '' : 's'}.`);
    } catch (importError) {
      setError(importError.message || String(importError));
    } finally {
      setWorking(false);
      if (importInputRef.current) importInputRef.current.value = '';
    }
  }

  const pageTitle = NAV_ITEMS.find(item => item.id === activePage)?.label || 'Home';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Boxes size={21} /></div>
          <div>
            <h1>VectorStore</h1>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={activePage === item.id ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage(item.id)}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="metric-grid">
          <Metric label="Items" value={inventorySummary.items} />
          <Metric label="Units" value={inventorySummary.units} />
          <Metric label="Rooms" value={inventorySummary.rooms} />
          <Metric label="Boxes" value={inventorySummary.boxes} />
        </div>

        <div className="sidebar-panel">
          <div className="panel-heading"><ShieldCheck size={16} /> Synced Storage</div>
          <p>Inventory is tied to your authenticated account and protected by Supabase row security.</p>
        </div>

        <div className="sidebar-actions">
          <button className="secondary-btn" onClick={fetchEverything} disabled={working || loading}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="secondary-btn" onClick={() => supabase.auth.signOut()}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Cloud inventory</p>
            <h2>{pageTitle === 'Home' ? 'Inventory and semantic search.' : pageTitle}</h2>
          </div>
          <div className="model-chip">
            <Database size={15} />
            {getEmbeddingModelLabel()}
          </div>
        </header>

        {(message || error) && <div className={error ? 'notice error' : 'notice'}>{error || message}</div>}

        {activePage === 'home' && (
          <HomePage
            loading={loading}
            working={working}
            items={visibleItems}
            query={query}
            setQuery={setQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            handleSearch={handleSearch}
            roomFilter={roomFilter}
            setRoomFilter={setRoomFilter}
            boxFilter={boxFilter}
            setBoxFilter={setBoxFilter}
            sortMode={sortMode}
            setSortMode={setSortMode}
            rooms={rooms}
            boxes={selectedRoomBoxes}
            onDelete={handleDelete}
          />
        )}

        {activePage === 'locations' && (
          <LocationsPage
            rooms={rooms}
            boxes={boxes}
            roomForm={roomForm}
            setRoomForm={setRoomForm}
            boxForm={boxForm}
            setBoxForm={setBoxForm}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
            onAddBox={handleAddBox}
            onDeleteBox={handleDeleteBox}
            working={working}
          />
        )}

        {activePage === 'capture' && (
          <CapturePage
            form={form}
            setForm={setForm}
            rooms={rooms}
            boxesForSelectedRoom={boxesForSelectedRoom}
            onAddItem={handleAddItem}
            working={working}
            cameraStream={cameraStream}
            startCamera={startCamera}
            stopCamera={stopCamera}
            scanCameraFrame={scanCameraFrame}
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraItems={cameraItems}
            setCameraItems={setCameraItems}
            saveCameraItems={saveCameraItems}
          />
        )}

        {activePage === 'assistant' && (
          <AssistantPage
            messages={assistantMessages}
            input={assistantInput}
            setInput={setAssistantInput}
            onSubmit={event => {
              event.preventDefault();
              const text = assistantInput;
              setAssistantInput('');
              askAssistant(text, 'assistant');
            }}
            working={working}
            voiceStatus={voiceStatus}
            startVoice={() => startVoice(setAssistantInput)}
            stopVoice={stopVoice}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            user={user}
            settings={settings}
            setSettings={setSettings}
            rooms={rooms}
            importInputRef={importInputRef}
            handleImport={handleImport}
            handleExport={handleExport}
            itemCount={items.length}
            working={working}
          />
        )}
      </main>

      <nav className="mobile-nav" aria-label="Mobile primary">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={activePage === item.id ? 'active' : ''} onClick={() => setActivePage(item.id)} aria-label={item.label}>
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function HomePage({
  loading,
  working,
  items,
  query,
  setQuery,
  searchResults,
  setSearchResults,
  handleSearch,
  roomFilter,
  setRoomFilter,
  boxFilter,
  setBoxFilter,
  sortMode,
  setSortMode,
  rooms,
  boxes,
  onDelete,
}) {
  return (
    <section className="page-stack">
      <form className="tool-panel" onSubmit={handleSearch}>
        <label htmlFor="search">Search inventory</label>
        <div className="inline-control">
          <Search size={18} />
          <input id="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find batteries, party supplies, winter gear..." />
          <button type="submit" disabled={working || loading}>Search</button>
        </div>
      </form>

      <section className="inventory-panel">
        <div className="inventory-header">
          <div className="section-title">
            <Boxes size={18} />
            <h3>{searchResults ? 'Search Results' : 'Inventory'}</h3>
          </div>
          {searchResults && <button className="secondary-btn" onClick={() => { setSearchResults(null); setQuery(''); }}>Show all</button>}
        </div>

        <div className="filters">
          <select value={roomFilter} onChange={event => { setRoomFilter(event.target.value); setBoxFilter('all'); }}>
            <option value="all">All rooms</option>
            {rooms.map(room => <option key={room.id} value={room.name}>{room.name}</option>)}
          </select>
          <select value={boxFilter} onChange={event => setBoxFilter(event.target.value)}>
            <option value="all">All boxes</option>
            {boxes.map(box => <option key={box.id} value={box.name}>{box.name}</option>)}
          </select>
          <select value={sortMode} onChange={event => setSortMode(event.target.value)}>
            <option value="updated">Recently updated</option>
            <option value="name">Name</option>
            <option value="room">Room and box</option>
            <option value="qty">Quantity</option>
            <option value="status">Status</option>
            <option value="match">Best match</option>
          </select>
        </div>

        {loading ? <FullPanelStatus label="Loading account storage" /> : <ItemList items={items} onDelete={onDelete} working={working} />}
      </section>
    </section>
  );
}

function LocationsPage({ rooms, boxes, roomForm, setRoomForm, boxForm, setBoxForm, onAddRoom, onDeleteRoom, onAddBox, onDeleteBox, working }) {
  return (
    <section className="split-grid">
      <div className="tool-panel">
        <div className="section-title"><Map size={18} /><h3>Rooms</h3></div>
        <form className="compact-form" onSubmit={onAddRoom}>
          <input value={roomForm} onChange={event => setRoomForm(event.target.value)} placeholder="Laundry Room" required />
          <button className="primary-btn" disabled={working}><Plus size={16} /> Add Room</button>
        </form>
        <div className="location-list">
          {rooms.map(room => (
            <article className="location-row" key={room.id}>
              <div><strong>{room.name}</strong><span>{boxes.filter(box => box.room_id === room.id).length} boxes</span></div>
              <button className="icon-btn" onClick={() => onDeleteRoom(room.id)} disabled={working} aria-label={`Delete ${room.name}`}><Trash2 size={15} /></button>
            </article>
          ))}
        </div>
      </div>

      <div className="tool-panel">
        <div className="section-title"><Box size={18} /><h3>Boxes</h3></div>
        <form className="compact-form" onSubmit={onAddBox}>
          <select value={boxForm.roomId} onChange={event => setBoxForm({ ...boxForm, roomId: event.target.value })} required>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
          </select>
          <input value={boxForm.name} onChange={event => setBoxForm({ ...boxForm, name: event.target.value })} placeholder="Shelf A, Bin 4, Tool Chest" required />
          <button className="primary-btn" disabled={working}><Plus size={16} /> Add Box</button>
        </form>
        <div className="location-list">
          {boxes.map(box => (
            <article className="location-row" key={box.id}>
              <div><strong>{box.name}</strong><span>{box.rooms?.name || rooms.find(room => room.id === box.room_id)?.name || 'Unassigned'}</span></div>
              <button className="icon-btn" onClick={() => onDeleteBox(box.id)} disabled={working} aria-label={`Delete ${box.name}`}><Trash2 size={15} /></button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapturePage({
  form,
  setForm,
  rooms,
  boxesForSelectedRoom,
  onAddItem,
  working,
  cameraStream,
  startCamera,
  stopCamera,
  scanCameraFrame,
  videoRef,
  canvasRef,
  cameraItems,
  setCameraItems,
  saveCameraItems,
}) {
  return (
    <section className="capture-grid">
      <form className="tool-panel add-form" onSubmit={event => onAddItem(event, 'manual')}>
        <div className="section-title"><PackagePlus size={18} /><h3>Manual Add</h3></div>
        <ItemFormFields form={form} setForm={setForm} rooms={rooms} boxesForSelectedRoom={boxesForSelectedRoom} />
        <button className="primary-btn" type="submit" disabled={working}><PackagePlus size={17} /> Embed and Store</button>
      </form>

      <section className="tool-panel camera-panel">
        <div className="section-title"><Camera size={18} /><h3>Camera Scan</h3></div>
        <div className="camera-preview">
          {cameraStream ? <video ref={videoRef} autoPlay playsInline muted /> : <div className="camera-empty"><Camera size={28} /><span>Camera preview</span></div>}
          <canvas ref={canvasRef} hidden />
        </div>
        <div className="button-row">
          {cameraStream
            ? <button className="secondary-btn" onClick={stopCamera} type="button">Close Camera</button>
            : <button className="secondary-btn" onClick={startCamera} type="button"><Camera size={16} /> Open Camera</button>}
          <button className="primary-btn" onClick={scanCameraFrame} type="button" disabled={!cameraStream || working}><Wand2 size={16} /> Detect Items</button>
        </div>
        {cameraItems.length > 0 && (
          <div className="review-list">
            {cameraItems.map(item => (
              <div className="review-row" key={item.id}>
                <input value={item.name} onChange={event => setCameraItems(current => current.map(row => row.id === item.id ? { ...row, name: event.target.value } : row))} />
                <input value={item.qty} onChange={event => setCameraItems(current => current.map(row => row.id === item.id ? { ...row, qty: event.target.value } : row))} />
                <button className="icon-btn" onClick={() => setCameraItems(current => current.filter(row => row.id !== item.id))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button className="primary-btn" onClick={saveCameraItems} disabled={working}>Save Detected Items</button>
          </div>
        )}
      </section>
    </section>
  );
}

function AssistantPage({ messages, input, setInput, onSubmit, working, voiceStatus, startVoice, stopVoice }) {
  return (
    <section className="assistant-page">
      <div className="chat-log">
        {messages.map((message, index) => (
          <div className={message.role === 'user' ? 'chat-message user' : 'chat-message assistant'} key={`${message.role}-${index}`}>
            {message.content}
          </div>
        ))}
      </div>
      <form className="chat-composer" onSubmit={onSubmit}>
        <input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask or record: move hammer to garage shelf A, add duct tape to bin 2..." />
        {voiceStatus === 'recording'
          ? <button className="danger-btn" type="button" onClick={stopVoice}><Square size={15} /> Stop</button>
          : <button className="secondary-btn" type="button" onClick={startVoice}><Mic size={16} /> Voice</button>}
        <button className="primary-btn" disabled={working || !input}><Send size={16} /> Send</button>
      </form>
    </section>
  );
}

function SettingsPage({ user, settings, setSettings, rooms, importInputRef, handleImport, handleExport, itemCount, working }) {
  return (
    <section className="split-grid">
      <div className="tool-panel">
        <div className="section-title"><SlidersHorizontal size={18} /><h3>Preferences</h3></div>
        <label>
          Default room
          <select value={settings.defaultRoom} onChange={event => setSettings({ ...settings, defaultRoom: event.target.value })}>
            {rooms.map(room => <option key={room.id} value={room.name}>{room.name}</option>)}
          </select>
        </label>
        <label className="toggle-row">
          <span>Spoken assistant replies</span>
          <input type="checkbox" checked={settings.ttsEnabled} onChange={event => setSettings({ ...settings, ttsEnabled: event.target.checked })} />
        </label>
        <label className="toggle-row">
          <span>Prefer database vector search</span>
          <input type="checkbox" checked={settings.preferCloudVectorSearch} onChange={event => setSettings({ ...settings, preferCloudVectorSearch: event.target.checked })} />
        </label>
      </div>

      <div className="tool-panel">
        <div className="section-title"><Database size={18} /><h3>Account and Data</h3></div>
        <div className="settings-fact"><span>Email</span><strong>{user.email}</strong></div>
        <div className="settings-fact"><span>Stored items</span><strong>{itemCount}</strong></div>
        <input ref={importInputRef} type="file" accept="application/json,.json" className="hidden-input" onChange={event => handleImport(event.target.files?.[0])} />
        <div className="button-row">
          <button className="secondary-btn" onClick={() => importInputRef.current?.click()} disabled={working}><Upload size={16} /> Import</button>
          <button className="secondary-btn" onClick={handleExport} disabled={!itemCount}><Download size={16} /> Export</button>
        </div>
      </div>
    </section>
  );
}

function ItemFormFields({ form, setForm, rooms, boxesForSelectedRoom }) {
  return (
    <>
      <label>Item name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /></label>
      <label>Description<textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} rows="3" /></label>
      <div className="two-col">
        <label>Qty<input value={form.qty} onChange={event => setForm({ ...form, qty: event.target.value })} /></label>
        <label>Unit<input value={form.unit} onChange={event => setForm({ ...form, unit: event.target.value })} placeholder="pcs, box, roll" /></label>
      </div>
      <label>
        Room
        <select value={form.roomName} onChange={event => setForm({ ...form, roomName: event.target.value, boxName: '' })}>
          {rooms.map(room => <option key={room.id} value={room.name}>{room.name}</option>)}
        </select>
      </label>
      <label>
        Box
        <select value={form.boxName} onChange={event => setForm({ ...form, boxName: event.target.value })}>
          <option value="">No box</option>
          {boxesForSelectedRoom.map(box => <option key={box.id} value={box.name}>{box.name}</option>)}
        </select>
      </label>
      <label>
        Status
        <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Missing</option>
          <option>Archived</option>
        </select>
      </label>
    </>
  );
}

function ItemList({ items, onDelete, working }) {
  if (!items.length) {
    return <div className="empty-state"><Boxes size={28} /><p>No items to show.</p></div>;
  }
  return (
    <div className="item-list">
      {items.map(item => (
        <article className="item-row" key={item.id}>
          <div>
            <div className="item-title">
              <strong>{item.name}</strong>
              {item.score !== null && <span>{Math.round(item.score * 100)}%</span>}
            </div>
            {item.description && <p>{item.description}</p>}
            <div className="item-meta">
              <span>{item.qty || 1} {item.unit}</span>
              <span>{item.roomName}{item.boxName ? ` / ${item.boxName}` : ''}</span>
              <span>{item.status}</span>
            </div>
          </div>
          <button className="icon-btn" aria-label={`Delete ${item.name}`} onClick={() => onDelete(item.id)} disabled={working}><Trash2 size={16} /></button>
        </article>
      ))}
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setWorking(true);
    setError('');
    setMessage('');
    const action = mode === 'sign-up'
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });
    const { error: authError } = await action;
    if (authError) setError(authError.message);
    else if (mode === 'sign-up') setMessage('Account created. Check your email if confirmation is enabled.');
    setWorking(false);
  }

  async function sendMagicLink() {
    setWorking(true);
    setError('');
    setMessage('');
    const { error: magicError } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (magicError) setError(magicError.message);
    else setMessage('Magic link sent.');
    setWorking(false);
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand large">
          <div className="brand-mark"><Boxes size={24} /></div>
          <div><h1>VectorStore</h1><p>Sign in to load your inventory anywhere.</p></div>
        </div>
        {(message || error) && <div className={error ? 'notice error' : 'notice'}>{error || message}</div>}
        <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} minLength="6" required /></label>
        <button className="primary-btn" type="submit" disabled={working}>{working && <Loader2 className="spin-icon" size={17} />}{mode === 'sign-up' ? 'Create Account' : 'Sign In'}</button>
        <button className="secondary-btn full" type="button" onClick={sendMagicLink} disabled={working || !email}>Send Magic Link</button>
        <button className="text-btn" type="button" onClick={() => setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')}>{mode === 'sign-up' ? 'Already have an account? Sign in.' : 'Need an account? Create one.'}</button>
      </form>
    </div>
  );
}

function SetupRequired() {
  const missing = getMissingSupabaseEnv();
  return (
    <div className="auth-shell">
      <div className="auth-card setup-card">
        <div className="brand large">
          <div className="brand-mark"><Database size={24} /></div>
          <div><h1>VectorStore Web</h1><p>Supabase needs to be connected before the site can load account storage.</p></div>
        </div>
        <div className="setup-list">{missing.map(name => <code key={name}>{name}</code>)}</div>
        <p className="muted">Copy `.env.example` to `.env.local`, fill in these values, then restart the dev server.</p>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function FullScreenStatus({ label }) {
  return <div className="auth-shell"><div className="loading-line"><Loader2 className="spin-icon" size={18} /> {label}</div></div>;
}

function FullPanelStatus({ label }) {
  return <div className="empty-state"><Loader2 className="spin-icon" size={24} /><p>{label}</p></div>;
}
