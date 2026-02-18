# AI Signals Backend

## Run

1. Install dependencies:
`npm install`

2. Create env file:
`cp .env.example .env`

3. Set `OPENAI_API_KEY` (required).
Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (required for auth).
Set `SUPABASE_SECRET_KEY` only if you want server-side token revocation on sign-out.

4. Start:
`npm run dev`

Backend runs on `http://localhost:3001` by default.
If `../dist/index.html` exists, this server also serves the frontend app on the same URL.

## Storage model

- Auth accounts and sessions are managed by Supabase Auth.
- Pipeline outputs are generated at runtime and are not persisted.

## Endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/session`
- `POST /api/auth/signout`
- `POST /api/signals`
- `GET /api/generate-briefs` (compatibility endpoint)
- `POST /api/pipeline/run`
- `GET /api/briefs/pending`
- `GET /api/briefs/published`
- `POST /api/briefs/:briefId/approve`
- `POST /api/briefs/:briefId/reject`

## Review flow

- Pipeline-generated briefs default to `pending_review`.
- Use `POST /api/briefs/:briefId/approve` to publish.
- Use `POST /api/briefs/:briefId/reject` to drop.

## Example request

```bash
curl -X POST http://localhost:3001/api/signals \
  -H "Content-Type: application/json" \
  -d '{
    "time_horizon": "30d",
    "tier_filter": "ALL",
    "limit": 5,
    "preferences": {
      "role": "Founder",
      "companySize": "Startup",
      "decisionAreas": ["GTM", "Product"],
      "mainConcern": "shipping AI copilots faster",
      "hasPersonalized": true
    }
  }'
```
