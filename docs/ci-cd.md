# CI/CD and production operations

## Continuous integration

`.github/workflows/ci.yml` runs for web changes on pull requests and pushes to `main`:

- `npm ci`
- Vitest unit and schema-contract tests
- Vite production build
- Preview-server HTTP smoke test

## Deployment

The frontend workflow deploys `VectorStoreWeb/` to Vercel after tests pass. Configure these repository/environment secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set the Vercel project root directory to `VectorStoreWeb`.
The two `VITE_*` values must also be present in the Vercel project's Production Environment Variables because Vercel performs the production build remotely.

The Supabase workflow applies `VectorStoreWeb/supabase/schema.sql` and deploys the `llm` and `cv` Edge Functions. Configure:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`

Set `GEMINI_API_KEY` and `GROQ_API_KEY` as Supabase function secrets separately; they are never stored in GitHub.

## Monitoring

`monitor.yml` checks `PRODUCTION_URL` every 15 minutes. A failed check fails the workflow and opens or comments on one `production-monitoring` issue. Configure the URL as a production environment secret, for example `https://app.example.com`.
