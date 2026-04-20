export const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>VectorStore - Semantic Inventory</title>
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
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(148, 163, 184, 0.16);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .glass-card {
      background: rgba(15, 23, 42, 0.78);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(148, 163, 184, 0.18);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04);
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
    @keyframes shakeX {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      40% { transform: translateX(4px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(3px); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dissolveOut {
      from { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      to { opacity: 0; transform: translateY(-6px) scale(0.985); filter: blur(6px); }
    }

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

    ::placeholder { color: rgba(148, 163, 184, 0.7); }
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
    <div>Loading VectorStore...</div>
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

window.__VECTORSTOCK_NATIVE_QUEUE__ = window.__VECTORSTOCK_NATIVE_QUEUE__ || [];
window.__VECTORSTOCK_NATIVE_BRIDGE__ = window.__VECTORSTOCK_NATIVE_BRIDGE__ || {
  receive(payload) {
    window.__VECTORSTOCK_NATIVE_QUEUE__.push(payload);
  },
};

const _pendingLLMRequests = {};
const _pendingCVRequests  = {};

function postNativeMessage(payload) {
  if (!window.ReactNativeWebView || typeof window.ReactNativeWebView.postMessage !== "function") {
    return false;
  }

  try {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

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
const CV_API_URL = ""; // set this to the real endpoint URL when ready — leave empty for stub mode
const CAMERA_PERMISSION_DENIED = "Camera access denied. Allow camera access in browser settings.";
const CAMERA_NOT_FOUND = "No camera found on this device.";
const CAMERA_NO_ITEMS = "No items detected — try retaking the photo.";
const CAMERA_DETECTION_FAILED = "Detection failed — please try again.";
const CAMERA_NATIVE_UNSUPPORTED = "Camera scanning requires a rebuilt development build. Expo Go will not prompt for WebView camera access.";

function normalizeLabel(value) {
  return String(value ?? "").trim().replace(/\\s+/g, " ");
}

function prettyLabel(value) {
  return normalizeLabel(value).replace(/\b\w/g, c => c.toUpperCase());
}

async function detectItems(imageBase64, room, box) {
  // Stub mode — active when not running inside the native app
  if (!window.ReactNativeWebView) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      { name: "Hammer",         qty: 1 },
      { name: "Screwdriver",    qty: 3 },
      { name: "Measuring Tape", qty: 1 },
    ];
  }

  // Native mode — send image to App.js which calls Groq vision
  return new Promise((resolve, reject) => {
    const requestId = String(Date.now()) + Math.random().toString(36).slice(2);
    _pendingCVRequests[requestId] = { resolve, reject };

    const sent = postNativeMessage({ type: "cv/request", requestId, imageBase64 });
    if (!sent) {
      delete _pendingCVRequests[requestId];
      reject(new Error("Native bridge unavailable"));
      return;
    }

    setTimeout(() => {
      if (_pendingCVRequests[requestId]) {
        delete _pendingCVRequests[requestId];
        reject(new Error("CV request timed out"));
      }
    }, 30000);
  });
}

window.detectItems = detectItems;

function getDetectItemsAdapter() {
  return typeof window.detectItems === "function" ? window.detectItems : null;
}

function getReviewAdapter() {
  if (!window.vectorStoreReview || typeof window.vectorStoreReview.openWithItems !== "function") {
    return null;
  }
  return window.vectorStoreReview;
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

// ─── Intent parsing (LLM stub + validation) ──────────────────────────────────
const VALID_INTENTS = new Set(["add", "search", "delete", "special_request", "unknown"]);
const DEFAULT_UNKNOWN_DIALOGUE = "Sorry, I couldn't understand that inventory request.";

function fallbackUnknownIntent(rawText) {
  return { intent: "unknown", raw: String(rawText ?? "") };
}

function fallbackLLMEnvelope(rawText, dialogue = DEFAULT_UNKNOWN_DIALOGUE) {
  const safeDialogue = String(dialogue ?? "").trim() || DEFAULT_UNKNOWN_DIALOGUE;
  return {
    action: fallbackUnknownIntent(rawText),
    dialogue: safeDialogue,
  };
}

function coerceQty(value, fallback = 1) {
  const num = Number(value);
  if (!isFinite(num)) return fallback;
  return Math.max(1, Math.round(num));
}

function parseDeleteQty(value) {
  if (value === null || value === undefined || String(value).trim() === "") return "all";
  const normalized = String(value).trim().toLowerCase();
  if (["all", "everything", "entire", "full"].includes(normalized)) return "all";
  const num = Number(normalized);
  if (!isFinite(num) || num <= 0) return "all";
  return Math.max(1, Math.round(num));
}

function buildIntentSystemPrompt(activeRoom, activeBox) {
  const safeRoom = prettyLabel(activeRoom || "Garage");
  const safeBox = prettyLabel(activeBox || "");
  return \`You are a home inventory assistant for a local inventory app.
The user will give you a natural-language request.
Return ONLY valid JSON. No markdown. No prose outside JSON. No code fences.

The current default room is: \${safeRoom}
The current default box is: \${safeBox || "(no box)"}

Return exactly this envelope:
{
  "action": {
    "intent": "add | search | delete | special_request | unknown"
  },
  "dialogue": "assistant-style response",
  "done": true
}

Allowed action shapes:
- Add: { "intent": "add", "items": [{ "name": string, "qty": number, "room": string, "box": string }] }
- Search: { "intent": "search", "query": string }
- Delete: { "intent": "delete", "name": string, "room": string, "box": string, "qty": number | "all" }
- Special Request: { "intent": "special_request", "request_type": "recipe_check | repair_check | general_query", "searches_needed": [{ "query": string, "purpose": string }] }
- Unknown: { "intent": "unknown", "raw": string }

The "done" field:
- Set "done": true when you have fully answered the user and no further actions are needed
- Set "done": false when you need to perform additional searches or actions

Rules:
- Always include a non-empty "dialogue" string.
- The dialogue must sound like a helpful assistant speaking to the user.
- The dialogue must match the action being taken or explain why no action was taken.
- If the request is unrelated to the inventory app, return intent "unknown" and explain that you cannot help because it is outside inventory management.
- If the request is ambiguous or you cannot confidently determine the inventory action, return intent "unknown" instead of guessing.
- Use the default room and default box when the user does not specify them.
- Multi-item add inputs produce multiple objects in the items array.
- qty defaults to 1 if not mentioned.
- For delete, qty defaults to "all" if not mentioned.
- If the user says an item is put in, inside, or into another object, treat that destination object as the box when it is the natural container.
- This container rule is broad. A bag, basket, bin, drawer, cabinet, case, pouch, backpack, tote, shelf, or another noun used as the destination container can be the box.
- Example: "Put toothbrush in a bag in the bathroom" should map to item "Toothbrush", room "Bathroom", box "Bag".
- For add, mention what was added and where.
- For search, mention what is being looked for.
- For delete, mention what is being removed and from where.
- For unknown, explain clearly whether the request was unclear or outside the app's inventory functionality.

Special request rules:
- Use "special_request" for questions like "Do I have ingredients to make an apple pie?" or "Do I have supplies to fix a broken window?"
- Use your own knowledge to determine what items, ingredients, or supplies are needed
- List each item you need to search for in the "searches_needed" array with a brief purpose
- You will receive search results for each item you request and can then search again or answer the user
- NEVER ask the user follow-up questions. Answer with what you know from the search results and your own knowledge.
- If you cannot help with the request, set "done": true and explain why in the dialogue.\`;
}

function validateIntentAction(result, rawText, activeRoom, activeBox) {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    return fallbackUnknownIntent(rawText);
  }

  const intent = String(result.intent ?? "").toLowerCase().trim();
  if (!VALID_INTENTS.has(intent)) return fallbackUnknownIntent(rawText);

  const fallbackRoom = prettyLabel(activeRoom || "Garage");
  const fallbackBox = prettyLabel(activeBox || "");

  if (intent === "add") {
    if (!Array.isArray(result.items) || result.items.length === 0) {
      return fallbackUnknownIntent(rawText);
    }
    const items = result.items
      .map(item => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return null;
        const name = normalizeLabel(item.name);
        if (!name) return null;
        return {
          name,
          qty: coerceQty(item.qty, 1),
          room: prettyLabel(item.room || fallbackRoom),
          box: prettyLabel(item.box || fallbackBox),
        };
      })
      .filter(Boolean);
    if (!items.length) return fallbackUnknownIntent(rawText);
    return { intent: "add", items };
  }

  if (intent === "search") {
    const query = normalizeLabel(result.query);
    if (!query) return fallbackUnknownIntent(rawText);
    return { intent: "search", query };
  }

  if (intent === "delete") {
    const name = normalizeLabel(result.name);
    if (!name) return fallbackUnknownIntent(rawText);
    return {
      intent: "delete",
      name,
      room: prettyLabel(result.room || fallbackRoom),
      box: prettyLabel(result.box || fallbackBox),
      qty: parseDeleteQty(result.qty),
    };
  }

  if (intent === "special_request") {
    const requestType = String(result.request_type || "general_query").trim();
    const searchesNeeded = Array.isArray(result.searches_needed)
      ? result.searches_needed.filter(s => s && typeof s === "object" && normalizeLabel(s.query))
      : [];
    return {
      intent: "special_request",
      request_type: requestType,
      searches_needed: searchesNeeded.map(s => ({
        query: normalizeLabel(s.query),
        purpose: normalizeLabel(s.purpose || ""),
      })),
    };
  }

  return {
    intent: "unknown",
    raw: normalizeLabel(result.raw || rawText),
  };
}

function validateLLMEnvelope(result, rawText, activeRoom, activeBox) {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    return fallbackLLMEnvelope(rawText);
  }

  const dialogue = String(result.dialogue ?? "").trim() || DEFAULT_UNKNOWN_DIALOGUE;
  const actionInput = result.action && typeof result.action === "object" ? result.action : result;
  const action = validateIntentAction(actionInput, rawText, activeRoom, activeBox);
  const done = typeof result.done === "boolean" ? result.done : true;
  return { action, dialogue, done };
}

async function sendToLLM(rawTextOrMessages, activeRoom, activeBox) {
  const systemPrompt = buildIntentSystemPrompt(activeRoom, activeBox);
  const isMessages = Array.isArray(rawTextOrMessages);
  return new Promise((resolve, reject) => {
    const requestId = String(Date.now()) + Math.random().toString(36).slice(2);
    _pendingLLMRequests[requestId] = { resolve, reject };
    const payload = {
      type: "llm/request",
      requestId,
      systemPrompt,
    };
    if (isMessages) {
      payload.messages = rawTextOrMessages;
    } else {
      payload.text = String(rawTextOrMessages ?? "");
    }
    const sent = postNativeMessage(payload);
    if (!sent) {
      delete _pendingLLMRequests[requestId];
      reject(new Error("Native bridge unavailable"));
      return;
    }
    setTimeout(() => {
      if (_pendingLLMRequests[requestId]) {
        delete _pendingLLMRequests[requestId];
        reject(new Error("LLM request timed out"));
      }
    }, 20000);
  });
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
  const ttsSupported = typeof window !== "undefined"
    && !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
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
  const [commandInput, setCommandInput] = useState("");
  const [llmLoading,   setLlmLoading]   = useState(false);
  const [commandError, setCommandError] = useState(null);
  const [voiceDraft,   setVoiceDraft]   = useState("");
  const [voiceStatus,  setVoiceStatus]  = useState(window.ReactNativeWebView ? "checking" : "disabled");
  const [voiceMode,    setVoiceMode]    = useState(window.ReactNativeWebView ? "checking" : "disabled");
  const [voiceLevel,   setVoiceLevel]   = useState(-2);
  const [voiceError,   setVoiceError]   = useState(null);
  const [voiceShake,   setVoiceShake]   = useState(false);
  const [voiceDebugEvents, setVoiceDebugEvents] = useState([]);
  const [roomForm,     setRoomForm]    = useState("");
  const [boxForm,      setBoxForm]     = useState({ room: defaultRoom, name: "" });
  const [searchQuery,  setSearchQuery] = useState("");
  const [topK,         setTopK]        = useState(5);
  const [filterRoom,   setFilterRoom]  = useState("all");
  const [filterBox,    setFilterBox]   = useState("all");
  const [ttsEnabled,   setTtsEnabled]  = useState(() => {
    if (!ttsSupported) return false;
    try { return window.localStorage.getItem("vectorstock.ttsEnabled") === "true"; }
    catch { return false; }
  });
  const [assistantReply, setAssistantReply] = useState(null);
  const [assistantReplyPhase, setAssistantReplyPhase] = useState("hidden");
  const [activeTab,    setActiveTab]   = useState("inventory");
  const [notif,        setNotif]       = useState(null);
  const [error,        setError]       = useState(null);
  const [modelStatus,  setModelStatus] = useState("initializing");
  const [isMobile,     setIsMobile]    = useState(window.innerWidth <= 768);
  const [boxMove,      setBoxMove]     = useState({ fromRoom: defaultRoom, box: "", toRoom: defaultRoom });
  const [cameraRoom,   setCameraRoom]   = useState(defaultRoom);
  const [cameraBox,    setCameraBox]    = useState("");
  const [cameraFacing, setCameraFacing] = useState("environment");
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraCapture, setCameraCapture] = useState(null);
  const [cameraSwitching, setCameraSwitching] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError,   setCameraError]   = useState(null);
  const [cameraMode,    setCameraMode]    = useState(window.ReactNativeWebView ? "checking" : "browser");
  const [cameraAvailable, setCameraAvailable] = useState(!window.ReactNativeWebView);
  const [clearRoomTarget, setClearRoomTarget] = useState("");
  const [importMode,     setImportMode]     = useState("merge");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteChoiceId, setPendingDeleteChoiceId] = useState(null);
  const [reviewItems,     setReviewItems]     = useState([]);
  const cancelRef = useRef(false);
  const llmLoadingRef = useRef(false);
  const voiceTabCancelRef = useRef(false);
  const submitCommandRef = useRef(null);
  const mobileContentRef = useRef(null);
  const desktopMainRef = useRef(null);
  const tabScrollPositionsRef = useRef({ mobile: {}, desktop: {} });
  const videoRef = useRef(null);
  const deletePromptTimeoutRef = useRef(null);
  // Refs so window.vectorStoreAPI always holds the latest closure
  const embedAndStoreRef    = useRef(null);
  const handleDeleteRef     = useRef(null);
  const seedRef             = useRef(null);
  const batchEmbedStoreRef  = useRef(null);
  const stopCameraStream = useCallback((stream = cameraStream) => {
    if (!stream || typeof stream.getTracks !== "function") return;
    stream.getTracks().forEach(track => {
      try { track.stop(); } catch {}
    });
    setCameraStream(current => current === stream ? null : current);
  }, [cameraStream]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    llmLoadingRef.current = llmLoading;
  }, [llmLoading]);

  useEffect(() => {
    if (!ttsSupported) return;
    try { window.localStorage.setItem("vectorstock.ttsEnabled", String(ttsEnabled)); }
    catch {}
  }, [ttsEnabled, ttsSupported]);

  useEffect(() => {
    if (!ttsSupported || ttsEnabled) return;
    try { window.speechSynthesis.cancel(); } catch {}
  }, [ttsEnabled, ttsSupported]);

  const clearPendingDeleteState = useCallback(() => {
    if (deletePromptTimeoutRef.current) {
      window.clearTimeout(deletePromptTimeoutRef.current);
      deletePromptTimeoutRef.current = null;
    }
    setPendingDeleteId(null);
    setPendingDeleteChoiceId(null);
  }, []);

  const armPendingDeleteTimeout = useCallback(() => {
    if (deletePromptTimeoutRef.current) {
      window.clearTimeout(deletePromptTimeoutRef.current);
    }
    deletePromptTimeoutRef.current = window.setTimeout(() => {
      setPendingDeleteId(null);
      setPendingDeleteChoiceId(null);
      deletePromptTimeoutRef.current = null;
    }, 4500);
  }, []);

  useEffect(() => {
    if (!assistantReply) {
      setAssistantReplyPhase("hidden");
      return;
    }

    setAssistantReplyPhase("visible");
    const dissolveTimer = window.setTimeout(() => setAssistantReplyPhase("dissolving"), 8800);
    const clearTimer = window.setTimeout(() => {
      setAssistantReply(null);
      setAssistantReplyPhase("hidden");
    }, 10000);

    return () => {
      window.clearTimeout(dissolveTimer);
      window.clearTimeout(clearTimer);
    };
  }, [assistantReply]);

  const speakAssistantDialogue = useCallback((dialogue) => {
    const text = String(dialogue ?? "").trim();
    if (!ttsEnabled || !ttsSupported || !text || !window.speechSynthesis) return;
    try { window.speechSynthesis.cancel(); } catch {}
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled, ttsSupported]);

  const rememberAssistantReply = useCallback((rawText, envelope, origin = "command") => {
    const reply = {
      id: crypto.randomUUID(),
      rawText: String(rawText ?? "").trim(),
      dialogue: String(envelope?.dialogue ?? "").trim(),
      intent: String(envelope?.action?.intent ?? "unknown").trim().toLowerCase() || "unknown",
      origin,
    };
    setAssistantReply(reply);
    if (origin === "voice") speakAssistantDialogue(reply.dialogue);
  }, [speakAssistantDialogue]);

  const handleTabContentScroll = useCallback((event) => {
    const mode = isMobile ? "mobile" : "desktop";
    tabScrollPositionsRef.current[mode][activeTab] = event.currentTarget.scrollTop;
  }, [activeTab, isMobile]);

  useEffect(() => {
    const mode = isMobile ? "mobile" : "desktop";
    const container = isMobile ? mobileContentRef.current : desktopMainRef.current;
    if (!container) return;
    const savedScrollTop = tabScrollPositionsRef.current[mode][activeTab] ?? 0;
    const frame = window.requestAnimationFrame(() => {
      if (container) container.scrollTop = savedScrollTop;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeTab, isMobile]);

  const triggerVoiceError = useCallback((message) => {
    setVoiceError(message);
    setVoiceStatus("error");
    setVoiceLevel(-2);
    setVoiceShake(true);
    window.setTimeout(() => setVoiceShake(false), 320);
    window.setTimeout(() => {
      setVoiceStatus(current => current === "error" ? (voiceMode === "native" ? "idle" : "disabled") : current);
    }, 900);
  }, [voiceMode]);

  useEffect(() => {
    const fallbackReceiver = (payload) => {
      window.__VECTORSTOCK_NATIVE_QUEUE__.push(payload);
    };

    const handleNativePayload = (payload) => {
      if (!payload || typeof payload !== "object") return;

      if (payload.type === "voice/capabilities") {
        const nextMode = payload.mode === "native" && payload.speechAvailable ? "native" : "disabled";
        setVoiceMode(nextMode);
        setVoiceStatus(nextMode === "native" ? "idle" : "disabled");
        if (nextMode !== "native") setVoiceLevel(-2);
        return;
      }

      if (payload.type === "camera/capabilities") {
        const nextAvailable = Boolean(payload.cameraAvailable);
        setCameraAvailable(nextAvailable);
        setCameraMode(nextAvailable ? String(payload.mode || "native-webview") : "disabled");
        return;
      }

      if (payload.type === "voice/status") {
        const nextStatus = String(payload.status || "").trim();
        if (!nextStatus) return;
        if (voiceTabCancelRef.current) {
          if (nextStatus === "idle" || nextStatus === "error") {
            voiceTabCancelRef.current = false;
          }
          setVoiceStatus(voiceMode === "native" ? "idle" : "disabled");
          setVoiceLevel(-2);
          setVoiceError(null);
          return;
        }
        if (nextStatus === "idle" && llmLoadingRef.current) return;
        setVoiceStatus(nextStatus);
        if (nextStatus !== "error") setVoiceError(null);
        if (nextStatus !== "recording") setVoiceLevel(-2);
        return;
      }

      if (payload.type === "voice/volume") {
        setVoiceLevel(Number(payload.value ?? -2));
        return;
      }

      if (payload.type === "voice/debug") {
        const nextEntry = {
          id: crypto.randomUUID(),
          event: String(payload.event || "event"),
          detail: String(payload.detail || ""),
        };
        setVoiceDebugEvents(prev => [nextEntry, ...prev].slice(0, 6));
        return;
      }

      if (payload.type === "voice/error") {
        if (voiceTabCancelRef.current) return;
        triggerVoiceError(String(payload.message || "Voice recognition failed — please type instead."));
        return;
      }

      if (payload.type === "llm/response") {
        const { requestId, result, error } = payload;
        const pending = _pendingLLMRequests[requestId];
        if (pending) {
          delete _pendingLLMRequests[requestId];
          if (error) pending.reject(new Error(error));
          else pending.resolve(result);
        }
        return;
      }

      if (payload.type === "cv/response") {
        const { requestId, result, error } = payload;
        const pending = _pendingCVRequests[requestId];
        if (pending) {
          delete _pendingCVRequests[requestId];
          if (error) pending.reject(new Error(error));
          else pending.resolve(result);
        }
        return;
      }

      if (payload.type === "voice/transcript") {
        if (voiceTabCancelRef.current) return;
        const transcript = String(payload.transcript || "").trim();
        if (!transcript) {
          triggerVoiceError("Didn't catch that — please try again.");
          return;
        }
        const isFinal = Boolean(payload.isFinal);
        setVoiceDraft(transcript);
        setVoiceError(null);
        setVoiceStatus(isFinal ? "processing" : "recording");
        if (isFinal) {
          void submitCommandRef.current?.(transcript, "voice", "voice");
        }
      }
    };

    window.__VECTORSTOCK_NATIVE_BRIDGE__.receive = handleNativePayload;

    const pending = Array.isArray(window.__VECTORSTOCK_NATIVE_QUEUE__)
      ? [...window.__VECTORSTOCK_NATIVE_QUEUE__]
      : [];
    window.__VECTORSTOCK_NATIVE_QUEUE__ = [];
    pending.forEach(handleNativePayload);
    postNativeMessage({ type: "voice/check-support" });
    postNativeMessage({ type: "camera/check-support" });

    return () => {
      window.__VECTORSTOCK_NATIVE_BRIDGE__.receive = fallbackReceiver;
    };
  }, [triggerVoiceError]);

  const toast = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
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
    setCameraRoom(current => rooms.includes(current) ? current : rooms[0]);
  }, [rooms, defaultRoom, addForm.room]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (cameraStream) {
      const video = videoRef.current;
      let settled = false;
      const finishSwitch = () => {
        if (settled) return;
        settled = true;
        setCameraSwitching(false);
      };
      video.srcObject = cameraStream;
      video.onloadedmetadata = finishSwitch;
      const fallbackTimer = window.setTimeout(finishSwitch, 450);
      video.play?.().then(finishSwitch).catch(finishSwitch);
      return () => {
        settled = true;
        window.clearTimeout(fallbackTimer);
        if (video) video.onloadedmetadata = null;
      };
    }
    videoRef.current.srcObject = null;
    videoRef.current.onloadedmetadata = null;
  }, [cameraStream]);

  useEffect(() => {
    if (activeTab === "camera") return;
    stopCameraStream();
  }, [activeTab, stopCameraStream]);

  useEffect(() => {
    if (activeTab === "voice") return;
    if (voiceStatus !== "recording" && voiceStatus !== "processing") return;
    if (voiceMode !== "native") return;

    voiceTabCancelRef.current = true;
    setVoiceDraft("");
    setVoiceError(null);
    setVoiceLevel(-2);
    setVoiceStatus("idle");
    postNativeMessage({ type: "voice/stop" });
  }, [activeTab, voiceStatus, voiceMode]);

  useEffect(() => () => {
    stopCameraStream();
  }, [stopCameraStream]);

  useEffect(() => () => {
    if (deletePromptTimeoutRef.current) {
      window.clearTimeout(deletePromptTimeoutRef.current);
    }
  }, []);

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

  // ── Load persisted items (seed is gated — call window.vectorStoreAPI.seedSampleData() manually) ──
  useEffect(() => {
    if (modelStatus !== "ready") return;
    cancelRef.current = false;
    let live = true;
    async function run() {
      try {
        const persisted = await getAllItems();
        if (!live || cancelRef.current) return;
        setInventory(persisted.map(item => ({
          ...item,
          room: item.room || "Unassigned",
          box: item.box || "",
        })));
      } catch (e) {
        if (live) setError(\`Storage failed: \${String(e?.message ?? e)}\`);
      }
    }
    run();
    return () => { live = false; cancelRef.current = true; };
  }, [modelStatus]);

  const COMMAND_NAME_STOPWORDS = new Set([
    "a", "an", "the", "my", "your", "our", "their", "some",
    "please", "add", "store", "put", "save", "item", "items",
    "and", "to", "in", "on", "at", "of", "for", "with", "into",
  ]);

  function hasMeaningfulName(value) {
    const tokens = normalizeLabel(value)
      .toLowerCase()
      .replace(/[^a-z0-9\\s]/g, " ")
      .split(/\\s+/)
      .filter(Boolean);
    if (!tokens.length) return false;
    return tokens.some(token => !COMMAND_NAME_STOPWORDS.has(token));
  }

  const formatStoredConfirmation = item => {
    const location = [prettyLabel(item.room), prettyLabel(item.box)].filter(Boolean).join(" › ");
    const qty = normalizeLabel(item.qty || "") || "1";
    return \`\${prettyLabel(item.name)} · \${location || "Unassigned"} · \${qty}\`;
  };

  const embedAndStoreItem = async ({
    name,
    qty = "",
    room = "",
    box = "",
    source = "text",
  }) => {
    const itemName = normalizeLabel(name);
    if (!itemName) throw new Error("Could not understand item name");

    const selectedRoom = prettyLabel(room || defaultRoom || "Unassigned");
    const selectedBox = prettyLabel(box || "");
    const qtyValue = String(qty ?? "").trim();
    const vec = await embedText([
      itemName,
      selectedBox ? ("Box " + selectedBox) : "",
      "Room " + selectedRoom,
    ].filter(Boolean).join(". "));

    try {
      const stored = await addItem({
        id: crypto.randomUUID(),
        name: itemName,
        qty: qtyValue,
        room: selectedRoom,
        box: selectedBox,
        source: String(source || "text"),
        vector: vec,
        addedAt: new Date().toLocaleString(),
      });
      setInventory(inv => [...inv, stored]);
      return stored;
    } catch (e) {
      throw new Error("Failed to save item, please try again");
    }
  };

  const handleDeleteById = async (id) => {
    await deleteItem(id);
    setInventory(inv => inv.filter(i => i.id !== id));
    setResults(r => r ? r.filter(i => i.id !== id) : r);
  };

  const handleDeleteByIntent = async (name, room, qty = "all", box = "") => {
    const targetName = normalizeLabel(name).toLowerCase();
    const targetRoom = normalizeLabel(room).toLowerCase();
    const targetBox = normalizeLabel(box).toLowerCase();
    const deleteQty = parseDeleteQty(qty);
    if (!targetName) throw new Error("Could not understand item name");

    const ranked = inventory
      .map(item => {
        const itemName = normalizeLabel(item.name).toLowerCase();
        const itemRoom = normalizeLabel(item.room).toLowerCase();
        const itemBox = normalizeLabel(item.box).toLowerCase();
        let score = 0;

        if (itemName === targetName) score += 5;
        else if (itemName.includes(targetName) || targetName.includes(itemName)) score += 2;
        else return null;

        if (targetRoom) {
          if (itemRoom === targetRoom) score += 3;
          else if (itemRoom.includes(targetRoom) || targetRoom.includes(itemRoom)) score += 1;
          else return null;
        }

        if (targetBox) {
          if (itemBox === targetBox) score += 2;
          else if (itemBox.includes(targetBox) || targetBox.includes(itemBox)) score += 1;
          else return null;
        }
        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    const best = ranked.find(candidate => candidate.score > 0)?.item;
    if (!best) {
      throw new Error("Item not found. Try a more specific name.");
    }

    const loc = [best.room, best.box].filter(Boolean).join(" › ");
    const currentQty = Number(normalizeLabel(best.qty));
    const hasNumericQty = isFinite(currentQty) && currentQty > 0;

    if (deleteQty === "all" || !hasNumericQty || deleteQty >= currentQty) {
      await handleDeleteById(best.id);
      toast(\`Removed: \${best.name}\${loc ? \` · \${loc}\` : ""} · all\`);
      return true;
    }

    const nextQty = String(Math.max(1, currentQty - deleteQty));
    const updated = { ...best, qty: nextQty };
    try {
      await addItem(updated);
      setInventory(prev => prev.map(item => item.id === best.id ? updated : item));
      setResults(prev => prev ? prev.map(item => item.id === best.id ? { ...item, qty: nextQty } : item) : prev);
      toast(\`Removed: \${best.name}\${loc ? \` · \${loc}\` : ""} · \${deleteQty}\`);
    } catch (e) {
      throw new Error("Failed to save item, please try again");
    }
    return true;
  };

  // ── Expose API on window for external callers (e.g. Person A's intent pipeline) ──
  embedAndStoreRef.current = embedAndStoreItem;
  handleDeleteRef.current  = handleDeleteByIntent;
  batchEmbedStoreRef.current = async (confirmedItems, onProgress) => {
    const total = confirmedItems.length;
    const stored = [];
    for (let i = 0; i < total; i++) {
      const item = confirmedItems[i];
      onProgress?.({ done: i, total, current: item.name });
      try {
        const result = await embedAndStoreItem({
          name:   item.name,
          qty:    String(item.qty ?? 1),
          room:   item.room,
          box:    item.box || "",
          source: "camera",
        });
        stored.push(result);
      } catch (e) {
        console.warn(\`Skipped "\${item.name}": \${e.message}\`);
      }
      onProgress?.({ done: i + 1, total, current: item.name });
    }
    return stored;
  };
  const handleReviewUpdate = (id, field, value) => {
    setReviewItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleReviewRemove = (id) => {
    setReviewItems(prev => prev.filter(item => item.id !== id));
  };

  const handleReviewConfirm = async () => {
    const valid = reviewItems.filter(item => normalizeLabel(item.name));
    if (!valid.length) return toast("No valid items to store.", "error");
    setSeeding(true);
    setSeedProg({ done: 0, total: valid.length, current: "" });
    try {
      const stored = await batchEmbedStoreRef.current(valid, ({ done, total, current }) => {
        setSeedProg({ done, total, current });
      });
      setReviewItems([]);
      setActiveTab("inventory");
      toast(\`Stored \${stored.length} item\${stored.length !== 1 ? "s" : ""} ✓\`);
    } catch (e) {
      toast(\`Store failed: \${e.message}\`, "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleReviewCancel = () => {
    setReviewItems([]);
    setActiveTab("camera");
  };

  seedRef.current = async () => {
    if (modelStatus !== "ready") throw new Error("Model not ready yet");
    setSeeding(true);
    setSeedProg({ done: 0, total: SEED_ITEMS.length, current: "" });
    const acc = [];
    try {
      for (let i = 0; i < SEED_ITEMS.length; i++) {
        const item = SEED_ITEMS[i];
        setSeedProg({ done: i, total: SEED_ITEMS.length, current: item.name });
        try {
          const stored = await embedAndStoreItem({ name: item.name, qty: item.qty, source: "seed" });
          acc.push(stored);
          setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name });
        } catch (e) {
          setSeedProg({ done: i + 1, total: SEED_ITEMS.length, current: item.name });
        }
      }
    } finally {
      setSeeding(false);
    }
    return acc;
  };

  useEffect(() => {
    window.vectorStoreAPI = {
      /**
       * Embed and store an item.
       * @param {{ name: string, qty?: string, room?: string, box?: string, source?: string }} item
       * @returns {Promise<{ id, name, qty, room, box, vector, source, addedAt }>}
       */
      embedAndStore: (item) => embedAndStoreRef.current(item),
      /**
       * Delete an item by name and room (fuzzy match).
       * Throws if item not found.
       * @param {string} name
       * @param {string} room
       * @returns {Promise<boolean>}
       */
      handleDelete: (name, room) => handleDeleteRef.current(name, room),
      /**
       * Load the 30 sample items into the DB (dev/demo only — not for production).
       * @returns {Promise<Array>}
       */
      seedSampleData: () => seedRef.current(),
      detectItems: (imageBase64, room, box) => detectItems(imageBase64, room, box),
      batchEmbedAndStore: (confirmedItems, onProgress) => batchEmbedStoreRef.current(confirmedItems, onProgress),
    };
    window.vectorStoreReview = {
      openWithItems: (items) => {
        setReviewItems(items);
        setActiveTab("review");
      },
    };
  }, []);

  const applyCommandError = useCallback((message, origin = "command") => {
    if (origin === "voice") {
      triggerVoiceError(message);
    } else {
      setCommandError(message);
    }
    toast(message, "error");
  }, [triggerVoiceError]);

  const formatActionResult = (actionResult, llmDialogue) => {
    if (!actionResult || typeof actionResult !== "object") {
      return "Action completed.";
    }
    const parts = [];
    if (llmDialogue) {
      parts.push(\`Assistant said: "\${llmDialogue}"\`);
    }
    switch (actionResult.intent) {
      case "search": {
        const header = \`SEARCH RESULT for "\${actionResult.query}":\`;
        if (actionResult.notFound || actionResult.found.length === 0) {
          parts.push(\`\${header} No items found matching "\${actionResult.query}" in the inventory.\`);
        } else {
          const items = actionResult.found.map(item => {
            const loc = [prettyLabel(item.room), prettyLabel(item.box)].filter(Boolean).join(" > ");
            return \`- \${item.name} (qty: \${item.qty}, location: \${loc || "Unassigned"}, relevance: \${item.score})\`;
          }).join("\\n");
          parts.push(\`\${header} Found \${actionResult.found.length} item(s):\\n\${items}\`);
        }
        break;
      }
      case "add":
        if (actionResult.stored && actionResult.stored.length > 0) {
          const items = actionResult.stored.map(item => prettyLabel(item.name)).join(", ");
          parts.push(\`Successfully added: \${items}\`);
        } else {
          parts.push(\`Add action completed\`);
        }
        break;
      case "delete":
        if (actionResult.success) {
          parts.push(\`Successfully deleted: \${actionResult.name}\`);
        } else {
          parts.push(\`Delete failed: \${actionResult.error || "unknown error"}\`);
        }
        break;
      case "special_request":
        parts.push(\`Special request received: \${actionResult.request_type || "general"}\`);
        break;
      case "unknown":
        parts.push(\`Could not understand the request.\`);
        break;
      default:
        if (actionResult.error) {
          parts.push(\`Error: \${actionResult.error}\`);
        } else {
          parts.push("Action completed.");
        }
    }
    return parts.join("\\n");
  };

  const routeIntentResult = async (result, source = "text", origin = "command") => {
    switch (result.intent) {
      case "add": {
        setLoading(l => ({ ...l, add: true }));
        setError(null);
        const storedItems = [];
        try {
          for (const item of result.items) {
            const parsedName = normalizeLabel(item?.name);
            if (!parsedName || !hasMeaningfulName(parsedName)) {
              throw new Error("Could not understand item name");
            }
            const parsedQty = coerceQty(item?.qty, 1);
            const stored = await embedAndStoreItem({
              name: parsedName,
              qty: parsedQty,
              room: prettyLabel(item?.room || defaultRoom || "Unassigned"),
              box: prettyLabel(item?.box || ""),
              source,
            });
            storedItems.push(stored);
          }
          if (!storedItems.length) throw new Error("Could not understand item name");
          const message = storedItems.length === 1
            ? \`✓ Stored: \${formatStoredConfirmation(storedItems[0])}\`
            : \`✓ Stored: \${storedItems.map(formatStoredConfirmation).join(" | ")}\`;
          toast(message);
          if (origin !== "voice") setCommandInput("");
          return { success: true, intent: "add", stored: storedItems };
        } catch (e) {
          return { success: false, intent: "add", error: String(e?.message ?? e) };
        } finally {
          setLoading(l => ({ ...l, add: false }));
        }
      }
      case "search": {
        setSearchQuery(result.query);
        setActiveTab("search");
        const searchResult = await performSearch(result.query);
        if (searchResult.success) {
          setResults(searchResult.found);
        }
        return {
          success: searchResult.success,
          intent: "search",
          query: searchResult.query,
          found: searchResult.found.map(item => ({
            name: item.name,
            qty: normalizeLabel(item.qty) || "1",
            room: item.room || "Unassigned",
            box: item.box || "",
            score: Math.round((item.score || 0) * 100) / 100,
          })),
          notFound: searchResult.notFound,
          error: searchResult.error || null,
        };
      }
      case "delete":
        try {
          await handleDeleteByIntent(result.name, result.room, result.qty, result.box);
          return { success: true, intent: "delete", name: result.name };
        } catch (e) {
          return { success: false, intent: "delete", error: String(e?.message ?? e) };
        }
      case "special_request":
        return { success: true, intent: "special_request", request_type: result.request_type };
      case "unknown":
        return { success: true, intent: "unknown" };
      default:
        return { success: false, intent: "unknown" };
    }
  };

  const submitNaturalLanguageCommand = async (rawTextValue, source = "text", origin = "command") => {
    const rawText = String(rawTextValue ?? "").trim();
    if (origin !== "voice") setCommandError(null);
    if (origin === "voice") setVoiceError(null);

    if (!rawText) {
      applyCommandError("Please enter an item name", origin);
      return false;
    }
    if (modelStatus !== "ready") {
      applyCommandError("Model still loading, please wait", origin);
      return false;
    }

    const activeRoom = prettyLabel(defaultRoom || "Garage");
    const activeBox = "";

    setLlmLoading(true);
    if (origin === "voice") setVoiceStatus("processing");
    setError(null);

    const MAX_LOOPS = 8;
    const chatHistory = [];

    try {
      // ── First LLM call ──
      const llmRawResult = await sendToLLM(rawText, activeRoom, activeBox);
      const parsedResult = validateLLMEnvelope(llmRawResult, rawText, activeRoom, activeBox);

      // ── If it's a special_request, enter the multi-turn loop ──
      if (parsedResult.action.intent === "special_request") {
        let loopCount = 0;
        let currentParsed = parsedResult;

        while (loopCount < MAX_LOOPS) {
          // If LLM said it's done, speak the answer and exit
          if (currentParsed.done) {
            rememberAssistantReply(rawText, currentParsed, origin);
            if (origin === "voice") setVoiceStatus(voiceMode === "native" ? "idle" : "disabled");
            return true;
          }

          // Execute searches_needed from the LLM response (if any)
          const searches = currentParsed.action.searches_needed || [];
          const searchResults = [];
          for (const s of searches) {
            const sr = await performSearch(s.query);
            searchResults.push(sr);
          }

          // Also handle other intents the LLM might return mid-loop (search, add, delete)
          if (currentParsed.action.intent === "search" && searches.length === 0) {
            const sr = await performSearch(currentParsed.action.query);
            if (sr.success) setResults(sr.found);
            searchResults.push(sr);
          } else if (currentParsed.action.intent === "add") {
            await routeIntentResult(currentParsed.action, source, origin);
          } else if (currentParsed.action.intent === "delete") {
            await routeIntentResult(currentParsed.action, source, origin);
          }

          // Format all search results and append to chat history
          if (searchResults.length > 0) {
            const formattedResults = searchResults.map(sr => {
              if (sr.notFound || sr.found.length === 0) {
                return \`SEARCH RESULT for "\${sr.query}": No items found matching "\${sr.query}" in the inventory.\`;
              }
              const items = sr.found.map(item => {
                const loc = [prettyLabel(item.room), prettyLabel(item.box)].filter(Boolean).join(" > ");
                return \`- \${item.name} (qty: \${item.qty}, location: \${loc || "Unassigned"}, relevance: \${Math.round((item.score || 0) * 100) / 100})\`;
              }).join("\\n");
              return \`SEARCH RESULT for "\${sr.query}": Found \${sr.found.length} item(s):\\n\${items}\`;
            }).join("\\n\\n");

            chatHistory.push({
              role: "user",
              content: formattedResults,
            });
          } else if (currentParsed.dialogue) {
            // No searches but LLM had something to say
            chatHistory.push({
              role: "assistant",
              content: currentParsed.dialogue,
            });
          }

          // Build messages: system + history + original query
          const messages = [
            { role: "system", content: buildIntentSystemPrompt(activeRoom, activeBox) },
            ...chatHistory,
            { role: "user", content: rawText },
          ];

          // Next LLM call
          const nextRaw = await sendToLLM(messages, activeRoom, activeBox);
          currentParsed = validateLLMEnvelope(nextRaw, rawText, activeRoom, activeBox);
          loopCount++;
        }

        // Safety: exceeded max loops, respond with what we have
        const fallbackDialogue = \`I wasn't able to fully resolve that, but here's what I found: \${currentParsed.dialogue}\`;
        rememberAssistantReply(rawText, { action: currentParsed.action, dialogue: fallbackDialogue, done: true }, origin);
        if (origin === "voice") setVoiceStatus(voiceMode === "native" ? "idle" : "disabled");
        return true;
      }

      // ── Standard flow (add/search/delete/unknown) — no loop ──
      const didHandle = await routeIntentResult(parsedResult.action, source, origin);
      if (!didHandle || (typeof didHandle === "object" && !didHandle.success)) {
        applyCommandError("Sorry, I didn't understand that. Try again.", origin);
        return false;
      }
      rememberAssistantReply(rawText, parsedResult, origin);
      if (origin === "voice") setVoiceStatus(voiceMode === "native" ? "idle" : "disabled");
      return true;
    } catch (e) {
      const message = String(e?.message ?? e);
      const knownMessages = [
        "Could not understand item name",
        "Failed to save item, please try again",
        "Item not found. Try a more specific name.",
        "Model not ready yet",
      ];
      if (knownMessages.includes(message)) {
        applyCommandError(message, origin);
      } else {
        applyCommandError("Sorry, I didn't understand that. Try again.", origin);
      }
      return false;
    } finally {
      setLlmLoading(false);
      if (origin === "voice") {
        setVoiceStatus(current => current === "recording" ? current : (voiceMode === "native" ? "idle" : "disabled"));
      }
    }
  };

  const handleCommandSubmit = async () => {
    await submitNaturalLanguageCommand(commandInput, "text", "command");
  };

  submitCommandRef.current = submitNaturalLanguageCommand;

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
    setLoading(l => ({ ...l, add: true }));
    setError(null);
    try {
      const stored = await embedAndStoreItem({
        name: itemName,
        qty: String(addForm.qty ?? "").trim(),
        room: selectedRoom,
        box: prettyLabel(addForm.box),
        source: "text",
      });
      setAddForm({ name: "", description: "", qty: "", unit: "", room: selectedRoom, box: "", status: "In Stock" });
      const loc = [stored.room, stored.box].filter(Boolean).join(" › ");
      toast(\`"\${stored.name}" stored in \${loc || "Unassigned"} ✓\`);
      if (isMobile) setActiveTab("inventory");
    } catch (e) {
      const message = String(e?.message ?? e);
      setError(message);
      if (message === "Failed to save item, please try again") {
        toast(message, "error");
      } else {
        toast("Embedding failed.", "error");
      }
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
  const performSearch = async (query, topKOverride = null) => {
    const q = String(query ?? "").trim();
    if (!q) return { success: false, query: "", found: [], notFound: true, error: "Empty query" };
    if (!inventory.length) return { success: false, query: q, found: [], notFound: true, error: "Inventory is empty" };
    if (modelStatus !== "ready") return { success: false, query: q, found: [], notFound: true, error: "Model not ready" };
    try {
      const qVec = await embedQuery(q);
      qVec.__queryText = q;
      const k = topKOverride ?? Math.max(1, Math.min(topK, inventory.length));
      const scored = searchItems(qVec, inventory, k);
      return { success: true, query: q, found: scored, notFound: scored.length === 0 };
    } catch (e) {
      return { success: false, query: q, found: [], notFound: true, error: String(e?.message ?? e) };
    }
  };

  const handleSearch = async (queryOverride = null) => {
    const q = String(queryOverride ?? searchQuery ?? "").trim();
    if (!q) return toast("Enter a search query.", "error");
    if (!inventory.length) return toast("Inventory is empty.", "error");
    if (modelStatus !== "ready") return toast("Model not ready.", "error");
    if (queryOverride !== null && queryOverride !== undefined) setSearchQuery(q);
    setLoading(l => ({ ...l, search: true })); setResults(null); setError(null);
    try {
      const result = await performSearch(q);
      if (result.success) {
        setResults(result.found);
      } else {
        setError(result.error || "Search failed");
        toast("Search failed.", "error");
      }
      return result.success;
    } finally {
      setLoading(l => ({ ...l, search: false }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await handleDeleteById(id);
    } catch (e) {
      setError(\`Delete failed: \${String(e?.message ?? e)}\`);
      toast("Delete failed.", "error");
    }
  };

  const handleDeleteCardAction = async (item, mode) => {
    clearPendingDeleteState();
    try {
      if (mode === "all") {
        await handleDeleteById(item.id);
        return;
      }

      const currentQty = Number(normalizeLabel(item.qty));
      if (!isFinite(currentQty) || currentQty <= 1) {
        await handleDeleteById(item.id);
        return;
      }

      const nextQty = String(currentQty - 1);
      const storedItem = inventory.find(existing => existing.id === item.id) || item;
      await addItem({ ...storedItem, qty: nextQty });
      setInventory(prev => prev.map(existing => existing.id === item.id ? { ...existing, qty: nextQty } : existing));
      setResults(prev => prev ? prev.map(existing => existing.id === item.id ? { ...existing, qty: nextQty } : existing) : prev);
      toast(\`Removed 1 \${item.name}\`);
    } catch (e) {
      setError(\`Delete failed: \${String(e?.message ?? e)}\`);
      toast("Delete failed.", "error");
    }
  };

  const handleDeleteCardPrompt = (item) => {
    const parsedQty = Number(normalizeLabel(item.qty));
    const allowChoice = isFinite(parsedQty) && parsedQty > 1;

    if (allowChoice) {
      const isOpen = pendingDeleteChoiceId === item.id;
      clearPendingDeleteState();
      if (!isOpen) {
        setPendingDeleteChoiceId(item.id);
        armPendingDeleteTimeout();
      }
      return;
    }

    const isOpen = pendingDeleteId === item.id;
    clearPendingDeleteState();
    if (!isOpen) {
      setPendingDeleteId(item.id);
      armPendingDeleteTimeout();
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAll();
      setInventory([]);
      setResults(null);
      setSearchQuery("");
      setFilterRoom("all");
      setFilterBox("all");
      setActiveTab("inventory");
      toast("All saved items cleared.");
    } catch (e) {
      setError(\`Clear failed: \${String(e?.message ?? e)}\`);
      toast("Clear failed.", "error");
    }
  };

  const handleExport = async () => {
    try {
      const items = await getAllItems();
      if (!items.length) return toast("Nothing to export — inventory is empty.", "error");

      const exportData = items.map(({ vector, ...rest }) => rest);
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        items: exportData,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      try {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = \`homefind-backup-\${new Date().toISOString().slice(0, 10)}.json\`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      } finally {
        URL.revokeObjectURL(url);
      }

      toast(\`Exported \${items.length} items ✓\`);
    } catch (e) {
      toast(\`Export failed: \${String(e?.message ?? e)}\`, "error");
    }
  };

  const handleImport = async (file, mode = "merge") => {
    if (modelStatus !== "ready") return toast("Model not ready.", "error");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || !Array.isArray(parsed.items)) {
        return toast("Invalid backup file.", "error");
      }

      const validItems = parsed.items.filter(item =>
        item && typeof item === "object" && normalizeLabel(item.name)
      );
      if (!validItems.length) return toast("No valid items found in file.", "error");

      if (mode === "replace") {
        await clearAll();
        setInventory([]);
        setResults(null);
        setFilterRoom("all");
        setFilterBox("all");
      }

      setSeeding(true);
      setSeedProg({ done: 0, total: validItems.length, current: "" });
      const imported = [];

      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        const label = normalizeLabel(item.name);
        setSeedProg({ done: i, total: validItems.length, current: label });
        try {
          const stored = await embedAndStoreItem({
            name: item.name,
            qty: item.qty || "",
            room: item.room || "Unassigned",
            box: item.box || "",
            source: "import",
          });
          imported.push(stored);
        } catch (e) {
          // Skip failed item and continue importing the rest.
        } finally {
          setSeedProg({ done: i + 1, total: validItems.length, current: label });
        }
      }

      const persisted = await getAllItems();
      setInventory(persisted.map(item => ({
        ...item,
        room: item.room || "Unassigned",
        box: item.box || "",
      })));
      setResults(null);
      toast(\`Imported \${imported.length} of \${validItems.length} items ✓\`);
    } catch (e) {
      toast(\`Import failed: \${String(e?.message ?? e)}\`, "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleImportFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleImport(file, importMode);
    }
    event.target.value = "";
  };

  const handleClearRoom = async () => {
    const target = prettyLabel(clearRoomTarget);
    if (!target) return toast("Select a room to clear.", "error");

    const toDelete = inventory.filter(item =>
      normalizeLabel(item.room).toLowerCase() === normalizeLabel(target).toLowerCase()
    );
    if (!toDelete.length) return toast(\`No items in \${target}.\`, "error");

    try {
      await Promise.all(toDelete.map(item => deleteItem(item.id)));
      setInventory(prev => prev.filter(item =>
        normalizeLabel(item.room).toLowerCase() !== normalizeLabel(target).toLowerCase()
      ));
      setResults(prev => prev ? prev.filter(item =>
        normalizeLabel(item.room).toLowerCase() !== normalizeLabel(target).toLowerCase()
      ) : prev);
      setClearRoomTarget("");
      toast(\`Cleared \${toDelete.length} items from \${target}.\`);
    } catch (e) {
      toast(\`Clear failed: \${e.message}\`, "error");
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

  const busy = loading.add || loading.search || llmLoading;
  const commandBusy = llmLoading || loading.add;
  const voiceBusy = voiceStatus === "recording" || voiceStatus === "processing" || llmLoading;
  const voiceSupportsMic = voiceMode === "native";
  const seedPct = seedProg.total > 0 ? (seedProg.done / seedProg.total) * 100 : 0;
  const knownRooms = Array.from(new Set([
    ...DEFAULT_ROOMS.map(prettyLabel),
    ...rooms.map(prettyLabel),
    ...inventory.map(i => prettyLabel(i.room)).filter(Boolean),
    prettyLabel(defaultRoom),
  ])).filter(Boolean);
  const normalizedFilterRoom = normalizeLabel(filterRoom).toLowerCase();
  const normalizedFilterBox = normalizeLabel(filterBox).toLowerCase();
  const roomRecords = Array.from(inventory.reduce((map, item) => {
    const room = prettyLabel(item.room);
    if (!room) return map;
    const key = normalizeLabel(room).toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, { room, count: 1 });
    }
    return map;
  }, new Map()).values());
  const roomsWithItems = roomRecords.map(record => record.room);
  const roomCounts = roomRecords.reduce((acc, record) => {
    acc[normalizeLabel(record.room).toLowerCase()] = record.count;
    return acc;
  }, {});
  const isInventoryFilterActive = filterRoom !== "all" || filterBox !== "all";
  const showRoomFilters = inventory.length > 0 && (roomsWithItems.length > 1 || isInventoryFilterActive);
  const boxesInRoom = filterRoom === "all"
    ? []
    : Array.from(new Map(
        inventory
          .filter(item =>
            normalizeLabel(item.room).toLowerCase() === normalizedFilterRoom
          )
          .map(item => prettyLabel(item.box))
          .filter(Boolean)
          .map(box => [normalizeLabel(box).toLowerCase(), box])
      ).values());
  const showBoxFilter = filterRoom !== "all"
    && (boxesInRoom.length > 1 || (filterBox !== "all" && boxesInRoom.length > 0));
  const filteredInventory = inventory
    .filter(item =>
      filterRoom === "all"
      || normalizeLabel(item.room).toLowerCase() === normalizedFilterRoom
    )
    .filter(item =>
      filterBox === "all"
      || normalizeLabel(item.box).toLowerCase() === normalizedFilterBox
    )
    .sort((a, b) => {
      const timeA = new Date(a.addedAt || 0).getTime();
      const timeB = new Date(b.addedAt || 0).getTime();
      return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
    });
  const filterSummaryLabel = [
    filterRoom !== "all" ? prettyLabel(filterRoom) : "",
    filterBox !== "all" ? prettyLabel(filterBox) : "",
  ].filter(Boolean).join(" › ");
  const handleRoomFilterSelect = (room) => {
    setFilterRoom(room);
    setFilterBox("all");
  };
  const displayItems = activeTab === "search" && results !== null
    ? results
    : activeTab === "inventory"
      ? filteredInventory
      : [];
  const assistantReplyIntentTone = assistantReply?.intent === "unknown"
    ? "#fbbf24"
    : assistantReply?.intent === "delete"
      ? "#fda4af"
      : assistantReply?.intent === "search"
        ? "#c4b5fd"
        : "#67e8f9";
  const assistantReplySourceLabel = assistantReply?.origin === "voice" ? "Voice" : "Typed command";

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

  const cameraBoxes = knownBoxRecords
    .filter(b => normalizeLabel(b.room).toLowerCase() === normalizeLabel(cameraRoom || defaultRoom).toLowerCase())
    .map(b => b.name);

  const moveBoxes = knownBoxRecords
    .filter(b => normalizeLabel(b.room).toLowerCase() === normalizeLabel(boxMove.fromRoom || defaultRoom).toLowerCase())
    .map(b => b.name);
  const moveReady = Boolean(normalizeLabel(boxMove.box)) && normalizeLabel(boxMove.fromRoom) && normalizeLabel(boxMove.toRoom)
    && normalizeLabel(boxMove.fromRoom).toLowerCase() !== normalizeLabel(boxMove.toRoom).toLowerCase();
  const moveSummary = moveReady
    ? ('Move "' + prettyLabel(boxMove.box) + '" from ' + prettyLabel(boxMove.fromRoom) + ' to ' + prettyLabel(boxMove.toRoom))
    : "Pick source room, box, and destination room";

  useEffect(() => {
    if (!cameraBox) return;
    const stillExists = cameraBoxes.some(box =>
      normalizeLabel(box).toLowerCase() === normalizeLabel(cameraBox).toLowerCase()
    );
    if (!stillExists) setCameraBox("");
  }, [cameraBoxes, cameraBox]);

  const handleOpenCamera = async (nextFacing = cameraFacing, options = {}) => {
    const requestedFacing = nextFacing === "user" ? "user" : "environment";
    const transition = Boolean(options.transition);
    setCameraError(null);
    setCameraCapture(null);
    setCameraSwitching(transition);
    stopCameraStream();

    if (window.ReactNativeWebView && !cameraAvailable) {
      setCameraError(CAMERA_NATIVE_UNSUPPORTED);
      setCameraSwitching(false);
      return;
    }

    if (!window.ReactNativeWebView && window.isSecureContext === false) {
      setCameraError("Camera is only available on HTTPS or localhost.");
      setCameraSwitching(false);
      return;
    }

    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      setCameraError("Camera is not supported in this browser.");
      setCameraSwitching(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: requestedFacing } },
        audio: false,
      });
      const actualFacing = stream.getVideoTracks?.()[0]?.getSettings?.().facingMode;
      setCameraFacing(actualFacing === "user" ? "user" : actualFacing === "environment" ? "environment" : requestedFacing);
      setCameraStream(stream);
    } catch (e) {
      if (e?.name === "NotAllowedError" || e?.name === "PermissionDeniedError") {
        setCameraError(CAMERA_PERMISSION_DENIED);
      } else if (e?.name === "NotFoundError" || e?.name === "DevicesNotFoundError") {
        setCameraError(CAMERA_NOT_FOUND);
      } else {
        setCameraError(\`Camera error: \${e?.message || "Unable to access camera."}\`);
      }
      setCameraSwitching(false);
    }
  };

  const handleFlipCamera = async () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    await handleOpenCamera(nextFacing, { transition: true });
  };

  const handleDetect = async (base64) => {
    const detectItems = getDetectItemsAdapter();
    if (!detectItems) {
      setCameraError("Camera detection is not available yet.");
      return;
    }

    const reviewApi = getReviewAdapter();
    if (!reviewApi) {
      setCameraError("Review screen is not available yet.");
      return;
    }

    setCameraLoading(true);
    setCameraError(null);
    try {
      const detected = await detectItems(base64, cameraRoom, cameraBox);
      if (!Array.isArray(detected) || !detected.length) {
        setCameraError(CAMERA_NO_ITEMS);
        return;
      }

      const reviewItems = detected
        .map(item => {
          const name = normalizeLabel(item?.name);
          if (!name) return null;
          return {
            id: crypto.randomUUID(),
            name,
            qty: String(item?.qty ?? 1),
            room: prettyLabel(cameraRoom || defaultRoom || "Unassigned"),
            box: prettyLabel(cameraBox || ""),
          };
        })
        .filter(Boolean);

      if (!reviewItems.length) {
        setCameraError(CAMERA_NO_ITEMS);
        return;
      }

      reviewApi.openWithItems(reviewItems);
      setActiveTab("review");
    } catch (e) {
      setCameraError(
        e?.message === "Camera detection is not available yet." || e?.message === "Review screen is not available yet."
          ? e.message
          : \`\${CAMERA_DETECTION_FAILED} (\${e?.message || "unknown"})\`
      );
    } finally {
      setCameraLoading(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      setCameraError("Camera preview is not ready yet.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    stopCameraStream();

    const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
    setCameraCapture(base64);
    void handleDetect(base64);
  };

  const handleRetake = () => {
    setCameraCapture(null);
    setCameraError(null);
    void handleOpenCamera();
  };

  // ── Shared sub-components ─────────────────────────────────────────────────
  const matchLabel = s => s > 0.75 ? "✦ strong" : s > 0.50 ? "· good" : "· partial";
  const matchColor = s => s > 0.75 ? "#93c5fd" : s > 0.50 ? "#a78bfa" : "#64748b";

  // Glass Card Component
  const ItemCard = ({ item }) => {
    const sc     = item.score;
    const colors = STATUS_COLORS[String(item.status ?? "")] ?? STATUS_COLORS["In Stock"];
    const statusStyle = {
      fontSize:11,
      minHeight:30,
      padding:"0 11px",
      borderRadius:15,
      fontWeight:600,
      fontFamily:INPUT_FF,
      display:"inline-flex",
      alignItems:"center",
      background: colors.bg,
      color: colors.text,
      border: \`1px solid \${colors.border}\`,
      boxShadow: \`inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 8px 18px \${colors.glow}\`,
    };
    const infoChipStyle = {
      fontSize:11,
      minHeight:30,
      padding:"0 11px",
      borderRadius:15,
      display:"inline-flex",
      alignItems:"center",
      fontFamily:INPUT_FF,
      border:"1px solid rgba(255, 255, 255, 0.06)",
      background:"rgba(67, 72, 75, 0.62)",
      color:"#cbd5e1",
      boxShadow:"inset 0 1px 0 rgba(255, 255, 255, 0.03)",
    };
    const locationChipStyle = {
      ...infoChipStyle,
      background:"rgba(96, 165, 250, 0.12)",
      border:"1px solid rgba(96, 165, 250, 0.18)",
      color:"#bfdbfe",
    };
    const parsedQty = Number(normalizeLabel(item.qty));
    const hasMultipleQty = isFinite(parsedQty) && parsedQty > 1;
    const deletePending = pendingDeleteId === item.id;
    const deleteChoiceOpen = pendingDeleteChoiceId === item.id;
    const deleteBtnBase = {
      minHeight:32,
      cursor:"pointer",
      lineHeight:1,
      borderRadius:16,
      transition:"all 0.15s ease",
      whiteSpace:"nowrap",
      fontFamily:INPUT_FF,
      display:"inline-flex",
      alignItems:"center",
      justifyContent:"center",
    };
    return (
      <div style={isMobile ? m.card : d.card}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={isMobile ? m.cName : d.cName}>{item.name}</div>
          {item.description && <div style={isMobile ? m.cDesc : d.cDesc}>{item.description}</div>}
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center", marginTop:8 }}>
            <span style={statusStyle}>
              {item.status}
            </span>
            {(item.qty || item.unit) && (
              <span style={infoChipStyle}>
                {[item.qty, item.unit].filter(Boolean).join(" ")}
              </span>
            )}
            {(item.room || item.box) && (
              <span style={locationChipStyle}>
                {[item.room, item.box].filter(Boolean).join(" › ")}
              </span>
            )}
          </div>
          {sc !== undefined && isFinite(sc) && (
            <div style={{ marginTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:10, color:"#8b949e", letterSpacing:"0.5px", textTransform:"uppercase", fontFamily:INPUT_FF }}>
                  Match
                </span>
                <span style={{ fontSize:11, color: matchColor(sc), fontFamily:INPUT_FF }}>
                  {(sc*100).toFixed(1)}% {matchLabel(sc)}
                </span>
              </div>
              <div style={{ height:5, background:"rgba(67, 72, 75, 0.48)", borderRadius:999, overflow:"hidden", marginBottom:2 }}>
                <div style={{
                  height:"100%", width:\`\${Math.max(0,Math.min(100,sc*100)).toFixed(1)}%\`,
                  borderRadius:999,
                  background: sc>0.75 ? "linear-gradient(90deg,#60a5fa,#c084fc)" : sc>0.50 ? "linear-gradient(90deg,#818cf8,#a78bfa)" : "#64748b",
                  transition:"width 0.4s ease",
                  boxShadow: sc>0.5 ? "0 0 12px rgba(96, 165, 250, 0.28)" : "none"
                }} />
              </div>
            </div>
          )}
        </div>
        {deleteChoiceOpen ? (
          <div style={{ display:"flex", flexDirection:"column", gap:6, alignSelf:"flex-start", flexShrink:0 }}>
            <button
              style={{
                ...deleteBtnBase,
                padding:"0 10px",
                background:"rgba(67, 72, 75, 0.72)",
                border:"1px solid rgba(255, 255, 255, 0.06)",
                color:"#f8fafc",
                fontSize:11,
                boxShadow:"inset 0 1px 0 rgba(255, 255, 255, 0.03)",
              }}
              onClick={() => handleDeleteCardAction(item, "one")}
            >
              Delete 1
            </button>
            <button
              style={{
                ...deleteBtnBase,
                padding:"0 10px",
                background:"rgba(127, 29, 29, 0.38)",
                border:"1px solid rgba(248, 113, 113, 0.28)",
                color:"#fecaca",
                fontSize:11,
                boxShadow:"0 10px 24px rgba(127, 29, 29, 0.16)",
              }}
              onClick={() => handleDeleteCardAction(item, "all")}
            >
              Delete all
            </button>
          </div>
        ) : (
          <button
            style={{
              ...deleteBtnBase,
              alignSelf:"flex-start",
              padding: deletePending ? "0 11px" : "0 10px",
              background: deletePending ? "rgba(127, 29, 29, 0.38)" : "rgba(67, 72, 75, 0.62)",
              border: deletePending ? "1px solid rgba(248, 113, 113, 0.34)" : "1px solid rgba(255, 255, 255, 0.06)",
              color: deletePending ? "#fecaca" : "#8b949e",
              fontSize: isMobile ? 18 : 13,
              boxShadow: deletePending ? "0 10px 24px rgba(127, 29, 29, 0.18)" : "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
              flexShrink:0,
            }}
            onClick={() => {
              if (deletePending) {
                handleDelete(item.id);
                clearPendingDeleteState();
              } else {
                handleDeleteCardPrompt(item);
              }
            }}
            onMouseEnter={e => { if (!deletePending) { e.currentTarget.style.color="#f8fafc"; e.currentTarget.style.background="rgba(87, 92, 95, 0.72)"; }}}
            onMouseLeave={e => { if (!deletePending) { e.currentTarget.style.color="#8b949e"; e.currentTarget.style.background="rgba(67, 72, 75, 0.62)"; }}}
          >{hasMultipleQty ? "×" : deletePending ? "Delete" : "×"}</button>
        )}
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

  const AssistantReplyCard = ({ compact = false }) => assistantReply ? (
    <div
      style={{
        ...(compact ? m.assistantCard : d.assistantCard),
        animation: assistantReplyPhase === "dissolving"
          ? "dissolveOut 1.2s ease forwards"
          : "fadeIn 0.22s ease",
      }}
    >
      <div style={compact ? m.assistantCardHeader : d.assistantCardHeader}>
        <div style={compact ? m.assistantBadge : d.assistantBadge}>
          <div style={compact ? m.assistantBadgeDot : d.assistantBadgeDot} />
          <span>Assistant</span>
        </div>
        <div style={compact ? m.assistantMeta : d.assistantMeta}>
          <span>{assistantReplySourceLabel}</span>
          <span style={{ color: assistantReplyIntentTone, textTransform:"uppercase" }}>
            {assistantReply.intent}
          </span>
        </div>
      </div>
      <div style={compact ? m.assistantBody : d.assistantBody}>{assistantReply.dialogue}</div>
      {assistantReply.rawText && (
        <div style={compact ? m.assistantRequest : d.assistantRequest}>
          {assistantReply.rawText}
        </div>
      )}
    </div>
  ) : null;

  const voiceStatusLabel = voiceStatus === "recording"
    ? (voiceDraft.trim() ? "Listening… live transcript is updating below" : "Listening… speak now")
    : voiceStatus === "processing"
      ? "Transcribing and sending to the assistant…"
      : voiceMode === "native"
        ? "Tap the mic to record a command or type below."
        : "Voice recording is disabled here. Use the typed backup instead.";
  const voiceMeterLevel = Math.max(0, Math.min(1, (voiceLevel + 2) / 12));

  const handleVoiceToggle = () => {
    if (voiceBusy && voiceStatus !== "recording") return;
    if (modelStatus !== "ready") {
      triggerVoiceError("Model still loading, please wait");
      return;
    }
    if (!voiceSupportsMic) {
      triggerVoiceError("Voice recording requires a development build. Use the backup text box instead.");
      return;
    }
    voiceTabCancelRef.current = false;
    setVoiceError(null);
    if (voiceStatus === "recording") {
      setVoiceStatus("processing");
      setVoiceLevel(-2);
      postNativeMessage({ type: "voice/stop" });
      return;
    }
    setVoiceDraft("");
    setVoiceStatus("recording");
    setVoiceLevel(-2);
    postNativeMessage({ type: "voice/start" });
  };

  const handleVoiceTogglePress = (event) => {
    if (event?.preventDefault) event.preventDefault();
    handleVoiceToggle();
  };

  const handleVoiceTypedSubmit = async () => {
    await submitNaturalLanguageCommand(voiceDraft, "text", "voice");
  };

  const renderVoicePanel = (compact = false) => {
    const commandReady = modelStatus === "ready";
    const micDisabled = !commandReady || !voiceSupportsMic || (voiceBusy && voiceStatus !== "recording");
    const styles = compact ? m : d;
    const panelStyle = compact ? { ...m.voicePanel, animation: voiceShake ? "shakeX 0.3s ease" : "none" } : { ...d.voicePanel, animation: voiceShake ? "shakeX 0.3s ease" : "none" };

    return (
      <div style={panelStyle}>
        <div style={styles.voiceHeader}>
          <div style={styles.voiceBadge}>
            {renderVoiceMark(compact)}
            <span>Voice</span>
          </div>
          <div style={styles.voiceHint}>{voiceMode === "native" ? "Live mic" : "Typed backup"}</div>
        </div>
        <div style={styles.voiceComposer}>
          <textarea
            className="glass-input"
            style={styles.voiceInput}
            placeholder={'Try: "add a hammer to the garage" or "where is my hammer"'}
            value={voiceDraft}
            onChange={e => {
              setVoiceDraft(e.target.value);
              if (voiceError) setVoiceError(null);
            }}
            disabled={voiceStatus === "recording" || voiceStatus === "processing"}
          />

          <div style={styles.voiceMetaRow}>
            <span style={styles.voiceMetaText}>{voiceStatusLabel}</span>
            <button
              style={styles.voiceSendBtn(voiceBusy || !voiceDraft.trim() || !commandReady)}
              onClick={handleVoiceTypedSubmit}
              disabled={voiceBusy || !voiceDraft.trim() || !commandReady}
            >
              Send Typed Command
            </button>
          </div>
        </div>

        {voiceError && <div style={styles.voiceError}>{voiceError}</div>}

        <div style={styles.voiceInfoCard}>
          <div style={styles.voiceInfoBody}>
            {voiceSupportsMic
              ? "Press once to start recording. Press again to stop and auto-submit."
              : "Expo Go and unsupported builds keep the typed fallback, but microphone recording is disabled."}
          </div>
          {!commandReady && (
            <div style={styles.voiceWarning}>
              The embedding model is still loading. Voice commands unlock once initialization completes.
            </div>
          )}
          {voiceSupportsMic && (
            <div>
              <div style={styles.voiceMeterHeader}>
                <span>Mic input</span>
                <span>{voiceStatus === "recording" ? (voiceMeterLevel > 0.08 ? "Hearing audio" : "Waiting for speech") : "Idle"}</span>
              </div>
              <div style={styles.voiceMeterTrack}>
                <div style={{
                  ...styles.voiceMeterFill(voiceStatus === "recording"),
                  width:\`\${Math.max(8, voiceMeterLevel * 100)}%\`,
                }} />
              </div>
            </div>
          )}
        </div>

        <div style={styles.voiceDebugCard}>
          <div style={styles.voiceDebugLabel}>Voice Debug</div>
          <div style={styles.voiceDebugGrid}>
            <div style={styles.voiceDebugStat}>Mode: <span style={styles.voiceDebugStatValue}>{voiceMode}</span></div>
            <div style={styles.voiceDebugStat}>Status: <span style={styles.voiceDebugStatValue}>{voiceStatus}</span></div>
            <div style={styles.voiceDebugStat}>Level: <span style={styles.voiceDebugStatValue}>{voiceLevel.toFixed(1)}</span></div>
          </div>
          <div style={styles.voiceDebugLog}>
            {voiceDebugEvents.length === 0
              ? "No native voice events received yet."
              : voiceDebugEvents.map(entry => (
                <div key={entry.id}>
                  <span style={styles.voiceDebugEvent}>{entry.event}</span>
                  {entry.detail ? ": " + entry.detail : ""}
                </div>
              ))}
          </div>
        </div>

        <div style={styles.voiceMicWrap}>
          <button
            className={voiceStatus === "recording" ? "glow-active" : ""}
            style={styles.voiceMicBtn(voiceStatus, micDisabled)}
            onPointerUp={handleVoiceTogglePress}
            disabled={micDisabled}
            title={voiceSupportsMic ? "Toggle microphone recording" : "Voice not supported on this build"}
          >
            {voiceStatus === "processing"
              ? <div className="spin" />
              : (
                <div style={styles.voiceMicIcon}>
                  {renderVoiceMark(compact)}
                </div>
              )}
          </button>
          <div style={styles.voiceMicLabel}>
            {voiceStatus === "recording" ? "Tap to stop and submit" : "Tap to start recording"}
          </div>
        </div>
      </div>
    );
  };

  const renderReviewMark = (compact = false) => (
    <svg
      width={compact ? 18 : 20}
      height={compact ? 18 : 20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M9 11l3 3L22 4" stroke="#f8fafc" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#60a5fa" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ReviewRow = ({ item, onUpdate, onRemove, compact = false }) => {
    const [localName, setLocalName] = React.useState(item.name);
    const [localQty,  setLocalQty]  = React.useState(item.qty);
    return (
      <div className="glass-card" style={{
        borderRadius: 12,
        padding: compact ? "8px 10px" : 14,
        display: "flex",
        gap: 10,
        alignItems: "center",
        background: "rgba(23, 27, 32, 0.96)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}>
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          <input
            className="glass-input"
            style={{
              flex: 2,
              borderRadius: 10,
              padding: compact ? "7px 10px" : "10px 12px",
              color: "#f8fafc",
              fontSize: compact ? 13 : 14,
              fontFamily: INPUT_FF,
              background: "rgba(67, 72, 75, 0.35)",
            }}
            value={localName}
            onChange={e => setLocalName(e.target.value)}
            onBlur={() => onUpdate(item.id, "name", localName)}
            placeholder="Item name"
          />
          <input
            className="glass-input"
            style={{
              width: compact ? 56 : 64,
              borderRadius: 10,
              padding: compact ? "7px 8px" : "10px 12px",
              color: "#f8fafc",
              fontSize: 14,
              textAlign: "center",
              fontFamily: INPUT_FF,
              background: "rgba(67, 72, 75, 0.35)",
            }}
            value={localQty}
            onChange={e => setLocalQty(e.target.value)}
            onBlur={() => onUpdate(item.id, "qty", localQty)}
            placeholder="Qty"
            type="number"
            min={1}
          />
        </div>
        <button
          className="glass-btn-secondary"
          style={{
            padding: compact ? "7px 10px" : "10px 12px",
            borderRadius: 10,
            color: "#f87171",
            border: "1px solid rgba(248, 113, 113, 0.3)",
            cursor: "pointer",
            background: "rgba(127, 29, 29, 0.2)",
            flexShrink: 0,
          }}
          onClick={() => onRemove(item.id)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  };

  const renderReviewPanel = (compact = false) => {
    const reviewRoom = reviewItems[0]?.room || "";
    const reviewBox  = reviewItems[0]?.box  || "";
    const reviewLocation = [reviewRoom, reviewBox].filter(Boolean).join(" › ");
    const styles = compact ? m : d;
    const panelStyle = compact
      ? { display:"flex", flexDirection:"column", gap:10, flex:1, minHeight:0 }
      : { ...d.voicePanel, animation: "none" };

    return (
      <div style={panelStyle}>
        {/* Header with badge */}
        <div style={styles.voiceHeader}>
          <div style={styles.voiceBadge}>
            {renderReviewMark(compact)}
            <span>Review</span>
          </div>
          <div style={styles.voiceHint}>{reviewItems.length} detected</div>
        </div>

        {/* Location info card */}
        <div style={styles.voiceComposer}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(96, 165, 250, 0.12)",
            border: "1px solid rgba(96, 165, 250, 0.18)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
              <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ fontSize: 13, color: "#bfdbfe", fontFamily: INPUT_FF }}>
              {reviewLocation || "Unassigned"}
            </span>
          </div>
        </div>

        {/* Items list */}
        {reviewItems.length === 0 ? (
          <div style={styles.voiceInfoCard}>
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ transform: "scale(1.5)", opacity: 0.5, marginBottom: 16 }}>{renderReviewMark(compact)}</div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 16, fontFamily: INPUT_FF }}>Nothing to store</div>
              <button
                style={styles.voiceSendBtn(false)}
                onClick={() => setActiveTab("camera")}
              >
                Retake Photo
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              ...styles.voiceInfoCard,
              ...(compact ? { flex:1, minHeight:0 } : { maxHeight:400 }),
              overflowY: "auto",
            }}>
              <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: INPUT_FF }}>
                Edit detected items
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reviewItems.map(item => (
                  <ReviewRow key={item.id} item={item} onUpdate={handleReviewUpdate} onRemove={handleReviewRemove} compact={compact} />
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ ...styles.voiceMicWrap, marginTop: compact ? 0 : "auto" }}>
              <button
                className="glass-btn glow-cyan"
                style={{
                  ...styles.voiceMicBtn("idle", seeding),
                  width: "100%",
                  maxWidth: compact ? 280 : 320,
                  height: compact ? 48 : 64,
                  minHeight: compact ? 48 : 64,
                  borderRadius: 16,
                }}
                disabled={seeding}
                onClick={handleReviewConfirm}
              >
                {seeding ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="spin" style={{ width: 20, height: 20 }} />
                    <span>Storing…</span>
                  </div>
                ) : (
                  \`Store All (\${reviewItems.length})\`
                )}
              </button>

              <button
                className="glass-btn-secondary"
                style={{
                  width: "100%",
                  maxWidth: compact ? 280 : 320,
                  padding: compact ? "10px" : "12px",
                  borderRadius: 12,
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  background: "rgba(30, 41, 59, 0.5)",
                  color: "#94a3b8",
                  fontSize: 13,
                  fontFamily: INPUT_FF,
                  cursor: "pointer",
                }}
                onClick={handleReviewCancel}
                disabled={seeding}
              >
                Cancel / Retake
              </button>
            </div>
          </>
        )}
      </div>
    );
  };


  const renderCameraMark = (compact = false) => (
    <svg
      width={compact ? 18 : 20}
      height={compact ? 18 : 20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4.5 8.5h3l1.5-2h6l1.5 2h3a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-8A1.5 1.5 0 0 1 4.5 8.5Z" stroke="#f8fafc" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="3.5" stroke="#60a5fa" strokeWidth="1.9" />
    </svg>
  );

  const renderCameraPanel = (compact = false) => {
    const canCapture = Boolean(cameraStream) && !cameraLoading;
    const cameraReady = cameraAvailable && cameraMode !== "checking";
    const showFlipCamera = Boolean(cameraStream) && !cameraCapture && !cameraLoading && !cameraSwitching;
    const previewStyle = compact ? m.cameraPreview : d.cameraPreview;
    const selectStyle = compact ? m.inp : d.sel;
    const styles = compact ? m : d;
    const panelStyle = compact ? { ...m.voicePanel, animation: "none" } : { ...d.voicePanel, animation: "none" };
    const cameraStatusLabel = cameraMode === "checking"
      ? "Checking camera support..."
      : cameraStream
        ? "Camera active — capture when ready"
        : cameraAvailable
          ? "Open the camera, capture an image, then send it to CV."
          : "This build cannot grant WebView camera access.";

    return (
      <div style={panelStyle}>
        {/* Header with badge */}
        <div style={styles.voiceHeader}>
          <div style={styles.voiceBadge}>
            {renderCameraMark(compact)}
            <span>Camera</span>
          </div>
          <div style={styles.voiceHint}>{cameraAvailable ? "Live capture" : "Unavailable"}</div>
        </div>

        {/* Location composer */}
        <div style={styles.voiceComposer}>
          <div style={compact ? m.cameraGrid : d.cameraGrid}>
            <select
              className="glass-input"
              style={selectStyle}
              value={cameraRoom}
              onChange={e => {
                setCameraRoom(prettyLabel(e.target.value));
                setCameraBox("");
              }}
              disabled={cameraLoading}
            >
              {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
            </select>
            <select
              className="glass-input"
              style={selectStyle}
              value={cameraBox}
              onChange={e => setCameraBox(e.target.value)}
              disabled={cameraLoading}
            >
              <option value="">No box</option>
              {cameraBoxes.map(box => <option key={box} value={box}>{box}</option>)}
            </select>
          </div>

          <div style={styles.voiceMetaRow}>
            <span style={styles.voiceMetaText}>{cameraStatusLabel}</span>
            {!cameraCapture && !cameraStream && (
              <button
                style={styles.voiceSendBtn(cameraLoading || !cameraReady)}
                onClick={() => handleOpenCamera()}
                disabled={cameraLoading || !cameraReady}
              >
                Open Camera
              </button>
            )}
            {cameraCapture && (
              <button
                style={styles.voiceSendBtn(cameraLoading)}
                onClick={handleRetake}
                disabled={cameraLoading}
              >
                Retake
              </button>
            )}
          </div>
        </div>

        {/* Camera error */}
        {cameraError && (
          <div style={styles.voiceError}>
            {cameraError}
          </div>
        )}

        {/* Preview card */}
        <div style={styles.voiceInfoCard}>
          <div style={previewStyle}>
            {!cameraCapture ? (
              cameraStream ? (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    style={compact ? m.cameraMedia : d.cameraMedia}
                  />
                  {cameraSwitching && (
                    <div style={compact ? m.cameraTransitionMask : d.cameraTransitionMask} />
                  )}
                  {showFlipCamera && (
                    <button
                      className="glass-btn-secondary"
                      style={compact ? m.cameraFlipBtn : d.cameraFlipBtn}
                      onClick={handleFlipCamera}
                      disabled={cameraLoading || cameraSwitching}
                      title={cameraFacing === "environment" ? "Rear camera active" : "Front camera active"}
                    >
                      {cameraFacing === "environment" ? "↺ Rear" : "↺ Front"}
                    </button>
                  )}
                </>
              ) : cameraSwitching ? (
                <div style={compact ? m.cameraTransitionFill : d.cameraTransitionFill} />
              ) : (
                <div style={compact ? m.cameraPlaceholder : d.cameraPlaceholder}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ transform: "scale(1.8)", opacity: 0.6 }}>{renderCameraMark(compact)}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: INPUT_FF, textAlign: "center" }}>Room and box labels are applied to every detected item from this scan.</div>
                  </div>
                </div>
              )
            ) : (
              <img
                src={\`data:image/jpeg;base64,\${cameraCapture}\`}
                alt="Captured inventory preview"
                style={compact ? m.cameraMedia : d.cameraMedia}
              />
            )}
          </div>

          {/* Info text */}
          <div style={styles.voiceInfoBody}>
            {cameraAvailable
              ? "Point at items you want to catalog. The AI will detect and suggest item names automatically."
              : "Camera requires a development build. Expo Go and browser previews have limited camera access."}
          </div>

          {/* Camera status warning */}
          {!cameraReady && cameraMode !== "checking" && (
            <div style={styles.voiceWarning}>
              Camera permissions are required. Rebuild the native app if permissions were recently changed.
            </div>
          )}

          {/* Capture indicator when active */}
          {(cameraStream || cameraSwitching) && !cameraCapture && (
            <div>
              <div style={styles.voiceMeterHeader}>
                <span>Camera status</span>
                <span>{cameraSwitching ? "Switching..." : "Live preview active"}</span>
              </div>
              <div style={styles.voiceMeterTrack}>
                <div style={{
                  ...styles.voiceMeterFill(true),
                  width: cameraSwitching ? "60%" : "100%",
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Debug card */}
        <div style={styles.voiceDebugCard}>
          <div style={styles.voiceDebugLabel}>Camera Debug</div>
          <div style={styles.voiceDebugGrid}>
            <div style={styles.voiceDebugStat}>Mode: <span style={styles.voiceDebugStatValue}>{cameraMode}</span></div>
            <div style={styles.voiceDebugStat}>Available: <span style={styles.voiceDebugStatValue}>{cameraAvailable ? "yes" : "no"}</span></div>
            <div style={styles.voiceDebugStat}>Facing: <span style={styles.voiceDebugStatValue}>{cameraFacing}</span></div>
          </div>
        </div>

        {/* Capture button wrapper */}
        <div style={compact && !cameraCapture && (cameraStream || cameraSwitching) ? m.cameraFloatingCaptureWrap : styles.voiceMicWrap}>
          {!cameraCapture && (cameraStream || cameraSwitching) && (
            <button
              className={cameraSwitching ? "" : "glow-active"}
              style={{
                ...styles.voiceMicBtn(cameraSwitching ? "recording" : "idle", !canCapture || cameraSwitching),
                width: compact ? 96 : 112,
                height: compact ? 96 : 112,
                minWidth: compact ? 96 : 112,
                minHeight: compact ? 96 : 112,
              }}
              onClick={handleCapture}
              disabled={!canCapture || cameraSwitching}
            >
              {cameraSwitching ? (
                <div className="spin" />
              ) : (
                <div style={{ transform: "scale(2.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {renderCameraMark(compact)}
                </div>
              )}
            </button>
          )}
          {cameraCapture && cameraLoading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div className="spin" style={{ width: 40, height: 40 }} />
              <div style={{ fontSize: 11, color: "#8b949e", fontFamily: INPUT_FF }}>Sending to CV API...</div>
            </div>
          )}
          <div style={compact && !cameraCapture && (cameraStream || cameraSwitching) ? m.cameraFloatingCaptureLabel : styles.voiceMicLabel}>
            {cameraCapture
              ? cameraLoading
                ? "Processing..."
                : "Review detected items above"
              : cameraSwitching
                ? "Switching camera..."
                : cameraStream
                  ? "Tap to capture"
                  : "Open camera to start"}
          </div>
        </div>
      </div>
    );
  };


  const renderMobileNavIcon = (tabKey, active) => {
    const common = {
      width: 21,
      height: 21,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: active ? "#f8fafc" : "#8b949e",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: m.navSvg(active),
      "aria-hidden": "true",
    };

    switch (tabKey) {
      case "inventory":
        return (
          <svg {...common}>
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9.5V20h13V9.5" />
            <path d="M10 20v-6h4v6" />
          </svg>
        );
      case "search":
        return (
          <svg {...common}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
        );
      case "voice":
        return (
          <svg {...common}>
            <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-3a3.5 3.5 0 1 0-7 0v3A3.5 3.5 0 0 0 12 15Z" />
            <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0" />
            <path d="M12 17v3" />
          </svg>
        );
      case "camera":
        return (
          <svg {...common}>
            <path d="M4.5 8.5h3l1.5-2h6l1.5 2h3a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-8A1.5 1.5 0 0 1 4.5 8.5Z" />
            <circle cx="12" cy="14" r="3.5" />
          </svg>
        );
      case "settings":
        return (
          <svg {...common}>
            <circle cx="12" cy="12" r="2.5" />
            <path d="M19 12a7 7 0 0 0-.08-1l2.02-1.57-2-3.46-2.4.77a7.28 7.28 0 0 0-1.73-1L14.5 3h-5l-.31 2.74a7.28 7.28 0 0 0-1.73 1l-2.4-.77-2 3.46L5.08 11A7 7 0 0 0 5 12c0 .34.03.67.08 1l-2.02 1.57 2 3.46 2.4-.77c.53.43 1.11.77 1.73 1L9.5 21h5l.31-2.74c.62-.23 1.2-.57 1.73-1l2.4.77 2-3.46L18.92 13c.05-.33.08-.66.08-1Z" />
          </svg>
        );
      case "add":
        return (
          <svg {...common}>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderBrandMark = (compact = false) => (
    <svg
      width={compact ? 20 : 22}
      height={compact ? 20 : 22}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="7" height="7" rx="2.2" stroke="#f8fafc" strokeWidth="1.9" />
      <rect x="13" y="4" width="7" height="7" rx="2.2" stroke="#94a3b8" strokeWidth="1.9" />
      <rect x="4" y="13" width="7" height="7" rx="2.2" stroke="#60a5fa" strokeWidth="1.9" />
      <rect x="13" y="13" width="7" height="7" rx="2.2" stroke="#f8fafc" strokeWidth="1.9" />
    </svg>
  );

  const renderSearchMark = (compact = false) => (
    <svg
      width={compact ? 18 : 20}
      height={compact ? 18 : 20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="#f8fafc" strokeWidth="1.9" />
      <path d="m16 16 4 4" stroke="#60a5fa" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );

  const renderVoiceMark = (compact = false) => (
    <svg
      width={compact ? 18 : 20}
      height={compact ? 18 : 20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-3a3.5 3.5 0 1 0-7 0v3A3.5 3.5 0 0 0 12 15Z" stroke="#f8fafc" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0" stroke="#60a5fa" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M12 17v3" stroke="#60a5fa" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );

  // ── MOBILE layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    const mobileTabs = [
      { key: "inventory", label: "Inventory" },
      { key: "search",    label: "Search" },
      { key: "voice",     label: "Voice" },
      { key: "camera",    label: "Camera" },
      { key: "settings",  label: "Settings" },
      { key: "add",       label: "Add" },
    ];

    return (
      <div style={m.root}>
        {/* Glass Header */}
        <div style={m.header}>
          <div style={m.logo}>{renderBrandMark(true)}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={m.title}>VectorStore</div>
            <div style={m.subtitle}>SEMANTIC INVENTORY</div>
          </div>
          <div style={m.headerMeta}>
            <div style={m.badge}>{inventory.length}</div>
            <div style={m.headerStatus} title={modelStatus}>
              <div style={m.modelDot(modelStatus)} />
            </div>
          </div>
        </div>

        {/* Progress banners */}
        <ProgressBanner />
        <AssistantReplyCard compact />

        {/* Error */}
        {error && (
          <div className="glass" style={m.error}>
            ⚠ {error}
            <span style={{ opacity:0.6, marginLeft:8, cursor:"pointer" }} onClick={() => setError(null)}>×</span>
          </div>
        )}

        {/* Content */}
        <div ref={mobileContentRef} style={m.content} onScroll={handleTabContentScroll}>

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
                <>
                  {showRoomFilters && (
                    <div style={m.filterRow}>
                      <button
                        className={filterRoom === "all" ? "glass-btn" : "glass-btn-secondary"}
                        style={m.filterPill(filterRoom === "all")}
                        onClick={() => handleRoomFilterSelect("all")}
                      >
                        All
                      </button>
                      {roomsWithItems.map(room => (
                        <button
                          key={room}
                          className={filterRoom === room ? "glass-btn" : "glass-btn-secondary"}
                          style={m.filterPill(filterRoom === room)}
                          onClick={() => handleRoomFilterSelect(room)}
                        >
                          {room} ({roomCounts[normalizeLabel(room).toLowerCase()] || 0})
                        </button>
                      ))}
                    </div>
                  )}
                  {showBoxFilter && (
                    <div style={m.filterRow}>
                      <button
                        className={filterBox === "all" ? "glass-btn" : "glass-btn-secondary"}
                        style={m.filterPill(filterBox === "all")}
                        onClick={() => setFilterBox("all")}
                      >
                        All
                      </button>
                      {boxesInRoom.map(box => (
                        <button
                          key={box}
                          className={filterBox === box ? "glass-btn" : "glass-btn-secondary"}
                          style={m.filterPill(filterBox === box)}
                          onClick={() => setFilterBox(box)}
                        >
                          {box}
                        </button>
                      ))}
                    </div>
                  )}
                  {isInventoryFilterActive && (
                    <div style={{ color:"#94a3b8", fontSize:12, padding:"0 2px 2px" }}>
                      {\`Showing \${filteredInventory.length} of \${inventory.length} items · \${filterSummaryLabel}\`}
                    </div>
                  )}
                  {filteredInventory.length === 0 && isInventoryFilterActive ? (
                    <div style={m.empty}>
                      <div style={{ fontSize:44, marginBottom:10 }}>📦</div>
                      <div style={{ color:"#64748b", fontSize:14 }}>
                        {\`No items in \${filterSummaryLabel}\`}
                      </div>
                    </div>
                  ) : (
                    filteredInventory.map(item => <ItemCard key={item.id} item={item} />)
                  )}
                </>
              )}
            </>
          )}

          {/* ── Search tab ── */}
          {activeTab === "search" && (
            <>
              <div style={m.searchBox}>
                <div style={m.searchHeader}>
                  <div style={m.searchBadge}>
                    {renderSearchMark(true)}
                    <span>Search</span>
                  </div>
                  <div style={m.searchHint}>Top {topK}</div>
                </div>
                <div style={m.searchCard}>
                  <textarea
                    className="glass-input"
                    style={m.searchInput}
                    rows={3}
                    placeholder={\`Try: "something to clean dishes"\\n"tools for home repair"\`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    disabled={modelStatus !== "ready"}
                  />
                  <div style={m.searchMetaRow}>
                    <span style={m.searchMetaText}>
                      {inventory.length ? (inventory.length + " indexed items") : "Inventory is empty"}
                    </span>
                    <button
                      style={m.searchActionBtn(busy || !inventory.length || modelStatus !== "ready")}
                      disabled={busy || !inventory.length || modelStatus !== "ready"}
                      onClick={() => handleSearch()}
                    >
                      {loading.search ? "Searching…" : "Run Search"}
                    </button>
                  </div>
                </div>
              </div>

              {loading.search && (
                <div style={m.searchStateCard}>
                  <div style={m.searchStateHeader}>
                    <div style={m.searchStateBadge}>
                      <div className="spin" />
                      <span>Searching</span>
                    </div>
                  </div>
                  <div style={m.searchStateBody}>Computing similarity across {inventory.length} vectors…</div>
                </div>
              )}

              {!loading.search && results !== null && results.length === 0 && (
                <div style={m.searchStateCard}>
                  <div style={m.searchStateHeader}>
                    <div style={m.searchStateBadge}>
                      {renderSearchMark(true)}
                      <span>No matches</span>
                    </div>
                  </div>
                  <div style={m.searchStateBody}>No results found for this search.</div>
                  <div style={m.searchStateSub}>Try broader wording or add a room or box hint.</div>
                </div>
              )}

              {!loading.search && results === null && (
                <div style={m.searchStateCard}>
                  <div style={m.searchStateHeader}>
                    <div style={m.searchStateBadge}>
                      {renderSearchMark(true)}
                      <span>Ready</span>
                    </div>
                  </div>
                  <div style={m.searchStateBody}>Search your inventory</div>
                  <div style={m.searchStateSub}>Describe what you are looking for in plain language.</div>
                </div>
              )}

              {!loading.search && results !== null && results.map(item => <ItemCard key={item.id} item={item} />)}
            </>
          )}

          {/* ── Voice tab ── */}
          {activeTab === "voice" && (
            renderVoicePanel(true)
          )}

          {/* ── Camera tab ── */}
          {activeTab === "camera" && (
            renderCameraPanel(true)
          )}

          {/* ── Review tab ── */}
          {activeTab === "review" && (
            renderReviewPanel(true)
          )}

          {/* ── Settings tab ── */}
          {activeTab === "settings" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {/* Header with badge */}
              <div style={m.searchHeader}>
                <div style={m.searchBadge}>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="2.5" stroke="#f8fafc" strokeWidth="1.9"/>
                    <path d="M19 12a7 7 0 0 0-.08-1l2.02-1.57-2-3.46-2.4.77a7.28 7.28 0 0 0-1.73-1L14.5 3h-5l-.31 2.74a7.28 7.28 0 0 0-1.73 1l-2.4-.77-2 3.46L5.08 11A7 7 0 0 0 5 12c0 .34.03.67.08 1l-2.02 1.57 2 3.46 2.4-.77c.53.43 1.11.77 1.73 1L9.5 21h5l.31-2.74c.62-.23 1.2-.57 1.73-1l2.4.77 2-3.46L18.92 13c.05-.33.08-.66.08-1Z" stroke="#60a5fa" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Settings</span>
                </div>
                <div style={m.searchHint}>{inventory.length} items</div>
              </div>

              {/* Model & Status Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Model & Status</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                    <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Embedding Model</span>
                    <span style={{ fontSize:12, color:"#e2e8f0", fontFamily:INPUT_FF }}>{EMBEDDING_MODEL}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                    <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Status</span>
                    <span style={{
                      fontSize:12,
                      color: modelStatus === "ready" ? "#34d399" : modelStatus === "error" ? "#f87171" : "#22d3ee",
                      fontFamily:INPUT_FF,
                      fontWeight:600
                    }}>
                      {modelStatus}
                    </span>
                  </div>
                  {ttsSupported && (
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginTop:4 }}>
                      <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Spoken Voice Replies</span>
                      <button
                        className={ttsEnabled ? "glass-btn" : "glass-btn-secondary"}
                        style={{
                          minHeight:32,
                          padding:"0 14px",
                          borderRadius:16,
                          fontSize:11,
                          fontWeight:600,
                          fontFamily:INPUT_FF,
                          color: ttsEnabled ? "#22d3ee" : "#94a3b8",
                          border: ttsEnabled ? "1px solid rgba(34, 211, 238, 0.35)" : "1px solid rgba(148, 163, 184, 0.2)",
                          cursor:"pointer",
                          background: ttsEnabled ? "rgba(34, 211, 238, 0.12)" : "rgba(30, 41, 59, 0.5)"
                        }}
                        onClick={() => setTtsEnabled(v => !v)}
                      >
                        {ttsEnabled ? "On" : "Off"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Settings Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Search Settings</div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Top K Results</span>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(inventory.length, 1)}
                    className="glass-input"
                    style={{ ...m.inp, width:80, textAlign:"center" }}
                    value={topK}
                    onChange={e => setTopK(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                </div>
              </div>

              {/* Default Room Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Default Room</div>
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
              </div>

              {/* Add Room Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Add New Room</div>
                <div style={{ display:"flex", gap:8 }}>
                  <input
                    className="glass-input"
                    style={{ ...m.inp, flex:1 }}
                    placeholder="Room name"
                    value={roomForm}
                    onChange={e => setRoomForm(e.target.value)}
                  />
                  <button
                    className="glass-btn"
                    style={m.searchActionBtn(false)}
                    onClick={handleAddRoom}
                  >
                    Add Room
                  </button>
                </div>
              </div>

              {/* Add Box Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Add New Box</div>
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
                    className="glass-btn"
                    style={m.searchActionBtn(false)}
                    onClick={handleAddBox}
                  >
                    Add Box
                  </button>
                </div>
              </div>

              {/* Move Box Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Move Box Between Rooms</div>
                <div style={{ fontSize:11, color:"#64748b", lineHeight:1.6, fontFamily:INPUT_FF }}>
                  Move updates every item currently inside that box.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>From Room</span>
                  <select
                    className="glass-input"
                    style={m.inp}
                    value={boxMove.fromRoom}
                    onChange={e => setBoxMove(prev => ({ ...prev, fromRoom: prettyLabel(e.target.value), box: "" }))}
                  >
                    {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
                  </select>
                  <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Box</span>
                  <select
                    className="glass-input"
                    style={m.inp}
                    value={boxMove.box}
                    onChange={e => setBoxMove(prev => ({ ...prev, box: e.target.value }))}
                  >
                    <option value="">Select box in room</option>
                    {moveBoxes.map(box => <option key={box} value={box}>{box}</option>)}
                  </select>
                  <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>To Room</span>
                  <select
                    className="glass-input"
                    style={m.inp}
                    value={boxMove.toRoom}
                    onChange={e => setBoxMove(prev => ({ ...prev, toRoom: prettyLabel(e.target.value) }))}
                  >
                    {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
                  </select>
                  <div style={{ fontSize:11, color: moveReady ? "#67e8f9" : "#64748b", lineHeight:1.6, fontFamily:INPUT_FF, marginTop:4 }}>
                    {moveSummary}
                  </div>
                  <button
                    className="glass-btn"
                    style={{
                      ...m.searchActionBtn(!moveReady),
                      marginTop:4
                    }}
                    onClick={handleMoveBox}
                    disabled={!moveReady}
                  >
                    Move Box Now
                  </button>
                </div>
              </div>

              {/* Data Management Card */}
              <div style={m.searchCard}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(34, 211, 238, 0.14)", border:"1px solid rgba(34, 211, 238, 0.22)", boxShadow:"0 10px 24px rgba(34, 211, 238, 0.08)" }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="1.8">
                        <path d="M12 3v18" strokeLinecap="round" />
                        <path d="M5 8h14" strokeLinecap="round" />
                        <path d="M7 13h10" strokeLinecap="round" />
                        <path d="M9 18h6" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Data Management</div>
                      <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6, fontFamily:INPUT_FF }}>Export your inventory or restore a backup with merge and replace modes.</div>
                    </div>
                  </div>
                  <div style={{ minWidth:72, padding:"8px 10px", borderRadius:14, background:"rgba(15, 23, 42, 0.72)", border:"1px solid rgba(148, 163, 184, 0.12)", textAlign:"center", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.7px", fontFamily:INPUT_FF }}>Stored</div>
                    <div style={{ fontSize:16, color:"#f8fafc", fontWeight:700, fontFamily:INPUT_FF, marginTop:2 }}>{inventory.length}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, padding:"12px 14px", borderRadius:16, background:"rgba(15, 23, 42, 0.6)", border:"1px solid rgba(148, 163, 184, 0.1)" }}>
                    <div>
                      <div style={{ fontSize:12, color:"#cbd5e1", fontFamily:INPUT_FF, fontWeight:600 }}>Inventory backup</div>
                      <div style={{ fontSize:11, color:"#64748b", lineHeight:1.6, fontFamily:INPUT_FF, marginTop:3 }}>Download the current local store as JSON for safekeeping or migration.</div>
                    </div>
                    <button
                      className="glass-btn-secondary"
                      style={{ ...m.btn("default"), minWidth:132, color:"#67e8f9", border:"1px solid rgba(34, 211, 238, 0.35)" }}
                      onClick={handleExport}
                    >
                      Export
                    </button>
                  </div>
                  <div style={{ padding:"12px 14px", borderRadius:16, background:"rgba(15, 23, 42, 0.6)", border:"1px solid rgba(148, 163, 184, 0.1)", display:"flex", flexDirection:"column", gap:10 }}>
                    <div>
                      <div style={{ fontSize:12, color:"#cbd5e1", fontFamily:INPUT_FF, fontWeight:600 }}>Restore from backup</div>
                      <div style={{ fontSize:11, color:"#64748b", lineHeight:1.6, fontFamily:INPUT_FF, marginTop:3 }}>Choose how imported data should be applied before selecting a backup file.</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <button
                      className={importMode === "merge" ? "glass-btn" : "glass-btn-secondary"}
                      style={{ ...m.btn("default"), minHeight:40, color: importMode === "merge" ? "#e2e8f0" : "#94a3b8" }}
                      onClick={() => setImportMode("merge")}
                    >
                      Merge
                    </button>
                    <button
                      className={importMode === "replace" ? "glass-btn" : "glass-btn-secondary"}
                      style={{ ...m.btn("default"), minHeight:40, color: importMode === "replace" ? "#e2e8f0" : "#94a3b8" }}
                      onClick={() => setImportMode("replace")}
                    >
                      Replace
                    </button>
                    </div>
                    <label
                      className="glass-btn-secondary"
                      style={{
                        ...m.btn("default"),
                        minHeight:42,
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        color:"#67e8f9",
                        border:"1px solid rgba(34, 211, 238, 0.35)",
                        opacity: seeding ? 0.45 : 1,
                        cursor: seeding ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="file"
                        accept=".json,application/json"
                        style={{ display:"none" }}
                        disabled={seeding}
                        onChange={handleImportFileSelect}
                      />
                      Import from Backup
                    </label>
                  </div>
                </div>
              </div>

              {/* Clear Room Card */}
              <div style={m.searchCard}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(251, 191, 36, 0.12)", border:"1px solid rgba(251, 191, 36, 0.18)" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8">
                      <path d="M4 7h16" strokeLinecap="round" />
                      <path d="M9 7V5h6v2" strokeLinecap="round" />
                      <path d="M7 7l1 11a2 2 0 002 2h4a2 2 0 002-2l1-11" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Clear Room</div>
                    <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6, fontFamily:INPUT_FF }}>Remove every stored item assigned to a selected room in one action.</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"12px 14px", borderRadius:16, background:"rgba(15, 23, 42, 0.6)", border:"1px solid rgba(148, 163, 184, 0.1)" }}>
                  <div style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Target room</div>
                  <select
                    className="glass-input"
                    style={m.inp}
                    value={clearRoomTarget}
                    onChange={e => setClearRoomTarget(e.target.value)}
                  >
                    <option value="">Select room</option>
                    {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
                  </select>
                  <button
                    className="glass-btn-secondary"
                    style={{ ...m.btn("default"), minHeight:42, color:"#f87171", border:"1px solid rgba(248, 113, 113, 0.35)", opacity: clearRoomTarget ? 1 : 0.45, cursor: clearRoomTarget ? "pointer" : "not-allowed" }}
                    onClick={handleClearRoom}
                    disabled={!clearRoomTarget}
                  >
                    Clear Selected Room
                  </button>
                </div>
              </div>

              {/* Clear All Card */}
              <div style={m.searchCard}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(248, 113, 113, 0.12)", border:"1px solid rgba(248, 113, 113, 0.22)", boxShadow:"0 10px 24px rgba(248, 113, 113, 0.08)" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8">
                      <path d="M12 9v4" strokeLinecap="round" />
                      <path d="M12 17h.01" strokeLinecap="round" />
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Danger Zone</div>
                    <div style={{ fontSize:12, color:"#fca5a5", lineHeight:1.6, fontFamily:INPUT_FF }}>This permanently removes every stored item and resets the local inventory state.</div>
                  </div>
                </div>
                <div style={{ padding:"12px 14px", borderRadius:16, background:"rgba(127, 29, 29, 0.18)", border:"1px solid rgba(248, 113, 113, 0.18)", display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ fontSize:11, color:"#fda4af", lineHeight:1.6, fontFamily:INPUT_FF }}>
                    Use only when you need a complete reset. This action cannot be undone from inside the app.
                  </div>
                  <button
                    className="glass-btn-secondary"
                    style={{ ...m.btn("default"), minHeight:42, color:"#f87171", border:"1px solid rgba(248, 113, 113, 0.35)", background:"rgba(127, 29, 29, 0.28)" }}
                    onClick={handleClearAllData}
                  >
                    Clear All Stored Items
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Add tab ── */}
          {activeTab === "add" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {/* Header with badge */}
              <div style={m.searchHeader}>
                <div style={m.searchBadge}>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14" stroke="#f8fafc" strokeWidth="1.9" strokeLinecap="round" />
                    <path d="M5 12h14" stroke="#60a5fa" strokeWidth="1.9" strokeLinecap="round" />
                  </svg>
                  <span>Add Item</span>
                </div>
                <div style={m.searchHint}>Manual Entry</div>
              </div>

              {/* Item Details Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Item Details</div>
                <input
                  className="glass-input"
                  style={m.searchInput}
                  placeholder="Item name *"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  disabled={modelStatus !== "ready"}
                />
                <textarea
                  className="glass-input"
                  style={{ ...m.searchInput, minHeight:80 }}
                  placeholder="Description (improves semantic search accuracy)"
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  disabled={modelStatus !== "ready"}
                />
              </div>

              {/* Quantity & Unit Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Quantity & Unit</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <input
                    className="glass-input"
                    style={m.inp}
                    placeholder="Qty"
                    value={addForm.qty}
                    onChange={e => setAddForm(f => ({ ...f, qty: e.target.value }))}
                    disabled={modelStatus !== "ready"}
                  />
                  <input
                    className="glass-input"
                    style={m.inp}
                    placeholder="Unit"
                    value={addForm.unit}
                    onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))}
                    disabled={modelStatus !== "ready"}
                  />
                </div>
              </div>

              {/* Location Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Location</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Room</span>
                  </div>
                  <select
                    className="glass-input"
                    style={m.inp}
                    value={addForm.room}
                    onChange={e => setAddForm(f => ({ ...f, room: prettyLabel(e.target.value), box: "" }))}
                    disabled={modelStatus !== "ready"}
                  >
                    {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
                  </select>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                      <rect x="3" y="7" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    <span style={{ fontSize:12, color:"#8b949e", fontFamily:INPUT_FF }}>Box</span>
                  </div>
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
              </div>

              {/* Status Card */}
              <div style={m.searchCard}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF }}>Status</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {STATUSES.map(st => {
                    const isSelected = addForm.status === st;
                    const colors = STATUS_COLORS[st];
                    return (
                      <button key={st}
                        className={isSelected ? "glass-btn" : "glass-btn-secondary"}
                        style={{
                          minHeight:36,
                          padding:"0 16px",
                          borderRadius:18,
                          border: "1px solid " + (isSelected ? colors.border : "rgba(148, 163, 184, 0.15)"),
                          background: isSelected ? colors.bg : "rgba(30, 41, 59, 0.5)",
                          color: isSelected ? colors.text : "#94a3b8",
                          fontSize:12,
                          fontWeight:600,
                          cursor:"pointer",
                          fontFamily:INPUT_FF,
                          boxShadow: isSelected ? ("0 8px 18px " + colors.glow) : "none"
                        }}
                        onClick={() => setAddForm(f => ({ ...f, status: st }))}
                      >{st}</button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="glass-btn glow-cyan"
                style={{
                  ...m.searchActionBtn(loading.add || seeding || modelStatus !== "ready"),
                  width:"100%",
                  minHeight:48,
                  borderRadius:24,
                  fontSize:14
                }}
                disabled={loading.add || seeding || modelStatus !== "ready"}
                onClick={handleAdd}
              >
                {loading.add ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <div className="spin" style={{ width:18, height:18 }} />
                    <span>Embedding…</span>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14" strokeLinecap="round" />
                      <path d="M5 12h14" strokeLinecap="round" />
                    </svg>
                    <span>Embed & Store</span>
                  </div>
                )}
              </button>
            </div>
          )}        </div>

        {/* Floating Bottom Navigation */}
        <div style={m.navShell}>
          <div style={m.nav}>
            {mobileTabs.map(t => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  style={m.navBtn(isActive)}
                  onClick={() => setActiveTab(t.key)}
                  aria-label={t.label}
                  title={t.label}
                >
                  <span style={m.navIcon(isActive)}>
                    {renderMobileNavIcon(t.key, isActive)}
                  </span>
                  {isActive && <span style={m.navIndicator} />}
                </button>
              );
            })}
          </div>
        </div>

        {notif && <GlassToast notif={notif} />}
      </div>
    );
  }

  // ── DESKTOP layout ────────────────────────────────────────────────────────
  return (
    <div style={d.root}>
      <div className="glass" style={d.header}>
        <div style={d.logo}>{renderBrandMark(false)}</div>
        <div>
          <h1 style={d.h1}>VectorStore</h1>
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
              <div className="glass" style={{ borderRadius:10, padding:10, display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.5px" }}>NATURAL-LANGUAGE COMMAND</div>
                <div style={{ fontSize:11, color:"#64748b", lineHeight:1.5 }}>
                  Use either quick command or manual form below.
                </div>
                <textarea
                  className="glass-input"
                  style={{ ...d.ta, minHeight:68 }}
                  placeholder={'Try: "where is my hammer"'}
                  value={commandInput}
                  onChange={e => {
                    setCommandInput(e.target.value);
                    if (commandError) setCommandError(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!commandBusy) handleCommandSubmit();
                    }
                  }}
                  disabled={commandBusy}
                />
                <button
                  className="glass-btn"
                  style={d.btn("primary", commandBusy)}
                  disabled={commandBusy}
                  onClick={handleCommandSubmit}
                >
                  {llmLoading ? "Thinking…" : loading.add ? "Saving…" : "Run Command"}
                </button>
                {commandError && <div style={{ fontSize:11, color:"#f87171" }}>{commandError}</div>}
              </div>
              <div style={{ ...d.secLbl, marginBottom:0 }}>Manual Entry</div>
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

          <div style={d.searchBox}>
            <div style={d.searchHeader}>
              <div style={d.searchBadge}>
                {renderSearchMark(false)}
                <span>Search</span>
              </div>
              <div style={d.searchHint}>Top {topK}</div>
            </div>
            <div style={d.searchCard}>
              <textarea
                className="glass-input"
                style={d.searchInput}
                placeholder={"Try:\\n\\"something to clean dishes\\"\\n\\"tools for home repair\\""}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); if (!busy&&inventory.length>0&&modelStatus==="ready") handleSearch(); }}}
                disabled={modelStatus !== "ready"}
              />
              <div style={d.searchMetaRow}>
                <span style={d.searchMetaText}>
                  {inventory.length ? (inventory.length + " indexed items") : "Inventory is empty"}
                </span>
                <input type="number" min={1} max={Math.max(inventory.length,1)}
                  className="glass-input"
                  style={d.searchTopK}
                  value={topK} onChange={e => setTopK(Math.max(1,parseInt(e.target.value)||1))} disabled={modelStatus !== "ready"} />
                <span style={d.searchMetaText}>results</span>
              </div>
              <button style={d.searchActionBtn(busy||!inventory.length||modelStatus!=="ready")} disabled={busy||!inventory.length||modelStatus!=="ready"} onClick={() => handleSearch()}>
                {loading.search ? "Searching…" : "Run Search"}
              </button>
            </div>
          </div>

          {error && (
            <div className="glass" style={d.err}>⚠ {error}
              <br /><span style={{ opacity:0.6, cursor:"pointer" }} onClick={() => setError(null)}>dismiss ×</span>
            </div>
          )}
          <div style={{ borderTop:"1px solid rgba(148, 163, 184, 0.1)", paddingTop:12, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.5px" }}>SETTINGS</div>
            {window.speechSynthesis && (
              <>
                <button
                  className={ttsEnabled ? "glass-btn" : "glass-btn-secondary"}
                  style={{ ...d.btn("default", false), fontSize:11, padding:"7px 10px", color: ttsEnabled ? "#22d3ee" : "#64748b", border: ttsEnabled ? "1px solid rgba(34, 211, 238, 0.35)" : "1px solid rgba(148, 163, 184, 0.2)" }}
                  onClick={() => setTtsEnabled(v => !v)}
                >
                  {ttsEnabled ? "🔊 Spoken Voice Replies: On" : "🔇 Spoken Voice Replies: Off"}
                </button>
                <div style={{ fontSize:10, color:"#64748b", lineHeight:1.6 }}>
                  Spoken replies apply only to voice-originated assistant responses.
                </div>
              </>
            )}
            <div style={{ display:"flex", gap:6 }}>
              <select
                className="glass-input"
                style={{ ...d.sel, flex:1 }}
                value={clearRoomTarget}
                onChange={e => setClearRoomTarget(e.target.value)}
              >
                <option value="">Select room to clear</option>
                {knownRooms.map(room => <option key={room} value={room}>{room}</option>)}
              </select>
              <button
                className="glass-btn-secondary"
                style={{ ...d.btn("default", !clearRoomTarget), fontSize:11, padding:"7px 10px", color:"#f87171", border:"1px solid rgba(248, 113, 113, 0.35)" }}
                onClick={handleClearRoom}
                disabled={!clearRoomTarget}
              >
                Clear Room
              </button>
            </div>
            <button
              className="glass-btn-secondary"
              style={{ ...d.btn("default", false), fontSize:11, padding:"7px 10px", color:"#67e8f9", border:"1px solid rgba(34, 211, 238, 0.35)" }}
              onClick={handleExport}
            >
              Export Inventory
            </button>
            <div style={{ fontSize:11, color:"#94a3b8" }}>Merge or Replace:</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              <button
                className={importMode === "merge" ? "glass-btn" : "glass-btn-secondary"}
                style={{ ...d.btn("default", false), fontSize:11, padding:"7px 10px", color: importMode === "merge" ? "#e2e8f0" : "#94a3b8" }}
                onClick={() => setImportMode("merge")}
              >
                Merge
              </button>
              <button
                className={importMode === "replace" ? "glass-btn" : "glass-btn-secondary"}
                style={{ ...d.btn("default", false), fontSize:11, padding:"7px 10px", color: importMode === "replace" ? "#e2e8f0" : "#94a3b8" }}
                onClick={() => setImportMode("replace")}
              >
                Replace
              </button>
            </div>
            <label
              className="glass-btn-secondary"
              style={{
                ...d.btn("default", seeding),
                fontSize:11,
                padding:"7px 10px",
                color:"#67e8f9",
                border:"1px solid rgba(34, 211, 238, 0.35)",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                cursor: seeding ? "not-allowed" : "pointer",
              }}
            >
              <input
                type="file"
                accept=".json,application/json"
                style={{ display:"none" }}
                disabled={seeding}
                onChange={handleImportFileSelect}
              />
              Import from Backup
            </label>
          </div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
            Embeddings via Transformers.js (bge-small-en-v1.5) · local, in-browser.<br />
            No exact names needed — concepts cluster in vector space.
          </div>
        </div>

        {/* Main */}
        <div ref={desktopMainRef} style={d.main} onScroll={handleTabContentScroll}>
          <ProgressBanner />
          <AssistantReplyCard />
          <div style={d.tabs}>
            <button className={activeTab==="inventory" ? "glass-btn" : "glass-btn-secondary"} style={d.tab(activeTab==="inventory")} onClick={() => setActiveTab("inventory")}>📦 Inventory ({inventory.length})</button>
            <button className={activeTab==="search" ? "glass-btn" : "glass-btn-secondary"} style={d.tab(activeTab==="search")}    onClick={() => setActiveTab("search")}>🔍 Results {results ? \`(\${results.length})\` : ""}</button>
            <button className={activeTab==="voice" ? "glass-btn" : "glass-btn-secondary"} style={d.tab(activeTab==="voice")} onClick={() => setActiveTab("voice")}>🎙️ Voice</button>
            <button className={activeTab==="camera" ? "glass-btn" : "glass-btn-secondary"} style={d.tab(activeTab==="camera")} onClick={() => setActiveTab("camera")}>📷 Camera</button>
          </div>

          {activeTab === "inventory" && showRoomFilters && (
            <div style={d.filterRow}>
              <button
                className={filterRoom === "all" ? "glass-btn" : "glass-btn-secondary"}
                style={d.filterPill(filterRoom === "all")}
                onClick={() => handleRoomFilterSelect("all")}
              >
                All
              </button>
              {roomsWithItems.map(room => (
                <button
                  key={room}
                  className={filterRoom === room ? "glass-btn" : "glass-btn-secondary"}
                  style={d.filterPill(filterRoom === room)}
                  onClick={() => handleRoomFilterSelect(room)}
                >
                  {room} ({roomCounts[normalizeLabel(room).toLowerCase()] || 0})
                </button>
              ))}
            </div>
          )}

          {activeTab === "inventory" && showBoxFilter && (
            <div style={d.filterRow}>
              <button
                className={filterBox === "all" ? "glass-btn" : "glass-btn-secondary"}
                style={d.filterPill(filterBox === "all")}
                onClick={() => setFilterBox("all")}
              >
                All
              </button>
              {boxesInRoom.map(box => (
                <button
                  key={box}
                  className={filterBox === box ? "glass-btn" : "glass-btn-secondary"}
                  style={d.filterPill(filterBox === box)}
                  onClick={() => setFilterBox(box)}
                >
                  {box}
                </button>
              ))}
            </div>
          )}

          {activeTab === "inventory" && isInventoryFilterActive && (
            <div style={{ color:"#94a3b8", fontSize:12, padding:"0 4px" }}>
              {\`Showing \${filteredInventory.length} of \${inventory.length} items · \${filterSummaryLabel}\`}
            </div>
          )}

          {activeTab === "voice" && renderVoicePanel()}
          {activeTab === "camera" && renderCameraPanel()}
          {activeTab === "review" && renderReviewPanel()}

          {loading.search && (
            <div style={{ display:"flex", alignItems:"center", gap:9, padding:"32px 0", justifyContent:"center", color:"#64748b", fontSize:11 }}>
              <div className="spin" /><span>Computing similarity across {inventory.length} vectors…</span>
            </div>
          )}

          {!loading.search && (activeTab === "inventory" || activeTab === "search") && displayItems.length === 0 && (
            <div style={{ textAlign:"center", padding:"44px 20px", color:"#475569" }}>
              <div style={{ fontSize:38, marginBottom:9 }}>{activeTab==="search" ? "🔍" : "📦"}</div>
              <div style={{ fontSize:13, color:"#64748b", marginBottom:4 }}>
                {activeTab==="search" ? "Run a search to find nearest neighbors"
                  : seeding ? "Embedding items, please wait…"
                  : modelStatus==="loading" ? "Loading embedding model..."
                  : activeTab==="inventory" && isInventoryFilterActive && inventory.length > 0 ? \`No items in \${filterSummaryLabel}\`
                  : "Inventory is empty"}
              </div>
            </div>
          )}

          {!loading.search && (activeTab === "inventory" || activeTab === "search") && displayItems.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      </div>

      {notif && <GlassToast notif={notif} />}
    </div>
  );
}

// ─── Mobile styles ────────────────────────────────────────────────────────────
const FF = "'DM Mono','SF Mono','Fira Code','Fira Mono','Roboto Mono','Courier New',monospace";
const INPUT_FF = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const TYPE = { xs: 12, sm: 13, md: 14, lg: 16, xl: 20 };
const m = {
  root:    { display:"flex", flexDirection:"column", height:"100%",
             color:"#e2e8f0", fontFamily:FF, overflow:"hidden" },
  header:  { display:"flex", alignItems:"center", gap:10, margin:"10px 12px 0", padding:"8px 10px 8px 8px", flexShrink:0,
             borderRadius:28, background:"rgba(23, 27, 32, 0.96)", border:"1px solid rgba(255, 255, 255, 0.06)",
             backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
             boxShadow:"0 18px 40px rgba(2, 6, 23, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  logo:    { width:42, height:42, background:"rgba(67, 72, 75, 0.95)",
             borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  title:   { fontSize:15, fontWeight:700, color:"#f8fafc", letterSpacing:"-0.2px", lineHeight:1.1 },
  subtitle:{ fontSize:10, color:"#8b949e", letterSpacing:"1.1px", marginTop:3 },
  headerMeta:{ display:"flex", alignItems:"center", gap:7, flexShrink:0 },
  badge:   { minWidth:34, height:34, padding:"0 10px", borderRadius:17, fontSize:12, color:"#f8fafc",
             background:"rgba(67, 72, 75, 0.95)", display:"flex", alignItems:"center", justifyContent:"center",
             fontWeight:600, fontFamily:INPUT_FF },
  headerStatus:{ width:34, height:34, borderRadius:17, background:"rgba(67, 72, 75, 0.95)",
                 display:"flex", alignItems:"center", justifyContent:"center" },
  modelDot:(s) => ({ width:8, height:8, borderRadius:"50%", flexShrink:0,
             background: s==="ready" ? "#34d399" : s==="loading" ? "#22d3ee" : s==="error" ? "#f87171" : "#64748b",
             boxShadow: s==="ready" ? "0 0 8px rgba(52, 211, 153, 0.6)" : s==="loading" ? "0 0 8px rgba(34, 211, 238, 0.6)" : "none" }),
  banner:  { display:"flex", gap:10, alignItems:"center", borderBottom:"1px solid rgba(148, 163, 184, 0.1)",
             padding:"12px 16px", flexShrink:0, borderRadius: "0 0 12px 12px" },
  error:   { background:"rgba(127, 29, 29, 0.6)", borderBottom:"1px solid rgba(248, 113, 113, 0.2)",
             padding:"10px 16px", fontSize:TYPE.sm, color:"#f87171", display:"flex", justifyContent:"space-between", flexShrink:0 },
  assistantCard:{ margin:"12px 12px 0", padding:"12px", borderRadius:24, flexShrink:0,
                  background:"rgba(23, 27, 32, 0.96)", border:"1px solid rgba(255, 255, 255, 0.06)",
                  backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
                  boxShadow:"0 18px 40px rgba(2, 6, 23, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  assistantCardHeader:{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:10 },
  assistantBadge:{ display:"inline-flex", alignItems:"center", gap:7, minHeight:34, padding:"0 12px",
                   borderRadius:17, background:"rgba(67, 72, 75, 0.95)", color:"#f8fafc",
                   fontSize:12, fontWeight:600, fontFamily:INPUT_FF },
  assistantBadgeDot:{ width:7, height:7, borderRadius:"50%", background:"#60a5fa",
                      boxShadow:"0 0 10px rgba(96, 165, 250, 0.5)" },
  assistantMeta:{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", fontSize:10,
                  color:"#8b949e", letterSpacing:"0.7px" },
  assistantBody:{ fontSize:13, color:"#f8fafc", lineHeight:1.6, fontFamily:INPUT_FF },
  assistantRequest:{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255, 255, 255, 0.06)",
                     fontSize:11, color:"#8b949e", lineHeight:1.5, fontFamily:INPUT_FF,
                     whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  content: { flex:1, minHeight:0, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10,
             paddingBottom:24 },
  card:    { borderRadius:24, padding:"14px 14px 13px", display:"flex", gap:12, alignItems:"flex-start",
             background:"rgba(23, 27, 32, 0.96)", border:"1px solid rgba(255, 255, 255, 0.06)",
             backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
             boxShadow:"0 18px 40px rgba(2, 6, 23, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  cName:   { fontSize:15, fontWeight:700, color:"#f8fafc", marginBottom:4, letterSpacing:"-0.2px", lineHeight:1.2, fontFamily:INPUT_FF },
  cDesc:   { fontSize:12, color:"#8b949e", lineHeight:1.6, fontFamily:INPUT_FF },
  empty:   { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
             flex:1, padding:40, textAlign:"center" },
  searchBox:{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 },
  searchHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"0 2px" },
  searchBadge:{ display:"inline-flex", alignItems:"center", gap:8, minHeight:34, padding:"0 12px",
                borderRadius:17, background:"rgba(67, 72, 75, 0.95)", color:"#f8fafc",
                fontSize:12, fontWeight:600, fontFamily:INPUT_FF },
  searchHint:{ minHeight:34, padding:"0 12px", borderRadius:17, display:"inline-flex", alignItems:"center",
               background:"rgba(23, 27, 32, 0.9)", border:"1px solid rgba(255, 255, 255, 0.06)",
               color:"#8b949e", fontSize:11, fontWeight:600, fontFamily:INPUT_FF },
  searchCard:{ padding:"12px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
               border:"1px solid rgba(255, 255, 255, 0.06)", backdropFilter:"blur(22px)",
               WebkitBackdropFilter:"blur(22px)", boxShadow:"0 18px 40px rgba(2, 6, 23, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
               display:"flex", flexDirection:"column", gap:10 },
  searchInput:{ width:"100%", minHeight:92, borderRadius:18, padding:"14px 15px", color:"#f8fafc", fontSize:15, lineHeight:"1.5", fontFamily:INPUT_FF,
                resize:"none", boxSizing:"border-box", background:"rgba(67, 72, 75, 0.35)", border:"1px solid rgba(255, 255, 255, 0.06)" },
  searchMetaRow:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 },
  searchMetaText:{ color:"#8b949e", fontSize:11, fontFamily:INPUT_FF },
  searchActionBtn:(disabled) => ({
                minHeight:38, padding:"0 15px", borderRadius:19, border:"1px solid rgba(96, 165, 250, 0.18)",
                background: disabled ? "rgba(67, 72, 75, 0.42)" : "rgba(67, 72, 75, 0.95)", color:"#f8fafc",
                fontSize:12, fontWeight:600, fontFamily:INPUT_FF, cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.55 : 1, boxShadow: disabled ? "none" : "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 22px rgba(2, 6, 23, 0.16)" }),
  searchStateCard:{ padding:"14px 14px 13px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
                    border:"1px solid rgba(255, 255, 255, 0.06)", backdropFilter:"blur(22px)",
                    WebkitBackdropFilter:"blur(22px)", boxShadow:"0 18px 40px rgba(2, 6, 23, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  searchStateHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:10 },
  searchStateBadge:{ display:"inline-flex", alignItems:"center", gap:8, minHeight:34, padding:"0 12px",
                     borderRadius:17, background:"rgba(67, 72, 75, 0.95)", color:"#f8fafc",
                     fontSize:12, fontWeight:600, fontFamily:INPUT_FF },
  searchStateBody:{ color:"#f8fafc", fontSize:14, lineHeight:1.5, fontFamily:INPUT_FF },
  searchStateSub:{ marginTop:5, color:"#8b949e", fontSize:12, lineHeight:1.5, fontFamily:INPUT_FF },
  voicePanel:{ display:"flex", flexDirection:"column", gap:10, minHeight:"calc(100vh - 260px)" },
  voiceHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"0 2px" },
  voiceBadge:{ display:"inline-flex", alignItems:"center", gap:8, minHeight:34, padding:"0 12px",
               borderRadius:17, background:"rgba(67, 72, 75, 0.95)", color:"#f8fafc",
               fontSize:12, fontWeight:600, fontFamily:INPUT_FF },
  voiceHint:{ minHeight:34, padding:"0 12px", borderRadius:17, display:"inline-flex", alignItems:"center",
              background:"rgba(23, 27, 32, 0.9)", border:"1px solid rgba(255, 255, 255, 0.06)",
              color:"#8b949e", fontSize:11, fontWeight:600, fontFamily:INPUT_FF },
  voiceComposer:{ padding:"12px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
                  border:"1px solid rgba(255, 255, 255, 0.06)", backdropFilter:"blur(22px)",
                  WebkitBackdropFilter:"blur(22px)", boxShadow:"0 18px 40px rgba(2, 6, 23, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                  display:"flex", flexDirection:"column", gap:10 },
  voiceInput:{ width:"100%", minHeight:110, resize:"vertical", borderRadius:18, padding:"14px 15px",
               boxSizing:"border-box", color:"#f8fafc", fontSize:15, lineHeight:"1.5", fontFamily:INPUT_FF,
               background:"rgba(67, 72, 75, 0.35)", border:"1px solid rgba(255, 255, 255, 0.06)" },
  voiceMetaRow:{ display:"flex", flexDirection:"column", gap:10 },
  voiceMetaText:{ color:"#8b949e", fontSize:12, lineHeight:1.5, fontFamily:INPUT_FF },
  voiceSendBtn:(disabled) => ({
               minHeight:38, padding:"0 15px", borderRadius:19, border:"1px solid rgba(96, 165, 250, 0.18)",
               background: disabled ? "rgba(67, 72, 75, 0.42)" : "rgba(67, 72, 75, 0.95)", color:"#f8fafc",
               fontSize:12, fontWeight:600, fontFamily:INPUT_FF, cursor: disabled ? "not-allowed" : "pointer",
               opacity: disabled ? 0.55 : 1, boxShadow: disabled ? "none" : "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 22px rgba(2, 6, 23, 0.16)" }),
  voiceError:{ padding:"11px 12px", borderRadius:18, color:"#fecaca", background:"rgba(127, 29, 29, 0.35)",
               border:"1px solid rgba(248, 113, 113, 0.2)", fontSize:11, lineHeight:1.5, fontFamily:INPUT_FF },
  voiceInfoCard:{ padding:"12px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
                  border:"1px solid rgba(255, 255, 255, 0.06)", display:"flex", flexDirection:"column", gap:10 },
  voiceInfoBody:{ fontSize:12, color:"#cbd5e1", lineHeight:1.6, fontFamily:INPUT_FF },
  voiceWarning:{ fontSize:11, color:"#fbbf24", lineHeight:1.5, fontFamily:INPUT_FF },
  voiceMeterHeader:{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#8b949e", marginBottom:5, fontFamily:INPUT_FF },
  voiceMeterTrack:{ height:6, borderRadius:999, overflow:"hidden", background:"rgba(67, 72, 75, 0.48)" },
  voiceMeterFill:(recording) => ({
               height:"100%", borderRadius:999,
               background: recording ? "linear-gradient(90deg, #60a5fa, #93c5fd, #c084fc)" : "rgba(100, 116, 139, 0.45)",
               transition:"width 0.12s linear" }),
  voiceDebugCard:{ padding:"12px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
                   border:"1px solid rgba(255, 255, 255, 0.06)", display:"flex", flexDirection:"column", gap:8 },
  voiceDebugLabel:{ fontSize:10, color:"#8b949e", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF },
  voiceDebugGrid:{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:6, fontSize:10, fontFamily:INPUT_FF },
  voiceDebugStat:{ color:"#8b949e" },
  voiceDebugStatValue:{ color:"#f8fafc" },
  voiceDebugLog:{ maxHeight:120, overflowY:"auto", borderRadius:16, padding:"10px 12px",
                  background:"rgba(67, 72, 75, 0.2)", border:"1px solid rgba(255, 255, 255, 0.06)",
                  fontSize:10, color:"#cbd5e1", lineHeight:1.5, fontFamily:INPUT_FF },
  voiceDebugEvent:{ color:"#93c5fd" },
  voiceMicWrap:{ marginTop:"auto", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, paddingTop:4 },
  voiceMicBtn:(status, disabled) => ({
             width:96, height:96, minWidth:96, minHeight:96, borderRadius:"50%",
             border:"1px solid rgba(255, 255, 255, 0.08)",
             background: status === "recording" ? "linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(192, 132, 252, 0.92))" : "rgba(67, 72, 75, 0.95)",
             color:"#f8fafc", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
             animation: status === "recording" ? "pulse 1s ease-in-out infinite" : "none",
             touchAction:"manipulation", display:"flex", alignItems:"center", justifyContent:"center",
             boxShadow: status === "recording" ? "0 0 24px rgba(96, 165, 250, 0.35)" : "0 12px 32px rgba(2, 6, 23, 0.24)" }),
  voiceMicIcon:{ transform:"scale(3.4)", display:"flex", alignItems:"center", justifyContent:"center" },
  voiceMicLabel:{ fontSize:11, color:"#8b949e", textAlign:"center", fontFamily:INPUT_FF },
  cameraFloatingCaptureWrap:{ position:"fixed", left:"50%", bottom:"calc(env(safe-area-inset-bottom, 0px) + 104px)", transform:"translateX(-50%)", zIndex:80, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 },
  cameraFloatingCaptureLabel:{ fontSize:11, color:"#cbd5e1", textAlign:"center", fontFamily:INPUT_FF, padding:"7px 12px", borderRadius:999, background:"rgba(15, 23, 42, 0.88)", border:"1px solid rgba(148, 163, 184, 0.14)", boxShadow:"0 12px 28px rgba(2, 6, 23, 0.3)" },
  inp:     { width:"100%", borderRadius:8, padding:"11px 12px", color:"#e2e8f0", fontSize:TYPE.md, lineHeight:"1.35", fontFamily:INPUT_FF,
             boxSizing:"border-box", display:"block" },
  addForm: { display:"flex", flexDirection:"column", gap:10 },
  cameraGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 },
  cameraPreview:{ width:"100%", minHeight:260, aspectRatio:"3 / 4", borderRadius:12, overflow:"hidden", border:"1px solid rgba(148, 163, 184, 0.16)", background:"rgba(15, 23, 42, 0.6)", display:"block", position:"relative" },
  cameraMedia:{ position:"absolute", inset:0, display:"block", width:"100%", height:"100%", objectFit:"cover", background:"#020617" },
  cameraTransitionFill:{ position:"absolute", inset:0, display:"block", width:"100%", height:"100%", background:"#000" },
  cameraTransitionMask:{ position:"absolute", inset:0, zIndex:1, background:"#000", opacity:0.96, pointerEvents:"none", transition:"opacity 0.18s ease" },
  cameraFlipBtn:{ position:"absolute", top:10, right:10, zIndex:2, border:"1px solid rgba(148, 163, 184, 0.25)", background:"rgba(15, 23, 42, 0.72)", color:"#e2e8f0", borderRadius:999, padding:"8px 12px", fontSize:12, fontFamily:FF, cursor:"pointer", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)" },
  cameraPlaceholder:{ position:"absolute", inset:0, color:"#94a3b8", fontSize:12, lineHeight:1.6, padding:"24px 18px", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center" },
  cameraActionRow:{ display:"flex", flexDirection:"column", gap:8 },
  cameraActionBtn:{ width:"100%" },
  cameraLoading:{ display:"flex", alignItems:"center", gap:10, color:"#94a3b8", fontSize:12 },
  cameraError:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, borderRadius:10, padding:"10px 12px", color:"#f87171", background:"rgba(127, 29, 29, 0.45)", border:"1px solid rgba(248, 113, 113, 0.2)", fontSize:12, lineHeight:1.5 },
  cameraInlineBtn:{ border:"1px solid rgba(248, 113, 113, 0.35)", background:"rgba(127, 29, 29, 0.1)", color:"#fecaca", borderRadius:8, padding:"8px 12px", fontSize:12, fontFamily:FF, cursor:"pointer", flexShrink:0 },
  filterRow:{ display:"flex", flexWrap:"wrap", gap:9, padding:"4px 2px 10px" },
  filterPill:(a) => ({
             minHeight:36, padding:"0 13px", borderRadius:18, border:"1px solid",
             borderColor: a ? "rgba(96, 165, 250, 0.18)" : "rgba(255, 255, 255, 0.06)",
             background: a ? "rgba(67, 72, 75, 0.95)" : "rgba(23, 27, 32, 0.9)",
             color: a ? "#f8fafc" : "#8b949e",
             fontSize:TYPE.xs, fontFamily:INPUT_FF, fontWeight:600, cursor:"pointer",
             boxShadow: a ? "inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 10px 22px rgba(2, 6, 23, 0.16)" : "inset 0 1px 0 rgba(255, 255, 255, 0.02)",
             transition:"all 0.18s ease" }),
  secLabel:{ fontSize:TYPE.xs, letterSpacing:"1.2px", color:"#94a3b8", textTransform:"uppercase", fontWeight:600 },
  btn:     (v, d) => ({
             width:"100%", padding:"13px", borderRadius:8, border:"none", cursor: d ? "not-allowed" : "pointer",
             fontSize:TYPE.md, fontFamily:FF, fontWeight:600, opacity: d ? 0.45 : 1,
             color:"#fff" }),
  navShell:{ flexShrink:0, padding:"6px 12px calc(env(safe-area-inset-bottom, 0px) + 12px)",
             background:"linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.3) 100%)" },
  nav:     { display:"flex", alignItems:"center", justifyContent:"space-between", gap:5, padding:"8px",
             borderRadius:28, background:"rgba(23, 27, 32, 0.96)", border:"1px solid rgba(255, 255, 255, 0.06)",
             backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
             boxShadow:"0 18px 40px rgba(2, 6, 23, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  navBtn:  (a) => ({
             position:"relative", width: a ? 64 : 42, minWidth: a ? 64 : 42, height: a ? 54 : 42, padding:0,
             border:"none", borderRadius:22,
             background: a ? "rgba(67, 72, 75, 0.95)" : "transparent",
             color:"#f8fafc", cursor:"pointer", fontFamily:INPUT_FF, display:"flex", alignItems:"center", justifyContent:"center",
             flex:"0 0 auto", boxShadow: a ? "inset 0 1px 0 rgba(255, 255, 255, 0.04)" : "none",
             transition:"all 0.18s ease" }),
  navIcon: (a) => ({
             width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center",
             flexShrink:0 }),
  navSvg:  (a) => ({
             display:"block", color: a ? "#f8fafc" : "#8b949e",
             transform: a ? "translateY(-2px)" : "none" }),
  navIndicator:{ position:"absolute", left:"50%", bottom:6, width:22, height:5,
                 transform:"translateX(-50%)", borderRadius:999,
                 background:"linear-gradient(90deg, #3b82f6, #60a5fa)",
                 boxShadow:"0 0 12px rgba(59, 130, 246, 0.45)" },
};

// ─── Desktop styles ───────────────────────────────────────────────────────────
const d = {
  root:   { minHeight:"100vh", color:"#e2e8f0", fontFamily:FF },
  header: { borderBottom:"1px solid rgba(148, 163, 184, 0.1)", padding:"18px 26px", display:"flex", alignItems:"center", gap:13 },
  logo:   { width:36, height:36, background:"linear-gradient(135deg,#22d3ee,#8b5cf6)", borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 },
  h1:     { fontSize:20, fontWeight:700, letterSpacing:"-0.3px", color:"#f1f5f9", margin:0 },
  sub:    { fontSize:TYPE.xs, color:"#94a3b8", margin:"2px 0 0", letterSpacing:"0.4px" },
  badge:  { marginLeft:"auto", borderRadius:20, padding:"4px 13px", fontSize:TYPE.xs, color:"#22d3ee" },
  status: (s) => ({ fontSize:TYPE.xs, padding:"5px 10px", borderRadius:6,
            background: s==="ready" ? "rgba(6, 78, 59, 0.5)" : s==="loading" ? "rgba(30, 58, 138, 0.5)" : "rgba(127, 29, 29, 0.5)",
            border: \`1px solid \${s==="ready" ? "rgba(16, 185, 129, 0.3)" : s==="loading" ? "rgba(59, 130, 246, 0.3)" : "rgba(248, 113, 113, 0.3)"}\`,
            color: s==="ready" ? "#34d399" : s==="loading" ? "#60a5fa" : "#f87171",
            boxShadow: s==="ready" ? "0 0 12px rgba(16, 185, 129, 0.2)" : "none" }),
  body:   { display:"grid", gridTemplateColumns:"310px 1fr", minHeight:"calc(100vh - 73px)" },
  side:   { borderRight:"1px solid rgba(148, 163, 184, 0.1)", padding:"18px 16px",
            display:"flex", flexDirection:"column", gap:16, overflowY:"auto", borderRadius: "0 12px 12px 0" },
  secLbl: { fontSize:TYPE.xs, letterSpacing:"1.2px", color:"#94a3b8", textTransform:"uppercase", marginBottom:7, fontWeight:600 },
  form:   { display:"flex", flexDirection:"column", gap:6 },
  cameraGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  cameraPreview:{ width:"100%", minHeight:360, aspectRatio:"3 / 4", borderRadius:12, overflow:"hidden", border:"1px solid rgba(148, 163, 184, 0.16)", background:"rgba(15, 23, 42, 0.6)", display:"block", position:"relative" },
  cameraMedia:{ position:"absolute", inset:0, display:"block", width:"100%", height:"100%", objectFit:"cover", background:"#020617" },
  cameraTransitionFill:{ position:"absolute", inset:0, display:"block", width:"100%", height:"100%", background:"#000" },
  cameraTransitionMask:{ position:"absolute", inset:0, zIndex:1, background:"#000", opacity:0.96, pointerEvents:"none", transition:"opacity 0.18s ease" },
  cameraFlipBtn:{ position:"absolute", top:12, right:12, zIndex:2, border:"1px solid rgba(148, 163, 184, 0.25)", background:"rgba(15, 23, 42, 0.72)", color:"#e2e8f0", borderRadius:999, padding:"8px 12px", fontSize:12, fontFamily:FF, cursor:"pointer", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)" },
  cameraPlaceholder:{ position:"absolute", inset:0, color:"#94a3b8", fontSize:12, lineHeight:1.6, padding:"24px 18px", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center" },
  cameraActionRow:{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" },
  cameraActionBtn:{ width:"auto", minWidth:140 },
  cameraLoading:{ display:"flex", alignItems:"center", gap:10, color:"#94a3b8", fontSize:12 },
  cameraError:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, borderRadius:10, padding:"10px 12px", color:"#f87171", background:"rgba(127, 29, 29, 0.45)", border:"1px solid rgba(248, 113, 113, 0.2)", fontSize:12, lineHeight:1.5 },
  cameraInlineBtn:{ border:"1px solid rgba(248, 113, 113, 0.35)", background:"rgba(127, 29, 29, 0.1)", color:"#fecaca", borderRadius:8, padding:"8px 12px", fontSize:12, fontFamily:FF, cursor:"pointer", flexShrink:0 },
  inp:    { width:"100%", borderRadius:6, padding:"9px 10px", color:"#e2e8f0", fontSize:TYPE.md, outline:"none",
            boxSizing:"border-box", fontFamily:INPUT_FF, transition:"border-color 0.15s" },
  ta:     { width:"100%", borderRadius:6, padding:"9px 10px", color:"#e2e8f0", fontSize:TYPE.md, outline:"none",
            boxSizing:"border-box", fontFamily:INPUT_FF, resize:"vertical", minHeight:72, lineHeight:1.4 },
  sel:    { width:"100%", borderRadius:6, padding:"9px 10px", color:"#e2e8f0", fontSize:TYPE.md, outline:"none",
            boxSizing:"border-box", fontFamily:INPUT_FF, cursor:"pointer" },
  btn:    (v, d) => ({
            width:"100%", padding:"8px 13px", borderRadius:6, border:"none",
            cursor: d ? "not-allowed" : "pointer", fontSize:TYPE.md, fontFamily:FF,
            fontWeight:600, letterSpacing:"0.3px", opacity: d ? 0.45 : 1, transition:"all 0.15s",
            background: v==="primary" ? "linear-gradient(135deg,#22d3ee,#8b5cf6)"
                      : v==="search"  ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "#1e2d3d",
            color:"#fff" }),
  main:   { padding:"18px 22px", display:"flex", flexDirection:"column", gap:12, overflowY:"auto" },
  banner: { borderRadius:8, padding:"12px 16px", display:"flex", gap:10, alignItems:"center", marginBottom:4 },
  searchBox:{ padding:"14px 16px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
              border:"1px solid rgba(255, 255, 255, 0.06)", backdropFilter:"blur(22px)",
              WebkitBackdropFilter:"blur(22px)", boxShadow:"0 18px 40px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
              display:"flex", flexDirection:"column", gap:12 },
  searchHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 },
  searchBadge:{ display:"inline-flex", alignItems:"center", gap:8, minHeight:36, padding:"0 13px",
                borderRadius:18, background:"rgba(67, 72, 75, 0.95)", color:"#f8fafc",
                fontSize:12, fontWeight:600, fontFamily:INPUT_FF },
  searchHint:{ minHeight:36, padding:"0 13px", borderRadius:18, display:"inline-flex", alignItems:"center",
               background:"rgba(23, 27, 32, 0.9)", border:"1px solid rgba(255, 255, 255, 0.06)",
               color:"#8b949e", fontSize:11, fontWeight:600, fontFamily:INPUT_FF },
  searchCard:{ display:"flex", flexDirection:"column", gap:10 },
  searchInput:{ width:"100%", minHeight:96, borderRadius:18, padding:"14px 15px", color:"#f8fafc", fontSize:15, lineHeight:"1.5",
                boxSizing:"border-box", fontFamily:INPUT_FF, resize:"vertical", background:"rgba(67, 72, 75, 0.35)",
                border:"1px solid rgba(255, 255, 255, 0.06)" },
  searchMetaRow:{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" },
  searchMetaText:{ color:"#8b949e", fontSize:11, fontFamily:INPUT_FF },
  searchTopK:{ width:54, borderRadius:14, padding:"7px 8px", textAlign:"center", color:"#f8fafc", fontSize:12,
               outline:"none", boxSizing:"border-box", fontFamily:INPUT_FF, background:"rgba(67, 72, 75, 0.35)",
               border:"1px solid rgba(255, 255, 255, 0.06)" },
  searchActionBtn:(disabled) => ({
               minHeight:40, padding:"0 15px", borderRadius:20, border:"1px solid rgba(96, 165, 250, 0.18)",
               background: disabled ? "rgba(67, 72, 75, 0.42)" : "rgba(67, 72, 75, 0.95)", color:"#f8fafc",
               fontSize:12, fontWeight:600, fontFamily:INPUT_FF, cursor: disabled ? "not-allowed" : "pointer",
               opacity: disabled ? 0.55 : 1, boxShadow: disabled ? "none" : "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 22px rgba(2, 6, 23, 0.16)" }),
  voicePanel:{ display:"flex", flexDirection:"column", gap:12, maxWidth:760, minHeight:560 },
  voiceHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 },
  voiceBadge:{ display:"inline-flex", alignItems:"center", gap:8, minHeight:36, padding:"0 13px",
               borderRadius:18, background:"rgba(67, 72, 75, 0.95)", color:"#f8fafc",
               fontSize:12, fontWeight:600, fontFamily:INPUT_FF },
  voiceHint:{ minHeight:36, padding:"0 13px", borderRadius:18, display:"inline-flex", alignItems:"center",
              background:"rgba(23, 27, 32, 0.9)", border:"1px solid rgba(255, 255, 255, 0.06)",
              color:"#8b949e", fontSize:11, fontWeight:600, fontFamily:INPUT_FF },
  voiceComposer:{ padding:"14px 16px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
                  border:"1px solid rgba(255, 255, 255, 0.06)", boxShadow:"0 18px 40px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                  display:"flex", flexDirection:"column", gap:10 },
  voiceInput:{ width:"100%", minHeight:110, borderRadius:18, padding:"14px 15px", color:"#f8fafc", fontSize:15, lineHeight:"1.5",
               boxSizing:"border-box", fontFamily:INPUT_FF, resize:"vertical", background:"rgba(67, 72, 75, 0.35)",
               border:"1px solid rgba(255, 255, 255, 0.06)" },
  voiceMetaRow:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" },
  voiceMetaText:{ color:"#8b949e", fontSize:12, lineHeight:1.5, fontFamily:INPUT_FF, flex:"1 1 280px" },
  voiceSendBtn:(disabled) => ({
               minHeight:40, padding:"0 15px", borderRadius:20, border:"1px solid rgba(96, 165, 250, 0.18)",
               background: disabled ? "rgba(67, 72, 75, 0.42)" : "rgba(67, 72, 75, 0.95)", color:"#f8fafc",
               fontSize:12, fontWeight:600, fontFamily:INPUT_FF, cursor: disabled ? "not-allowed" : "pointer",
               opacity: disabled ? 0.55 : 1, boxShadow: disabled ? "none" : "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 22px rgba(2, 6, 23, 0.16)" }),
  voiceError:{ padding:"11px 12px", borderRadius:18, color:"#fecaca", background:"rgba(127, 29, 29, 0.35)",
               border:"1px solid rgba(248, 113, 113, 0.2)", fontSize:11, lineHeight:1.5, fontFamily:INPUT_FF },
  voiceInfoCard:{ padding:"14px 16px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
                  border:"1px solid rgba(255, 255, 255, 0.06)", display:"flex", flexDirection:"column", gap:10 },
  voiceInfoBody:{ fontSize:12, color:"#cbd5e1", lineHeight:1.6, fontFamily:INPUT_FF },
  voiceWarning:{ fontSize:11, color:"#fbbf24", lineHeight:1.5, fontFamily:INPUT_FF },
  voiceMeterHeader:{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#8b949e", marginBottom:5, fontFamily:INPUT_FF },
  voiceMeterTrack:{ height:6, borderRadius:999, overflow:"hidden", background:"rgba(67, 72, 75, 0.48)" },
  voiceMeterFill:(recording) => ({
               height:"100%", borderRadius:999,
               background: recording ? "linear-gradient(90deg, #60a5fa, #93c5fd, #c084fc)" : "rgba(100, 116, 139, 0.45)",
               transition:"width 0.12s linear" }),
  voiceDebugCard:{ padding:"14px 16px", borderRadius:24, background:"rgba(23, 27, 32, 0.96)",
                   border:"1px solid rgba(255, 255, 255, 0.06)", display:"flex", flexDirection:"column", gap:8 },
  voiceDebugLabel:{ fontSize:10, color:"#8b949e", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:INPUT_FF },
  voiceDebugGrid:{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:8, fontSize:10, fontFamily:INPUT_FF },
  voiceDebugStat:{ color:"#8b949e" },
  voiceDebugStatValue:{ color:"#f8fafc" },
  voiceDebugLog:{ maxHeight:120, overflowY:"auto", borderRadius:16, padding:"10px 12px",
                  background:"rgba(67, 72, 75, 0.2)", border:"1px solid rgba(255, 255, 255, 0.06)",
                  fontSize:10, color:"#cbd5e1", lineHeight:1.5, fontFamily:INPUT_FF },
  voiceDebugEvent:{ color:"#93c5fd" },
  voiceMicWrap:{ marginTop:"auto", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, paddingTop:8 },
  voiceMicBtn:(status, disabled) => ({
               width:112, height:112, minWidth:112, minHeight:112, borderRadius:"50%",
               border:"1px solid rgba(255, 255, 255, 0.08)",
               background: status === "recording" ? "linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(192, 132, 252, 0.92))" : "rgba(67, 72, 75, 0.95)",
               color:"#f8fafc", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
               animation: status === "recording" ? "pulse 1s ease-in-out infinite" : "none",
               touchAction:"manipulation", display:"flex", alignItems:"center", justifyContent:"center",
               boxShadow: status === "recording" ? "0 0 24px rgba(96, 165, 250, 0.35)" : "0 12px 32px rgba(2, 6, 23, 0.24)" }),
  voiceMicIcon:{ transform:"scale(1.5)", display:"flex", alignItems:"center", justifyContent:"center" },
  voiceMicLabel:{ fontSize:11, color:"#8b949e", textAlign:"center", fontFamily:INPUT_FF },
  assistantCard:{ marginBottom:6, padding:"14px 16px", borderRadius:24,
                  background:"rgba(23, 27, 32, 0.96)", border:"1px solid rgba(255, 255, 255, 0.06)",
                  backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
                  boxShadow:"0 18px 40px rgba(2, 6, 23, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  assistantCardHeader:{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:12 },
  assistantBadge:{ display:"inline-flex", alignItems:"center", gap:8, minHeight:36, padding:"0 13px",
                   borderRadius:18, background:"rgba(67, 72, 75, 0.95)", color:"#f8fafc",
                   fontSize:12, fontWeight:600, fontFamily:INPUT_FF },
  assistantBadgeDot:{ width:7, height:7, borderRadius:"50%", background:"#60a5fa",
                      boxShadow:"0 0 10px rgba(96, 165, 250, 0.5)" },
  assistantMeta:{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", fontSize:10,
                  color:"#8b949e", letterSpacing:"0.7px" },
  assistantBody:{ fontSize:14, color:"#f8fafc", lineHeight:1.65, fontFamily:INPUT_FF },
  assistantRequest:{ marginTop:12, paddingTop:12, borderTop:"1px solid rgba(255, 255, 255, 0.06)",
                     fontSize:11, color:"#8b949e", lineHeight:1.5, fontFamily:INPUT_FF },
  tabs:   { display:"flex", gap:3, borderBottom:"1px solid rgba(148, 163, 184, 0.1)", marginBottom:2 },
  tab:    (a) => ({ padding:"8px 15px", borderRadius:"6px 6px 0 0", border:"1px solid",
            borderColor: a ? "rgba(139, 92, 246, 0.3)" : "transparent",
            background: a ? "rgba(30, 41, 59, 0.5)" : "transparent", color: a ? "#22d3ee" : "#64748b",
            fontSize:TYPE.sm, cursor:"pointer", fontFamily:FF, fontWeight: a ? 600 : 400, marginBottom:-1 }),
  filterRow:{ display:"flex", flexWrap:"wrap", gap:9, padding:"8px 4px 6px" },
  filterPill:(a) => ({
            minHeight:36, padding:"0 13px", borderRadius:18, border:"1px solid",
            borderColor: a ? "rgba(96, 165, 250, 0.18)" : "rgba(255, 255, 255, 0.06)",
            background: a ? "rgba(67, 72, 75, 0.95)" : "rgba(23, 27, 32, 0.9)",
            color: a ? "#f8fafc" : "#8b949e",
            fontSize:TYPE.xs, fontFamily:INPUT_FF, fontWeight:600, cursor:"pointer",
            boxShadow: a ? "inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 10px 22px rgba(2, 6, 23, 0.14)" : "inset 0 1px 0 rgba(255, 255, 255, 0.02)",
            transition:"all 0.18s ease" }),
  card:   { borderRadius:24, padding:"14px 16px", display:"flex", gap:14, alignItems:"flex-start",
            background:"rgba(23, 27, 32, 0.96)", border:"1px solid rgba(255, 255, 255, 0.06)",
            backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
            boxShadow:"0 18px 40px rgba(2, 6, 23, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  cName:  { fontSize:15, fontWeight:700, color:"#f8fafc", marginBottom:4, letterSpacing:"-0.2px", lineHeight:1.2, fontFamily:INPUT_FF },
  cDesc:  { fontSize:12, color:"#8b949e", marginBottom:2, lineHeight:1.6, fontFamily:INPUT_FF },
  err:    { borderRadius:6, padding:"9px 12px", fontSize:TYPE.sm, color:"#f87171", lineHeight:1.5,
            background:"rgba(127, 29, 29, 0.5)", border:"1px solid rgba(248, 113, 113, 0.2)" },
  toggleRow:{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, paddingTop:2 },
  toggleBtn:(a) => ({
            padding:"5px 12px", borderRadius:999, border:"1px solid",
            borderColor: a ? "rgba(34, 211, 238, 0.55)" : "rgba(148, 163, 184, 0.25)",
            background: a ? "rgba(34, 211, 238, 0.18)" : "rgba(15, 23, 42, 0.6)",
            color: a ? "#22d3ee" : "#94a3b8",
            fontSize:TYPE.xs, fontFamily:FF, fontWeight:600, cursor:"pointer" }),
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

  // Test 4: LLM envelope validation preserves dialogue and normalizes add actions
  const validatedEnvelope = validateLLMEnvelope({
    action: {
      intent: "add",
      items: [{ name: "toothbrush", qty: "2", room: "bathroom", box: "bag" }],
    },
    dialogue: "I added two toothbrushes to the bag in the bathroom.",
  }, "Put toothbrush in a bag in the bathroom", "Garage", "");
  const test8 = validatedEnvelope.action.intent === "add";
  const test9 = validatedEnvelope.action.items[0].box === "Bag";
  const test10 = validatedEnvelope.dialogue === "I added two toothbrushes to the bag in the bathroom.";

  // Test 5: invalid LLM payload falls back to unknown with safe dialogue
  const fallbackEnvelope = validateLLMEnvelope(null, "how do I change a tire", "Garage", "");
  const test11 = fallbackEnvelope.action.intent === "unknown";
  const test12 = typeof fallbackEnvelope.dialogue === "string" && fallbackEnvelope.dialogue.length > 0;

  console.log("Tests:", { test1, test2, test3, test4, test5, test6, test7, test8, test9, test10, test11, test12 });
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
