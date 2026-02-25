import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { pipeline } from '@xenova/transformers';

// ─── Vector math ──────────────────────────────────────────────────────────────
function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (!isFinite(denom) || denom === 0) return 0;
  return Math.max(-1, Math.min(1, dot / denom));
}

// ─── Embed via Transformers.js ────────────────────────────────────────────────
let pipelineInstance = null;
let modelLoading = false;
const loadQueue = [];

async function getEmbeddingPipeline() {
  if (pipelineInstance) return pipelineInstance;

  if (modelLoading) {
    return new Promise((resolve) => {
      loadQueue.push(resolve);
    });
  }

  modelLoading = true;

  try {
    console.log('Creating embedding pipeline...');
    pipelineInstance = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      {
        quantized: true,
        progress_callback: (progress) => {
          console.log('Model download progress:', progress);
        }
      }
    );
    console.log('Pipeline created successfully');

    loadQueue.forEach(resolve => resolve(pipelineInstance));
    loadQueue.length = 0;

    return pipelineInstance;
  } catch (error) {
    modelLoading = false;
    console.error('Pipeline creation error:', error);
    throw new Error(`Failed to load embedding model: ${error.message}`);
  }
}

async function embedText(text) {
  const safeText = String(text ?? "").trim();
  if (!safeText) throw new Error("Cannot embed empty text.");

  try {
    const pipe = await getEmbeddingPipeline();
    const output = await pipe(safeText, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Embedding error:', error);
    throw new Error(`Embedding failed: ${error.message}`);
  }
}

// ─── Seed data (30 household items) ──────────────────────────────────────────
const SEED_ITEMS = [
  { name: "Chef's Knife",          description: "Sharp 8-inch stainless steel blade for chopping vegetables and meat",           qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Cutting Board",         description: "Large wooden board for food prep and slicing ingredients safely",               qty: "2",  unit: "pcs",   status: "In Stock"  },
  { name: "Non-stick Frying Pan",  description: "12-inch pan with Teflon coating, ideal for eggs and sautéing",                  qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Pasta Pot",             description: "Large stockpot with lid for boiling pasta, soups, and stews",                   qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Dish Soap",             description: "Liquid detergent for hand-washing plates, pots, and kitchen utensils",          qty: "3",  unit: "btl",   status: "In Stock"  },
  { name: "Kitchen Sponge",        description: "Scrubbing pad with soft side for cleaning dishes and wiping surfaces",          qty: "6",  unit: "pcs",   status: "Low Stock" },
  { name: "Paper Towels",          description: "Absorbent disposable rolls for mopping up spills and drying hands",             qty: "4",  unit: "rolls", status: "In Stock"  },
  { name: "Laundry Detergent",     description: "Powder detergent for washing clothes in the washing machine",                   qty: "1",  unit: "box",   status: "Low Stock" },
  { name: "Fabric Softener",       description: "Liquid conditioner added to rinse cycle to keep clothes soft and fresh",        qty: "1",  unit: "btl",   status: "In Stock"  },
  { name: "Broom",                 description: "Bristle broom for sweeping dust and debris from hard floors",                   qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Mop & Bucket",          description: "Wet mop system for cleaning tile and hardwood floors",                          qty: "1",  unit: "set",   status: "In Stock"  },
  { name: "Vacuum Cleaner",        description: "Upright electric vacuum for removing dirt and pet hair from carpets",           qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Toilet Paper",          description: "Soft 2-ply bathroom tissue rolls for personal hygiene",                        qty: "24", unit: "rolls", status: "In Stock"  },
  { name: "Hand Soap",             description: "Pump dispenser liquid soap for washing hands in bathroom and kitchen",          qty: "3",  unit: "pcs",   status: "In Stock"  },
  { name: "Shampoo",               description: "Hair cleansing product for scalp and washing hair in the shower",               qty: "2",  unit: "btl",   status: "In Stock"  },
  { name: "Toothpaste",            description: "Fluoride dental paste for brushing and cleaning teeth twice daily",             qty: "3",  unit: "tubes", status: "In Stock"  },
  { name: "Bed Sheets",            description: "Cotton queen-size fitted and flat sheets for sleeping comfort",                 qty: "2",  unit: "sets",  status: "In Stock"  },
  { name: "Pillow",                description: "Soft memory foam pillow for sleeping head and neck support",                    qty: "4",  unit: "pcs",   status: "In Stock"  },
  { name: "LED Light Bulbs",       description: "60W equivalent LED bulbs for ceiling fixtures and bedside lamps",               qty: "8",  unit: "pcs",   status: "In Stock"  },
  { name: "Extension Cord",        description: "6-foot 3-outlet power strip for plugging in multiple appliances",               qty: "2",  unit: "pcs",   status: "In Stock"  },
  { name: "AA Batteries",          description: "Alkaline batteries for remote controls, flashlights, and wall clocks",          qty: "12", unit: "pcs",   status: "Low Stock" },
  { name: "Smoke Detector",        description: "Battery-powered ceiling alarm that detects fire and smoke in the home",         qty: "3",  unit: "pcs",   status: "In Stock"  },
  { name: "First Aid Kit",         description: "Box of bandages, antiseptic wipes, and gauze for treating minor injuries",      qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Ibuprofen",             description: "Over-the-counter pain reliever and fever reducer tablet medication",            qty: "1",  unit: "btl",   status: "Low Stock" },
  { name: "Plunger",               description: "Rubber suction cup for unclogging blocked toilets and slow drains",             qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Hammer",                description: "Claw hammer for driving nails and light home repair tasks",                     qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Screwdriver Set",       description: "Phillips and flathead screwdrivers for assembling furniture and fixtures",      qty: "1",  unit: "set",   status: "In Stock"  },
  { name: "Measuring Tape",        description: "25-foot retractable tape for measuring rooms, furniture, and distances",        qty: "1",  unit: "pcs",   status: "In Stock"  },
  { name: "Trash Bags",            description: "30-gallon black garbage bags for kitchen and outdoor waste bins",               qty: "2",  unit: "boxes", status: "In Stock"  },
  { name: "All-Purpose Cleaner",   description: "Spray bottle surface cleaner for countertops, appliances, and bathrooms",       qty: "2",  unit: "btl",   status: "In Stock"  },
];

const STATUSES = ["In Stock", "Low Stock", "Out of Stock", "Ordered"];
const STATUS_COLORS = {
  "In Stock":     { bg: "#0d2e1a", text: "#4ade80", border: "#166534" },
  "Low Stock":    { bg: "#2d1f00", text: "#fbbf24", border: "#92400e" },
  "Out of Stock": { bg: "#2d0a0a", text: "#f87171", border: "#991b1b" },
  "Ordered":      { bg: "#0a1a2d", text: "#60a5fa", border: "#1e40af" },
};

export default function App() {
  const [inventory, setInventory]     = useState([]);
  const [results,   setResults]       = useState(null);
  const [loading,   setLoading]       = useState({ add: false, search: false });
  const [seeding,   setSeeding]       = useState(false);
  const [seedProg,  setSeedProg]      = useState({ done: 0, total: 0, current: "" });
  const [addForm,   setAddForm]       = useState({ name: "", description: "", qty: "", unit: "", status: "In Stock" });
  const [searchQuery, setSearchQuery] = useState("");
  const [topK,      setTopK]          = useState(5);
  const [activeTab, setActiveTab]     = useState("inventory");
  const [notif,     setNotif]         = useState(null);
  const [error,     setError]         = useState(null);
  const [modelStatus, setModelStatus] = useState("initializing");
  const cancelRef = useRef(false);

  const toast = (msg, type = "success") => {
    Alert.alert(type === "error" ? "Error" : "Success", msg);
  };

  // ── Initialize model ──────────────────────────────────────────────────────
  useEffect(() => {
    let live = true;

    async function initModel() {
      try {
        console.log('Starting model initialization...');
        setModelStatus("loading");
        await getEmbeddingPipeline();
        if (live) {
          console.log('Model ready!');
          setModelStatus("ready");
          toast("Embedding model loaded ✓");
        }
      } catch (e) {
        console.error('Model initialization error:', e);
        if (live) {
          setModelStatus("error");
          setError(`Model load failed: ${e.message}`);
          toast("Failed to load embedding model", "error");
        }
      }
    }

    initModel();
    return () => { live = false; };
  }, []);

  // ── Seed on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (modelStatus !== "ready") return;

    cancelRef.current = false;
    let live = true;

    async function run() {
      setSeeding(true);
      setSeedProg({ done: 0, total: SEED_ITEMS.length, current: "" });

      for (let i = 0; i < SEED_ITEMS.length; i++) {
        if (!live || cancelRef.current) break;

        const item = SEED_ITEMS[i];
        setSeedProg(p => ({ ...p, current: item.name }));

        try {
          const embedding = await embedText(`${item.name} ${item.description}`);
          const newItem = { ...item, id: Date.now() + i, embedding };
          setInventory(inv => [...inv, newItem]);
          setSeedProg(p => ({ ...p, done: p.done + 1 }));
        } catch (e) {
          console.error('Seeding error:', e);
        }
      }

      if (live) {
        setSeeding(false);
        toast(`${SEED_ITEMS.length} items seeded ✓`);
      }
    }

    run();
    return () => { live = false; cancelRef.current = true; };
  }, [modelStatus]);

  // ── Add item ──────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const name = String(addForm.name ?? "").trim();
    if (!name) return toast("Item name is required.", "error");
    if (modelStatus !== "ready") return toast("Model not ready.", "error");

    setLoading(l => ({ ...l, add: true }));
    setError(null);
    try {
      const embedding = await embedText(`${name} ${addForm.description}`);
      const item = {
        id: Date.now(),
        name,
        description: addForm.description,
        qty: addForm.qty,
        unit: addForm.unit,
        status: addForm.status,
        embedding
      };
      setInventory(inv => [...inv, item]);
      setAddForm({ name: "", description: "", qty: "", unit: "", status: "In Stock" });
      toast(`"${item.name}" embedded and stored ✓`);
    } catch (e) {
      setError(e.message);
      toast("Embedding failed.", "error");
    } finally {
      setLoading(l => ({ ...l, add: false }));
    }
  };

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    const q = String(searchQuery ?? "").trim();
    if (!q) return toast("Enter a search query.", "error");
    if (inventory.length === 0) return toast("Inventory is empty.", "error");
    if (modelStatus !== "ready") return toast("Model not ready.", "error");

    setLoading(l => ({ ...l, search: true }));
    setResults(null);
    setError(null);
    try {
      const queryEmbedding = await embedText(q);
      const scored = inventory.map(item => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding)
      })).sort((a, b) => b.score - a.score).slice(0, topK);
      setResults(scored);
      setActiveTab("search");
    } catch (e) {
      setError(e.message);
      toast("Search failed.", "error");
    } finally {
      setLoading(l => ({ ...l, search: false }));
    }
  };

  const handleDelete = (id) => {
    setInventory(inv => inv.filter(i => i.id !== id));
    setResults(r => r ? r.filter(i => i.id !== id) : r);
  };

  const busy = loading.add || loading.search;
  const displayItems = (activeTab === "search" && results !== null) ? results : inventory;
  const seedPct = seedProg.total > 0 ? (seedProg.done / seedProg.total) * 100 : 0;

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemDesc}>{item.description}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemQty}>Qty: {item.qty} {item.unit}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status].bg, borderColor: STATUS_COLORS[item.status].border }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status].text }]}>{item.status}</Text>
        </View>
      </View>
      {activeTab === "search" && item.score && (
        <Text style={styles.score}>Similarity: {(item.score * 100).toFixed(1)}%</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VectorStock</Text>
        <Text style={styles.subtitle}>Semantic Inventory</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "inventory" && styles.activeTab]}
          onPress={() => setActiveTab("inventory")}
        >
          <Text style={[styles.tabText, activeTab === "inventory" && styles.activeTabText]}>Inventory ({inventory.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "search" && styles.activeTab]}
          onPress={() => setActiveTab("search")}
        >
          <Text style={[styles.tabText, activeTab === "search" && styles.activeTabText]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "add" && styles.activeTab]}
          onPress={() => setActiveTab("add")}
        >
          <Text style={[styles.tabText, activeTab === "add" && styles.activeTabText]}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "inventory" && (
        <FlatList
          data={displayItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      )}

      {activeTab === "search" && (
        <View style={styles.searchTab}>
          <TextInput
            style={styles.input}
            placeholder="Search inventory..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.searchControls}>
            <Text>Top K:</Text>
            <TextInput
              style={[styles.input, { width: 60 }]}
              keyboardType="numeric"
              value={topK.toString()}
              onChangeText={(text) => setTopK(parseInt(text) || 5)}
            />
            <TouchableOpacity style={styles.btn} onPress={handleSearch} disabled={busy}>
              <Text style={styles.btnText}>{loading.search ? "Searching..." : "Search"}</Text>
            </TouchableOpacity>
          </View>
          {results && (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
            />
          )}
        </View>
      )}

      {activeTab === "add" && (
        <ScrollView style={styles.addTab}>
          <TextInput
            style={styles.input}
            placeholder="Item name"
            value={addForm.name}
            onChangeText={(text) => setAddForm(f => ({ ...f, name: text }))}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            multiline
            value={addForm.description}
            onChangeText={(text) => setAddForm(f => ({ ...f, description: text }))}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Qty"
              value={addForm.qty}
              onChangeText={(text) => setAddForm(f => ({ ...f, qty: text }))}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Unit"
              value={addForm.unit}
              onChangeText={(text) => setAddForm(f => ({ ...f, unit: text }))}
            />
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleAdd} disabled={busy}>
            <Text style={styles.btnText}>{loading.add ? "Adding..." : "Add Item"}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {seeding && (
        <View style={styles.seeding}>
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text>Seeding inventory... {seedProg.done}/{seedProg.total}</Text>
          <Text>{seedProg.current}</Text>
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090e17',
    paddingTop: 50,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2d3d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 14,
    color: '#60a5fa',
    fontFamily: 'monospace',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2d3d',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1e2d3d',
  },
  tabText: {
    color: '#64748b',
    fontFamily: 'monospace',
  },
  activeTabText: {
    color: '#60a5fa',
  },
  list: {
    flex: 1,
  },
  item: {
    backgroundColor: '#0d1520',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    fontFamily: 'monospace',
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 18,
  },
  itemDesc: {
    color: '#94a3b8',
    marginVertical: 5,
    fontFamily: 'monospace',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQty: {
    color: '#cbd5e1',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  score: {
    color: '#fbbf24',
    fontFamily: 'monospace',
    marginTop: 5,
  },
  searchTab: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#1e2d3d',
    color: '#e2e8f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  searchControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'monospace',
  },
  addTab: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  seeding: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 14, 23, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
