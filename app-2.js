const { useState, useEffect, useRef } = React;

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

async function waitForTransformers() {
  if (window.transformersReady) return;
  return new Promise((resolve) => {
    window.addEventListener('transformers-ready', resolve, { once: true });
  });
}

async function getEmbeddingPipeline() {
  if (pipelineInstance) return pipelineInstance;

  if (modelLoading) {
    return new Promise((resolve) => {
      loadQueue.push(resolve);
    });
  }

  modelLoading = true;

  try {
    await waitForTransformers();

    console.log('Creating embedding pipeline...');
    pipelineInstance = await window.transformersPipeline(
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

// ─── App ──────────────────────────────────────────────────────────────────────
function SemanticInventory() {
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
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 4000);
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
      console.log('Starting seed process...');
      setSeeding(true);
      setSeedProg({ done: 0, total: SEED_ITEMS.length, current: "" });
      const acc = [];

      for (let i = 0; i < SEED_ITEMS.length; i++) {
        if (!live || cancelRef.current) break;
        const item = SEED_ITEMS[i];
        if (live) setSeedProg({ done: i, total: SEED_ITEMS.length, current: item.name });
        try {
          const vec = await embedText(`${item.name}. ${item.description}`);
          acc.push({ id: crypto.randomUUID(), ...item, vector: vec, addedAt: new Date().toLocaleString() });
          if (live) { setInventory([...acc]); setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name }); }
        } catch (e) {
          console.warn(`Seed skip "${item.name}":`, e.message);
          if (live) setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name });
        }
      }
      if (live) {
        console.log('Seed complete!');
        setSeeding(false);
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
      const desc = String(addForm.description ?? "").trim();
      const vec  = await embedText([name, desc].filter(Boolean).join(". "));
      const item = {
        id: crypto.randomUUID(),
        name,
        description: desc,
        qty:    String(addForm.qty  ?? "").trim(),
        unit:   String(addForm.unit ?? "").trim(),
        status: addForm.status,
        vector: vec,
        addedAt: new Date().toLocaleString(),
      };
      setInventory(inv => [...inv, item]);
      setAddForm({ name: "", description: "", qty: "", unit: "", status: "In Stock" });
      toast(`"${item.name}" embedded and stored ✓`);
    } catch (e) {
      setError(String(e?.message ?? e));
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
      const qVec = await embedText(q);
      const k    = Math.max(1, Math.min(topK, inventory.length));
      const scored = inventory
        .map(item => ({ ...item, score: cosineSimilarity(qVec, item.vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
      setResults(scored);
      setActiveTab("search");
    } catch (e) {
      setError(String(e?.message ?? e));
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

  // ── Inline styles ─────────────────────────────────────────────────────────
  const $ = {
    root:    { minHeight:"100vh", background:"#090e17", color:"#e2e8f0", fontFamily:"'DM Mono','Courier New',monospace" },
    header:  { borderBottom:"1px solid #1e2d3d", padding:"18px 26px", display:"flex", alignItems:"center", gap:13,
               background:"linear-gradient(180deg,#0d1520 0%,#090e17 100%)" },
    logo:    { width:36, height:36, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius:8,
               display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 },
    h1:      { fontSize:19, fontWeight:700, letterSpacing:"-0.4px", color:"#f1f5f9", margin:0 },
    sub:     { fontSize:10, color:"#64748b", margin:"2px 0 0", letterSpacing:"0.5px" },
    badge:   { marginLeft:"auto", background:"#1e2d3d", border:"1px solid #2d4a63", borderRadius:20, padding:"3px 13px", fontSize:11, color:"#60a5fa" },
    body:    { display:"grid", gridTemplateColumns:"310px 1fr", minHeight:"calc(100vh - 73px)" },
    side:    { borderRight:"1px solid #1e2d3d", padding:"18px 16px", background:"#0b1220", display:"flex", flexDirection:"column", gap:16, overflowY:"auto" },
    secLbl:  { fontSize:10, letterSpacing:"2px", color:"#475569", textTransform:"uppercase", marginBottom:7 },
    form:    { display:"flex", flexDirection:"column", gap:6 },
    inp:     { width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:6,
               padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
               boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.15s" },
    ta:      { width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:6,
               padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
               boxSizing:"border-box", fontFamily:"inherit", resize:"vertical", minHeight:60 },
    sel:     { width:"100%", background:"#0d1a27", border:"1px solid #1e3045", borderRadius:6,
               padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none",
               boxSizing:"border-box", fontFamily:"inherit", cursor:"pointer" },
    r2:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 },
    btn:     (v, d) => ({
               width:"100%", padding:"8px 13px", borderRadius:6, border:"none",
               cursor: d ? "not-allowed" : "pointer", fontSize:12, fontFamily:"inherit",
               fontWeight:600, letterSpacing:"0.3px", opacity: d ? 0.45 : 1, transition:"all 0.15s",
               background: v==="primary" ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                         : v==="search"  ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "#1e2d3d",
               color:"#fff",
             }),
    div:     { borderTop:"1px solid #1e2d3d" },
    main:    { padding:"18px 22px", display:"flex", flexDirection:"column", gap:12, overflowY:"auto" },
    seed:    { background:"#0d1a27", border:"1px solid #1e3045", borderRadius:8, padding:"12px 16px", display:"flex", flexDirection:"column", gap:7 },
    seedRow: { display:"flex", justifyContent:"space-between", fontSize:12, color:"#60a5fa" },
    track:   { height:3, background:"#1e3045", borderRadius:2, overflow:"hidden" },
    fill:    (p) => ({ height:"100%", width:`${p}%`, background:"linear-gradient(90deg,#3b82f6,#8b5cf6)", transition:"width 0.3s ease" }),
    tabs:    { display:"flex", gap:3, borderBottom:"1px solid #1e2d3d", marginBottom:2 },
    tab:     (a) => ({
               padding:"6px 15px", borderRadius:"6px 6px 0 0",
               border:"1px solid", borderColor: a ? "#2d4a63" : "transparent",
               borderBottom: a ? "1px solid #090e17" : "1px solid transparent",
               background: a ? "#0d1a27" : "transparent",
               color: a ? "#93c5fd" : "#475569", fontSize:11, cursor:"pointer",
               fontFamily:"inherit", fontWeight: a ? 600 : 400, marginBottom:-1,
             }),
    spinRow: { display:"flex", alignItems:"center", gap:9, padding:"32px 0", justifyContent:"center", color:"#475569", fontSize:11 },
    empty:   { textAlign:"center", padding:"44px 20px", color:"#334155" },
    card:    { background:"#0d1a27", border:"1px solid #1e3045", borderRadius:8, padding:"12px 14px", display:"flex", gap:11, alignItems:"flex-start" },
    cName:   { fontSize:13, fontWeight:700, color:"#f1f5f9", marginBottom:3 },
    cDesc:   { fontSize:11, color:"#64748b", marginBottom:6, lineHeight:1.5 },
    cMeta:   { display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" },
    pill:    (c) => ({ fontSize:10, padding:"2px 8px", borderRadius:20, background:c.bg, color:c.text, border:`1px solid ${c.border}`, fontWeight:600 }),
    pillG:   { fontSize:10, padding:"2px 8px", borderRadius:20, background:"#111d2e", color:"#94a3b8", border:"1px solid #1e3045" },
    sTrack:  { height:3, background:"#1e3045", borderRadius:2, overflow:"hidden", marginTop:7, marginBottom:2 },
    sFill:   (s) => ({ height:"100%", width:`${Math.max(0,Math.min(100,s*100)).toFixed(1)}%`,
                       background: s>0.82 ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : s>0.65 ? "linear-gradient(90deg,#6366f1,#a78bfa)" : "linear-gradient(90deg,#334155,#475569)",
                       transition:"width 0.4s ease" }),
    sLbl:    (s) => ({ fontSize:10, color: s>0.82 ? "#93c5fd" : s>0.65 ? "#a78bfa" : "#475569" }),
    del:     { background:"none", border:"none", color:"#334155", cursor:"pointer", fontSize:13, padding:"2px 4px", borderRadius:4, flexShrink:0, lineHeight:1 },
    err:     { background:"#2d0a0a", border:"1px solid #991b1b", borderRadius:6, padding:"9px 12px", fontSize:11, color:"#f87171", lineHeight:1.5 },
    toast:   (t) => ({ position:"fixed", bottom:18, right:18, zIndex:1000,
                       background: t==="error" ? "#2d0a0a" : "#0d2e1a",
                       border:`1px solid ${t==="error" ? "#991b1b" : "#166534"}`,
                       color: t==="error" ? "#f87171" : "#4ade80",
                       padding:"10px 16px", borderRadius:8, fontSize:11,
                       boxShadow:"0 8px 32px rgba(0,0,0,0.5)", maxWidth:320, animation:"slideUp 0.2s ease" }),
    hint:    { marginTop:"auto", fontSize:10, color:"#2d4a63", lineHeight:1.7 },
    status:  (s) => ({ fontSize:10, padding:"4px 10px", borderRadius:6,
                      background: s==="ready" ? "#0d2e1a" : s==="loading" ? "#0a1a2d" : "#2d0a0a",
                      border: `1px solid ${s==="ready" ? "#166534" : s==="loading" ? "#1e40af" : "#991b1b"}`,
                      color: s==="ready" ? "#4ade80" : s==="loading" ? "#60a5fa" : "#f87171" }),
  };

  return (
    <div style={$.root}>
      {/* HEADER */}
      <div style={$.header}>
        <div style={$.logo}>🔷</div>
        <div>
          <h1 style={$.h1}>VectorStock</h1>
          <p style={$.sub}>SEMANTIC INVENTORY · RAG-POWERED NEAREST-NEIGHBOR SEARCH</p>
        </div>
        <div style={$.badge}>{inventory.length} items indexed</div>
        <div style={$.status(modelStatus)}>
          {modelStatus === "loading" && "⟳ Loading model..."}
          {modelStatus === "ready" && "✓ Model ready"}
          {modelStatus === "error" && "⚠ Model error"}
          {modelStatus === "initializing" && "⏳ Initializing..."}
        </div>
      </div>

      <div style={$.body}>
        {/* ── SIDEBAR ── */}
        <div style={$.side}>

          {/* Add item */}
          <div>
            <div style={$.secLbl}>Add Item</div>
            <div style={$.form}>
              <input
                style={$.inp} placeholder="Item name *"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                disabled={modelStatus !== "ready"}
              />
              <textarea
                style={$.ta} placeholder="Description (boosts semantic accuracy)"
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                disabled={modelStatus !== "ready"}
              />
              <div style={$.r2}>
                <input style={$.inp} placeholder="Qty"  value={addForm.qty}  onChange={e => setAddForm(f => ({ ...f, qty: e.target.value }))} disabled={modelStatus !== "ready"} />
                <input style={$.inp} placeholder="Unit" value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))} disabled={modelStatus !== "ready"} />
              </div>
              <select style={$.sel} value={addForm.status} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))} disabled={modelStatus !== "ready"}>
                {STATUSES.map(st => <option key={st}>{st}</option>)}
              </select>
              <button style={$.btn("primary", loading.add || seeding || modelStatus !== "ready")} disabled={loading.add || seeding || modelStatus !== "ready"} onClick={handleAdd}>
                {loading.add ? "⟳  Embedding…" : "+ Embed & Store"}
              </button>
            </div>
          </div>

          <div style={$.div} />

          {/* Search */}
          <div>
            <div style={$.secLbl}>Semantic Search</div>
            <div style={$.form}>
              <textarea
                style={{ ...$.ta, minHeight:50 }}
                placeholder={"Try:\n\"something to clean dishes\"\n\"tools for home repair\"\n\"bedroom comfort items\""}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); if (!busy && inventory.length>0 && modelStatus==="ready") handleSearch(); } }}
                disabled={modelStatus !== "ready"}
              />
              <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"#475569" }}>
                <span>Top</span>
                <input
                  type="number" min={1} max={Math.max(inventory.length,1)}
                  style={{ ...$.inp, width:46, textAlign:"center", padding:"5px 6px" }}
                  value={topK}
                  onChange={e => setTopK(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={modelStatus !== "ready"}
                />
                <span>results</span>
              </div>
              <button style={$.btn("search", busy || inventory.length===0 || modelStatus !== "ready")} disabled={busy || inventory.length===0 || modelStatus !== "ready"} onClick={handleSearch}>
                {loading.search ? "⟳  Vectorizing…" : "⌕  Search Nearest Neighbors"}
              </button>
            </div>
          </div>

          {/* Error box */}
          {error && (
            <div style={$.err}>
              ⚠ {error}
              <br /><span style={{ opacity:0.6, cursor:"pointer" }} onClick={() => setError(null)}>dismiss ×</span>
            </div>
          )}

          <div style={$.hint}>
            Items are embedded using Transformers.js (all-MiniLM-L6-v2) running locally in your browser.<br />
            Search embeds your query then computes cosine similarity against all vectors.<br />
            No exact names needed — concepts cluster naturally in vector space.
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={$.main}>

          {/* Model loading */}
          {modelStatus === "loading" && (
            <div style={$.seed}>
              <div style={$.seedRow}>
                <span>🔷 Loading embedding model...</span>
              </div>
              <div style={$.track}><div style={{ ...$.fill(50), animation:"pulse 1.5s ease-in-out infinite" }} /></div>
              <div style={{ fontSize:10, color:"#475569" }}>
                Downloading all-MiniLM-L6-v2 from Hugging Face (~25MB, only on first load)
              </div>
            </div>
          )}

          {/* Seed progress */}
          {seeding && (
            <div style={$.seed}>
              <div style={$.seedRow}>
                <span>🔷 Embedding household inventory…</span>
                <span>{seedProg.done} / {seedProg.total}</span>
              </div>
              <div style={$.track}><div style={$.fill(seedPct)} /></div>
              <div style={{ fontSize:10, color:"#475569" }}>
                {seedProg.current ? `Embedding: "${seedProg.current}"` : "Starting…"}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={$.tabs}>
            <button style={$.tab(activeTab==="inventory")} onClick={() => setActiveTab("inventory")}>
              📦 Inventory ({inventory.length})
            </button>
            <button style={$.tab(activeTab==="search")} onClick={() => setActiveTab("search")}>
              🔍 Results {results ? `(${results.length})` : ""}
            </button>
          </div>

          {/* Spinner for search */}
          {loading.search && (
            <div style={$.spinRow}>
              <div className="spin" />
              <span>Embedding query &amp; computing similarity across {inventory.length} vectors…</span>
            </div>
          )}

          {/* Empty state */}
          {!loading.search && displayItems.length === 0 && (
            <div style={$.empty}>
              <div style={{ fontSize:38, marginBottom:9 }}>{activeTab==="search" ? "🔍" : "📦"}</div>
              <div style={{ fontSize:13, color:"#475569", marginBottom:4 }}>
                {activeTab==="search" ? "Run a search to find nearest neighbors"
                  : seeding ? "Embedding items, please wait…"
                  : modelStatus === "loading" ? "Loading embedding model..."
                  : "Inventory is empty"}
              </div>
              <div style={{ fontSize:11, color:"#334155" }}>
                {activeTab==="search"
                  ? "Your query is embedded into the same vector space as stored items"
                  : modelStatus === "ready" ? "Add items via the sidebar to get started" : "Model will auto-load on startup"}
              </div>
            </div>
          )}

          {/* Item cards */}
          {!loading.search && displayItems.map(item => {
            const sc     = item.score;
            const colors = STATUS_COLORS[String(item.status ?? "")] ?? STATUS_COLORS["In Stock"];
            const name   = String(item.name ?? "");
            const desc   = String(item.description ?? "");
            const qty    = String(item.qty  ?? "");
            const unit   = String(item.unit ?? "");
            const at     = String(item.addedAt ?? "");
            return (
              <div key={item.id} style={$.card}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={$.cName}>{name}</div>
                  {desc && <div style={$.cDesc}>{desc}</div>}
                  <div style={$.cMeta}>
                    <span style={$.pill(colors)}>{String(item.status ?? "")}</span>
                    {(qty || unit) && <span style={$.pillG}>{[qty, unit].filter(Boolean).join(" ")}</span>}
                    <span style={{ ...$.pillG, marginLeft:"auto", opacity:0.55 }}>{at}</span>
                  </div>
                  {sc !== undefined && isFinite(sc) && (
                    <>
                      <div style={$.sTrack}><div style={$.sFill(sc)} /></div>
                      <div style={$.sLbl(sc)}>
                        similarity {(sc * 100).toFixed(1)}%
                        {sc > 0.82 ? "  ✦ strong match" : sc > 0.65 ? "  · good match" : "  · partial match"}
                      </div>
                    </>
                  )}
                </div>
                <button
                  style={$.del}
                  title="Remove"
                  onClick={() => handleDelete(item.id)}
                  onMouseEnter={e => e.currentTarget.style.color="#f87171"}
                  onMouseLeave={e => e.currentTarget.style.color="#334155"}
                >✕</button>
              </div>
            );
          })}
        </div>
      </div>

      {notif && <div style={$.toast(notif.type)}>{notif.msg}</div>}
    </div>
  );
}

// Wait for everything to load, then render
console.log('Waiting for dependencies...');

function initApp() {
  console.log('Initializing React app...');
  document.getElementById('loading').style.display = 'none';
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<SemanticInventory />);
  console.log('React app rendered');
}

if (window.transformersReady) {
  initApp();
} else {
  window.addEventListener('transformers-ready', initApp, { once: true });
}
