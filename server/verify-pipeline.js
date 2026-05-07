require('dotenv').config();
const { fetchNews } = require('./services/ingest');
const { normalizeItems, deduplicateItems, clusterItems, scoreAndRankClusters } = require('./services/process');
const { getEmbeddingsBatch, extractMetadataLLMBatch, getEmbedding } = require('./services/extraction');

async function testRun() {
    console.log('Testing extraction and embedding pipeline...');
    
    const rawItems = await fetchNews('A'); 
    const sample = rawItems.slice(0, 3); // Test with 3 items to save time and tokens
    console.log(`Fetched ${sample.length} raw items from Tier A.`);
    
    if (sample.length === 0) {
        console.log('No items fetched. Check internet connection or RSS feeds.');
        return;
    }

    const normalized = normalizeItems(sample);
    const textsForEmbedding = normalized.map(item => `${item.clean_title} ${item.clean_text}`);
    
    console.log('Fetching embeddings...');
    const embeddings = await getEmbeddingsBatch(textsForEmbedding);
    for (let i = 0; i < normalized.length; i++) {
        normalized[i].embedding = embeddings[i];
    }
    console.log(`Successfully fetched ${embeddings.length} embeddings.`);
    
    console.log('Deduplicating...');
    const deduped = deduplicateItems(normalized);
    
    console.log(`Extracting LLM metadata for ${deduped.length} items...`);
    const metadataList = await extractMetadataLLMBatch(deduped);
    for (let i = 0; i < deduped.length; i++) {
        deduped[i].extractedMetadata = metadataList[i];
    }
    console.log('Metadata extracted successfully.');
    
    console.log('Clustering...');
    const clusters = clusterItems(deduped);
    
    const preferences = { mainConcern: 'Security and costs', role: 'Product Leader' };
    console.log(`Fetching concern embedding for: "${preferences.mainConcern}"...`);
    preferences.concernEmbedding = await getEmbedding(preferences.mainConcern);
    
    console.log('Scoring and Ranking...');
    const ranked = scoreAndRankClusters(clusters, preferences, '30d');
    
    console.log('\n--- SUCCESS! ---');
    if (ranked.length > 0) {
        const top = ranked[0];
        console.log('Ranked 1st item Title:', top.representative.clean_title);
        console.log('Extracted Metadata:', top.representative.extractedMetadata);
        console.log('Final Score:', top.ranking.score.toFixed(3));
        console.log('Semantic Match (Embeddings):', top.ranking.semanticMatch.toFixed(3));
    } else {
        console.log('No clusters were ranked. Time horizon may have filtered them out.');
    }
}

testRun().catch(console.error);
