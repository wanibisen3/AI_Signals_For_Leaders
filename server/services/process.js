const {
    CATEGORY_KEYWORDS,
    EVENT_KEYWORDS,
    ENTITY_KEYWORDS,
    ROLE_KEYWORDS,
    DECISION_AREA_KEYWORDS,
    MAIN_CONCERN_SYNONYMS
} = require('../constants');

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

function formatDateISO(value) {
    return toDate(value).toISOString().split('T')[0];
}

function normalizeText(text = '') {
    return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokenize(text = '') {
    const stopWords = new Set(['to', 'with', 'the', 'of', 'in', 'for', 'on', 'a', 'an', 'and', 'or', 'at', 'by']);
    return normalizeText(text)
        .split(' ')
        .filter((t) => t.length > 2 && !stopWords.has(t));
}

function stemToken(token = '') {
    return String(token || '')
        .replace(/(ing|ed|es|s)$/i, '')
        .trim();
}

function fractionMatch(text = '', terms = []) {
    if (!terms.length) return 0;
    let hits = 0;
    for (const term of terms) {
        if (text.includes(normalizeText(term))) hits += 1;
    }
    return hits / terms.length;
}

function termMatchesText(text = '', term = '') {
    const normalizedText = normalizeText(text);
    const normalizedTerm = normalizeText(term);
    if (!normalizedText || !normalizedTerm) return false;
    if (normalizedText.includes(normalizedTerm)) return true;

    const textTokens = tokenize(normalizedText).map(stemToken).filter(Boolean);
    const termTokens = tokenize(normalizedTerm).map(stemToken).filter(Boolean);
    if (!termTokens.length || !textTokens.length) return false;

    return termTokens.every((termToken) => textTokens.some((textToken) => textToken === termToken || textToken.includes(termToken) || termToken.includes(textToken)));
}

function termCoverage(text = '', terms = []) {
    const uniqueTerms = Array.from(new Set((terms || []).map((term) => normalizeText(term)).filter(Boolean)));
    if (!uniqueTerms.length) return 0;

    let hits = 0;
    for (const term of uniqueTerms) {
        if (termMatchesText(text, term)) hits += 1;
    }

    return hits / uniqueTerms.length;
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
            published_at: item.pubDate || null,
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
    const concern = preferences.mainConcern || '';
    const areas = Array.isArray(preferences.decisionAreas) ? preferences.decisionAreas : [];
    const text = normalizeText(`${cluster.representative.clean_title} ${cluster.representative.clean_text} ${cluster.category || ''}`);

    const roleTerms = ROLE_KEYWORDS[role] || ROLE_KEYWORDS.Other || [];
    const roleMatch = role ? termCoverage(text, roleTerms) : 0;

    const areaTerms = areas.flatMap((area) => DECISION_AREA_KEYWORDS[area] || [String(area || '')]);
    const areaMatch = areaTerms.length ? termCoverage(text, areaTerms) : 0;

    const concernTokens = tokenize(concern);
    const expandedConcernTerms = new Set(concernTokens);
    for (const token of concernTokens) {
        const synonyms = MAIN_CONCERN_SYNONYMS[token] || [];
        for (const synonym of synonyms) expandedConcernTerms.add(synonym);
    }
    const concernTerms = Array.from(expandedConcernTerms);
    const concernTokenMatch = concernTerms.length ? termCoverage(text, concernTerms) : 0;
    const concernPhraseMatch = concern && termMatchesText(text, concern) ? 1 : 0;
    const concernMatch = concern
        ? Math.min(1, concernTokenMatch * 0.65 + concernPhraseMatch * 0.35)
        : 0;

    const hasPersonalization = Boolean(role || concern || areas.length);
    const personalizationMatch = hasPersonalization
        ? clamp((roleMatch * 0.2) + (areaMatch * 0.25) + (concernMatch * 0.55), 0, 1)
        : 0.5;

    const score = hasPersonalization
        ? clamp(0.25 + personalizationMatch * 2.75, 0.25, 3)
        : 1.1;

    return {
        score,
        personalizationMatch,
        roleMatch,
        areaMatch,
        concernMatch
    };
}

function computeNoisePenalty(cluster) {
    const text = `${cluster.representative.clean_title} ${cluster.representative.clean_text}`.toLowerCase();
    let penalty = 0;
    if (/(amazing|revolutionary|game[- ]?changing|unbelievable|must see)/.test(text)) penalty += 0.8;
    if (cluster.items.length > 6) penalty += 0.3;
    return Math.min(2, penalty);
}

function computeTrust(cluster) {
    const representative = cluster.representative;
    const base = Number(representative.source_trust) || (representative.source_tier === 'A' ? 1 : representative.source_tier === 'B' ? 0.85 : 0.6);
    const corroboration = Math.min(0.15, (cluster.supporting_source_count - 1) * 0.05);
    const tierCPenalty = representative.source_tier === 'C' && cluster.supporting_source_count < 2 ? 0.1 : 0;
    return clamp(base + corroboration - tierCPenalty, 0.4, 1);
}

function computeFreshness(cluster) {
    const publishedAt = toDate(cluster.representative?.published_at);
    const now = Date.now();
    const ageDays = Math.max(0, (now - publishedAt.getTime()) / (24 * 60 * 60 * 1000));

    const freshness = clamp(Math.exp(-ageDays / 18), 0.15, 1);
    return {
        freshness,
        ageDays
    };
}

function preferredCategoriesFromPreferences(preferences = {}) {
    const categories = new Set();
    const areas = Array.isArray(preferences.decisionAreas) ? preferences.decisionAreas : [];
    for (const area of areas) categories.add(area);

    const concern = normalizeText(preferences.mainConcern || '');
    if (/(innovation|product|feature|agent|roadmap|model)/.test(concern)) categories.add('Product');
    if (/(cost|efficiency|budget|pricing|spend)/.test(concern)) categories.add('Cost');
    if (/(risk|compliance|security|privacy|regulation|policy)/.test(concern)) categories.add('Risk');
    if (/(growth|market|go to market|gtm|sales|customer|distribution)/.test(concern)) categories.add('GTM');
    if (/(workflow|automation|internal|productivity|velocity|operations)/.test(concern)) categories.add('Productivity');

    return Array.from(categories);
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

    const preferredCategories = preferredCategoriesFromPreferences(preferences);
    const scored = filtered.map((cluster) => {
        const trust = computeTrust(cluster);
        const impact = computeImpact(cluster);
        const urgency = computeUrgency(cluster);
        const leaderFitDetails = computeLeaderFit(cluster, preferences);
        const noise = computeNoisePenalty(cluster);
        const freshnessDetails = computeFreshness(cluster);
        const hasPersonalization = Boolean(
            preferences?.role ||
            preferences?.mainConcern ||
            (Array.isArray(preferences?.decisionAreas) && preferences.decisionAreas.length)
        );

        const lowMatchPenalty = hasPersonalization && leaderFitDetails.personalizationMatch < 0.2 ? 1.35 : 0;
        const mismatchPenalty = hasPersonalization ? (1 - leaderFitDetails.personalizationMatch) * 1.25 : 0;
        const focusCategoryMatch = preferredCategories.includes(cluster.category);
        const focusSemanticMatch = (leaderFitDetails.concernMatch >= 0.45) || (leaderFitDetails.areaMatch >= 0.45);
        const focusPriority = hasPersonalization && (focusCategoryMatch || focusSemanticMatch) ? 1 : 0;
        const focusMatch = hasPersonalization
            ? clamp((focusCategoryMatch ? 0.15 : 0) + (leaderFitDetails.concernMatch * 0.55) + (leaderFitDetails.areaMatch * 0.3), 0, 1)
            : 0.5;
        const focusBoost = focusMatch * 4.8;
        const stalePenalty = freshnessDetails.ageDays > 30 ? Math.min(1.6, (freshnessDetails.ageDays - 30) * 0.03) : 0;
        const freshnessBoost = freshnessDetails.freshness * 1.25;

        const score = trust * impact * urgency * leaderFitDetails.score * freshnessDetails.freshness
            + focusBoost
            + freshnessBoost
            - stalePenalty
            - noise
            - lowMatchPenalty
            - mismatchPenalty;
        return {
            ...cluster,
            ranking: {
                trust,
                impact,
                urgency,
                freshness: freshnessDetails.freshness,
                ageDays: Math.round(freshnessDetails.ageDays),
                focusPriority,
                focusMatch,
                leaderFit: leaderFitDetails.score,
                personalizationMatch: leaderFitDetails.personalizationMatch,
                roleMatch: leaderFitDetails.roleMatch,
                areaMatch: leaderFitDetails.areaMatch,
                concernMatch: leaderFitDetails.concernMatch,
                noise,
                score
            }
        };
    });

    scored.sort((a, b) => {
        if ((b.ranking.focusPriority || 0) !== (a.ranking.focusPriority || 0)) {
            return (b.ranking.focusPriority || 0) - (a.ranking.focusPriority || 0);
        }
        return b.ranking.score - a.ranking.score;
    });
    return scored;
}

module.exports = {
    normalizeItems,
    deduplicateItems,
    clusterItems,
    scoreAndRankClusters,
    stableId,
    formatDateISO
};
