import { handleDashboardState, handleRunGeneration, handleSavePersonalization } from './_lib/backend.js';

export default async function handler(req: any, res: any) {
  const action = String(req.query?.action || req.body?.action || '').trim();

  if (action === 'generate') return handleRunGeneration(req, res);
  if (action === 'personalization') return handleSavePersonalization(req, res);
  return handleDashboardState(req, res);
}
