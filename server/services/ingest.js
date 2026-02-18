const Parser = require('rss-parser');
const { SOURCES } = require('../constants');

const parser = new Parser({
    timeout: 5000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Signals-Bot/1.0)'
    }
});

/**
 * Fetches and aggregates news from configured RSS sources.
 * @param {string} tierFilter - 'A', 'B', or 'ALL'
 * @returns {Promise<Array>} List of raw news items
 */
async function fetchNews(tierFilter = 'ALL') {
    const normalizedTier = String(tierFilter || 'ALL').toUpperCase();
    const sources = SOURCES.filter((source) => normalizedTier === 'ALL' || source.tier === normalizedTier);

    console.log(`Starting fetch for ${sources.length} sources...`);

    const feedPromises = sources.map(async (source) => {
        try {
            const feed = await parser.parseURL(source.url);
            return (feed.items || []).slice(0, 30).map(item => ({
                source: source.name,
                source_tier: source.tier,
                source_trust: source.trust,
                title: item.title || '',
                link: item.link,
                pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                contentSnippet: item.contentSnippet || item.summary || '',
                content: item.content || '',
                author: item.creator || item.author || 'Unknown'
            }));
        } catch (error) {
            console.error(`Failed to fetch ${source.name}: ${error.message}`);
            return [];
        }
    });

    const results = await Promise.all(feedPromises);
    const flatResults = results.flat();

    console.log(`Fetched ${flatResults.length} raw items.`);
    return flatResults;
}

module.exports = { fetchNews };
