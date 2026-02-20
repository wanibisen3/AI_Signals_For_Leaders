import { createRequire } from 'node:module';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const { fetchNews } = require('../../server/services/ingest');
const {
  normalizeItems,
  deduplicateItems,
  clusterItems,
  scoreAndRankClusters,
  generateBrief
} = require('../../server/services/process');

type SupabaseLike = ReturnType<typeof createClient> | null;
type AnyReq = any;
type AnyRes = any;

type PipelineState = {
  lastRunAt: string | null;
  lastCount: number;
  cache: Map<string, { createdAt: number; payload: any }>;
  reviewBriefs: Map<string, any>;
};

const globalState = globalThis as typeof globalThis & {
  __aiSignalsPipelineState?: PipelineState;
};

const pipelineState: PipelineState = globalState.__aiSignalsPipelineState || {
  lastRunAt: null,
  lastCount: 0,
  cache: new Map(),
  reviewBriefs: new Map()
};

globalState.__aiSignalsPipelineState = pipelineState;

let initialized = false;
let supabaseAuth: SupabaseLike = null;
let supabaseAdmin: SupabaseLike = null;

function looksLikeConfigured(value = '') {
  const text = String(value || '').trim();
  return Boolean(text) && !text.startsWith('your_');
}

function isValidHttpUrl(value = '') {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function initSupabaseClients() {
  if (initialized) return;

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const authKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || '';

  const canInitAuth = looksLikeConfigured(supabaseUrl) && looksLikeConfigured(authKey) && isValidHttpUrl(supabaseUrl);
  const canInitAdmin = looksLikeConfigured(supabaseUrl) && looksLikeConfigured(serviceKey) && isValidHttpUrl(supabaseUrl);

  supabaseAuth = canInitAuth ? createClient(supabaseUrl, authKey) : null;
  supabaseAdmin = canInitAdmin ? createClient(supabaseUrl, serviceKey) : null;
  initialized = true;
}

function methodNotAllowed(res: AnyRes, method: string) {
  res.setHeader('Allow', method);
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

function defaultPreferences() {
  return {
    role: '',
    companySize: '',
    decisionAreas: [],
    mainConcern: '',
    hasPersonalized: false
  };
}

function mapAuthUser(email = '') {
  return { email, preferences: defaultPreferences() };
}

function getAuthToken(req: AnyReq) {
  const header = req.headers?.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return req.body?.token || req.query?.token || '';
}

function normalizeEmail(email = '') {
  return String(email || '').trim().toLowerCase();
}

async function readBody(req: AnyReq) {
  if (req.body !== undefined) {
    if (typeof req.body !== 'string') return req.body || {};
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function parsePipelineRequest(input: any = {}) {
  const parsedLimit = Number(input.limit || 7);
  const rawPreferences = input.preferences || {};
  const normalizedPreferences = {
    role: String(rawPreferences.role || '').trim(),
    companySize: String(rawPreferences.companySize || '').trim(),
    decisionAreas: Array.isArray(rawPreferences.decisionAreas)
      ? rawPreferences.decisionAreas.map((x: any) => String(x || '').trim()).filter(Boolean)
      : [],
    mainConcern: String(rawPreferences.mainConcern || '').trim(),
    hasPersonalized: Boolean(rawPreferences.hasPersonalized)
  };
  return {
    preferences: normalizedPreferences,
    timeHorizon: input.time_horizon || input.timeHorizon || '30d',
    tierFilter: input.tier_filter || input.tierFilter || 'ALL',
    limit: Number.isFinite(parsedLimit) ? Math.max(1, Math.min(parsedLimit, 20)) : 7,
    bypassCache: Boolean(input.bypass_cache || input.bypassCache)
  };
}

function preferencesKey(preferences: any = {}, timeHorizon = '30d', tierFilter = 'ALL', limit = 7) {
  return JSON.stringify({
    role: preferences.role || '',
    companySize: preferences.companySize || '',
    decisionAreas: preferences.decisionAreas || [],
    mainConcern: preferences.mainConcern || '',
    timeHorizon,
    tierFilter,
    limit
  });
}

async function runPipeline({
  preferences = {},
  timeHorizon = '30d',
  tierFilter = 'ALL',
  limit = 7
}: {
  preferences?: any;
  timeHorizon?: string;
  tierFilter?: string;
  limit?: number;
}) {
  const rawItems = await fetchNews(tierFilter);
  const normalized = normalizeItems(rawItems);
  const deduped = deduplicateItems(normalized);
  const clusters = clusterItems(deduped);
  const ranked = scoreAndRankClusters(clusters, preferences, timeHorizon);

  const topClusters = ranked.slice(0, Number(limit));
  const briefs = (await Promise.all(topClusters.map((cluster: any) => generateBrief(cluster, preferences)))).filter(Boolean);

  for (const brief of briefs) {
    pipelineState.reviewBriefs.set(brief.id, brief);
  }

  pipelineState.lastRunAt = new Date().toISOString();
  pipelineState.lastCount = briefs.length;

  return {
    briefs,
    meta: {
      fetched: rawItems.length,
      normalized: normalized.length,
      deduped: deduped.length,
      clusters: clusters.length,
      ranked: ranked.length,
      returned: briefs.length,
      reviewPending: briefs.filter((brief: any) => brief.reviewStatus === 'pending_review').length,
      lastRunAt: pipelineState.lastRunAt
    }
  };
}

export async function handleHealth(req: AnyReq, res: AnyRes) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
  initSupabaseClients();

  return res.json({
    ok: true,
    service: 'ai-signals-backend',
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasSupabaseAuth: Boolean(supabaseAuth),
    lastRunAt: pipelineState.lastRunAt,
    lastCount: pipelineState.lastCount
  });
}

export async function handleAuthSignup(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initSupabaseClients();

  try {
    if (!supabaseAuth) {
      return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
    }

    const body = await readBody(req);
    const email = normalizeEmail(body?.email);
    const password = String(body?.password || '');

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    const signUpResult = await supabaseAuth.auth.signUp({ email, password });
    if (signUpResult.error) {
      return res.status(400).json({ success: false, error: signUpResult.error.message });
    }

    let session = signUpResult.data.session || null;
    if (!session) {
      const signInResult = await supabaseAuth.auth.signInWithPassword({ email, password });
      if (!signInResult.error && signInResult.data.session) session = signInResult.data.session;
    }

    if (!session) {
      return res.status(400).json({
        success: false,
        error: 'Account created. Enable email login in Supabase (or confirm email) before signing in.'
      });
    }

    return res.json({
      success: true,
      token: session.access_token,
      user: mapAuthUser(signUpResult.data.user?.email || email)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Signup failed' });
  }
}

export async function handleAuthSignin(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initSupabaseClients();

  try {
    if (!supabaseAuth) {
      return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
    }

    const body = await readBody(req);
    const email = normalizeEmail(body?.email);
    const password = String(body?.password || '');

    const signInResult = await supabaseAuth.auth.signInWithPassword({ email, password });
    if (signInResult.error || !signInResult.data.session) {
      return res.status(401).json({ success: false, error: signInResult.error?.message || 'Invalid email or password' });
    }

    return res.json({
      success: true,
      token: signInResult.data.session.access_token,
      user: mapAuthUser(signInResult.data.user?.email || email)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Signin failed' });
  }
}

export async function handleAuthSession(req: AnyReq, res: AnyRes) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
  initSupabaseClients();

  try {
    if (!supabaseAuth) {
      return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
    }

    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ success: false, error: 'Invalid session' });

    const userResult = await supabaseAuth.auth.getUser(token);
    if (userResult.error || !userResult.data.user) {
      return res.status(401).json({ success: false, error: 'Invalid session' });
    }

    return res.json({
      success: true,
      user: mapAuthUser(userResult.data.user.email || '')
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Session check failed' });
  }
}

export async function handleAuthSignout(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initSupabaseClients();

  try {
    const body = await readBody(req);
    if (req.body === undefined) req.body = body;
    const token = getAuthToken(req);

    if (token && supabaseAdmin && (supabaseAdmin as any).auth?.admin?.signOut) {
      await (supabaseAdmin as any).auth.admin.signOut(token);
    }

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Signout failed' });
  }
}

export async function handleSignals(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  try {
    const body = await readBody(req);
    const { preferences, timeHorizon, tierFilter, limit, bypassCache } = parsePipelineRequest(body || {});
    const cacheKey = preferencesKey(preferences, timeHorizon, tierFilter, limit);
    const cached = pipelineState.cache.get(cacheKey);
    const now = Date.now();
    const ttlMs = Number(process.env.CACHE_TTL_MS || 15 * 60 * 1000);

    if (!bypassCache && cached && now - cached.createdAt < ttlMs) {
      return res.json({ success: true, fromCache: true, ...cached.payload });
    }

    const payload = await runPipeline({ preferences, timeHorizon, tierFilter, limit });
    pipelineState.cache.set(cacheKey, { createdAt: now, payload });
    return res.json({ success: true, fromCache: false, ...payload });
  } catch (error: any) {
    console.error('POST /api/signals failed:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Pipeline failed' });
  }
}
