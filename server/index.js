require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const { fetchNews } = require('./services/ingest');
const { normalizeItems, deduplicateItems, clusterItems, scoreAndRankClusters, generateBrief } = require('./services/process');

const app = express();
const port = process.env.PORT || 3001;
const cronSchedule = process.env.CRON_SCHEDULE || '*/30 * * * *';
const frontendDistPath = path.resolve(__dirname, '..', 'dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexPath);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAuthKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY;

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

app.use(cors());
app.use(express.json());
if (hasFrontendBuild) {
    app.use(express.static(frontendDistPath));
}

const canInitSupabaseAuth = looksLikeConfigured(supabaseUrl) && looksLikeConfigured(supabaseAuthKey) && isValidHttpUrl(supabaseUrl);
const canInitSupabaseAdmin = looksLikeConfigured(supabaseUrl) && looksLikeConfigured(supabaseServiceKey) && isValidHttpUrl(supabaseUrl);

const supabaseAuth = canInitSupabaseAuth
    ? createClient(supabaseUrl, supabaseAuthKey)
    : null;
const supabaseAdmin = canInitSupabaseAdmin
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

const pipelineState = {
    lastRunAt: null,
    lastCount: 0,
    cache: new Map(),
    reviewBriefs: new Map()
};

function defaultPreferences() {
    return {
        role: '',
        companySize: '',
        decisionAreas: [],
        mainConcern: '',
        hasPersonalized: false
    };
}

function getAuthToken(req) {
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) return header.slice(7).trim();
    return req.body?.token || req.query?.token || '';
}

function normalizeEmail(email = '') {
    return String(email || '').trim().toLowerCase();
}

function mapAuthUser(email = '') {
    return {
        email,
        preferences: defaultPreferences()
    };
}

function parsePipelineRequest(input = {}) {
    const parsedLimit = Number(input.limit || 7);
    return {
        preferences: input.preferences || {},
        timeHorizon: input.time_horizon || input.timeHorizon || '30d',
        tierFilter: input.tier_filter || input.tierFilter || 'ALL',
        limit: Number.isFinite(parsedLimit) ? Math.max(1, Math.min(parsedLimit, 20)) : 7,
        bypassCache: Boolean(input.bypass_cache || input.bypassCache)
    };
}

function preferencesKey(preferences = {}, timeHorizon = '30d', tierFilter = 'ALL', limit = 7) {
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
}) {
    const rawItems = await fetchNews(tierFilter);
    const normalized = normalizeItems(rawItems);
    const deduped = deduplicateItems(normalized);
    const clusters = clusterItems(deduped);
    const ranked = scoreAndRankClusters(clusters, preferences, timeHorizon);

    const topClusters = ranked.slice(0, Number(limit));
    const briefs = (await Promise.all(topClusters.map((cluster) => generateBrief(cluster, preferences))))
        .filter(Boolean);

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
            reviewPending: briefs.filter((brief) => brief.reviewStatus === 'pending_review').length,
            lastRunAt: pipelineState.lastRunAt
        }
    };
}

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        service: 'ai-signals-backend',
        hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
        hasSupabaseAuth: Boolean(supabaseAuth),
        lastRunAt: pipelineState.lastRunAt,
        lastCount: pipelineState.lastCount
    });
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        if (!supabaseAuth) {
            return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
        }
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password || '');

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
            if (!signInResult.error && signInResult.data.session) {
                session = signInResult.data.session;
            }
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
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message || 'Signup failed' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        if (!supabaseAuth) {
            return res.status(503).json({ success: false, error: 'Supabase auth is not configured' });
        }
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password || '');
        const signInResult = await supabaseAuth.auth.signInWithPassword({ email, password });
        if (signInResult.error || !signInResult.data.session) {
            return res.status(401).json({ success: false, error: signInResult.error?.message || 'Invalid email or password' });
        }
        return res.json({
            success: true,
            token: signInResult.data.session.access_token,
            user: mapAuthUser(signInResult.data.user?.email || email)
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message || 'Signin failed' });
    }
});

app.get('/api/auth/session', async (req, res) => {
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
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message || 'Session check failed' });
    }
});

app.post('/api/auth/signout', async (req, res) => {
    try {
        const token = getAuthToken(req);
        if (token && supabaseAdmin && supabaseAdmin.auth?.admin?.signOut) {
            await supabaseAdmin.auth.admin.signOut(token);
        }
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message || 'Signout failed' });
    }
});

app.post('/api/signals', async (req, res) => {
    try {
        const {
            preferences,
            timeHorizon,
            tierFilter,
            limit,
            bypassCache
        } = parsePipelineRequest(req.body || {});

        const cacheKey = preferencesKey(preferences, timeHorizon, tierFilter, limit);
        const cached = pipelineState.cache.get(cacheKey);
        const now = Date.now();
        const ttlMs = Number(process.env.CACHE_TTL_MS || 15 * 60 * 1000);

        if (!bypassCache && cached && now - cached.createdAt < ttlMs) {
            return res.json({ success: true, fromCache: true, ...cached.payload });
        }

        const payload = await runPipeline({
            preferences,
            timeHorizon,
            tierFilter,
            limit
        });

        pipelineState.cache.set(cacheKey, { createdAt: now, payload });
        return res.json({ success: true, fromCache: false, ...payload });
    } catch (error) {
        console.error('POST /api/signals failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Pipeline failed' });
    }
});

app.get('/api/generate-briefs', async (req, res) => {
    try {
        const {
            preferences,
            timeHorizon,
            tierFilter,
            limit,
            bypassCache
        } = parsePipelineRequest(req.query || {});

        const cacheKey = preferencesKey(preferences, timeHorizon, tierFilter, limit);
        const cached = pipelineState.cache.get(cacheKey);
        const now = Date.now();
        const ttlMs = Number(process.env.CACHE_TTL_MS || 15 * 60 * 1000);

        if (!bypassCache && cached && now - cached.createdAt < ttlMs) {
            return res.json({ success: true, fromCache: true, ...cached.payload });
        }

        const payload = await runPipeline({
            preferences,
            timeHorizon,
            tierFilter,
            limit
        });

        pipelineState.cache.set(cacheKey, { createdAt: now, payload });
        return res.json({ success: true, fromCache: false, ...payload });
    } catch (error) {
        console.error('GET /api/generate-briefs failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Pipeline failed' });
    }
});

app.post('/api/pipeline/run', async (req, res) => {
    try {
        const { preferences, timeHorizon, tierFilter, limit } = parsePipelineRequest(req.body || {});
        const payload = await runPipeline({
            preferences,
            timeHorizon,
            tierFilter,
            limit
        });
        return res.json({ success: true, ...payload });
    } catch (error) {
        console.error('POST /api/pipeline/run failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Pipeline run failed' });
    }
});

app.get('/api/briefs/pending', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(Number(req.query.limit || 20), 50));
        const pending = Array.from(pipelineState.reviewBriefs.values())
            .filter((brief) => brief.reviewStatus === 'pending_review')
            .slice(0, limit);
        return res.json({ success: true, briefs: pending });
    } catch (error) {
        console.error('GET /api/briefs/pending failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Failed to fetch pending briefs' });
    }
});

app.get('/api/briefs/published', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(Number(req.query.limit || 20), 50));
        const approved = Array.from(pipelineState.reviewBriefs.values())
            .filter((brief) => brief.reviewStatus === 'approved')
            .slice(0, limit);
        return res.json({ success: true, briefs: approved });
    } catch (error) {
        console.error('GET /api/briefs/published failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Failed to fetch published briefs' });
    }
});

app.post('/api/briefs/:briefId/approve', async (req, res) => {
    try {
        const briefId = req.params.briefId;
        const approvedBy = req.body?.approvedBy || 'reviewer';
        const memoryBrief = pipelineState.reviewBriefs.get(briefId);
        if (memoryBrief) {
            memoryBrief.reviewStatus = 'approved';
            memoryBrief.approvedAt = new Date().toISOString();
            memoryBrief.approvedBy = approvedBy;
            pipelineState.reviewBriefs.set(briefId, memoryBrief);
        }

        return res.json({ success: true, briefId, reviewStatus: 'approved', approvedBy });
    } catch (error) {
        console.error('POST /api/briefs/:briefId/approve failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Failed to approve brief' });
    }
});

app.post('/api/briefs/:briefId/reject', async (req, res) => {
    try {
        const briefId = req.params.briefId;
        const memoryBrief = pipelineState.reviewBriefs.get(briefId);
        if (memoryBrief) {
            memoryBrief.reviewStatus = 'rejected';
            memoryBrief.approvedAt = null;
            memoryBrief.approvedBy = null;
            pipelineState.reviewBriefs.set(briefId, memoryBrief);
        }

        return res.json({ success: true, briefId, reviewStatus: 'rejected' });
    } catch (error) {
        console.error('POST /api/briefs/:briefId/reject failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Failed to reject brief' });
    }
});

if (hasFrontendBuild) {
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) return next();
        return res.sendFile(frontendIndexPath);
    });
} else {
    app.get('/', (req, res) => {
        res.send('AI Signals backend is running. Build frontend with `npm run build` in project root to serve app here.');
    });
}

cron.schedule(cronSchedule, async () => {
    try {
        console.log('[cron] Running default pipeline refresh...');
        await runPipeline({
            preferences: {},
            timeHorizon: '30d',
            tierFilter: 'ALL',
            limit: 7
        });
        console.log('[cron] Pipeline refresh completed');
    } catch (error) {
        console.error('[cron] Pipeline refresh failed:', error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
