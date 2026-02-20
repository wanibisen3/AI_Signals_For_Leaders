<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pwx0TIVVnbgbuLgRua9ABlyzR17aTAp1

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create a local env file from the template:
   `cp .env.example .env.local`
3. Set required server env vars in `.env.local`:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` (optional for signout admin revoke)
5. Run the app:
   `npm run dev`

## Backend Pipeline (Local Express)

This repo still includes `server/` for local/backend-only runs, but Vercel deployment now uses `api/*.ts` serverless routes.

1. `cd server`
2. `npm install`
3. `cp .env.example .env`
4. Set `OPENAI_API_KEY` in `server/.env`
5. `npm run dev`

## One URL Setup (Frontend + Backend)

Serve the React app and API from one local URL (`http://localhost:3001`):

1. Install backend deps once:
   `npm --prefix server install`
2. Build frontend:
   `npm run build`
3. Start backend:
   `npm --prefix server start`

Then open `http://localhost:3001`.

## Secure OpenAI Usage

The OpenAI API key is server-side only.

- Do not read `OPENAI_API_KEY` in frontend code.
- Use `POST /api/openai` from the browser.
- The Vercel serverless function in `api/openai.ts` reads `process.env.OPENAI_API_KEY` securely on the server.

Frontend helper:
- `services/openai.ts`

## Deploy on Vercel (Single Domain)

1. Import this repo into Vercel.
2. In Project Settings -> Environment Variables, add:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` (optional but recommended)
   - `OPENAI_MODEL` (optional, defaults to `gpt-4o-mini`)
   - `CACHE_TTL_MS` (optional)
   - `SEMANTIC_DEDUPE_THRESHOLD` (optional)
3. Deploy.

## Google Sign-In Setup (Supabase)

To enable "Continue with Google":

1. In Supabase Dashboard -> Authentication -> Providers, enable Google.
2. Add redirect URLs in Supabase Auth settings:
   - `https://ai-signals-for-leaders.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
