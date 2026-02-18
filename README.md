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
3. Set `OPENAI_API_KEY` in `.env.local`
4. (Optional) Set `VITE_BACKEND_URL` in `.env.local` if backend is not on `http://localhost:3001`
5. Run the app:
   `npm run dev`

## Backend Pipeline

The frontend dashboard expects the Node backend in `server/` to be running for live briefs.

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

## Deploy on Vercel

1. Import this repo into Vercel.
2. In Project Settings -> Environment Variables, add:
   - `OPENAI_API_KEY`
3. Deploy.
