const { OpenAI } = require('openai');
const { stableId, formatDateISO } = require('./process');

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

function fallbackBrief(cluster, index = 0) {
    const item = cluster.representative;
    const personalizationMatch = cluster.ranking?.personalizationMatch;
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
        date: formatDateISO(item.published_at),
        category: cluster.category || 'Strategy',
        reviewStatus: 'pending_review',
        approvedAt: null,
        approvedBy: null,
        eventType: cluster.event_type,
        supportingSources: cluster.items.slice(0, 3).map((x) => ({ source: x.source, url: x.url })),
        rankingScore: cluster.ranking?.score,
        matchScore: personalizationMatch !== undefined ? Math.round(personalizationMatch * 100) : 50,
        matchBreakdown: cluster.ranking ? {
            role: Math.round((cluster.ranking.roleMatch || 0) * 100),
            focus: Math.round((cluster.ranking.focusMatch || 0) * 100),
            decisionAreas: Math.round((cluster.ranking.areaMatch || 0) * 100)
        } : undefined
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

CRITICAL: In the 'whyItMatters' and 'leaderTakeaway' sections, directly address the user's main concern: "${preferences.mainConcern || 'General impact'}". Explain why this news is relevant to THAT specific objective.
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
            date: formatDateISO(item.published_at),
            category: parsed.category || cluster.category || 'Strategy',
            reviewStatus: 'pending_review',
            approvedAt: null,
            approvedBy: null,
            eventType: cluster.event_type,
            supportingSources: cluster.items.slice(0, 3).map((x) => ({ source: x.source, url: x.url })),
            rankingScore: cluster.ranking?.score,
            matchScore: cluster.ranking?.personalizationMatch !== undefined
                ? Math.round(cluster.ranking.personalizationMatch * 100)
                : (cluster.ranking?.leaderFit ? Math.round((cluster.ranking.leaderFit / 3) * 100) : 50),
            matchBreakdown: cluster.ranking ? {
                role: Math.round((cluster.ranking.roleMatch || 0) * 100),
                focus: Math.round((cluster.ranking.focusMatch || 0) * 100),
                decisionAreas: Math.round((cluster.ranking.areaMatch || 0) * 100)
            } : undefined
        };
    } catch (error) {
        console.error('LLM generation failed, using fallback:', error.message);
        return fallbackBrief(cluster);
    }
}

module.exports = {
    generateBrief,
    fallbackBrief
};
