export const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>VectorStock - Semantic Inventory</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; overscroll-behavior: none; -webkit-text-size-adjust: 100%; }
    body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }

    /* Animated Gradient Background */
    .app-bg {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: linear-gradient(135deg, #0f0a1f 0%, #1a1029 25%, #0d1520 50%, #0a1628 75%, #0f172a 100%);
      background-size: 400% 400%;
      animation: gradientShift 10s ease infinite;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
      top: -50px;
      left: -50px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);
      bottom: 10%;
      right: -30px;
      animation-delay: -3s;
    }

    .orb-3 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
      top: 40%;
      left: 30%;
      animation-delay: -5s;
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      25% { background-position: 100% 50%; }
      50% { background-position: 100% 100%; }
      75% { background-position: 0% 100%; }
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(20px, -20px) scale(1.05); }
      66% { transform: translate(-10px, 10px) scale(0.95); }
    }

    #root { width: 100%; height: 100%; position: relative; z-index: 1; }

    /* Glass Effect Utilities */
    .glass {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(148, 163, 184, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .glass-card {
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(148, 163, 184, 0.12);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .glass-nav {
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(148, 163, 184, 0.1);
      box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.3);
    }

    .glass-input {
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(148, 163, 184, 0.15);
      transition: all 0.2s ease;
    }

    .glass-input:focus {
      border-color: rgba(34, 211, 238, 0.5);
      box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.35);
      background: rgba(15, 23, 42, 0.7);
    }

    .glass-btn {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8));
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(139, 92, 246, 0.3);
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      transition: all 0.15s ease;
    }

    .glass-btn:active {
      transform: scale(0.95);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }

    .glass-btn-secondary {
      background: rgba(30, 41, 59, 0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(148, 163, 184, 0.2);
      transition: all 0.15s ease;
    }

    .glass-btn-secondary:active {
      transform: scale(0.95);
      background: rgba(30, 41, 59, 0.7);
    }

    .glow-cyan {
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.2);
    }

    .glow-active {
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3);
    }

    /* Shimmer Animation */
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .shimmer {
      background: linear-gradient(90deg,
        rgba(59, 130, 246, 0) 0%,
        rgba(59, 130, 246, 0.1) 50%,
        rgba(59, 130, 246, 0) 100%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }

    #loading {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; color: #22d3ee;
      font-family: monospace; font-size: 14px; flex-direction: column; gap: 20px;
      position: relative;
    }

    .spinner {
      width: 40px; height: 40px; border: 3px solid rgba(34, 211, 238, 0.2);
      border-top-color: #22d3ee; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spin {
      width: 18px; height: 18px; border: 2px solid rgba(34, 211, 238, 0.2);
      border-top-color: #22d3ee; border-radius: 50%;
      animation: spin 0.7s linear infinite; flex-shrink: 0;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideUp { from { transform: translateY(14px); opacity: 0; } to { transform: none; opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    input:focus, textarea:focus, select:focus {
      outline: none;
    }
    @media (max-width: 768px) {
      input, textarea, select { font-size: 16px !important; line-height: 1.35; }
    }

    button:not(:disabled):active {
      filter: brightness(0.9);
      transform: scale(0.98);
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 3px; }

    .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }

    ::placeholder { color: rgba(148, 163, 184, 0.5); }
  </style>
</head>
<body>
  <div class="app-bg">
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
  </div>
  <div id="loading">
    <div class="spinner"></div>
    <div>Loading VectorStock...</div>
  </div>
  <div id="root"></div>

  <script type="module">
    import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
    window.transformersPipeline = pipeline;
    window.transformersEnv = env;
    env.allowLocalModels = false;
    window.transformersReady = true;
    window.dispatchEvent(new Event('transformers-ready'));
  </script>

  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <script type="text/babel">
const { useState, useEffect, useRef, useCallback } = React;

// ─── Utility Functions ─────────────────────────────────────────────────────────
function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]; magA += a[i] * a[i]; magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (!isFinite(denom) || denom === 0) return 0;
  return Math.max(-1, Math.min(1, dot / denom));
}

function searchItems(queryVector, allItems, topK, minScore = 0.0) {
  const queryHint = String(queryVector?.__queryText ?? "").toLowerCase().trim();
  const results = allItems
    .map(item => {
      const baseScore = cosineSimilarity(queryVector, item.vector);
      const locationText = [item.room, item.box].filter(Boolean).join(" ").toLowerCase();
      const locationBoost = queryHint && locationText.includes(queryHint) ? 0.08 : 0;
      return { ...item, score: Math.min(1, baseScore + locationBoost) };
    })
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return results;
}

// ─── Vector math ──────────────────────────────────────────────────────────────
let pipelineInstance = null, modelLoading = false;
const loadQueue = [];
const EMBEDDING_MODEL = 'Xenova/bge-small-en-v1.5';
const BGE_QUERY_PREFIX = 'Represent this sentence for searching relevant passages: ';
const DEFAULT_ROOMS = ["Garage", "Kitchen", "Bedroom", "Office", "Living Room", "Basement"];

function normalizeLabel(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function prettyLabel(value) {
  return normalizeLabel(value).replace(/\b\w/g, c => c.toUpperCase());
}

function readJSONStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(fallback) ? (Array.isArray(parsed) ? parsed : fallback) : (parsed ?? fallback);
  } catch {
    return fallback;
  }
}

async function waitForTransformers() {
  if (window.transformersReady) return;
  return new Promise(resolve => window.addEventListener('transformers-ready', resolve, { once: true }));
}

async function getEmbeddingPipeline() {
  if (pipelineInstance) return pipelineInstance;
  if (modelLoading) return new Promise(resolve => loadQueue.push(resolve));
  modelLoading = true;
  try {
    await waitForTransformers();
    pipelineInstance = await window.transformersPipeline('feature-extraction', EMBEDDING_MODEL, { quantized: true });
    loadQueue.forEach(r => r(pipelineInstance)); loadQueue.length = 0;
    return pipelineInstance;
  } catch (e) { modelLoading = false; throw new Error(\`Failed to load embedding model: \${e.message}\`); }
}

async function embedText(text) {
  const safeText = String(text ?? "").trim();
  if (!safeText) throw new Error("Cannot embed empty text.");
  const pipe = await getEmbeddingPipeline();
  const output = await pipe(safeText, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

async function embedQuery(text) {
  return embedText(\`\${BGE_QUERY_PREFIX}\${String(text ?? "").trim()}\`);
}

// ─── IndexedDB storage ────────────────────────────────────────────────────────
const DB_NAME = "vectorstock-db";
const DB_VERSION = 1;
const ITEMS_STORE = "items";
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ITEMS_STORE)) {
        db.createObjectStore(ITEMS_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
  return dbPromise;
}

async function withStore(mode, run) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ITEMS_STORE, mode);
    const store = tx.objectStore(ITEMS_STORE);
    let result;
    try {
      result = run(store);
    } catch (e) {
      reject(e);
      return;
    }
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed"));
    tx.onabort = () => reject(tx.error || new Error("IndexedDB transaction aborted"));
  });
}

async function addItem(item) {
  const record = { ...item, id: item.id || crypto.randomUUID() };
  return withStore("readwrite", store => {
    store.put(record);
    return record;
  });
}

async function getAllItems() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ITEMS_STORE, "readonly");
    const store = tx.objectStore(ITEMS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error || new Error("Failed to read items"));
  });
}

async function deleteItem(id) {
  return withStore("readwrite", store => store.delete(id));
}

async function clearAll() {
  return withStore("readwrite", store => store.clear());
}

window.vectorStoreDB = { addItem, getAllItems, deleteItem, clearAll };

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_ITEMS = [
  { name: "Chef's Knife",         description: "Sharp 8-inch stainless steel blade for chopping vegetables and meat",           qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Cutting Board",        description: "Large wooden board for food prep and slicing ingredients safely",               qty: "2",  unit: "pcs",   status: "In Stock"  },
  { name: "Non-stick Frying Pan", description: "12-inch pan with Teflon coating, ideal for eggs and sautéing",                  qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Pasta Pot",            description: "Large stockpot with lid for boiling pasta, soups, and stews",                   qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Dish Soap",            description: "Liquid detergent for hand-washing plates, pots, and kitchen utensils",          qty: "3",  unit: "btl",   status: "In Stock"  },
  { name: "Kitchen Sponge",       description: "Scrubbing pad with soft side for cleaning dishes and wiping surfaces",          qty: "6",  unit: "pcs",   status: "Low Stock" },
  { name: "Paper Towels",         description: "Absorbent disposable rolls for mopping up spills and drying hands",             qty: "4",  unit: "rolls", status: "In Stock"  },
  { name: "Laundry Detergent",    description: "Powder detergent for washing clothes in the washing machine",                   qty: "1",  unit: "box",   status: "Low Stock" },
  { name: "Fabric Softener",      description: "Liquid conditioner added to rinse cycle to keep clothes soft and fresh",        qty: "1",  unit: "btl",   status: "In Stock"  },
  { name: "Broom",                description: "Bristle broom for sweeping dust and debris from hard floors",                   qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Mop & Bucket",         description: "Wet mop system for cleaning tile and hardwood floors",                          qty: "1",  unit: "set",   status: "In Stock"  },
  { name: "Vacuum Cleaner",       description: "Upright electric vacuum for removing dirt and pet hair from carpets",           qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Toilet Paper",         description: "Soft 2-ply bathroom tissue rolls for personal hygiene",                        qty: "24", unit: "rolls", status: "In Stock"  },
  { name: "Hand Soap",            description: "Pump dispenser liquid soap for washing hands in bathroom and kitchen",          qty: "3",  unit: "pcs",   status: "In Stock"  },
  { name: "Shampoo",              description: "Hair cleansing product for scalp and washing hair in the shower",               qty: "2",  unit: "btl",   status: "In Stock"  },
  { name: "Toothpaste",           description: "Fluoride dental paste for brushing and cleaning teeth twice daily",             qty: "3",  unit: "tubes", status: "In Stock"  },
  { name: "Bed Sheets",           description: "Cotton queen-size fitted and flat sheets for sleeping comfort",                 qty: "2",  unit: "sets",  status: "In Stock"  },
  { name: "Pillow",               description: "Soft memory foam pillow for sleeping head and neck support",                    qty: "4",  unit: "pcs",   status: "In Stock"  },
  { name: "LED Light Bulbs",      description: "60W equivalent LED bulbs for ceiling fixtures and bedside lamps",               qty: "8",  unit: "pcs",   status: "In Stock"  },
  { name: "Extension Cord",       description: "6-foot 3-outlet power strip for plugging in multiple appliances",               qty: "2",  unit: "pcs",   status: "In Stock"  },
  { name: "AA Batteries",         description: "Alkaline batteries for remote controls, flashlights, and wall clocks",          qty: "12", unit: "pcs",   status: "Low Stock" },
  { name: "Smoke Detector",       description: "Battery-powered ceiling alarm that detects fire and smoke in the home",         qty: "3",  unit: "pcs",   status: "In Stock"  },
  { name: "First Aid Kit",        description: "Box of bandages, antiseptic wipes, and gauze for treating minor injuries",      qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Ibuprofen",            description: "Over-the-counter pain reliever and fever reducer tablet medication",            qty: "1",  unit: "btl",   status: "Low Stock" },
  { name: "Plunger",              description: "Rubber suction cup for unclogging blocked toilets and slow drains",             qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Hammer",               description: "Claw hammer for driving nails and light home repair tasks",                     qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Screwdriver Set",      description: "Phillips and flathead screwdrivers for assembling furniture and fixtures",      qty: "1",  unit: "set",   status: "In Stock"  },
  { name: "Measuring Tape",       description: "25-foot retractable tape for measuring rooms, furniture, and distances",        qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Trash Bags",           description: "30-gallon black garbage bags for kitchen and outdoor waste bins",               qty: "2",  unit: "boxes", status: "In Stock"  },
  { name: "All-Purpose Cleaner",  description: "Spray bottle surface cleaner for countertops, appliances, and bathrooms",       qty: "2",  unit: "btl",   status: "In Stock"  },
];

const STATUSES = ["In Stock", "Low Stock", "Out of Stock", "Ordered"];
const STATUS_COLORS = {
  "In Stock":     { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399", border: "rgba(16, 185, 129, 0.3)", glow: "rgba(16, 185, 129, 0.2)" },
  "Low Stock":    { bg: "rgba(251, 191, 36, 0.15)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.3)", glow: "rgba(251, 191, 36, 0.2)" },
  "Out of Stock": { bg: "rgba(248, 113, 113, 0.15)", text: "#f87171", border: "rgba(248, 113, 113, 0.3)", glow: "rgba(248, 113, 113, 0.2)" },
  "Ordered":      { bg: "rgba(96, 165, 250, 0.15)", text: "#60a5fa", border: "rgba(96, 165, 250, 0.3)", glow: "rgba(96, 165, 250, 0.2)" },
};

// ─── App ──────────────────────────────────────────────────────────────────────
function SemanticInventory() {
  const [inventory,    setInventory]   = useState([]);
  const [results,      setResults]     = useState(null);
  const [loading,      setLoading]     = useState({ add: false, search: false });
  const [seeding,      setSeeding]     = useState(false);
  const [seedProg,     setSeedProg]    = useState({ done: 0, total: 0, current: "" });
  const [defaultRoom,  setDefaultRoom] = useState(() => {
    try { return window.localStorage.getItem("vectorstock.defaultRoom") || "Garage"; }
    catch { return "Garage"; }
  });
  const [rooms,        setRooms]       = useState(() => {
    const saved = readJSONStorage("vectorstock.rooms", []);
    const merged = [...DEFAULT_ROOMS, ...saved.map(prettyLabel)];
    return Array.from(new Set(merged.map(prettyLabel)));
  });
  const [boxes,        setBoxes]       = useState(() => {
    const saved = readJSONStorage("vectorstock.boxes", []);
    return saved
      .map(b => ({ id: b.id || crypto.randomUUID(), name: prettyLabel(b.name), room: prettyLabel(b.room) }))
      .filter(b => b.name && b.room);
  });
  const [addForm,      setAddForm]     = useState({ name: "", description: "", qty: "", unit: "", room: defaultRoom, box: "", status: "In Stock" });
  const [roomForm,     setRoomForm]    = useState("");
  const [boxForm,      setBoxForm]     = useState({ room: defaultRoom, name: "" });
  const [searchQuery,  setSearchQuery] = useState("");
  const [topK,         setTopK]        = useState(5);
  const [activeTab,    setActiveTab]   = useState("inventory");
  const [notif,        setNotif]       = useState(null);
  const [error,        setError]       = useState(null);
  const [modelStatus,  setModelStatus] = useState("initializing");
  const [isMobile,     setIsMobile]    = useState(window.innerWidth <= 768);
  const [boxMove,      setBoxMove]     = useState({ fromRoom: defaultRoom, box: "", toRoom: defaultRoom });
  const cancelRef = useRef(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toast = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  };

  useEffect(() => {
    try { window.localStorage.setItem("vectorstock.defaultRoom", defaultRoom); }
    catch {}
  }, [defaultRoom]);

  useEffect(() => {
    try { window.localStorage.setItem("vectorstock.rooms", JSON.stringify(rooms)); }
    catch {}
  }, [rooms]);

  useEffect(() => {
    try { window.localStorage.setItem("vectorstock.boxes", JSON.stringify(boxes)); }
    catch {}
  }, [boxes]);

  useEffect(() => {
    if (!rooms.length) return;
    if (!rooms.includes(defaultRoom)) setDefaultRoom(rooms[0]);
    if (!rooms.includes(addForm.room)) {
      setAddForm(f => ({ ...f, room: rooms[0], box: "" }));
    }
    setBoxForm(f => ({ ...f, room: rooms.includes(f.room) ? f.room : rooms[0] }));
    setBoxMove(m => ({
      ...m,
      fromRoom: rooms.includes(m.fromRoom) ? m.fromRoom : rooms[0],
      toRoom: rooms.includes(m.toRoom) ? m.toRoom : rooms[0],
    }));
  }, [rooms, defaultRoom, addForm.room]);

  // ── Initialize model ──────────────────────────────────────────────────────
  useEffect(() => {
    let live = true;
    async function initModel() {
      try {
        setModelStatus("loading");
        await getEmbeddingPipeline();
        if (live) { setModelStatus("ready"); toast("Model ready ✓"); }
      } catch (e) {
        if (live) { setModelStatus("error"); setError(\`Model failed: \${e.message}\`); }
      }
    }
    initModel();
    return () => { live = false; };
  }, []);

  // ── Seed ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (modelStatus !== "ready") return;
    cancelRef.current = false;
    let live = true;
    async function run() {
      try {
        const persisted = await getAllItems();
        if (!live || cancelRef.current) return;
        if (persisted.length > 0) {
          setInventory(persisted.map(item => ({
            ...item,
            room: item.room || "Unassigned",
            box: item.box || "",
          })));
          setSeeding(false);
          setSeedProg({ done: 0, total: 0, current: "" });
          return;
        }

        setSeeding(true);
        setSeedProg({ done: 0, total: SEED_ITEMS.length, current: "" });
        const acc = [];
        for (let i = 0; i < SEED_ITEMS.length; i++) {
          if (!live || cancelRef.current) break;
          const item = SEED_ITEMS[i];
          if (live) setSeedProg({ done: i, total: SEED_ITEMS.length, current: item.name });
          try {
            const seedRoom = "Unassigned";
            const seedBox = "Starter Box";
            const vec = await embedText(\`\${item.name}. \${item.description}. Box \${seedBox}. Room \${seedRoom}\`);
            const stored = await addItem({
              id: crypto.randomUUID(),
              ...item,
              room: seedRoom,
              box: seedBox,
              vector: vec,
              addedAt: new Date().toLocaleString(),
            });
            acc.push(stored);
            if (live) {
              setInventory([...acc]);
              setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name });
            }
          } catch (e) {
            if (live) setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name });
          }
        }
      } catch (e) {
        if (live) setError(\`Storage failed: \${String(e?.message ?? e)}\`);
      } finally {
        if (live) setSeeding(false);
      }
    }
    run();
    return () => { live = false; cancelRef.current = true; };
  }, [modelStatus]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const itemName = normalizeLabel(addForm.name);
    if (!itemName) return toast("Item name is required.", "error");
    if (modelStatus !== "ready") return toast("Model not ready.", "error");
    const selectedRoom = prettyLabel(addForm.room || defaultRoom);
    if (!selectedRoom) return toast("Select a room.", "error");
    if (!rooms.some(r => normalizeLabel(r).toLowerCase() === selectedRoom.toLowerCase())) {
      return toast("Selected room does not exist.", "error");
    }
    setLoading(l => ({ ...l, add: true })); setError(null);
    try {
      const desc = String(addForm.description ?? "").trim();
      const selectedBox = prettyLabel(addForm.box);
      const vec  = await embedText([
        itemName,
        desc,
        selectedBox ? ("Box " + selectedBox) : "",
        "Room " + selectedRoom,
      ].filter(Boolean).join(". "));
      const stored = await addItem({
        id: crypto.randomUUID(),
        name: itemName,
        room: selectedRoom,
        box: selectedBox,
        description: desc,
        qty: String(addForm.qty ?? "").trim(), unit: String(addForm.unit ?? "").trim(),
        status: addForm.status, vector: vec, addedAt: new Date().toLocaleString(),
      });
      setInventory(inv => [...inv, stored]);
      setAddForm({ name: "", description: "", qty: "", unit: "", room: selectedRoom, box: "", status: "In Stock" });
      const loc = [stored.room, stored.box].filter(Boolean).join(" › ");
      toast(\`"\${stored.name}" stored in \${loc || "Unassigned"} ✓\`);
      if (isMobile) setActiveTab("inventory");
    } catch (e) {
      setError(String(e?.message ?? e)); toast("Embedding failed.", "error");
    } finally {
      setLoading(l => ({ ...l, add: false }));
    }
  };

  const handleAddRoom = () => {
    const roomName = prettyLabel(roomForm);
    if (!roomName) return toast("Enter a room name.", "error");
    if (rooms.some(r => normalizeLabel(r).toLowerCase() === roomName.toLowerCase())) {
      return toast("Room already exists.", "error");
    }
    setRooms(prev => [...prev, roomName]);
    setRoomForm("");
    setAddForm(f => ({ ...f, room: roomName, box: "" }));
    setBoxForm(f => ({ ...f, room: roomName }));
    toast(\`Room "\${roomName}" added.\`);
  };

  const handleAddBox = () => {
    const boxName = prettyLabel(boxForm.name);
    const boxRoom = prettyLabel(boxForm.room || defaultRoom);
    if (!boxName) return toast("Enter a box name.", "error");
    if (!boxRoom) return toast("Select a room for the box.", "error");
    if (!rooms.some(r => normalizeLabel(r).toLowerCase() === boxRoom.toLowerCase())) {
      return toast("Room does not exist.", "error");
    }
    const duplicate = boxes.some(b =>
      normalizeLabel(b.name).toLowerCase() === boxName.toLowerCase()
      && normalizeLabel(b.room).toLowerCase() === boxRoom.toLowerCase()
    );
    const duplicateFromItems = inventory.some(item =>
      normalizeLabel(item.box).toLowerCase() === boxName.toLowerCase()
      && normalizeLabel(item.room).toLowerCase() === boxRoom.toLowerCase()
    );
    if (duplicate || duplicateFromItems) return toast("Box already exists in this room.", "error");
    setBoxes(prev => [...prev, { id: crypto.randomUUID(), name: boxName, room: boxRoom }]);
    setBoxForm(prev => ({ ...prev, name: "" }));
    if (prettyLabel(addForm.room || defaultRoom) === boxRoom) {
      setAddForm(f => ({ ...f, box: boxName }));
    }
    toast(\`Box "\${boxName}" added to \${boxRoom}.\`);
  };

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    const q = String(searchQuery ?? "").trim();
    if (!q) return toast("Enter a search query.", "error");
    if (!inventory.length) return toast("Inventory is empty.", "error");
    if (modelStatus !== "ready") return toast("Model not ready.", "error");
    setLoading(l => ({ ...l, search: true })); setResults(null); setError(null);
    try {
      const qVec = await embedQuery(q);
      qVec.__queryText = q;
      const k = Math.max(1, Math.min(topK, inventory.length));
      setResults(searchItems(qVec, inventory, k));
    } catch (e) {
      setError(String(e?.message ?? e)); toast("Search failed.", "error");
    } finally {
      setLoading(l => ({ ...l, search: false }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setInventory(inv => inv.filter(i => i.id !== id));
      setResults(r => r ? r.filter(i => i.id !== id) : r);
    } catch (e) {
      setError(\`Delete failed: \${String(e?.message ?? e)}\`);
      toast("Delete failed.", "error");
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAll();
      setInventory([]);
      setResults(null);
      setSearchQuery("");
      setActiveTab("inventory");
      toast("All saved items cleared.");
    } catch (e) {
      setError(\`Clear failed: \${String(e?.message ?? e)}\`);
      toast("Clear failed.", "error");
    }
  };

  const handleMoveBox = async () => {
    const sourceRoom = prettyLabel(boxMove.fromRoom || defaultRoom || "Garage");
    const box = prettyLabel(boxMove.box);
    const targetRoom = prettyLabel(boxMove.toRoom || defaultRoom || "Garage");
    if (!sourceRoom) return toast("Select source room.", "error");
    if (!box) return toast("Select a box to move.", "error");
    if (!targetRoom) return toast("Select destination room.", "error");
    if (sourceRoom.toLowerCase() === targetRoom.toLowerCase()) return toast("Choose a different destination room.", "error");

    const changed = inventory.filter(item =>
      normalizeLabel(item.box).toLowerCase() === box.toLowerCase()
      && prettyLabel(item.room).toLowerCase() === sourceRoom.toLowerCase()
    );
    if (!changed.length) return toast("No items found in selected box.", "error");
    try {
      const updatedRecords = changed.map(item => ({ ...item, room: targetRoom }));
      await Promise.all(updatedRecords.map(item => addItem(item)));
      setInventory(prev => prev.map(item =>
        normalizeLabel(item.box).toLowerCase() === box.toLowerCase()
        && prettyLabel(item.room).toLowerCase() === sourceRoom.toLowerCase()
          ? { ...item, room: targetRoom }
          : item
      ));
      setResults(prev => prev ? prev.map(item =>
        normalizeLabel(item.box).toLowerCase() === box.toLowerCase()
        && prettyLabel(item.room).toLowerCase() === sourceRoom.toLowerCase()
          ? { ...item, room: targetRoom }
          : item
      ) : prev);
      setBoxes(prev => prev.map(b =>
        normalizeLabel(b.name).toLowerCase() === box.toLowerCase()
        && normalizeLabel(b.room).toLowerCase() === sourceRoom.toLowerCase()
          ? { ...b, room: targetRoom }
          : b
      ));
      setBoxMove(prev => ({ ...prev, fromRoom: sourceRoom, box: "", toRoom: targetRoom }));
      toast(\`Moved box "\${box}" from \${sourceRoom} to \${targetRoom}.\`);
    } catch (e) {
      setError(\`Move failed: \${String(e?.message ?? e)}\`);
      toast("Move failed.", "error");
    }
  };

  const busy = loading.add || loading.search;
  const seedPct = seedProg.total > 0 ? (seedProg.done / seedProg.total) * 100 : 0;
  const displayItems = (activeTab === "search" && results !== null) ? results : inventory;
  const knownRooms = Array.from(new Set([
    ...DEFAULT_ROOMS.map(prettyLabel),
    ...rooms.map(prettyLabel),
    ...inventory.map(i => prettyLabel(i.room)).filter(Boolean),
    prettyLabel(defaultRoom),
  ])).filter(Boolean);

  const knownBoxRecords = Array.from(new Map([
    ...boxes.map(b => ({ name: prettyLabel(b.name), room: prettyLabel(b.room) })),
    ...inventory
      .filter(i => normalizeLabel(i.box))
      .map(i => ({ name: prettyLabel(i.box), room: prettyLabel(i.room || defaultRoom) })),
  ].map(b => {
    const key = normalizeLabel(b.room).toLowerCase() + "::" + normalizeLabel(b.name).toLowerCase();
    return [key, b];
  })).values());

  const addItemBoxes = knownBoxRecords
    .filter(b => normalizeLabel(b.room).toLowerCase() === normalizeLabel(addForm.room || defaultRoom).toLowerCase())
    .map(b => b.name);

  const moveBoxes = knownBoxRecords
    .filter(b => normalizeLabel(b.room).toLowerCase() === normalizeLabel(boxMove.fromRoom || defaultRoom).toLowerCase())
    .map(b => b.name);

  // ── Shared sub-components ─────────────────────────────────────────────────
  const matchLabel = s => s > 0.75 ? "✦ strong" : s > 0.50 ? "· good" : "· partial";
  const matchColor = s => s > 0.75 ? "#93c5fd" : s > 0.50 ? "#a78bfa" : "#64748b";

  // Glass Card Component
  const ItemCard = ({ item }) => {
    const sc     = item.score;
    const colors = STATUS_COLORS[String(item.status ?? "")] ?? STATUS_COLORS["In Stock"];
    return (
      <div className="glass-card" style={isMobile ? m.card : d.card}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={isMobile ? m.cName : d.cName}>{item.name}</div>
          {item.description && <div style={isMobile ? m.cDesc : d.cDesc}>{item.description}</div>}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginTop:4 }}>
            <span style={{
              fontSize:11, padding:"4px 10px", borderRadius:20, fontWeight:600,
              background: colors.bg, color: colors.text,
              border: \`1px solid \${colors.border}\`,
              boxShadow: \`0 0 12px \${colors.glow}\`
            }}>
              {item.status}
            </span>
            {(item.qty || item.unit) && (
              <span style={{
                fontSize:11, padding:"4px 10px", borderRadius:20,
                background: "rgba(30, 41, 59, 0.5)", color:"#94a3b8",
                border:"1px solid rgba(148, 163, 184, 0.15)"
              }}>
                {[item.qty, item.unit].filter(Boolean).join(" ")}
              </span>
            )}
            {(item.room || item.box) && (
              <span style={{
                fontSize:11, padding:"4px 10px", borderRadius:20,
                background:"rgba(14, 165, 233, 0.12)", color:"#67e8f9",
                border:"1px solid rgba(34, 211, 238, 0.25)"
              }}>
                {[item.room, item.box].filter(Boolean).join(" › ")}
              </span>
            )}
          </div>
          {sc !== undefined && isFinite(sc) && (
            <div style={{ marginTop:8 }}>
              <div style={{ height:3, background:"rgba(30, 41, 59, 0.5)", borderRadius:2, overflow:"hidden", marginBottom:3 }}>
                <div style={{
                  height:"100%", width:\`\${Math.max(0,Math.min(100,sc*100)).toFixed(1)}%\`,
                  background: sc>0.75 ? "linear-gradient(90deg,#22d3ee,#8b5cf6)" : sc>0.50 ? "linear-gradient(90deg,#6366f1,#a78bfa)" : "#475569",
                  transition:"width 0.4s ease",
                  boxShadow: sc>0.5 ? "0 0 10px rgba(139, 92, 246, 0.5)" : "none"
                }} />
              </div>
              <span style={{ fontSize:11, color: matchColor(sc) }}>
                {(sc*100).toFixed(1)}% {matchLabel(sc)}
              </span>
            </div>
          )}
        </div>
        <button
          style={{
            background:"rgba(30, 41, 59, 0.3)", border:"1px solid rgba(148, 163, 184, 0.1)",
            color:"#64748b", cursor:"pointer", fontSize: isMobile ? 20 : 14,
            padding:"6px 8px", flexShrink:0, lineHeight:1, borderRadius:6,
            transition:"all 0.15s ease"
          }}
          onClick={() => handleDelete(item.id)}
          onMouseEnter={e => { e.currentTarget.style.color="#f87171"; e.currentTarget.style.background="rgba(248, 113, 113, 0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="#64748b"; e.currentTarget.style.background="rgba(30, 41, 59, 0.3)"; }}
        >✕</button>
      </div>
    );
  };

  // Glass Progress Banner
  const ProgressBanner = () => (
    <>
      {modelStatus === "loading" && (
        <div className="glass" style={isMobile ? m.banner : d.banner}>
          <div className="spin" />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:"#22d3ee", marginBottom:3 }}>Loading embedding model…</div>
            <div style={{ fontSize:10, color:"#64748b" }}>Downloading bge-small-en-v1.5 (~25MB, once only)</div>
          </div>
        </div>
      )}
      {seeding && (
        <div className="glass" style={isMobile ? m.banner : d.banner}>
          <div className="spin" />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:"#22d3ee", marginBottom:3 }}>
              Embedding inventory… {seedProg.done}/{seedProg.total}
            </div>
            <div style={{ height:3, background:"rgba(30, 41, 59, 0.5)", borderRadius:2, overflow:"hidden", margin:"4px 0", position:"relative" }}>
              <div className="shimmer" style={{ position:"absolute", top:0, left:0, right:0, bottom:0 }} />
              <div style={{ height:"100%", width:\`\${seedPct}%\`, background:"linear-gradient(90deg,#22d3ee,#8b5cf6)", transition:"width 0.3s", position:"relative", zIndex:1 }} />
            </div>
            {seedProg.current && <div style={{ fontSize:10, color:"#64748b" }}>"{seedProg.current}"</div>}
          </div>
        </div>
      )}
    </>
  );

  // Glass Toast Notification
  const GlassToast = ({ notif }) => (
    <div className="glass" style={{
      position:"fixed", zIndex:1000, animation:"slideUp 0.25s ease",
      background: notif.type === "error" ? "rgba(127, 29, 29, 0.7)" : "rgba(6, 78, 59, 0.7)",
      border: \`1px solid \${notif.type === "error" ? "rgba(248, 113, 113, 0.3)" : "rgba(16, 185, 129, 0.3)"}\`,
      color: notif.type === "error" ? "#f87171" : "#34d399",
      padding:"14px 18px", borderRadius:12, fontSize:13,
      boxShadow: notif.type === "error"
        ? "0 8px 32px rgba(248, 113, 113, 0.3), 0 0 20px rgba(248, 113, 113, 0.1)"
        : "0 8px 32px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.1)"
    }}>
      {notif.msg}
    </div>
  );

  // ── MOBILE layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    const isSearchTab = activeTab === "search";
    const listItems   = isSearchTab && results !== null ? results : inventory;

    return (
      <div style={m.root}>
        {/* Glass Header */}
        <div className="glass" style={m.header}>
          <div style={m.logo}>🔷</div>
          <div style={{ flex:1 }}>
            <div style={m.title}>VectorStock</div>
            <div style={m.subtitle}>SEMANTIC INVENTORY</div>
          </div>
          <div className="glass" style={m.badge}>{inventory.length} items</div>
          <div style={m.modelDot(modelStatus)} title={modelStatus} />
        </div>

        {/* Progress banners */}
        <ProgressBanner />

        {/* Error */}
        {error && (
          <div className="glass" style={m.error}>
            ⚠ {error}
            <span style={{ opacity:0.6, marginLeft:8, cursor:"pointer" }} onClick={() => setError(null)}>×</span>
          </div>
        )}

        {/* Content */}
        <div style={m.content}>

          {/* ── Inventory tab ── */}
          {activeTab === "inventory" && (
            <>
              {!seeding && inventory.length === 0 ? (
                <div style={m.empty}>
                  <div style={{ fontSize:44, marginBottom:10 }}>📦</div>
                  <div style={{ color:"#64748b", fontSize:14 }}>
                    {modelStatus !== "ready" ? "Loading model…" : "No items yet"}
                  </div>
                  <div style={{ color:"#475569", fontSize:12, marginTop:4 }}>
                    {modelStatus === "ready" && "Tap + Add to store your first item"}
                  </div>
                </div>
              ) : (
                inventory.map(item => <ItemCard key={item.id} item={item} />)
              )}
            </>
          )}

          {/* ── Search tab ── */}
          {activeTab === "search" && (
            <>
              <div className="glass" style={m.searchBox}>
                <textarea
                  className="glass-input"
                  style={m.searchInput}
                  rows={2}
                  placeholder={\`Try: "something to clean dishes"\\n"tools for home repair"\`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  disabled={modelStatus !== "ready"}
                />
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <button
                    className="glass-btn"
                    style={{ ...m.btn("search"), flex:1 }}
                    disabled={busy || !inventory.length || modelStatus !== "ready"}
                    onClick={handleSearch}
                  >
                    {loading.search ? "⟳ Searching…" : "⌕ Search"}
                  </button>
                </div>
              </div>

              {loading.search && (
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 16px", color:"#64748b", fontSize:12 }}>
                  <div className="spin" />
                  Computing similarity across {inventory.length} vectors…
                </div>
              )}

              {!loading.search && results !== null && results.length === 0 && (
                <div style={m.empty}>
                  <div style={{ fontSize:44, marginBottom:10 }}>🔍</div>
                  <div style={{ color:"#64748b", fontSize:14 }}>No results found</div>
                </div>
              )}

              {!loading.search && results === null && (
                <div style={m.empty}>
                  <div style={{ fontSize:44, marginBottom:10 }}>🔍</div>
                  <div style={{ color:"#64748b", fontSize:14 }}>Search your inventory</div>
                  <div style={{ color:"#475569", fontSize:12, marginTop:4 }}>Describe what you're looking for</div>
                </div>
              )}

              {!loading.search && results !== null && results.map(item => <ItemCard key={item.id} item={item} />)}
            </>
          )}

          {/* ── Settings tab ── */}
          {activeTab === "settings" && (
            <div className="glass" style={m.addForm}>
              <div style={m.secLabel}>SETTINGS</div>
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>
                Model:
                <div style={{ color:"#e2e8f0", marginTop:3 }}>{EMBEDDING_MODEL}</div>
              </div>
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>
                Status:
                <div style={{ color: modelStatus === "ready" ? "#34d399" : modelStatus === "error" ? "#f87171" : "#22d3ee", marginTop:3 }}>
                  {modelStatus}
                </div>
              </div>
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>
                Search Results (Top K):
              </div>
              <input
                type="number" min={1} max={Math.max(inventory.length, 1)}
                className="glass-input"
                style={{ ...m.inp, width:90 }}
                value={topK}
                onChange={e => setTopK(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>
                Default Room:
              </div>
              <select
                className="glass-input"
                style={m.inp}
                value={defaultRoom}
                onChange={e => {
                  const next = prettyLabel(e.target.value);
                  setDefaultRoom(next);
                  setAddForm(f => ({ ...f, room: next, box: "" }));
                  setBoxForm(f => ({ ...f, room: next }));
                  setBoxMove(prev => ({ ...prev, fromRoom: next, toRoom: next, box: "" }));
                }}
              >
                {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
              </select>
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>
                Add Room:
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input
                  className="glass-input"
                  style={{ ...m.inp, flex:1 }}
                  placeholder="Room name"
                  value={roomForm}
                  onChange={e => setRoomForm(e.target.value)}
                />
                <button
                  className="glass-btn-secondary"
                  style={{ ...m.btn("default"), width:110, color:"#67e8f9", border:"1px solid rgba(34, 211, 238, 0.35)" }}
                  onClick={handleAddRoom}
                >
                  Add Room
                </button>
              </div>
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>
                Add Box (assign to room):
              </div>
              <select
                className="glass-input"
                style={m.inp}
                value={boxForm.room}
                onChange={e => setBoxForm(f => ({ ...f, room: prettyLabel(e.target.value) }))}
              >
                {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
              </select>
              <div style={{ display:"flex", gap:8 }}>
                <input
                  className="glass-input"
                  style={{ ...m.inp, flex:1 }}
                  placeholder="Box name"
                  value={boxForm.name}
                  onChange={e => setBoxForm(f => ({ ...f, name: e.target.value }))}
                />
                <button
                  className="glass-btn-secondary"
                  style={{ ...m.btn("default"), width:110, color:"#67e8f9", border:"1px solid rgba(34, 211, 238, 0.35)" }}
                  onClick={handleAddBox}
                >
                  Add Box
                </button>
              </div>
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>
                Move Box:
              </div>
              <select
                className="glass-input"
                style={m.inp}
                value={boxMove.fromRoom}
                onChange={e => setBoxMove(prev => ({ ...prev, fromRoom: prettyLabel(e.target.value), box: "" }))}
              >
                {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
              </select>
              <select
                className="glass-input"
                style={m.inp}
                value={boxMove.box}
                onChange={e => setBoxMove(prev => ({ ...prev, box: e.target.value }))}
              >
                <option value="">Select box in room</option>
                {moveBoxes.map(box => <option key={box} value={box}>{box}</option>)}
              </select>
              <select
                className="glass-input"
                style={m.inp}
                value={boxMove.toRoom}
                onChange={e => setBoxMove(prev => ({ ...prev, toRoom: prettyLabel(e.target.value) }))}
              >
                {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
              </select>
              <button
                className="glass-btn-secondary"
                style={{ ...m.btn("default"), color:"#67e8f9", border:"1px solid rgba(34, 211, 238, 0.35)" }}
                onClick={handleMoveBox}
              >
                Move Box
              </button>
              <div style={{ fontSize:11, color:"#64748b", lineHeight:1.6 }}>
                Stored items: {inventory.length}
              </div>
              <button
                className="glass-btn-secondary"
                style={{ ...m.btn("default"), color:"#f87171", border:"1px solid rgba(248, 113, 113, 0.35)" }}
                onClick={handleClearAllData}
              >
                Clear All Stored Items
              </button>
            </div>
          )}

          {/* ── Add tab ── */}
          {activeTab === "add" && (
            <div className="glass" style={m.addForm}>
              <div style={m.secLabel}>ADD ITEM</div>
              <input
                className="glass-input"
                style={m.inp} placeholder="Item name *"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                disabled={modelStatus !== "ready"}
              />
              <textarea
                className="glass-input"
                style={{ ...m.inp, minHeight:80, resize:"vertical" }}
                placeholder="Description (improves search accuracy)"
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                disabled={modelStatus !== "ready"}
              />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <input className="glass-input" style={m.inp} placeholder="Qty"  value={addForm.qty}  onChange={e => setAddForm(f => ({ ...f, qty: e.target.value }))}  disabled={modelStatus !== "ready"} />
                <input className="glass-input" style={m.inp} placeholder="Unit" value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))} disabled={modelStatus !== "ready"} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <select
                  className="glass-input"
                  style={m.inp}
                  value={addForm.room}
                  onChange={e => setAddForm(f => ({ ...f, room: prettyLabel(e.target.value), box: "" }))}
                  disabled={modelStatus !== "ready"}
                >
                  {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
                </select>
                <select
                  className="glass-input"
                  style={m.inp}
                  value={addForm.box}
                  onChange={e => setAddForm(f => ({ ...f, box: e.target.value }))}
                  disabled={modelStatus !== "ready"}
                >
                  <option value="">No box</option>
                  {addItemBoxes.map(box => <option key={box} value={box}>{box}</option>)}
                </select>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {STATUSES.map(st => {
                  const isSelected = addForm.status === st;
                  const colors = STATUS_COLORS[st];
                  return (
                    <button key={st}
                      className={isSelected ? "glass-btn" : "glass-btn-secondary"}
                      style={{
                        padding:"8px 14px", borderRadius:20,
                        border: \`1px solid \${isSelected ? "rgba(139, 92, 246, 0.4)" : "rgba(148, 163, 184, 0.15)"}\`,
                        color: isSelected ? "#fff" : "#94a3b8",
                        fontSize:12, cursor:"pointer", fontFamily:"inherit"
                      }}
                      onClick={() => setAddForm(f => ({ ...f, status: st }))}
                    >{st}</button>
                  );
                })}
              </div>
              <button
                className="glass-btn glow-cyan"
                style={m.btn("primary", loading.add || seeding || modelStatus !== "ready")}
                disabled={loading.add || seeding || modelStatus !== "ready"}
                onClick={handleAdd}
              >
                {loading.add ? "⟳ Embedding…" : "+ Embed & Store"}
              </button>
            </div>
          )}
        </div>

        {/* Glass Bottom Navigation */}
        <div className="glass-nav" style={m.nav}>
          {[
            { key: "inventory", icon: "📦", label: \`Inventory\` },
            { key: "search",    icon: "🔍", label: "Search"    },
            { key: "settings",  icon: "⚙️", label: "Settings"  },
            { key: "add",       icon: "＋", label: "Add Item"  },
          ].map(t => (
            <button
              key={t.key}
              className={activeTab === t.key ? "glow-active" : ""}
              style={m.navBtn(activeTab === t.key)}
              onClick={() => setActiveTab(t.key)}
            >
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <span style={{ fontSize:10, marginTop:2 }}>{t.label}</span>
            </button>
          ))}
        </div>

        {notif && <GlassToast notif={notif} />}
      </div>
    );
  }

  // ── DESKTOP layout ────────────────────────────────────────────────────────
  return (
    <div style={d.root}>
      <div className="glass" style={d.header}>
        <div style={d.logo}>🔷</div>
        <div>
          <h1 style={d.h1}>VectorStock</h1>
          <p style={d.sub}>SEMANTIC INVENTORY · RAG-POWERED NEAREST-NEIGHBOR SEARCH</p>
        </div>
        <div className="glass" style={d.badge}>{inventory.length} items indexed</div>
        <div className="glass" style={d.status(modelStatus)}>
          {modelStatus === "loading" && "⟳ Loading model..."}
          {modelStatus === "ready"   && "✓ Model ready"}
          {modelStatus === "error"   && "⚠ Model error"}
          {modelStatus === "initializing" && "⏳ Initializing..."}
        </div>
      </div>

      <div style={d.body}>
        {/* Glass Sidebar */}
        <div className="glass" style={d.side}>
          <div>
            <div style={d.secLbl}>Add Item</div>
            <div style={d.form}>
              <input className="glass-input" style={d.inp} placeholder="Item name *" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} disabled={modelStatus !== "ready"} />
              <textarea className="glass-input" style={d.ta} placeholder="Description (boosts semantic accuracy)" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} disabled={modelStatus !== "ready"} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <input className="glass-input" style={d.inp} placeholder="Qty"  value={addForm.qty}  onChange={e => setAddForm(f => ({ ...f, qty: e.target.value }))}  disabled={modelStatus !== "ready"} />
                <input className="glass-input" style={d.inp} placeholder="Unit" value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))} disabled={modelStatus !== "ready"} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <select className="glass-input" style={d.sel} value={addForm.room} onChange={e => setAddForm(f => ({ ...f, room: prettyLabel(e.target.value), box: "" }))} disabled={modelStatus !== "ready"}>
                  {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
                </select>
                <select className="glass-input" style={d.sel} value={addForm.box} onChange={e => setAddForm(f => ({ ...f, box: e.target.value }))} disabled={modelStatus !== "ready"}>
                  <option value="">No box</option>
                  {addItemBoxes.map(box => <option key={box} value={box}>{box}</option>)}
                </select>
              </div>
              <select className="glass-input" style={d.sel} value={addForm.status} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))} disabled={modelStatus !== "ready"}>
                {STATUSES.map(st => <option key={st}>{st}</option>)}
              </select>
              <button className="glass-btn glow-cyan" style={d.btn("primary", loading.add || seeding || modelStatus !== "ready")} disabled={loading.add || seeding || modelStatus !== "ready"} onClick={handleAdd}>
                {loading.add ? "⟳ Embedding…" : "+ Embed & Store"}
              </button>
            </div>
          </div>

          <div style={{ borderTop:"1px solid rgba(148, 163, 184, 0.1)" }} />

          <div>
            <div style={d.secLbl}>Semantic Search</div>
            <div style={d.form}>
              <textarea
                className="glass-input"
                style={{ ...d.ta, minHeight:50 }}
                placeholder={"Try:\\n\\"something to clean dishes\\"\\n\\"tools for home repair\\""}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); if (!busy&&inventory.length>0&&modelStatus==="ready") handleSearch(); }}}
                disabled={modelStatus !== "ready"}
              />
              <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"#64748b" }}>
                <span>Top</span>
                <input type="number" min={1} max={Math.max(inventory.length,1)}
                  className="glass-input"
                  style={{ ...d.inp, width:46, textAlign:"center", padding:"5px 6px" }}
                  value={topK} onChange={e => setTopK(Math.max(1,parseInt(e.target.value)||1))} disabled={modelStatus !== "ready"} />
                <span>results</span>
              </div>
              <button className="glass-btn" style={d.btn("search", busy||!inventory.length||modelStatus!=="ready")} disabled={busy||!inventory.length||modelStatus!=="ready"} onClick={handleSearch}>
                {loading.search ? "⟳ Vectorizing…" : "⌕ Search Nearest Neighbors"}
              </button>
            </div>
          </div>

          {error && (
            <div className="glass" style={d.err}>⚠ {error}
              <br /><span style={{ opacity:0.6, cursor:"pointer" }} onClick={() => setError(null)}>dismiss ×</span>
            </div>
          )}
          <div style={{ marginTop:"auto", fontSize:10, color:"#475569", lineHeight:1.7 }}>
            Embeddings via Transformers.js (bge-small-en-v1.5) · local, in-browser.<br />
            No exact names needed — concepts cluster in vector space.
          </div>
        </div>

        {/* Main */}
        <div style={d.main}>
          <ProgressBanner />
          <div style={d.tabs}>
            <button className={activeTab==="inventory" ? "glass-btn" : "glass-btn-secondary"} style={d.tab(activeTab==="inventory")} onClick={() => setActiveTab("inventory")}>📦 Inventory ({inventory.length})</button>
            <button className={activeTab==="search" ? "glass-btn" : "glass-btn-secondary"} style={d.tab(activeTab==="search")}    onClick={() => setActiveTab("search")}>🔍 Results {results ? \`(\${results.length})\` : ""}</button>
          </div>

          {loading.search && (
            <div style={{ display:"flex", alignItems:"center", gap:9, padding:"32px 0", justifyContent:"center", color:"#64748b", fontSize:11 }}>
              <div className="spin" /><span>Computing similarity across {inventory.length} vectors…</span>
            </div>
          )}

          {!loading.search && displayItems.length === 0 && (
            <div style={{ textAlign:"center", padding:"44px 20px", color:"#475569" }}>
              <div style={{ fontSize:38, marginBottom:9 }}>{activeTab==="search" ? "🔍" : "📦"}</div>
              <div style={{ fontSize:13, color:"#64748b", marginBottom:4 }}>
                {activeTab==="search" ? "Run a search to find nearest neighbors"
                  : seeding ? "Embedding items, please wait…"
                  : modelStatus==="loading" ? "Loading embedding model..."
                  : "Inventory is empty"}
              </div>
            </div>
          )}

          {!loading.search && displayItems.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      </div>

      {notif && <GlassToast notif={notif} />}
    </div>
  );
}

// ─── Mobile styles ────────────────────────────────────────────────────────────
const FF = "'DM Mono','Courier New',monospace";
const INPUT_FF = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const m = {
  root:    { display:"flex", flexDirection:"column", height:"100%",
             color:"#e2e8f0", fontFamily:FF, overflow:"hidden" },
  header:  { display:"flex", alignItems:"center", gap:10, padding:"14px 16px", flexShrink:0 },
  logo:    { width:34, height:34, background:"linear-gradient(135deg,#22d3ee,#8b5cf6)",
             borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 },
  title:   { fontSize:16, fontWeight:700, color:"#f1f5f9", letterSpacing:"-0.3px" },
  subtitle:{ fontSize:9, color:"#64748b", letterSpacing:"1px" },
  badge:   { borderRadius:20, padding:"4px 10px", fontSize:11, color:"#22d3ee" },
  modelDot:(s) => ({ width:8, height:8, borderRadius:"50%", flexShrink:0,
             background: s==="ready" ? "#34d399" : s==="loading" ? "#22d3ee" : s==="error" ? "#f87171" : "#64748b",
             boxShadow: s==="ready" ? "0 0 8px rgba(52, 211, 153, 0.6)" : s==="loading" ? "0 0 8px rgba(34, 211, 238, 0.6)" : "none" }),
  banner:  { display:"flex", gap:10, alignItems:"center", borderBottom:"1px solid rgba(148, 163, 184, 0.1)",
             padding:"12px 16px", flexShrink:0, borderRadius: "0 0 12px 12px" },
  error:   { background:"rgba(127, 29, 29, 0.6)", borderBottom:"1px solid rgba(248, 113, 113, 0.2)",
             padding:"10px 16px", fontSize:12, color:"#f87171", display:"flex", justifyContent:"space-between", flexShrink:0 },
  content: { flex:1, minHeight:0, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10,
             paddingBottom:20 },
  card:    { borderRadius:12, padding:"14px", display:"flex", gap:10, alignItems:"flex-start" },
  cName:   { fontSize:15, fontWeight:700, color:"#f1f5f9", marginBottom:3 },
  cDesc:   { fontSize:12, color:"#94a3b8", lineHeight:1.5 },
  empty:   { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
             flex:1, padding:40, textAlign:"center" },
  searchBox:{ borderBottom:"1px solid rgba(148, 163, 184, 0.1)", padding:"12px 14px",
              display:"flex", flexDirection:"column", gap:8, flexShrink:0, borderRadius: "0 0 12px 12px" },
  searchInput:{ width:"100%", borderRadius:8, padding:"10px 12px", color:"#e2e8f0", fontSize:16, lineHeight:"1.35", fontFamily:INPUT_FF,
                resize:"none", boxSizing:"border-box" },
  inp:     { width:"100%", borderRadius:8, padding:"12px 12px", color:"#e2e8f0", fontSize:16, lineHeight:"1.35", fontFamily:INPUT_FF,
             boxSizing:"border-box", display:"block" },
  addForm: { display:"flex", flexDirection:"column", gap:10 },
  secLabel:{ fontSize:10, letterSpacing:"2px", color:"#64748b", textTransform:"uppercase" },
  btn:     (v, d) => ({
             width:"100%", padding:"13px", borderRadius:8, border:"none", cursor: d ? "not-allowed" : "pointer",
             fontSize:14, fontFamily:FF, fontWeight:600, opacity: d ? 0.45 : 1,
             color:"#fff" }),
  nav:     { display:"flex", flexShrink:0, paddingBottom: "env(safe-area-inset-bottom, 0px)" },
  navBtn:  (a) => ({
             flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
             padding:"12px 0", border:"none", background: "transparent",
             color: a ? "#22d3ee" : "#64748b", cursor:"pointer", fontFamily:FF,
             borderTop: a ? "2px solid #22d3ee" : "2px solid transparent",
             transition:"all 0.2s ease" }),
};

// ─── Desktop styles ───────────────────────────────────────────────────────────
const d = {
  root:   { minHeight:"100vh", color:"#e2e8f0", fontFamily:FF },
  header: { borderBottom:"1px solid rgba(148, 163, 184, 0.1)", padding:"18px 26px", display:"flex", alignItems:"center", gap:13 },
  logo:   { width:36, height:36, background:"linear-gradient(135deg,#22d3ee,#8b5cf6)", borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 },
  h1:     { fontSize:19, fontWeight:700, letterSpacing:"-0.4px", color:"#f1f5f9", margin:0 },
  sub:    { fontSize:10, color:"#64748b", margin:"2px 0 0", letterSpacing:"0.5px" },
  badge:  { marginLeft:"auto", borderRadius:20, padding:"4px 13px", fontSize:11, color:"#22d3ee" },
  status: (s) => ({ fontSize:10, padding:"4px 10px", borderRadius:6,
            background: s==="ready" ? "rgba(6, 78, 59, 0.5)" : s==="loading" ? "rgba(30, 58, 138, 0.5)" : "rgba(127, 29, 29, 0.5)",
            border: \`1px solid \${s==="ready" ? "rgba(16, 185, 129, 0.3)" : s==="loading" ? "rgba(59, 130, 246, 0.3)" : "rgba(248, 113, 113, 0.3)"}\`,
            color: s==="ready" ? "#34d399" : s==="loading" ? "#60a5fa" : "#f87171",
            boxShadow: s==="ready" ? "0 0 12px rgba(16, 185, 129, 0.2)" : "none" }),
  body:   { display:"grid", gridTemplateColumns:"310px 1fr", minHeight:"calc(100vh - 73px)" },
  side:   { borderRight:"1px solid rgba(148, 163, 184, 0.1)", padding:"18px 16px",
            display:"flex", flexDirection:"column", gap:16, overflowY:"auto", borderRadius: "0 12px 12px 0" },
  secLbl: { fontSize:10, letterSpacing:"2px", color:"#64748b", textTransform:"uppercase", marginBottom:7 },
  form:   { display:"flex", flexDirection:"column", gap:6 },
  inp:    { width:"100%", borderRadius:6, padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
            boxSizing:"border-box", fontFamily:FF, transition:"border-color 0.15s" },
  ta:     { width:"100%", borderRadius:6, padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
            boxSizing:"border-box", fontFamily:FF, resize:"vertical", minHeight:60 },
  sel:    { width:"100%", borderRadius:6, padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
            boxSizing:"border-box", fontFamily:FF, cursor:"pointer" },
  btn:    (v, d) => ({
            width:"100%", padding:"8px 13px", borderRadius:6, border:"none",
            cursor: d ? "not-allowed" : "pointer", fontSize:12, fontFamily:FF,
            fontWeight:600, letterSpacing:"0.3px", opacity: d ? 0.45 : 1, transition:"all 0.15s",
            background: v==="primary" ? "linear-gradient(135deg,#22d3ee,#8b5cf6)"
                      : v==="search"  ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "#1e2d3d",
            color:"#fff" }),
  main:   { padding:"18px 22px", display:"flex", flexDirection:"column", gap:12, overflowY:"auto" },
  banner: { borderRadius:8, padding:"12px 16px", display:"flex", gap:10, alignItems:"center", marginBottom:4 },
  tabs:   { display:"flex", gap:3, borderBottom:"1px solid rgba(148, 163, 184, 0.1)", marginBottom:2 },
  tab:    (a) => ({ padding:"6px 15px", borderRadius:"6px 6px 0 0", border:"1px solid",
            borderColor: a ? "rgba(139, 92, 246, 0.3)" : "transparent",
            background: a ? "rgba(30, 41, 59, 0.5)" : "transparent", color: a ? "#22d3ee" : "#64748b",
            fontSize:11, cursor:"pointer", fontFamily:FF, fontWeight: a ? 600 : 400, marginBottom:-1 }),
  card:   { borderRadius:10, padding:"12px 14px", display:"flex", gap:11, alignItems:"flex-start" },
  cName:  { fontSize:13, fontWeight:700, color:"#f1f5f9", marginBottom:3 },
  cDesc:  { fontSize:11, color:"#94a3b8", marginBottom:6, lineHeight:1.5 },
  err:    { borderRadius:6, padding:"9px 12px", fontSize:11, color:"#f87171", lineHeight:1.5,
            background:"rgba(127, 29, 29, 0.5)", border:"1px solid rgba(248, 113, 113, 0.2)" },
};

// ─── Tests ──────────────────────────────────────────────────────────────────────
function runTests() {
  const mockItems = [
    { id: 1, name: "Item A", vector: [1, 0, 0] },
    { id: 2, name: "Item B", vector: [0, 1, 0] },
    { id: 3, name: "Item C", vector: [0, 0, 1] },
    { id: 4, name: "Item D", vector: [0.5, 0.5, 0] },
  ];
  const queryVec = [1, 0, 0];

  // Test 1: cosineSimilarity returns correct values
  const test1 = cosineSimilarity([1, 0, 0], [1, 0, 0]) === 1;
  const test2 = cosineSimilarity([1, 0, 0], [0, 1, 0]) === 0;
  const test3 = Math.abs(cosineSimilarity([1, 0, 0], [-1, 0, 0]) + 1) < 0.0001;

  // Test 2: searchItems returns sorted results
  const results = searchItems(queryVec, mockItems, 3);
  const test4 = results.length === 3;
  const test5 = results[0].id === 1; // [1,0,0] has highest similarity
  const test6 = results[0].score >= results[1].score;

  // Test 3: minScore filter works
  const filteredResults = searchItems(queryVec, mockItems, 4, 0.5);
  const test7 = filteredResults.every(r => r.score >= 0.5);

  console.log("Tests:", { test1, test2, test3, test4, test5, test6, test7 });
}

runTests();

function initApp() {
  document.getElementById('loading').style.display = 'none';
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<SemanticInventory />);
}

if (window.transformersReady) { initApp(); }
else { window.addEventListener('transformers-ready', initApp, { once: true }); }
  </script>
</body>
</html>
`;
