const { OpenAI } = require('openai');

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

async function getEmbeddingsBatch(texts) {
    if (!openai || !texts.length) return texts.map(() => []);
    
    try {
        const response = await openai.embeddings.create({
            input: texts,
            model: 'text-embedding-3-small'
        });
        // Ensure order matches
        return response.data.sort((a, b) => a.index - b.index).map(d => d.embedding);
    } catch (error) {
        console.error('getEmbeddingsBatch failed:', error.message);
        return texts.map(() => []);
    }
}

async function getEmbedding(text) {
    const batch = await getEmbeddingsBatch([text]);
    return batch[0] || [];
}

async function extractMetadataLLMBatch(items) {
    if (!openai || !items.length) return items.map(() => ({ executive_impact_score: 5, primary_audience: 'General', is_threat: false }));

    const batchSize = 10;
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const promises = batch.map(async (item) => {
            const text = `${item.clean_title}\n${item.clean_text}`.slice(0, 1500); // limit length
            const prompt = `Analyze this AI news article and extract metadata for business leaders.
Return JSON with exactly these keys:
- "executive_impact_score": number 1-10 (how impactful is this for an enterprise strategy?)
- "primary_audience": string (e.g. "Product", "Finance", "Security", "GTM", "General")
- "is_threat": boolean (is this a security vulnerability, major competitor move, or regulatory risk?)

Text:
${text}
`;
            try {
                const response = await openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    temperature: 0,
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: 'You are an AI metadata extractor. Return JSON.' },
                        { role: 'user', content: prompt }
                    ]
                });
                const parsed = JSON.parse(response.choices[0].message.content);
                return {
                    executive_impact_score: Number(parsed.executive_impact_score) || 5,
                    primary_audience: parsed.primary_audience || 'General',
                    is_threat: Boolean(parsed.is_threat)
                };
            } catch (e) {
                return { executive_impact_score: 5, primary_audience: 'General', is_threat: false };
            }
        });

        const batchResults = await Promise.all(promises);
        results.push(...batchResults);
    }

    return results;
}

module.exports = {
    getEmbeddingsBatch,
    getEmbedding,
    extractMetadataLLMBatch
};
