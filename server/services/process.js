const { OpenAI } = require('openai');
const { CATEGORY_KEYWORDS, EVENT_KEYWORDS, ENTITY_KEYWORDS } = require('../constants');

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const TIER_PRIORITY = {
    A: 3,
    B: 2,
    C: 1
};

function stableId(input = '') {
    const text = String(input);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
        hash ^= text.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return `id-${(hash >>> 0).toString(16)}`;
}

function canonicalizeUrl(rawUrl = '') {
    try {
        const url = new URL(rawUrl);
        url.hash = '';
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
            url.searchParams.delete(k);
        });
        return url.toString();
    } catch {
        return rawUrl || '';
    }
}

function stripHtml(text = '') {
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function detectEntities(text) {
    const lower = text.toLowerCase();
    return ENTITY_KEYWORDS.filter((entity) => lower.includes(entity.toLowerCase()));
}

function detectCategoryTags(text) {
    const lower = text.toLowerCase();
    const tags = [];
    for (const [tag, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
            tags.push(tag);
        }
    }
    return tags.length ? tags : ['Productivity'];
}

function detectEventType(text) {
    const lower = text.toLowerCase();
    for (const [eventType, keywords] of Object.entries(EVENT_KEYWORDS)) {
        if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
            return eventType;
        }
    }
    return 'update';
}

function detectTimeHorizonFit(text) {
    const lower = text.toLowerCase();
    if (/(security|deprecat|pricing|launch|release|available now|today)/.test(lower)) return '30d';
    if (/(trend|adoption|workflow|enterprise pattern|market)/.test(lower)) return '6m';
    return '12m';
}

function getEvidenceStrength(sourceTier) {
    if (sourceTier === 'A') return 'primary';
    if (sourceTier === 'B') return 'secondary';
    return 'emerging';
}

function tierPriority(sourceTier = 'C') {
    return TIER_PRIORITY[sourceTier] || TIER_PRIORITY.C;
}

function wordCount(text = '') {
    return stripHtml(text).split(/\s+/).filter(Boolean).length;
}

function toDate(value) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeItems(rawItems) {
    return rawItems.map((item, index) => {
        const cleanTitle = stripHtml(item.title || '');
        const cleanText = stripHtml(item.contentSnippet || item.content || '');
        const mergedText = `${cleanTitle} ${cleanText}`;

        let sourceTrust = Number(item.source_trust);
        if (!Number.isFinite(sourceTrust)) {
            if (item.source_tier === 'A') sourceTrust = 1;
            else if (item.source_tier === 'B') sourceTrust = 0.85;
            else sourceTrust = 0.6;
        }

        return {
            id: stableId(`${item.link || cleanTitle}-${index}`),
            source: item.source,
            source_tier: item.source_tier,
            source_trust: clamp(sourceTrust, 0.4, 1),
            author: item.author || 'Unknown',
            published_at: item.pubDate || new Date(),
            url: item.link || '',
            canonical_url: canonicalizeUrl(item.link || ''),
            clean_title: cleanTitle,
            clean_text: cleanText,
            entities: detectEntities(mergedText),
            category_tags: detectCategoryTags(mergedText),
            event_type: detectEventType(mergedText),
            time_horizon_fit: detectTimeHorizonFit(mergedText),
            evidence_strength: getEvidenceStrength(item.source_tier)
        };
    });
}

function normalizeTitleForDedupe(title = '') {
    return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function tokenizeForSimilarity(text = '') {
    return normalizeTitleForDedupe(text)
        .split(' ')
        .filter((t) => t.length > 2);
}

function tokenFrequency(tokens = []) {
    const freq = new Map();
    for (const token of tokens) {
        freq.set(token, (freq.get(token) || 0) + 1);
    }
    return freq;
}

function cosineSimilarity(aFreq, bFreq) {
    if (!aFreq.size || !bFreq.size) return 0;

    let dot = 0;
    for (const [token, aVal] of aFreq.entries()) {
        const bVal = bFreq.get(token) || 0;
        dot += aVal * bVal;
    }

    let aMag = 0;
    for (const value of aFreq.values()) aMag += value * value;
    let bMag = 0;
    for (const value of bFreq.values()) bMag += value * value;

    const denominator = Math.sqrt(aMag) * Math.sqrt(bMag);
    return denominator ? dot / denominator : 0;
}

function semanticFingerprint(item) {
    return tokenFrequency(tokenizeForSimilarity(`${item.clean_title} ${item.clean_text}`));
}

function choosePreferredItem(existing, candidate) {
    const existingTier = tierPriority(existing.source_tier);
    const candidateTier = tierPriority(candidate.source_tier);
    if (candidateTier !== existingTier) {
        return candidateTier > existingTier ? candidate : existing;
    }

    // If both are primary sources, keep the earliest publication as canonical origin.
    if (existing.source_tier === 'A' && candidate.source_tier === 'A') {
        const existingTime = toDate(existing.published_at).getTime();
        const candidateTime = toDate(candidate.published_at).getTime();
        if (candidateTime !== existingTime) {
            return candidateTime < existingTime ? candidate : existing;
        }
    }

    const existingTextLen = wordCount(existing.clean_text);
    const candidateTextLen = wordCount(candidate.clean_text);
    if (candidateTextLen !== existingTextLen) {
        return candidateTextLen > existingTextLen ? candidate : existing;
    }

    const existingTrust = Number(existing.source_trust) || 0;
    const candidateTrust = Number(candidate.source_trust) || 0;
    if (candidateTrust !== existingTrust) {
        return candidateTrust > existingTrust ? candidate : existing;
    }

    return existing;
}

function deduplicateItems(items) {
    const byCanonicalUrl = new Map();
    for (const item of items) {
        const key = item.canonical_url || item.url || item.clean_title;
        if (!byCanonicalUrl.has(key)) {
            byCanonicalUrl.set(key, item);
            continue;
        }
        byCanonicalUrl.set(key, choosePreferredItem(byCanonicalUrl.get(key), item));
    }

    const uniqueByUrl = Array.from(byCanonicalUrl.values());
    const deduped = [];
    const fingerprints = [];
    const threshold = Number(process.env.SEMANTIC_DEDUPE_THRESHOLD || 0.9);

    for (const candidate of uniqueByUrl) {
        const candidateFp = semanticFingerprint(candidate);
        let duplicateIndex = -1;

        for (let i = 0; i < deduped.length; i += 1) {
            const similarity = cosineSimilarity(candidateFp, fingerprints[i]);
            if (similarity >= threshold) {
                duplicateIndex = i;
                break;
            }
        }

        if (duplicateIndex === -1) {
            deduped.push(candidate);
            fingerprints.push(candidateFp);
        } else {
            const preferred = choosePreferredItem(deduped[duplicateIndex], candidate);
            deduped[duplicateIndex] = preferred;
            fingerprints[duplicateIndex] = semanticFingerprint(preferred);
        }
    }

    return deduped;
}

function detectPeakRelevanceWindow(cluster) {
    const counts = { '30d': 0, '6m': 0, '12m': 0 };
    for (const item of cluster.items) {
        const key = item.time_horizon_fit;
        if (counts[key] !== undefined) counts[key] += 1;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0][0] : '6m';
}

function clusterItems(items) {
    const clusters = new Map();

    for (const item of items) {
        const entityKey = item.entities[0] || 'general';
        const categoryKey = item.category_tags[0] || 'General';
        const key = `${item.event_type}:${entityKey}:${categoryKey}`;
        if (!clusters.has(key)) {
            clusters.set(key, {
                key,
                event_type: item.event_type,
                entity: entityKey,
                category: categoryKey,
                items: []
            });
        }
        clusters.get(key).items.push(item);
    }

    return Array.from(clusters.values()).map((cluster) => {
        cluster.items.sort((a, b) => toDate(b.published_at) - toDate(a.published_at));
        cluster.representative = cluster.items.reduce((best, candidate) => choosePreferredItem(best, candidate));
        cluster.cluster_id = stableId(`${cluster.key}:${cluster.representative?.canonical_url || cluster.representative?.url || cluster.representative?.clean_title || ''}`);
        cluster.first_seen_at = cluster.items.reduce((oldest, item) => toDate(item.published_at) < toDate(oldest) ? item.published_at : oldest, cluster.items[0].published_at);
        cluster.last_updated_at = cluster.items[0].published_at;
        cluster.peak_relevance_window = detectPeakRelevanceWindow(cluster);
        cluster.supporting_source_count = new Set(cluster.items.map((item) => item.source)).size;
        return cluster;
    });
}

function computeImpact(cluster) {
    const text = `${cluster.representative.clean_title} ${cluster.representative.clean_text}`.toLowerCase();
    let impact = 0.8;
    if (/(pricing|cost|launch|release|security|compliance|availability)/.test(text)) impact += 1.4;
    if (/(major|breakthrough|enterprise|platform|general availability)/.test(text)) impact += 0.8;
    return Math.min(3, impact);
}

function computeUrgency(cluster) {
    const text = `${cluster.representative.clean_title} ${cluster.representative.clean_text}`.toLowerCase();
    if (/(security|deprecation|incident|deadline|urgent|critical)/.test(text)) return 2;
    if (/(launch|released|available now|today)/.test(text)) return 1.4;
    return 0.5;
}

function computeLeaderFit(cluster, preferences = {}) {
    const role = preferences.role || 'Other';
    const concern = (preferences.mainConcern || '').toLowerCase();
    const areas = preferences.decisionAreas || [];
    const text = `${cluster.representative.clean_title} ${cluster.representative.clean_text}`.toLowerCase();
    let score = 0.5;

    if (role === 'Founder' && /(go to market|funding|distribution|growth|customer)/.test(text)) score += 0.8;
    if (role === 'Product Leader' && /(roadmap|product|feature|developer|workflow)/.test(text)) score += 0.8;
    if (role === 'Business Leader' && /(cost|compliance|risk|enterprise|operations)/.test(text)) score += 0.8;

    for (const area of areas) {
        if (text.includes(String(area).toLowerCase())) score += 0.2;
    }
    if (concern && text.includes(concern.split(' ')[0])) score += 0.3;

    return Math.min(2, score);
}

function computeNoisePenalty(cluster) {
    const text = `${cluster.representative.clean_title} ${cluster.representative.clean_text}`.toLowerCase();
    let penalty = 0;
    if (/(amazing|revolutionary|game[- ]?changing|unbelievable|must see)/.test(text)) penalty += 0.8;
    if (cluster.items.length > 6) penalty += 0.3; // potential syndication
    return Math.min(2, penalty);
}

function computeTrust(cluster) {
    const representative = cluster.representative;
    const base = Number(representative.source_trust) || (representative.source_tier === 'A' ? 1 : representative.source_tier === 'B' ? 0.85 : 0.6);
    const corroboration = Math.min(0.15, (cluster.supporting_source_count - 1) * 0.05);
    const tierCPenalty = representative.source_tier === 'C' && cluster.supporting_source_count < 2 ? 0.1 : 0;
    return clamp(base + corroboration - tierCPenalty, 0.4, 1);
}

function scoreAndRankClusters(clusters, preferences = {}, timeHorizon = '30d') {
    const filtered = clusters.filter((cluster) => {
        if (timeHorizon === '30d') {
            return cluster.peak_relevance_window === '30d' || cluster.peak_relevance_window === '6m';
        }
        if (timeHorizon === '6m') {
            return cluster.peak_relevance_window !== '12m';
        }
        return true;
    });

    const scored = filtered.map((cluster) => {
        const trust = computeTrust(cluster);
        const impact = computeImpact(cluster);
        const urgency = computeUrgency(cluster);
        const leaderFit = computeLeaderFit(cluster, preferences);
        const noise = computeNoisePenalty(cluster);

        const score = trust * impact * urgency * leaderFit - noise;
        return {
            ...cluster,
            ranking: {
                trust,
                impact,
                urgency,
                leaderFit,
                noise,
                score
            }
        };
    });

    scored.sort((a, b) => b.ranking.score - a.ranking.score);
    return scored;
}

function fallbackBrief(cluster, index = 0) {
    const item = cluster.representative;
    return {
        id: `brief-${stableId(`${cluster.cluster_id}-${index}`)}`,
        clusterId: cluster.cluster_id,
        headline: item.clean_title,
        summary: item.clean_text || 'No summary available.',
        whatHappened: item.clean_text || item.clean_title,
        whyItMatters: 'Potential impact on roadmap, operating model, or competitive dynamics.',
        leaderTakeaway: 'Assign a quick owner to evaluate impact and decide monitor vs experiment.',
        whatToConsiderNext: [
            'Assess relevance to current strategic priorities',
            'Estimate risk and implementation effort',
            'Decide monitor vs pilot in next planning cycle'
        ],
        source: item.source,
        date: new Date(item.published_at).toISOString().split('T')[0],
        category: cluster.category || 'Strategy',
        reviewStatus: 'pending_review',
        approvedAt: null,
        approvedBy: null,
        eventType: cluster.event_type,
        supportingSources: cluster.items.slice(0, 3).map((x) => ({ source: x.source, url: x.url }))
    };
}

async function generateBrief(cluster, preferences = {}) {
    if (!openai) return fallbackBrief(cluster);
    const item = cluster.representative;

    const prompt = `
Create one executive decision brief in JSON.
Audience role: ${preferences.role || 'Leader'}
Decision areas: ${(preferences.decisionAreas || []).join(', ') || 'General'}
Main concern: ${preferences.mainConcern || 'N/A'}

Facts:
Title: ${item.clean_title}
Source: ${item.source}
Published at: ${item.published_at}
Summary: ${item.clean_text}
Cluster event type: ${cluster.event_type}
Cluster category: ${cluster.category}

Return JSON with fields:
headline, summary, whatHappened, whyItMatters, leaderTakeaway, whatToConsiderNext (array of 3 strings), category
Be concrete and conservative.`;

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            temperature: 0.2,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'You are an executive AI strategy analyst. Return valid JSON only.' },
                { role: 'user', content: prompt }
            ]
        });

        const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
        return {
            id: `brief-${stableId(`${cluster.cluster_id}-${item.canonical_url || item.url || item.clean_title}`)}`,
            clusterId: cluster.cluster_id,
            headline: parsed.headline || item.clean_title,
            summary: parsed.summary || item.clean_text || '',
            whatHappened: parsed.whatHappened || item.clean_text || item.clean_title,
            whyItMatters: parsed.whyItMatters || 'Potential strategic impact.',
            leaderTakeaway: parsed.leaderTakeaway || 'Monitor and evaluate for strategic fit.',
            whatToConsiderNext: Array.isArray(parsed.whatToConsiderNext) && parsed.whatToConsiderNext.length
                ? parsed.whatToConsiderNext.slice(0, 3)
                : fallbackBrief(cluster).whatToConsiderNext,
            source: item.source,
            date: new Date(item.published_at).toISOString().split('T')[0],
            category: parsed.category || cluster.category || 'Strategy',
            reviewStatus: 'pending_review',
            approvedAt: null,
            approvedBy: null,
            eventType: cluster.event_type,
            supportingSources: cluster.items.slice(0, 3).map((x) => ({ source: x.source, url: x.url }))
        };
    } catch (error) {
        console.error('LLM generation failed, using fallback:', error.message);
        return fallbackBrief(cluster);
    }
}

module.exports = {
    normalizeItems,
    deduplicateItems,
    clusterItems,
    scoreAndRankClusters,
    generateBrief
};
