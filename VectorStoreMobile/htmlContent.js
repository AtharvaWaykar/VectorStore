export const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>VectorStock - Semantic Inventory</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; overscroll-behavior: none; }
    body { margin: 0; padding: 0; background: #090e17; -webkit-font-smoothing: antialiased; }
    #root { width: 100%; height: 100%; }
    #loading {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: #090e17; color: #60a5fa;
      font-family: monospace; font-size: 14px; flex-direction: column; gap: 20px;
    }
    .spinner {
      width: 40px; height: 40px; border: 3px solid #1e3045;
      border-top-color: #60a5fa; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .spin {
      width: 18px; height: 18px; border: 2px solid #1e3045;
      border-top-color: #3b82f6; border-radius: 50%;
      animation: spin 0.7s linear infinite; flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideUp { from { transform: translateY(14px); opacity: 0; } to { transform: none; opacity: 1; } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    input:focus, textarea:focus, select:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
      outline: none;
    }
    button:not(:disabled):active { filter: brightness(0.9); }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #090e17; }
    ::-webkit-scrollbar-thumb { background: #1e3045; border-radius: 3px; }
    /* iOS safe area */
    .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
  </style>
</head>
<body>
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

// ─── Vector math ──────────────────────────────────────────────────────────────
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

// ─── Embed via Transformers.js ────────────────────────────────────────────────
let pipelineInstance = null, modelLoading = false;
const loadQueue = [];

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
    pipelineInstance = await window.transformersPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });
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

// ─── Seed data ────────────────────────────────────────────────────────────────
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
  "In Stock":     { bg: "#0d2e1a", text: "#4ade80", border: "#166534" },
  "Low Stock":    { bg: "#2d1f00", text: "#fbbf24", border: "#92400e" },
  "Out of Stock": { bg: "#2d0a0a", text: "#f87171", border: "#991b1b" },
  "Ordered":      { bg: "#0a1a2d", text: "#60a5fa", border: "#1e40af" },
};

// ─── App ──────────────────────────────────────────────────────────────────────
function SemanticInventory() {
  const [inventory,    setInventory]   = useState([]);
  const [results,      setResults]     = useState(null);
  const [loading,      setLoading]     = useState({ add: false, search: false });
  const [seeding,      setSeeding]     = useState(false);
  const [seedProg,     setSeedProg]    = useState({ done: 0, total: 0, current: "" });
  const [addForm,      setAddForm]     = useState({ name: "", description: "", qty: "", unit: "", status: "In Stock" });
  const [searchQuery,  setSearchQuery] = useState("");
  const [topK,         setTopK]        = useState(5);
  const [activeTab,    setActiveTab]   = useState("inventory");
  const [notif,        setNotif]       = useState(null);
  const [error,        setError]       = useState(null);
  const [modelStatus,  setModelStatus] = useState("initializing");
  const [isMobile,     setIsMobile]    = useState(window.innerWidth <= 768);
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
      setSeeding(true);
      setSeedProg({ done: 0, total: SEED_ITEMS.length, current: "" });
      const acc = [];
      for (let i = 0; i < SEED_ITEMS.length; i++) {
        if (!live || cancelRef.current) break;
        const item = SEED_ITEMS[i];
        if (live) setSeedProg({ done: i, total: SEED_ITEMS.length, current: item.name });
        try {
          const vec = await embedText(\`\${item.name}. \${item.description}\`);
          acc.push({ id: crypto.randomUUID(), ...item, vector: vec, addedAt: new Date().toLocaleString() });
          if (live) { setInventory([...acc]); setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name }); }
        } catch (e) {
          if (live) setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name });
        }
      }
      if (live) setSeeding(false);
    }
    run();
    return () => { live = false; cancelRef.current = true; };
  }, [modelStatus]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const name = String(addForm.name ?? "").trim();
    if (!name) return toast("Item name is required.", "error");
    if (modelStatus !== "ready") return toast("Model not ready.", "error");
    setLoading(l => ({ ...l, add: true })); setError(null);
    try {
      const desc = String(addForm.description ?? "").trim();
      const vec  = await embedText([name, desc].filter(Boolean).join(". "));
      setInventory(inv => [...inv, {
        id: crypto.randomUUID(), name, description: desc,
        qty: String(addForm.qty ?? "").trim(), unit: String(addForm.unit ?? "").trim(),
        status: addForm.status, vector: vec, addedAt: new Date().toLocaleString(),
      }]);
      setAddForm({ name: "", description: "", qty: "", unit: "", status: "In Stock" });
      toast(\`"\${name}" stored ✓\`);
      if (isMobile) setActiveTab("inventory");
    } catch (e) {
      setError(String(e?.message ?? e)); toast("Embedding failed.", "error");
    } finally {
      setLoading(l => ({ ...l, add: false }));
    }
  };

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    const q = String(searchQuery ?? "").trim();
    if (!q) return toast("Enter a search query.", "error");
    if (!inventory.length) return toast("Inventory is empty.", "error");
    if (modelStatus !== "ready") return toast("Model not ready.", "error");
    setLoading(l => ({ ...l, search: true })); setResults(null); setError(null);
    try {
      const qVec = await embedText(q);
      const k = Math.max(1, Math.min(topK, inventory.length));
      setResults(
        inventory.map(item => ({ ...item, score: cosineSimilarity(qVec, item.vector) }))
          .sort((a, b) => b.score - a.score).slice(0, k)
      );
    } catch (e) {
      setError(String(e?.message ?? e)); toast("Search failed.", "error");
    } finally {
      setLoading(l => ({ ...l, search: false }));
    }
  };

  const handleDelete = (id) => {
    setInventory(inv => inv.filter(i => i.id !== id));
    setResults(r => r ? r.filter(i => i.id !== id) : r);
  };

  const busy = loading.add || loading.search;
  const seedPct = seedProg.total > 0 ? (seedProg.done / seedProg.total) * 100 : 0;
  const displayItems = (activeTab === "search" && results !== null) ? results : inventory;

  // ── Shared sub-components ─────────────────────────────────────────────────
  const matchLabel = s => s > 0.75 ? "✦ strong" : s > 0.50 ? "· good" : "· partial";
  const matchColor = s => s > 0.75 ? "#93c5fd" : s > 0.50 ? "#a78bfa" : "#475569";

  const ItemCard = ({ item }) => {
    const sc     = item.score;
    const colors = STATUS_COLORS[String(item.status ?? "")] ?? STATUS_COLORS["In Stock"];
    return (
      <div style={isMobile ? m.card : d.card}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={isMobile ? m.cName : d.cName}>{item.name}</div>
          {item.description && <div style={isMobile ? m.cDesc : d.cDesc}>{item.description}</div>}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginTop:4 }}>
            <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, fontWeight:600,
                           background:colors.bg, color:colors.text, border:\`1px solid \${colors.border}\` }}>
              {item.status}
            </span>
            {(item.qty || item.unit) && (
              <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20,
                             background:"#111d2e", color:"#94a3b8", border:"1px solid #1e3045" }}>
                {[item.qty, item.unit].filter(Boolean).join(" ")}
              </span>
            )}
          </div>
          {sc !== undefined && isFinite(sc) && (
            <div style={{ marginTop:8 }}>
              <div style={{ height:3, background:"#1e3045", borderRadius:2, overflow:"hidden", marginBottom:3 }}>
                <div style={{ height:"100%", width:\`\${Math.max(0,Math.min(100,sc*100)).toFixed(1)}%\`,
                  background: sc>0.75 ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : sc>0.50 ? "linear-gradient(90deg,#6366f1,#a78bfa)" : "#334155",
                  transition:"width 0.4s ease" }} />
              </div>
              <span style={{ fontSize:11, color: matchColor(sc) }}>
                {(sc*100).toFixed(1)}% {matchLabel(sc)}
              </span>
            </div>
          )}
        </div>
        <button
          style={{ background:"none", border:"none", color:"#475569", cursor:"pointer",
                   fontSize: isMobile ? 20 : 14, padding:"4px 6px", flexShrink:0, lineHeight:1 }}
          onClick={() => handleDelete(item.id)}
          onMouseEnter={e => e.currentTarget.style.color="#f87171"}
          onMouseLeave={e => e.currentTarget.style.color="#475569"}
        >✕</button>
      </div>
    );
  };

  const ProgressBanner = () => (
    <>
      {modelStatus === "loading" && (
        <div style={isMobile ? m.banner : d.banner}>
          <div className="spin" />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:"#60a5fa", marginBottom:3 }}>Loading embedding model…</div>
            <div style={{ fontSize:10, color:"#475569" }}>Downloading all-MiniLM-L6-v2 (~25MB, once only)</div>
          </div>
        </div>
      )}
      {seeding && (
        <div style={isMobile ? m.banner : d.banner}>
          <div className="spin" />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:"#60a5fa", marginBottom:3 }}>
              Embedding inventory… {seedProg.done}/{seedProg.total}
            </div>
            <div style={{ height:3, background:"#1e3045", borderRadius:2, overflow:"hidden", margin:"4px 0" }}>
              <div style={{ height:"100%", width:\`\${seedPct}%\`, background:"linear-gradient(90deg,#3b82f6,#8b5cf6)", transition:"width 0.3s" }} />
            </div>
            {seedProg.current && <div style={{ fontSize:10, color:"#475569" }}>"{seedProg.current}"</div>}
          </div>
        </div>
      )}
    </>
  );

  // ── MOBILE layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    const isSearchTab = activeTab === "search";
    const listItems   = isSearchTab && results !== null ? results : inventory;

    return (
      <div style={m.root}>
        {/* Header */}
        <div style={m.header}>
          <div style={m.logo}>🔷</div>
          <div style={{ flex:1 }}>
            <div style={m.title}>VectorStock</div>
            <div style={m.subtitle}>SEMANTIC INVENTORY</div>
          </div>
          <div style={m.badge}>{inventory.length} items</div>
          <div style={m.modelDot(modelStatus)} title={modelStatus} />
        </div>

        {/* Progress banners */}
        <ProgressBanner />

        {/* Error */}
        {error && (
          <div style={m.error}>
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
                  <div style={{ color:"#475569", fontSize:14 }}>
                    {modelStatus !== "ready" ? "Loading model…" : "No items yet"}
                  </div>
                  <div style={{ color:"#334155", fontSize:12, marginTop:4 }}>
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
              <div style={m.searchBox}>
                <textarea
                  style={m.searchInput}
                  rows={2}
                  placeholder={\`Try: "something to clean dishes"\\n"tools for home repair"\`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  disabled={modelStatus !== "ready"}
                />
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#475569" }}>
                    <span>Top</span>
                    <input
                      type="number" min={1} max={Math.max(inventory.length,1)}
                      style={{ ...m.inp, width:52, textAlign:"center" }}
                      value={topK}
                      onChange={e => setTopK(Math.max(1, parseInt(e.target.value) || 1))}
                      disabled={modelStatus !== "ready"}
                    />
                    <span>results</span>
                  </div>
                  <button
                    style={{ ...m.btn("search"), flex:1 }}
                    disabled={busy || !inventory.length || modelStatus !== "ready"}
                    onClick={handleSearch}
                  >
                    {loading.search ? "⟳ Searching…" : "⌕ Search"}
                  </button>
                </div>
              </div>

              {loading.search && (
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 16px", color:"#475569", fontSize:12 }}>
                  <div className="spin" />
                  Computing similarity across {inventory.length} vectors…
                </div>
              )}

              {!loading.search && results !== null && results.length === 0 && (
                <div style={m.empty}>
                  <div style={{ fontSize:44, marginBottom:10 }}>🔍</div>
                  <div style={{ color:"#475569", fontSize:14 }}>No results found</div>
                </div>
              )}

              {!loading.search && results === null && (
                <div style={m.empty}>
                  <div style={{ fontSize:44, marginBottom:10 }}>🔍</div>
                  <div style={{ color:"#475569", fontSize:14 }}>Search your inventory</div>
                  <div style={{ color:"#334155", fontSize:12, marginTop:4 }}>Describe what you're looking for</div>
                </div>
              )}

              {!loading.search && results !== null && results.map(item => <ItemCard key={item.id} item={item} />)}
            </>
          )}

          {/* ── Add tab ── */}
          {activeTab === "add" && (
            <div style={m.addForm}>
              <div style={m.secLabel}>ADD ITEM</div>
              <input
                style={m.inp} placeholder="Item name *"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                disabled={modelStatus !== "ready"}
              />
              <textarea
                style={{ ...m.inp, minHeight:80, resize:"vertical" }}
                placeholder="Description (improves search accuracy)"
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                disabled={modelStatus !== "ready"}
              />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <input style={m.inp} placeholder="Qty"  value={addForm.qty}  onChange={e => setAddForm(f => ({ ...f, qty: e.target.value }))}  disabled={modelStatus !== "ready"} />
                <input style={m.inp} placeholder="Unit" value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))} disabled={modelStatus !== "ready"} />
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {STATUSES.map(st => (
                  <button key={st}
                    style={{ padding:"8px 14px", borderRadius:20, border:"1px solid",
                      borderColor: addForm.status === st ? "#3b82f6" : "#1e3045",
                      background:  addForm.status === st ? "#0a1a2d" : "#0d1a27",
                      color:       addForm.status === st ? "#60a5fa" : "#475569",
                      fontSize:12, cursor:"pointer", fontFamily:"inherit" }}
                    onClick={() => setAddForm(f => ({ ...f, status: st }))}
                  >{st}</button>
                ))}
              </div>
              <button
                style={m.btn("primary", loading.add || seeding || modelStatus !== "ready")}
                disabled={loading.add || seeding || modelStatus !== "ready"}
                onClick={handleAdd}
              >
                {loading.add ? "⟳ Embedding…" : "+ Embed & Store"}
              </button>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={m.nav} className="safe-bottom">
          {[
            { key: "inventory", icon: "📦", label: \`Inventory\` },
            { key: "search",    icon: "🔍", label: "Search"    },
            { key: "add",       icon: "＋", label: "Add Item"  },
          ].map(t => (
            <button key={t.key} style={m.navBtn(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <span style={{ fontSize:10, marginTop:2 }}>{t.label}</span>
            </button>
          ))}
        </div>

        {notif && <div style={m.toast(notif.type)}>{notif.msg}</div>}
      </div>
    );
  }

  // ── DESKTOP layout ────────────────────────────────────────────────────────
  return (
    <div style={d.root}>
      <div style={d.header}>
        <div style={d.logo}>🔷</div>
        <div>
          <h1 style={d.h1}>VectorStock</h1>
          <p style={d.sub}>SEMANTIC INVENTORY · RAG-POWERED NEAREST-NEIGHBOR SEARCH</p>
        </div>
        <div style={d.badge}>{inventory.length} items indexed</div>
        <div style={d.status(modelStatus)}>
          {modelStatus === "loading" && "⟳ Loading model..."}
          {modelStatus === "ready"   && "✓ Model ready"}
          {modelStatus === "error"   && "⚠ Model error"}
          {modelStatus === "initializing" && "⏳ Initializing..."}
        </div>
      </div>

      <div style={d.body}>
        {/* Sidebar */}
        <div style={d.side}>
          <div>
            <div style={d.secLbl}>Add Item</div>
            <div style={d.form}>
              <input style={d.inp} placeholder="Item name *" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} disabled={modelStatus !== "ready"} />
              <textarea style={d.ta} placeholder="Description (boosts semantic accuracy)" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} disabled={modelStatus !== "ready"} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <input style={d.inp} placeholder="Qty"  value={addForm.qty}  onChange={e => setAddForm(f => ({ ...f, qty: e.target.value }))}  disabled={modelStatus !== "ready"} />
                <input style={d.inp} placeholder="Unit" value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))} disabled={modelStatus !== "ready"} />
              </div>
              <select style={d.sel} value={addForm.status} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))} disabled={modelStatus !== "ready"}>
                {STATUSES.map(st => <option key={st}>{st}</option>)}
              </select>
              <button style={d.btn("primary", loading.add || seeding || modelStatus !== "ready")} disabled={loading.add || seeding || modelStatus !== "ready"} onClick={handleAdd}>
                {loading.add ? "⟳ Embedding…" : "+ Embed & Store"}
              </button>
            </div>
          </div>

          <div style={{ borderTop:"1px solid #1e2d3d" }} />

          <div>
            <div style={d.secLbl}>Semantic Search</div>
            <div style={d.form}>
              <textarea
                style={{ ...d.ta, minHeight:50 }}
                placeholder={"Try:\\n\\"something to clean dishes\\"\\n\\"tools for home repair\\""}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); if (!busy&&inventory.length>0&&modelStatus==="ready") handleSearch(); }}}
                disabled={modelStatus !== "ready"}
              />
              <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"#475569" }}>
                <span>Top</span>
                <input type="number" min={1} max={Math.max(inventory.length,1)}
                  style={{ ...d.inp, width:46, textAlign:"center", padding:"5px 6px" }}
                  value={topK} onChange={e => setTopK(Math.max(1,parseInt(e.target.value)||1))} disabled={modelStatus !== "ready"} />
                <span>results</span>
              </div>
              <button style={d.btn("search", busy||!inventory.length||modelStatus!=="ready")} disabled={busy||!inventory.length||modelStatus!=="ready"} onClick={handleSearch}>
                {loading.search ? "⟳ Vectorizing…" : "⌕ Search Nearest Neighbors"}
              </button>
            </div>
          </div>

          {error && (
            <div style={d.err}>⚠ {error}
              <br /><span style={{ opacity:0.6, cursor:"pointer" }} onClick={() => setError(null)}>dismiss ×</span>
            </div>
          )}
          <div style={{ marginTop:"auto", fontSize:10, color:"#2d4a63", lineHeight:1.7 }}>
            Embeddings via Transformers.js (all-MiniLM-L6-v2) · local, in-browser.<br />
            No exact names needed — concepts cluster in vector space.
          </div>
        </div>

        {/* Main */}
        <div style={d.main}>
          <ProgressBanner />
          <div style={d.tabs}>
            <button style={d.tab(activeTab==="inventory")} onClick={() => setActiveTab("inventory")}>📦 Inventory ({inventory.length})</button>
            <button style={d.tab(activeTab==="search")}    onClick={() => setActiveTab("search")}>🔍 Results {results ? \`(\${results.length})\` : ""}</button>
          </div>

          {loading.search && (
            <div style={{ display:"flex", alignItems:"center", gap:9, padding:"32px 0", justifyContent:"center", color:"#475569", fontSize:11 }}>
              <div className="spin" /><span>Computing similarity across {inventory.length} vectors…</span>
            </div>
          )}

          {!loading.search && displayItems.length === 0 && (
            <div style={{ textAlign:"center", padding:"44px 20px", color:"#334155" }}>
              <div style={{ fontSize:38, marginBottom:9 }}>{activeTab==="search" ? "🔍" : "📦"}</div>
              <div style={{ fontSize:13, color:"#475569", marginBottom:4 }}>
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

      {notif && <div style={d.toast(notif.type)}>{notif.msg}</div>}
    </div>
  );
}

// ─── Mobile styles ────────────────────────────────────────────────────────────
const FF = "'DM Mono','Courier New',monospace";
const m = {
  root:    { display:"flex", flexDirection:"column", height:"100%", background:"#090e17",
             color:"#e2e8f0", fontFamily:FF, overflow:"hidden" },
  header:  { display:"flex", alignItems:"center", gap:10, padding:"14px 16px",
             borderBottom:"1px solid #1e2d3d", background:"#0b1220", flexShrink:0 },
  logo:    { width:34, height:34, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
             borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 },
  title:   { fontSize:16, fontWeight:700, color:"#f1f5f9", letterSpacing:"-0.3px" },
  subtitle:{ fontSize:9, color:"#475569", letterSpacing:"1px" },
  badge:   { background:"#1e2d3d", border:"1px solid #2d4a63", borderRadius:20,
             padding:"3px 10px", fontSize:11, color:"#60a5fa" },
  modelDot:(s) => ({ width:8, height:8, borderRadius:"50%", flexShrink:0,
             background: s==="ready" ? "#4ade80" : s==="loading" ? "#60a5fa" : s==="error" ? "#f87171" : "#475569" }),
  banner:  { display:"flex", gap:10, alignItems:"center", background:"#0d1a27",
             borderBottom:"1px solid #1e3045", padding:"12px 16px", flexShrink:0 },
  error:   { background:"#2d0a0a", borderBottom:"1px solid #991b1b", padding:"10px 16px",
             fontSize:12, color:"#f87171", display:"flex", justifyContent:"space-between", flexShrink:0 },
  content: { flex:1, minHeight:0, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10,
             paddingBottom:20 },
  card:    { background:"#0d1a27", border:"1px solid #1e3045", borderRadius:10,
             padding:"14px", display:"flex", gap:10, alignItems:"flex-start" },
  cName:   { fontSize:15, fontWeight:700, color:"#f1f5f9", marginBottom:3 },
  cDesc:   { fontSize:12, color:"#64748b", lineHeight:1.5 },
  empty:   { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
             flex:1, padding:40, textAlign:"center" },
  searchBox:{ background:"#0b1220", borderBottom:"1px solid #1e2d3d", padding:"12px 14px",
              display:"flex", flexDirection:"column", gap:8, flexShrink:0 },
  searchInput:{ width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:8,
                padding:"10px 12px", color:"#e2e8f0", fontSize:13, fontFamily:FF,
                resize:"none", boxSizing:"border-box" },
  inp:     { width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:8,
             padding:"12px 12px", color:"#e2e8f0", fontSize:13, fontFamily:FF,
             boxSizing:"border-box", display:"block" },
  addForm: { display:"flex", flexDirection:"column", gap:10 },
  secLabel:{ fontSize:10, letterSpacing:"2px", color:"#475569", textTransform:"uppercase" },
  btn:     (v, d) => ({
             width:"100%", padding:"13px", borderRadius:8, border:"none", cursor: d ? "not-allowed" : "pointer",
             fontSize:14, fontFamily:FF, fontWeight:600, opacity: d ? 0.45 : 1,
             background: v==="primary" ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                       : v==="search"  ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "#1e2d3d",
             color:"#fff" }),
  nav:     { display:"flex", background:"#0b1220", borderTop:"1px solid #1e2d3d", flexShrink:0 },
  navBtn:  (a) => ({
             flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
             padding:"10px 0", border:"none", background: a ? "#0d1a27" : "transparent",
             color: a ? "#93c5fd" : "#475569", cursor:"pointer", fontFamily:FF,
             borderTop: a ? "2px solid #3b82f6" : "2px solid transparent" }),
  toast:   (t) => ({ position:"fixed", bottom:90, left:16, right:16, zIndex:1000,
             background: t==="error" ? "#2d0a0a" : "#0d2e1a",
             border:\`1px solid \${t==="error" ? "#991b1b" : "#166534"}\`,
             color: t==="error" ? "#f87171" : "#4ade80",
             padding:"12px 16px", borderRadius:10, fontSize:13,
             boxShadow:"0 8px 32px rgba(0,0,0,0.6)", animation:"slideUp 0.2s ease" }),
};

// ─── Desktop styles ───────────────────────────────────────────────────────────
const d = {
  root:   { minHeight:"100vh", background:"#090e17", color:"#e2e8f0", fontFamily:FF },
  header: { borderBottom:"1px solid #1e2d3d", padding:"18px 26px", display:"flex", alignItems:"center", gap:13,
            background:"linear-gradient(180deg,#0d1520 0%,#090e17 100%)" },
  logo:   { width:36, height:36, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 },
  h1:     { fontSize:19, fontWeight:700, letterSpacing:"-0.4px", color:"#f1f5f9", margin:0 },
  sub:    { fontSize:10, color:"#64748b", margin:"2px 0 0", letterSpacing:"0.5px" },
  badge:  { marginLeft:"auto", background:"#1e2d3d", border:"1px solid #2d4a63", borderRadius:20, padding:"3px 13px", fontSize:11, color:"#60a5fa" },
  status: (s) => ({ fontSize:10, padding:"4px 10px", borderRadius:6,
            background: s==="ready" ? "#0d2e1a" : s==="loading" ? "#0a1a2d" : "#2d0a0a",
            border: \`1px solid \${s==="ready" ? "#166534" : s==="loading" ? "#1e40af" : "#991b1b"}\`,
            color: s==="ready" ? "#4ade80" : s==="loading" ? "#60a5fa" : "#f87171" }),
  body:   { display:"grid", gridTemplateColumns:"310px 1fr", minHeight:"calc(100vh - 73px)" },
  side:   { borderRight:"1px solid #1e2d3d", padding:"18px 16px", background:"#0b1220",
            display:"flex", flexDirection:"column", gap:16, overflowY:"auto" },
  secLbl: { fontSize:10, letterSpacing:"2px", color:"#475569", textTransform:"uppercase", marginBottom:7 },
  form:   { display:"flex", flexDirection:"column", gap:6 },
  inp:    { width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:6,
            padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
            boxSizing:"border-box", fontFamily:FF, transition:"border-color 0.15s" },
  ta:     { width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:6,
            padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
            boxSizing:"border-box", fontFamily:FF, resize:"vertical", minHeight:60 },
  sel:    { width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:6,
            padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
            boxSizing:"border-box", fontFamily:FF, cursor:"pointer" },
  btn:    (v, d) => ({
            width:"100%", padding:"8px 13px", borderRadius:6, border:"none",
            cursor: d ? "not-allowed" : "pointer", fontSize:12, fontFamily:FF,
            fontWeight:600, letterSpacing:"0.3px", opacity: d ? 0.45 : 1, transition:"all 0.15s",
            background: v==="primary" ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                      : v==="search"  ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "#1e2d3d",
            color:"#fff" }),
  main:   { padding:"18px 22px", display:"flex", flexDirection:"column", gap:12, overflowY:"auto" },
  banner: { background:"#0d1a27", border:"1px solid #1e3045", borderRadius:8, padding:"12px 16px",
            display:"flex", gap:10, alignItems:"center", marginBottom:4 },
  tabs:   { display:"flex", gap:3, borderBottom:"1px solid #1e2d3d", marginBottom:2 },
  tab:    (a) => ({ padding:"6px 15px", borderRadius:"6px 6px 0 0", border:"1px solid",
            borderColor: a ? "#2d4a63" : "transparent", borderBottom: a ? "1px solid #090e17" : "1px solid transparent",
            background: a ? "#0d1a27" : "transparent", color: a ? "#93c5fd" : "#475569",
            fontSize:11, cursor:"pointer", fontFamily:FF, fontWeight: a ? 600 : 400, marginBottom:-1 }),
  card:   { background:"#0d1a27", border:"1px solid #1e3045", borderRadius:8, padding:"12px 14px",
            display:"flex", gap:11, alignItems:"flex-start" },
  cName:  { fontSize:13, fontWeight:700, color:"#f1f5f9", marginBottom:3 },
  cDesc:  { fontSize:11, color:"#64748b", marginBottom:6, lineHeight:1.5 },
  err:    { background:"#2d0a0a", border:"1px solid #991b1b", borderRadius:6, padding:"9px 12px", fontSize:11, color:"#f87171", lineHeight:1.5 },
  toast:  (t) => ({ position:"fixed", bottom:18, right:18, zIndex:1000,
            background: t==="error" ? "#2d0a0a" : "#0d2e1a",
            border:\`1px solid \${t==="error" ? "#991b1b" : "#166534"}\`,
            color: t==="error" ? "#f87171" : "#4ade80",
            padding:"10px 16px", borderRadius:8, fontSize:11,
            boxShadow:"0 8px 32px rgba(0,0,0,0.5)", maxWidth:320, animation:"slideUp 0.2s ease" }),
};

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
