import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

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
};

const globalState = globalThis as typeof globalThis & {
  __aiSignalsPipelineState?: PipelineState;
};

const pipelineState: PipelineState = globalState.__aiSignalsPipelineState || {
  lastRunAt: null,
  lastCount: 0,
  cache: new Map()
};

globalState.__aiSignalsPipelineState = pipelineState;

const TOKEN_TIERS = [
  { packageCode: 'sgd_1_10', amountCents: 100, tokens: 10, label: 'SGD 1' },
  { packageCode: 'sgd_10_150', amountCents: 1000, tokens: 150, label: 'SGD 10' },
  { packageCode: 'sgd_70_1000', amountCents: 7000, tokens: 1000, label: 'SGD 70' }
] as const;
const FIXED_BRIEF_COUNT = 18;

let initialized = false;
let supabaseAuth: SupabaseLike = null;
let supabaseAdmin: SupabaseLike = null;
let stripeClient: Stripe | null = null;
let testOverrides: { auth?: SupabaseLike; admin?: SupabaseLike; stripe?: Stripe | null } | null = null;

function looksLikeConfigured(value = '') {
  const text = String(value || '').trim();
  return Boolean(text) && !text.startsWith('your_');
}

function isMissingTableError(error: any, tableName: string) {
  const message = String(error?.message || '').toLowerCase();
  const normalizedTable = tableName.toLowerCase();
  return (
    (message.includes('relation') && message.includes(normalizedTable) && message.includes('does not exist')) ||
    (message.includes('could not find the table') && message.includes(normalizedTable) && message.includes('schema cache'))
  );
}

function isMissingColumnError(error: any, tableName: string, columnName: string) {
  const message = String(error?.message || '').toLowerCase();
  return (
    (message.includes('could not find the') &&
      message.includes(columnName.toLowerCase()) &&
      message.includes(tableName.toLowerCase()) &&
      message.includes('schema cache')) ||
    (message.includes('column') &&
      message.includes(columnName.toLowerCase()) &&
      message.includes('does not exist'))
  );
}

function isMissingFunctionError(error: any, functionName: string) {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('could not find the function') &&
    message.includes(functionName.toLowerCase())
  );
}

function isAccountDeactivatedError(error: any) {
  return String(error?.message || '').toLowerCase().includes('account has been deactivated');
}

function isUserAlreadyRegisteredError(error: any) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('already registered') || message.includes('user already exists');
}

function isValidHttpUrl(value = '') {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function initClients() {
  if (testOverrides) {
    supabaseAuth = testOverrides.auth ?? null;
    supabaseAdmin = testOverrides.admin ?? null;
    stripeClient = testOverrides.stripe ?? null;
    initialized = true;
    return;
  }
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

export function __setTestClients(overrides: { auth?: SupabaseLike; admin?: SupabaseLike; stripe?: Stripe | null }) {
  testOverrides = overrides;
  initialized = false;
}

export function __resetTestClients() {
  testOverrides = null;
  initialized = false;
  supabaseAuth = null;
  supabaseAdmin = null;
  stripeClient = null;
}

function getStripeClient() {
  if (stripeClient) return stripeClient;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  stripeClient = new Stripe(secret, { apiVersion: '2025-01-27.acacia' });
  return stripeClient;
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
    keywords: [],
    hasPersonalized: false
  };
}

function parseKeywords(raw: any): string[] {
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x || '').trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw.split(',').map((x) => x.trim()).filter(Boolean);
  }
  return [];
}

function toPreferences(row: any) {
  if (!row) return defaultPreferences();
  const role = String(row.role || '').trim();
  const companySize = String(row.company_maturity || '').trim();
  const mainConcern = String(row.main_focus || '').trim();
  const keywords = parseKeywords(row.keywords || []);
  const decisionAreas = parseKeywords(row.decision_areas || []);

  return {
    role,
    companySize,
    decisionAreas,
    mainConcern,
    keywords,
    hasPersonalized: Boolean(role || companySize || mainConcern || keywords.length || decisionAreas.length)
  };
}

function toPersonalizationRecord(preferences: any = {}) {
  return {
    role: String(preferences.role || '').trim(),
    company_maturity: String(preferences.companySize || '').trim(),
    main_focus: String(preferences.mainConcern || '').trim(),
    keywords: parseKeywords(preferences.keywords || []),
    decision_areas: Array.isArray(preferences.decisionAreas)
      ? preferences.decisionAreas.map((x: any) => String(x || '').trim()).filter(Boolean)
      : []
  };
}

function getAuthToken(req: AnyReq) {
  const header = req.headers?.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return req.body?.token || req.query?.token || '';
}

function getRequestOrigin(req: AnyReq) {
  const explicitOrigin = String(process.env.PUBLIC_APP_URL || '').trim();
  if (explicitOrigin) return explicitOrigin.replace(/\/+$/, '');

  const forwardedProto = String(req.headers?.['x-forwarded-proto'] || '').split(',')[0].trim();
  const forwardedHost = String(req.headers?.['x-forwarded-host'] || '').split(',')[0].trim();
  const host = forwardedHost || String(req.headers?.host || '').trim();
  const proto = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
  if (!host) return '';
  return `${proto}://${host}`;
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

async function readRawBody(req: AnyReq) {
  if (typeof req.body === 'string') return req.body;
  if (req.body && Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function requireAuth(req: AnyReq, res: AnyRes) {
  initClients();
  if (!supabaseAuth || !supabaseAdmin) {
    res.status(503).json({ success: false, error: 'Supabase is not configured' });
    return null;
  }

  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Missing authorization token' });
    return null;
  }

  const userResult = await supabaseAuth.auth.getUser(token);
  if (userResult.error || !userResult.data.user) {
    res.status(401).json({ success: false, error: 'Invalid session' });
    return null;
  }

  return {
    token,
    user: userResult.data.user
  };
}

async function ensureUserInitialized(userId: string, email: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const firstAttempt = await supabaseAdmin.rpc('ensure_user_initialized', {
    p_user_id: userId,
    p_email: email || ''
  });
  if (!firstAttempt.error) return;

  const secondAttempt = await supabaseAdmin.rpc('ensure_user_initialized', {
    p_email: email || '',
    p_user_id: userId
  });
  if (!secondAttempt.error) return;

  // Compatibility fallback for environments where SQL functions were not applied yet.
  const userUpsert = await supabaseAdmin
    .from('app_users')
    .upsert({ user_id: userId, email: email || '', updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (userUpsert.error) {
    if (isMissingTableError(userUpsert.error, 'app_users')) return;
    throw userUpsert.error;
  }

  const personalizationUpsert = await supabaseAdmin
    .from('user_personalizations')
    .upsert({ user_id: userId, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (personalizationUpsert.error) {
    if (isMissingTableError(personalizationUpsert.error, 'user_personalizations')) return;
    throw personalizationUpsert.error;
  }

  const balanceQuery = await supabaseAdmin
    .from('user_token_balances')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle();
  if (balanceQuery.error) {
    if (isMissingTableError(balanceQuery.error, 'user_token_balances')) return;
    throw balanceQuery.error;
  }

  if (!balanceQuery.data) {
    const insertBalance = await supabaseAdmin
      .from('user_token_balances')
      .insert({ user_id: userId, balance: 10 });
    if (insertBalance.error) {
      if (isMissingTableError(insertBalance.error, 'user_token_balances')) return;
      throw insertBalance.error;
    }

    const grantTx = await supabaseAdmin
      .from('token_transactions')
      .insert({
        user_id: userId,
        type: 'grant',
        amount: 10,
        reason: 'Initial token grant',
        idempotency_key: `grant:init:${userId}`,
        metadata: { source: 'system' }
      });
    if (grantTx.error && grantTx.error.code !== '23505') {
      if (isMissingTableError(grantTx.error, 'token_transactions')) return;
      throw grantTx.error;
    }
  }
}

async function assertActiveUser(userId: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const { data, error } = await supabaseAdmin
    .from('app_users')
    .select('user_id, deleted_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error, 'app_users')) return;
    throw error;
  }
  if (data?.deleted_at) {
    throw new Error('Account has been deactivated');
  }
}

async function getTokenBalance(userId: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const { data, error } = await supabaseAdmin
    .from('user_token_balances')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error, 'user_token_balances')) {
      return 0;
    }
    throw error;
  }
  return Number(data?.balance || 0);
}

async function getPersonalization(userId: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const { data, error } = await supabaseAdmin
    .from('user_personalizations')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error, 'user_personalizations')) {
      return defaultPreferences();
    }
    throw error;
  }
  return toPreferences(data);
}

async function loadUserStateSafe(userId: string) {
  try {
    return {
      personalization: await getPersonalization(userId),
      tokenBalance: await getTokenBalance(userId)
    };
  } catch {
    return {
      personalization: defaultPreferences(),
      tokenBalance: 0
    };
  }
}

async function tryReactivateDeletedAccount(email: string, password: string) {
  if (!supabaseAdmin || !supabaseAuth || !(supabaseAdmin as any).auth?.admin?.updateUserById) return null;

  const { data: appUser, error: appUserError } = await supabaseAdmin
    .from('app_users')
    .select('user_id, deleted_at')
    .eq('email', email)
    .maybeSingle();

  if (appUserError) {
    if (isMissingTableError(appUserError, 'app_users')) return null;
    throw appUserError;
  }
  if (!appUser?.user_id || !appUser?.deleted_at) return null;

  const updateResult = await (supabaseAdmin as any).auth.admin.updateUserById(appUser.user_id, {
    password
  });
  if (updateResult.error) throw updateResult.error;

  const { error: reactivateError } = await supabaseAdmin
    .from('app_users')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq('user_id', appUser.user_id);
  if (reactivateError && !isMissingTableError(reactivateError, 'app_users')) throw reactivateError;

  const signInResult = await supabaseAuth.auth.signInWithPassword({ email, password });
  if (signInResult.error || !signInResult.data.session || !signInResult.data.user?.id) {
    return null;
  }

  await ensureUserInitialized(signInResult.data.user.id, signInResult.data.user.email || email);
  await assertActiveUser(signInResult.data.user.id);
  const state = await loadUserStateSafe(signInResult.data.user.id);

  return {
    token: signInResult.data.session.access_token,
    user: mapAuthUser(signInResult.data.user, state.personalization),
    tokenBalance: state.tokenBalance
  };
}

async function savePersonalization(userId: string, preferences: any) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const record = toPersonalizationRecord(preferences);
  const firstAttempt = await supabaseAdmin
    .from('user_personalizations')
    .upsert({ user_id: userId, ...record, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (!firstAttempt.error) return record;

  if (isMissingColumnError(firstAttempt.error, 'user_personalizations', 'decision_areas')) {
    const { decision_areas: _unused, ...withoutDecisionAreas } = record;
    const secondAttempt = await supabaseAdmin
      .from('user_personalizations')
      .upsert({ user_id: userId, ...withoutDecisionAreas, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (!secondAttempt.error) return record;
    if (isMissingTableError(secondAttempt.error, 'user_personalizations')) {
      return record;
    }
    throw secondAttempt.error;
  }

  if (isMissingTableError(firstAttempt.error, 'user_personalizations')) {
    return record;
  }
  throw firstAttempt.error;
}

function personalizationChanged(before: any, afterRecord: any) {
  const beforeRecord = toPersonalizationRecord(before || {});
  return JSON.stringify(beforeRecord) !== JSON.stringify(afterRecord);
}

function parsePipelineRequest(input: any = {}) {
  const rawPreferences = input.preferences || {};
  const normalizedPreferences = {
    role: String(rawPreferences.role || '').trim(),
    companySize: String(rawPreferences.companySize || '').trim(),
    decisionAreas: Array.isArray(rawPreferences.decisionAreas)
      ? rawPreferences.decisionAreas.map((x: any) => String(x || '').trim()).filter(Boolean)
      : [],
    mainConcern: String(rawPreferences.mainConcern || '').trim(),
    keywords: parseKeywords(rawPreferences.keywords || []),
    hasPersonalized: Boolean(rawPreferences.hasPersonalized)
  };
  return {
    preferences: normalizedPreferences,
    timeHorizon: input.time_horizon || input.timeHorizon || '30d',
    tierFilter: input.tier_filter || input.tierFilter || 'ALL',
    limit: FIXED_BRIEF_COUNT,
    bypassCache: Boolean(input.bypass_cache || input.bypassCache)
  };
}

function preferencesKey(preferences: any = {}, timeHorizon = '30d', tierFilter = 'ALL', limit = 18) {
  return JSON.stringify({
    role: preferences.role || '',
    companySize: preferences.companySize || '',
    decisionAreas: preferences.decisionAreas || [],
    mainConcern: preferences.mainConcern || '',
    keywords: preferences.keywords || [],
    timeHorizon,
    tierFilter,
    limit
  });
}

async function buildBriefPayload({ preferences = {}, timeHorizon = '30d', tierFilter = 'ALL', limit = 18 }) {
  const rawItems = await fetchNews(tierFilter);
  const normalized = normalizeItems(rawItems);
  const deduped = deduplicateItems(normalized);
  const clusters = clusterItems(deduped);
  const ranked = scoreAndRankClusters(clusters, preferences, timeHorizon);

  const hasPersonalization = Boolean(
    preferences?.role ||
    preferences?.mainConcern ||
    (Array.isArray(preferences?.decisionAreas) && preferences.decisionAreas.length) ||
    (Array.isArray(preferences?.keywords) && preferences.keywords.length)
  );
  const requestedLimit = Number(limit);
  const focusQuota = hasPersonalization ? Math.ceil(requestedLimit * 0.9) : 0;
  const focusFirst = ranked.filter((cluster: any) => (cluster?.ranking?.focusMatch || 0) >= 0.45);
  const others = ranked.filter((cluster: any) => (cluster?.ranking?.focusMatch || 0) < 0.45);
  const prioritized = hasPersonalization
    ? [...focusFirst.slice(0, focusQuota), ...others, ...focusFirst.slice(focusQuota)]
    : ranked;

  const topClusters = prioritized.slice(0, requestedLimit);
  const briefs = (await Promise.all(topClusters.map((cluster: any) => generateBrief(cluster, preferences)))).filter(Boolean);

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

async function saveCompletedBatch(userId: string, batchId: string, briefs: any[]) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const { error } = await supabaseAdmin.rpc('complete_generation_batch', {
    p_user_id: userId,
    p_batch_id: batchId,
    p_items: briefs
  });
  if (error) throw error;
}

async function markBatchFailedAndRefund(userId: string, batchId: string, generationRequestId: string, message: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const { error } = await supabaseAdmin.rpc('fail_generation_and_refund', {
    p_user_id: userId,
    p_batch_id: batchId,
    p_generation_request_id: generationRequestId,
    p_error: message
  });
  if (error) throw error;
}

async function getLatestCompletedBatch(userId: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');

  const { data: batch, error: batchError } = await supabaseAdmin
    .from('brief_batches')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (batchError) throw batchError;
  if (!batch) return { batch: null, briefs: [] };

  const { data: items, error: itemError } = await supabaseAdmin
    .from('brief_items')
    .select('payload, item_order')
    .eq('batch_id', batch.id)
    .order('item_order', { ascending: true });
  if (itemError) throw itemError;

  const briefs = (items || []).map((x: any) => x.payload);
  return { batch, briefs };
}

async function getLatestCompletedBatchSafe(userId: string) {
  try {
    return await getLatestCompletedBatch(userId);
  } catch (error: any) {
    if (isMissingTableError(error, 'brief_batches') || isMissingTableError(error, 'brief_items')) {
      return { batch: null, briefs: [] };
    }
    throw error;
  }
}

async function runGenerationForUser({
  userId,
  preferences,
  limit,
  generationRequestId,
  timeHorizon = '30d',
  tierFilter = 'ALL'
}: {
  userId: string;
  preferences: any;
  limit: number;
  generationRequestId: string;
  timeHorizon?: string;
  tierFilter?: string;
}) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');

  const claimResult = await supabaseAdmin.rpc('claim_generation_token', {
    p_user_id: userId,
    p_generation_request_id: generationRequestId,
    p_requested_brief_count: limit,
    p_personalization_snapshot: toPersonalizationRecord(preferences)
  });

  if (claimResult.error) throw claimResult.error;
  const claimRow = claimResult.data?.[0];
  if (!claimRow) throw new Error('Generation claim failed');

  if (claimRow.error_code === 'duplicate_request') {
    const existingBatchId = claimRow.batch_id;
    const { data: existingBatch } = await supabaseAdmin
      .from('brief_batches')
      .select('id, status, error_message')
      .eq('id', existingBatchId)
      .maybeSingle();

    if (existingBatch?.status === 'completed') {
      const { batch, briefs } = await getLatestCompletedBatch(userId);
      return {
        success: true,
        duplicate: true,
        batch,
        briefs,
        balance: await getTokenBalance(userId)
      };
    }

    return {
      success: false,
      duplicate: true,
      error: existingBatch?.error_message || 'Duplicate generation request in progress'
    };
  }

  if (claimRow.error_code === 'insufficient_tokens') {
    return {
      success: false,
      error: 'Insufficient tokens',
      code: 'insufficient_tokens',
      balance: claimRow.balance_after ?? 0
    };
  }

  const batchId = claimRow.batch_id;
  try {
    const payload = await buildBriefPayload({ preferences, timeHorizon, tierFilter, limit });
    await saveCompletedBatch(userId, batchId, payload.briefs);
    return {
      success: true,
      batch: {
        id: batchId,
        status: 'completed',
        createdAt: new Date().toISOString()
      },
      briefs: payload.briefs,
      meta: payload.meta,
      balance: await getTokenBalance(userId)
    };
  } catch (error: any) {
    await markBatchFailedAndRefund(userId, batchId, generationRequestId, error?.message || 'Generation failed');
    return {
      success: false,
      error: error?.message || 'Generation failed',
      code: 'generation_failed',
      balance: await getTokenBalance(userId)
    };
  }
}

function getCheckoutTiers() {
  return TOKEN_TIERS.map((tier) => ({
    packageCode: tier.packageCode,
    currency: 'SGD',
    amount: tier.amountCents / 100,
    tokens: tier.tokens,
    label: tier.label,
    mostPopular: tier.packageCode === 'sgd_10_150'
  }));
}

async function ensureStripeCatalog() {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const stripe = getStripeClient();
  if (!stripe) throw new Error('Stripe is not configured');

  const { data: existingRows, error: existingError } = await supabaseAdmin
    .from('stripe_price_catalog')
    .select('*');
  if (existingError) throw existingError;

  const byCode = new Map((existingRows || []).map((row: any) => [row.package_code, row]));

  for (const tier of TOKEN_TIERS) {
    if (byCode.has(tier.packageCode)) continue;

    const product = await stripe.products.create({
      name: `AI Signals Tokens (${tier.label})`,
      description: `${tier.tokens} tokens`,
      metadata: {
        packageCode: tier.packageCode,
        tokens: String(tier.tokens)
      }
    });

    const price = await stripe.prices.create({
      currency: 'sgd',
      unit_amount: tier.amountCents,
      product: product.id,
      metadata: {
        packageCode: tier.packageCode,
        tokens: String(tier.tokens)
      }
    });

    const { error: insertError } = await supabaseAdmin
      .from('stripe_price_catalog')
      .insert({
        package_code: tier.packageCode,
        currency: 'sgd',
        amount_cents: tier.amountCents,
        tokens: tier.tokens,
        stripe_product_id: product.id,
        stripe_price_id: price.id
      });
    if (insertError) throw insertError;
  }
}

async function getCatalogRow(packageCode: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
  const { data, error } = await supabaseAdmin
    .from('stripe_price_catalog')
    .select('*')
    .eq('package_code', packageCode)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function mapAuthUser(user: any, preferences: any) {
  return {
    id: user.id,
    email: user.email || '',
    preferences: preferences || defaultPreferences()
  };
}

export async function handleHealth(req: AnyReq, res: AnyRes) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
  initClients();

  return res.json({
    ok: true,
    service: 'ai-signals-backend',
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasSupabaseAuth: Boolean(supabaseAuth),
    hasSupabaseAdmin: Boolean(supabaseAdmin),
    hasStripe: Boolean(process.env.STRIPE_SECRET_KEY),
    lastRunAt: pipelineState.lastRunAt,
    lastCount: pipelineState.lastCount
  });
}

export async function handleAuthSignup(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initClients();

  try {
    if (!supabaseAuth) {
      return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
    }

    const body = await readBody(req);
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    const signUpResult = await supabaseAuth.auth.signUp({ email, password });
    if (signUpResult.error) {
      if (isUserAlreadyRegisteredError(signUpResult.error)) {
        const reactivated = await tryReactivateDeletedAccount(email, password);
        if (reactivated) {
          return res.json({
            success: true,
            ...reactivated
          });
        }
      }
      return res.status(400).json({ success: false, error: signUpResult.error.message });
    }

    let session = signUpResult.data.session || null;
    if (!session) {
      const signInResult = await supabaseAuth.auth.signInWithPassword({ email, password });
      if (!signInResult.error && signInResult.data.session) session = signInResult.data.session;
    }

    if (!session || !signUpResult.data.user?.id) {
      return res.status(400).json({
        success: false,
        error: 'Account created. Enable email login in Supabase (or confirm email) before signing in.'
      });
    }

    await ensureUserInitialized(signUpResult.data.user.id, signUpResult.data.user.email || email);
    const state = await loadUserStateSafe(signUpResult.data.user.id);

    return res.json({
      success: true,
      token: session.access_token,
      user: mapAuthUser(signUpResult.data.user, state.personalization),
      tokenBalance: state.tokenBalance
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Signup failed' });
  }
}

export async function handleAuthSignin(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initClients();

  try {
    if (!supabaseAuth) {
      return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
    }

    const body = await readBody(req);
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    const signInResult = await supabaseAuth.auth.signInWithPassword({ email, password });
    if (signInResult.error || !signInResult.data.session || !signInResult.data.user?.id) {
      return res.status(401).json({ success: false, error: signInResult.error?.message || 'Invalid email or password' });
    }

    await ensureUserInitialized(signInResult.data.user.id, signInResult.data.user.email || email);
    await assertActiveUser(signInResult.data.user.id);
    const state = await loadUserStateSafe(signInResult.data.user.id);

    return res.json({
      success: true,
      token: signInResult.data.session.access_token,
      user: mapAuthUser(signInResult.data.user, state.personalization),
      tokenBalance: state.tokenBalance
    });
  } catch (error: any) {
    if (isAccountDeactivatedError(error)) {
      return res.status(401).json({
        success: false,
        error: 'No user exists for this account. Please create a new account.',
        code: 'account_deleted'
      });
    }
    return res.status(500).json({ success: false, error: error?.message || 'Signin failed' });
  }
}

export async function handleAuthSession(req: AnyReq, res: AnyRes) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    await ensureUserInitialized(auth.user.id, auth.user.email || '');
    await assertActiveUser(auth.user.id);
    const state = await loadUserStateSafe(auth.user.id);

    return res.json({
      success: true,
      user: mapAuthUser(auth.user, state.personalization),
      tokenBalance: state.tokenBalance
    });
  } catch (error: any) {
    if (isAccountDeactivatedError(error)) {
      return res.status(401).json({
        success: false,
        error: 'No user exists for this account. Please create a new account.',
        code: 'account_deleted'
      });
    }
    return res.status(500).json({ success: false, error: error?.message || 'Session check failed' });
  }
}

export async function handleAuthSignout(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initClients();

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

export async function handleAuthGoogleStart(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initClients();

  try {
    if (!supabaseAuth) {
      return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
    }

    const body = await readBody(req);
    const origin = getRequestOrigin(req);
    const fallbackRedirect = origin ? `${origin}/auth/callback` : undefined;
    const redirectTo = String(body?.redirectTo || fallbackRedirect || '').trim();
    if (!redirectTo) {
      return res.status(400).json({ success: false, error: 'Missing redirect URL' });
    }

    const startResult = await supabaseAuth.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });

    if (startResult.error || !startResult.data?.url) {
      return res.status(400).json({
        success: false,
        error: startResult.error?.message || 'Failed to start Google authentication'
      });
    }

    return res.json({ success: true, url: startResult.data.url });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Google auth start failed' });
  }
}

export async function handleAuthExchange(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initClients();

  try {
    if (!supabaseAuth) {
      return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
    }

    const body = await readBody(req);
    const code = String(body?.code || '').trim();
    if (!code) return res.status(400).json({ success: false, error: 'Missing auth code' });

    const exchangeResult = await supabaseAuth.auth.exchangeCodeForSession(code);
    if (exchangeResult.error || !exchangeResult.data?.session || !exchangeResult.data.user?.id) {
      return res.status(400).json({
        success: false,
        error: exchangeResult.error?.message || 'Failed to exchange auth code'
      });
    }

    await ensureUserInitialized(exchangeResult.data.user.id, exchangeResult.data.user.email || '');
    await assertActiveUser(exchangeResult.data.user.id);
    const state = await loadUserStateSafe(exchangeResult.data.user.id);

    const session = exchangeResult.data.session;
    return res.json({
      success: true,
      token: session.access_token,
      user: mapAuthUser(exchangeResult.data.user, state.personalization),
      tokenBalance: state.tokenBalance
    });
  } catch (error: any) {
    if (isAccountDeactivatedError(error)) {
      return res.status(401).json({
        success: false,
        error: 'No user exists for this account. Please create a new account.',
        code: 'account_deleted'
      });
    }
    return res.status(500).json({ success: false, error: error?.message || 'Auth exchange failed' });
  }
}

export async function handleDashboardState(req: AnyReq, res: AnyRes) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    await ensureUserInitialized(auth.user.id, auth.user.email || '');
    await assertActiveUser(auth.user.id);

    const [state, latest] = await Promise.all([
      loadUserStateSafe(auth.user.id),
      getLatestCompletedBatchSafe(auth.user.id)
    ]);

    return res.json({
      success: true,
      tokenBalance: state.tokenBalance,
      personalization: state.personalization,
      latestBatch: latest.batch,
      briefs: latest.briefs,
      hasBatch: Boolean(latest.batch)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Failed to load dashboard state' });
  }
}

export async function handleRunGeneration(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    await ensureUserInitialized(auth.user.id, auth.user.email || '');
    await assertActiveUser(auth.user.id);

    const body = await readBody(req);
    const generationRequestId = String(body?.generationRequestId || crypto.randomUUID());
    const personalization = await getPersonalization(auth.user.id);

    const result = await runGenerationForUser({
      userId: auth.user.id,
      preferences: personalization,
      limit: FIXED_BRIEF_COUNT,
      generationRequestId
    });

    if (!result.success) {
      const status = result.code === 'insufficient_tokens' ? 402 : 400;
      return res.status(status).json({ success: false, ...result });
    }

    return res.json({ success: true, ...result });
  } catch (error: any) {
    if (
      isMissingTableError(error, 'user_personalizations') ||
      isMissingTableError(error, 'user_token_balances') ||
      isMissingTableError(error, 'brief_batches') ||
      isMissingTableError(error, 'brief_items') ||
      isMissingTableError(error, 'token_transactions') ||
      isMissingFunctionError(error, 'claim_generation_token')
    ) {
      return res.status(503).json({
        success: false,
        error: 'Generation is unavailable until database migrations are applied'
      });
    }
    return res.status(500).json({ success: false, error: error?.message || 'Generation failed' });
  }
}

export async function handleSavePersonalization(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    await ensureUserInitialized(auth.user.id, auth.user.email || '');
    await assertActiveUser(auth.user.id);

    const body = await readBody(req);
    const existing = await getPersonalization(auth.user.id);

    const nextPreferences = {
      role: String(body?.role || ''),
      companySize: String(body?.companySize || ''),
      mainConcern: String(body?.mainConcern || ''),
      keywords: parseKeywords(body?.keywords || []),
      decisionAreas: Array.isArray(body?.decisionAreas) ? body.decisionAreas : existing.decisionAreas,
      hasPersonalized: true
    };

    const savedRecord = await savePersonalization(auth.user.id, nextPreferences);
    const changed = personalizationChanged(existing, savedRecord);

    if (!changed) {
      return res.json({
        success: true,
        changed: false,
        generated: false,
        personalization: toPreferences(savedRecord),
        tokenBalance: await getTokenBalance(auth.user.id)
      });
    }

    const balance = await getTokenBalance(auth.user.id);
    if (balance <= 0) {
      return res.json({
        success: true,
        changed: true,
        generated: false,
        requiresTopUp: true,
        personalization: toPreferences(savedRecord),
        tokenBalance: balance
      });
    }

    const generationRequestId = crypto.randomUUID();
    const generationResult = await runGenerationForUser({
      userId: auth.user.id,
      preferences: toPreferences(savedRecord),
      limit: FIXED_BRIEF_COUNT,
      generationRequestId
    });

    if (!generationResult.success) {
      return res.status(generationResult.code === 'insufficient_tokens' ? 402 : 400).json({
        success: false,
        changed: true,
        generated: false,
        error: generationResult.error,
        tokenBalance: generationResult.balance ?? await getTokenBalance(auth.user.id)
      });
    }

    return res.json({
      success: true,
      changed: true,
      generated: true,
      personalization: toPreferences(savedRecord),
      tokenBalance: generationResult.balance,
      briefs: generationResult.briefs,
      latestBatch: generationResult.batch
    });
  } catch (error: any) {
    if (
      isMissingTableError(error, 'user_personalizations') ||
      isMissingTableError(error, 'user_token_balances') ||
      isMissingTableError(error, 'brief_batches') ||
      isMissingTableError(error, 'brief_items') ||
      isMissingTableError(error, 'token_transactions') ||
      isMissingFunctionError(error, 'claim_generation_token')
    ) {
      const body = await readBody(req);
      const fallbackPreferences = {
        role: String(body?.role || ''),
        companySize: String(body?.companySize || ''),
        mainConcern: String(body?.mainConcern || ''),
        keywords: parseKeywords(body?.keywords || []),
        decisionAreas: Array.isArray(body?.decisionAreas) ? body.decisionAreas : [],
        hasPersonalized: true
      };
      return res.json({
        success: true,
        changed: true,
        generated: false,
        migrationRequired: true,
        personalization: fallbackPreferences,
        tokenBalance: 0
      });
    }
    return res.status(500).json({ success: false, error: error?.message || 'Failed to save personalization' });
  }
}

export async function handleTokenCatalog(req: AnyReq, res: AnyRes) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
  return res.json({ success: true, tiers: getCheckoutTiers() });
}

export async function handleStripeCheckout(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    await ensureUserInitialized(auth.user.id, auth.user.email || '');
    await assertActiveUser(auth.user.id);

    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({ success: false, error: 'Stripe is not configured' });
    }

    await ensureStripeCatalog();

    const body = await readBody(req);
    const packageCode = String(body?.packageCode || '').trim();
    const catalogRow = await getCatalogRow(packageCode);
    if (!catalogRow) {
      return res.status(400).json({ success: false, error: 'Invalid package' });
    }

    const origin = getRequestOrigin(req);
    const successUrl = `${origin}/?checkout=success`;
    const cancelUrl = `${origin}/?checkout=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ price: catalogRow.stripe_price_id, quantity: 1 }],
      metadata: {
        userId: auth.user.id,
        tokensToGrant: String(catalogRow.tokens)
      }
    });

    return res.json({ success: true, url: session.url });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Failed to create checkout session' });
  }
}

export async function handleStripeWebhook(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  initClients();

  try {
    const stripe = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !webhookSecret) {
      return res.status(503).json({ success: false, error: 'Stripe webhook is not configured' });
    }

    const signature = req.headers['stripe-signature'];
    if (!signature || typeof signature !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing Stripe signature' });
    }

    const raw = await readRawBody(req);
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const userId = String(metadata.userId || '').trim();
      const tokensToGrant = Number(metadata.tokensToGrant || 0);

      if (!userId || !Number.isFinite(tokensToGrant) || tokensToGrant <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid checkout metadata' });
      }

      await ensureUserInitialized(userId, session.customer_details?.email || '');

      if (!supabaseAdmin) throw new Error('Supabase admin unavailable');
      const grant = await supabaseAdmin.rpc('grant_purchased_tokens', {
        p_user_id: userId,
        p_tokens: tokensToGrant,
        p_stripe_event_id: event.id,
        p_session_id: session.id
      });
      if (grant.error) throw grant.error;
    }

    return res.json({ received: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Webhook handling failed' });
  }
}

export async function handleUpdatePassword(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    await ensureUserInitialized(auth.user.id, auth.user.email || '');
    await assertActiveUser(auth.user.id);

    const body = await readBody(req);
    const newPassword = String(body?.newPassword || '');
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    if (!supabaseAdmin || !(supabaseAdmin as any).auth?.admin?.updateUserById) {
      return res.status(503).json({ success: false, error: 'Password update unavailable' });
    }

    const result = await (supabaseAdmin as any).auth.admin.updateUserById(auth.user.id, {
      password: newPassword
    });
    if (result.error) {
      return res.status(400).json({ success: false, error: result.error.message });
    }

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Password update failed' });
  }
}

export async function handleDeleteAccount(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    const body = await readBody(req);
    const confirmationText = String(body?.confirmationText || '').trim();
    if (confirmationText !== 'DELETE') {
      return res.status(400).json({ success: false, error: 'Type DELETE to confirm account deletion' });
    }

    if (!supabaseAdmin) throw new Error('Supabase admin unavailable');

    const { error } = await supabaseAdmin
      .from('app_users')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('user_id', auth.user.id);
    if (error) throw error;

    const token = getAuthToken(req);
    if (token && (supabaseAdmin as any).auth?.admin?.signOut) {
      await (supabaseAdmin as any).auth.admin.signOut(token);
    }

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Delete account failed' });
  }
}

export async function handleSignals(req: AnyReq, res: AnyRes) {
  // Backward-compatible alias: generation trigger now always costs 1 token.
  return handleRunGeneration(req, res);
}

export async function handleLegacyGenerateBriefs(req: AnyReq, res: AnyRes) {
  return handleRunGeneration(req, res);
}
