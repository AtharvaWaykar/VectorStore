# VectorStore — AI Workflow Instructions

This document is intended to be ingested by an LLM (Claude, GPT, Gemini, etc.) to understand how to build, run, and test this project.

---

## Project Overview

**VectorStore** is a semantic inventory management application that uses client-side AI embeddings to enable natural-language search over a personal item inventory. No backend is required — all AI inference and storage runs in the browser or mobile WebView.

**Architecture:**

| Component | Type | Path |
|---|---|---|
| `VectorStoreMobile` | React Native / Expo mobile app (iOS & Android) | `VectorStoreMobile/` |

---

## Repository Structure

```
VectorStore/
├── INSTRUCTIONS.md
├── VectorStoreMobile/
│   ├── App.js
│   ├── index.js
│   ├── htmlContent.js
│   ├── app.json
│   ├── package.json
│   ├── assets/
│   └── ios/
```

---

## Tech Stack

### Mobile (`VectorStoreMobile`)

- React Native 0.81.5 with Expo 54
- Hermes JavaScript engine
- react-native-webview
- expo-speech-recognition
- @xenova/transformers@2.17.2
- IndexedDB (vectorstock-db)

---

## Prerequisites

- Node.js 18+
- npm 8+

### iOS
- macOS with Xcode 15+
- CocoaPods
- iOS deployment target: 15.1+

### Android
- Android SDK 35+
- Java JDK 17+

---

## Setup

⚠️ **Important: Set up environment variables before running the app.**

```bash
cd VectorStoreMobile
npm install
```

---

## Running

```bash
cd VectorStoreMobile
npx expo run:ios --device
```

---

## Testing

Manual tests:

- Model loading
- Add item
- Semantic search
- Persistence
- Delete item
- Voice input

---

## Key Implementation Details

- UI runs inside WebView via htmlContent.js
- AI runs locally using Transformers.js
- Embeddings: 384-dim vectors
- Cosine similarity threshold: 0.5

---

## Storage

IndexedDB:
- DB: vectorstock-db
- Store: items

Schema:
{
  "id": "<auto>",
  "name": "string",
  "description": "string",
  "embedding": []
}

---

## Environment Variables

⚠️ **Required before running the app**

```env
EXPO_PUBLIC_GROQ_API_KEY=your_key
EXPO_PUBLIC_GEMINI_API_KEY=your_key
```

---

## Common Issues

- CocoaPods errors → update pods
- Blank WebView → ensure Metro running
- Voice issues → rebuild native app

---

## Git Remote

https://github.com/AtharvaWaykar/VectorStore.git
