import { handleStripeCheckout, handleStripeWebhook, handleTokenCatalog } from './_lib/backend.js';

export default async function handler(req: any, res: any) {
  const action = String(req.query?.action || req.body?.action || '').trim();

  if (action === 'checkout') return handleStripeCheckout(req, res);
  if (action === 'webhook') return handleStripeWebhook(req, res);
  return handleTokenCatalog(req, res);
}
