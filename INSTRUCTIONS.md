# VectorStore — AI Workflow Instructions

This document is intended to be ingested by an LLM (Claude, GPT, Gemini, etc.) to understand how to build, run, and test this project.

---

## Project Overview

**VectorStore** is a semantic inventory management application that uses client-side AI embeddings to enable natural-language search over a personal item inventory. No backend is required — all AI inference and storage runs in the browser or mobile WebView.

**Dual-platform architecture:**

| Component | Type | Path |
|---|---|---|
| `VectorStoreMobile` | React Native / Expo mobile app (iOS & Android) | `VectorStoreMobile/` |
| `VectorStoreWeb` | Standalone web app (no build step) | `VectorStoreWeb/` |

Both share the same core logic: `Transformers.js` for embeddings (`all-MiniLM-L6-v2`) and `IndexedDB` for local persistence.

---

## Repository Structure

```
VectorStore/
├── INSTRUCTIONS.md               # This file
├── VectorStoreMobile/            # React Native + Expo app
│   ├── App.js                    # Root component (renders WebView)
│   ├── index.js                  # Entry point
│   ├── htmlContent.js            # Embedded HTML/CSS/JS served in WebView
│   ├── app.json                  # Expo configuration
│   ├── package.json              # npm dependencies & scripts
│   ├── assets/                   # App icons and splash screen
│   └── ios/                      # Native iOS project (Xcode + CocoaPods)
└── VectorStoreWeb/               # Standalone web app
    ├── index.html                # Full app (React 18 via CDN, 46KB)
    ├── app.js                    # React component logic (674 lines)
    └── styles.css                # Stylesheet
```

---

## Tech Stack

### Mobile (`VectorStoreMobile`)

- **React Native 0.81.5** with **Expo 54**
- **New Architecture enabled** (`newArchEnabled: true`)
- **JavaScript engine:** Hermes
- **Key dependency:** `react-native-webview` — the entire UI is an embedded HTML page
- **AI model:** `@xenova/transformers@2.17.2` → `Xenova/all-MiniLM-L6-v2` (384-dim sentence embeddings)
- **Storage:** IndexedDB (inside WebView) via `vectorstock-db`
- **Package manager:** npm

### Web (`VectorStoreWeb`)

- **React 18** via CDN (no bundler)
- **Babel Standalone** for JSX transpilation in-browser
- **Transformers.js** via CDN (`@xenova/transformers@2.17.2`)
- **Storage:** IndexedDB (`vectorstock-db`)
- **No build step required**

---

## Prerequisites

### All platforms
- **Node.js 18+**
- **npm 8+**

### iOS (mobile only)
- **macOS** with **Xcode 15+**
- **CocoaPods** (`sudo gem install cocoapods`)
- iOS deployment target: **15.1+**

### Android (mobile only)
- **Android SDK 35+** (managed by Expo / Android Studio)
- **Java JDK 17+**

---

## Setup

### Mobile

```bash
cd VectorStoreMobile

# Install JS dependencies
npm install

# Install iOS native dependencies (macOS only)
cd ios && pod install && cd ..
```

### Web

No setup required. The web app is served as static files.

---

## Running the Project

### Mobile — Development

```bash
cd VectorStoreMobile

npm start          # Start Expo dev server (Metro bundler)
npm run ios        # Launch on iOS Simulator or connected device
npm run android    # Launch on Android Emulator or connected device
npm run web        # Launch in browser via Expo web
```

When running `npm start`, press:
- `i` to open iOS simulator
- `a` to open Android emulator
- `w` to open in web browser

### Web — Development

```bash
cd VectorStoreWeb

# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve .

# Option 3: Any static file server
```

Then open: `http://localhost:8000/index.html`

> **Important:** The web app must be served over HTTP/HTTPS (not `file://`) because IndexedDB and the ONNX model loader require a proper origin.

---

## Testing

There is currently **no automated test suite**. Manual testing steps:

### Functional Tests

1. **Model loading** — On first launch, `Xenova/all-MiniLM-L6-v2` downloads and caches. Subsequent launches use the cache. Verify a loading indicator appears then disappears.

2. **Add item** — Enter an item name and description and submit. It should appear in the inventory list.

3. **Semantic search** — Type a natural-language query (e.g., "something to sit on"). Items with cosine similarity ≥ 0.5 to the query should surface, ranked by score.

4. **Persistence** — Reload the app. All previously added items should still appear (IndexedDB persistence).

5. **Delete item** — Remove an item and confirm it no longer appears after reload.

### Confirmed Working (from git history)

- Search ranking function
- POC array persistence in IndexedDB
- CocoaPods install on iOS
- React Native WebView integration

---

## Key Implementation Details

### How the Mobile App Works

`App.js` renders a `WebView` that loads the full HTML/CSS/JS application from `htmlContent.js` (an inline string export). There are no native React Native UI components — the entire interface is browser-based inside the WebView. This means:

- All AI logic runs in the WebView's JS engine, not the React Native JS thread.
- Changes to the UI require editing `htmlContent.js`.
- Platform-specific adjustments (e.g., iOS safe-area padding) are handled via `Platform.OS` in `App.js`.

### AI Embeddings

Both platforms use `Transformers.js` to run the `all-MiniLM-L6-v2` model locally (no API calls):

```js
const { pipeline } = await import('@xenova/transformers');
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const output = await embedder(text, { pooling: 'mean', normalize: true });
```

Embeddings are 384-dimensional float32 vectors. Similarity is computed via cosine similarity. Items scoring ≥ 0.5 against the query are returned as results.

### Storage Schema

IndexedDB database: `vectorstock-db`
Object store: `items`
Key path: `id` (auto-generated)

Each item record:
```json
{
  "id": "<auto>",
  "name": "string",
  "description": "string",
  "embedding": [/* float32 array, length 384 */]
}
```

---

## Configuration

All configuration is hardcoded. Key values to know if modifying:

| Setting | Value | Location |
|---|---|---|
| AI model | `Xenova/all-MiniLM-L6-v2` | `htmlContent.js`, `VectorStoreWeb/app.js` |
| Similarity threshold | `0.5` | `htmlContent.js`, `VectorStoreWeb/app.js` |
| IndexedDB name | `vectorstock-db` | `htmlContent.js`, `VectorStoreWeb/app.js` |
| App bundle ID (iOS) | `com.anonymous.VectorStoreMobile` | `app.json` |
| Expo slug | `VectorStoreMobile` | `app.json` |

No `.env` files or environment variables are required.

---

## Common Issues

| Problem | Cause | Fix |
|---|---|---|
| `pod install` fails | CocoaPods version mismatch | `sudo gem update cocoapods && pod install` |
| Model download hangs | Network / CORS | Use a local HTTP server (not `file://`) for web |
| Blank WebView on iOS | Metro bundler not running | Ensure `npm start` is running before `npm run ios` |
| IndexedDB quota exceeded | Too many items stored | Clear app storage in device settings |
| Expo version mismatch | Wrong Node/npm version | Use Node 18+ and run `npm install` fresh |

---

## Git Remote

```
https://github.com/AtharvaWaykar/VectorStore.git
```

Main branch: `main`
