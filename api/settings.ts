import { handleDeleteAccount, handleUpdatePassword } from './_lib/backend.js';

export default async function handler(req: any, res: any) {
  const action = String(req.query?.action || req.body?.action || '').trim();

  if (action === 'delete-account') return handleDeleteAccount(req, res);
  return handleUpdatePassword(req, res);
}
