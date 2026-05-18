# VectorStore Web

VectorStore Web is the browser version of the mobile WebView app. It keeps `VectorStoreMobile/` untouched and adds a new React/Vite app with Supabase login, per-user cloud storage, import/export, room/box management, browser voice input, camera capture, assistant actions, and vector search support.

## What You Need To Set Up

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Supabase Authentication settings, enable Email auth. Magic links also work with the current UI.
4. Copy `.env.example` to `.env.local`.
5. Fill in:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

6. Install and run:

```bash
npm install
npm run dev
```

## Optional AI Setup

The website generates item embeddings in the browser using `@huggingface/transformers`, so no private key is needed for normal inventory storage and search.

If you want to re-enable the mobile app's Gemini/Groq assistant and camera-recognition behavior on the website, deploy the Supabase Edge Functions in `supabase/functions` and set these Supabase secrets:

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase secrets set GROQ_API_KEY=your-groq-key
supabase functions deploy llm
supabase functions deploy cv
```

The Assistant page calls the `llm` function. The Camera Scan workflow calls the `cv` function. If those functions are not deployed yet, the assistant falls back to a simple local command parser and camera recognition shows a setup error.

## App Pages

- Home: inventory, semantic search, filters, and sorting only.
- Rooms: add/remove rooms and boxes.
- Add: manual add, voice add, and camera scan.
- Assistant: chat-style LLM actions for add/search/delete.
- Settings: default room, text-to-speech, vector search preference, import/export, and account info.

## Database Shape

- `profiles`: one row per auth user
- `rooms`: user-owned room names
- `boxes`: user-owned boxes/containers inside rooms
- `items`: user-owned inventory records with a `vector(384)` embedding
- `match_items`: SQL function for authenticated semantic search

Row Level Security is enabled on all user data tables. Users can only read and write rows where `user_id = auth.uid()`.

## Migration From Mobile

Use the mobile app's JSON export, then sign into VectorStore Web and use `Import`. The web app regenerates embeddings during import and stores the items in the authenticated account.
