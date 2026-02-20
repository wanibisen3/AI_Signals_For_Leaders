const SOURCES = [
    // Tier A primary
    { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Anthropic', url: 'https://www.anthropic.com/feed/blog.xml', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Microsoft AI Blog', url: 'https://blogs.microsoft.com/ai/feed/', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss/', tier: 'A', trust: 1.0, type: 'rss' },

    // Tier B secondary corroboration
    { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', tier: 'B', trust: 0.85, type: 'rss' },
    { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', tier: 'B', trust: 0.8, type: 'rss' },
    { name: 'MIT Tech Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/', tier: 'B', trust: 0.85, type: 'rss' }
];

const CATEGORY_KEYWORDS = {
    Product: ['product', 'launch', 'feature', 'agent', 'assistant', 'api', 'model'],
    Cost: ['pricing', 'price', 'cost', 'efficiency', 'cheaper', 'inference cost'],
    GTM: ['enterprise', 'sales', 'distribution', 'partner', 'adoption', 'customer'],
    Productivity: ['workflow', 'automation', 'developer', 'copilot', 'velocity'],
    Risk: ['regulation', 'compliance', 'security', 'safety', 'privacy', 'policy']
};

const EVENT_KEYWORDS = {
    release: ['release', 'launch', 'announced', 'available'],
    pricing: ['pricing', 'price', 'cost', 'billing'],
    partnership: ['partnership', 'partnered', 'alliance'],
    regulation: ['regulation', 'act', 'compliance', 'policy'],
    acquisition: ['acquire', 'acquisition', 'merger'],
    benchmark: ['benchmark', 'eval', 'score', 'performance'],
    security: ['vulnerability', 'security', 'incident', 'breach'],
    product_launch: ['new product', 'new platform', 'new service']
};

const ENTITY_KEYWORDS = ['OpenAI', 'Google', 'DeepMind', 'Anthropic', 'Meta', 'Microsoft', 'NVIDIA', 'Amazon', 'AWS'];

const ROLE_KEYWORDS = {
    'Product Leader': ['product', 'roadmap', 'feature', 'developer', 'workflow', 'adoption', 'ux', 'platform'],
    'Business Leader': ['revenue', 'margin', 'cost', 'operations', 'risk', 'compliance', 'governance', 'enterprise'],
    Founder: ['startup', 'growth', 'distribution', 'go to market', 'fundraising', 'customer', 'velocity', 'hiring'],
    Other: ['strategy', 'planning', 'team', 'execution']
};

const DECISION_AREA_KEYWORDS = {
    Product: ['product', 'feature', 'roadmap', 'user', 'platform', 'experience'],
    Cost: ['cost', 'pricing', 'spend', 'efficiency', 'budget', 'inference'],
    GTM: ['go to market', 'sales', 'customer', 'distribution', 'pipeline', 'acquisition'],
    Productivity: ['automation', 'workflow', 'developer', 'velocity', 'time saved', 'efficiency'],
    Risk: ['risk', 'security', 'compliance', 'regulation', 'privacy', 'policy']
};

const MAIN_CONCERN_SYNONYMS = {
    cost: ['pricing', 'spend', 'budget', 'efficiency', 'cheaper', 'inference cost'],
    hiring: ['talent', 'recruiting', 'workforce', 'headcount'],
    productivity: ['automation', 'workflow', 'velocity', 'copilot'],
    regulation: ['policy', 'compliance', 'legal', 'governance'],
    security: ['breach', 'vulnerability', 'incident', 'safety'],
    growth: ['adoption', 'distribution', 'go to market', 'customer'],
    revenue: ['sales', 'monetization', 'pricing', 'enterprise deals']
};

module.exports = {
    SOURCES,
    CATEGORY_KEYWORDS,
    EVENT_KEYWORDS,
    ENTITY_KEYWORDS,
    ROLE_KEYWORDS,
    DECISION_AREA_KEYWORDS,
    MAIN_CONCERN_SYNONYMS
};
