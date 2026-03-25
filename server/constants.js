const SOURCES = [
    // Tier A primary
    { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Google Research Blog', url: 'https://research.google/blog/rss/', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Anthropic', url: 'https://www.anthropic.com/feed/blog.xml', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Microsoft AI Blog', url: 'https://blogs.microsoft.com/ai/feed/', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss/', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml', tier: 'A', trust: 0.95, type: 'rss' },
    { name: 'Groq Blog', url: 'https://groq.com/blog/feed/', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Cohere Blog', url: 'https://cohere.com/blog/rss.xml', tier: 'A', trust: 1.0, type: 'rss' },
    { name: 'Stability AI', url: 'https://stability.ai/blog?format=rss', tier: 'A', trust: 0.9, type: 'rss' },
    { name: 'Together AI', url: 'https://www.together.ai/blog/rss.xml', tier: 'A', trust: 0.9, type: 'rss' },
    { name: 'Papers with Code', url: 'https://paperswithcode.com/rss', tier: 'A', trust: 0.95, type: 'rss' },

    // Tier B secondary corroboration
    { name: 'Techmeme AI', url: 'https://www.techmeme.com/feed.xml?x=1', tier: 'B', trust: 0.9, type: 'rss' },
    { name: 'Perplexity Blog', url: 'https://blog.perplexity.ai/feed', tier: 'B', trust: 0.85, type: 'rss' },
    { name: 'AI21 Labs', url: 'https://www.ai21.com/blog/rss.xml', tier: 'B', trust: 0.85, type: 'rss' },
    { name: 'Pinecone Blog', url: 'https://www.pinecone.io/blog/rss.xml', tier: 'B', trust: 0.8, type: 'rss' },
    { name: 'LangChain Blog', url: 'https://blog.langchain.dev/rss/', tier: 'B', trust: 0.8, type: 'rss' },
    { name: 'Replicate Blog', url: 'https://replicate.com/blog/rss', tier: 'B', trust: 0.85, type: 'rss' },
    { name: 'AI Trends', url: 'https://www.aitrends.com/feed/', tier: 'B', trust: 0.85, type: 'rss' },
    { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', tier: 'B', trust: 0.85, type: 'rss' },
    { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', tier: 'B', trust: 0.8, type: 'rss' },
    { name: 'MIT Tech Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/', tier: 'B', trust: 0.85, type: 'rss' },
    { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', tier: 'B', trust: 0.8, type: 'rss' },
    { name: 'Forbes AI', url: 'https://www.forbes.com/ai/feed/', tier: 'B', trust: 0.75, type: 'rss' },

    // Tier C curated newsletters
    { name: "Ben's Bites", url: 'https://www.bensbites.com/feed', tier: 'C', trust: 0.7, type: 'rss' },
    { name: 'Import AI', url: 'https://importai.substack.com/feed', tier: 'C', trust: 0.75, type: 'rss' },
    { name: 'Prompts Daily', url: 'https://www.promptsdaily.ai/feed', tier: 'C', trust: 0.65, type: 'rss' },
    { name: 'Superhuman AI Newsletter', url: 'https://www.superhuman.ai/feed', tier: 'C', trust: 0.7, type: 'rss' }
];

const CATEGORY_KEYWORDS = {
    Product: ['product', 'launch', 'feature', 'agent', 'assistant', 'api', 'model', 'multimodal', 'vision'],
    Cost: ['pricing', 'price', 'cost', 'efficiency', 'cheaper', 'inference cost', 'roi', 'margin'],
    GTM: ['enterprise', 'sales', 'distribution', 'partner', 'adoption', 'customer', 'market share'],
    Productivity: ['workflow', 'automation', 'developer', 'copilot', 'velocity', 'time saved'],
    Risk: ['regulation', 'compliance', 'security', 'safety', 'privacy', 'policy', 'governance', 'alignment']
};

const EVENT_KEYWORDS = {
    release: ['release', 'launch', 'announced', 'available', 'ga', 'general availability'],
    pricing: ['pricing', 'price', 'cost', 'billing', 'subscription'],
    partnership: ['partnership', 'partnered', 'alliance', 'joint venture'],
    regulation: ['regulation', 'act', 'compliance', 'policy', 'legal', 'executive order'],
    acquisition: ['acquire', 'acquisition', 'merger', 'buyout'],
    benchmark: ['benchmark', 'eval', 'score', 'performance', 'leaderboard'],
    security: ['vulnerability', 'security', 'incident', 'breach', 'exploit', 'jailbreak'],
    product_launch: ['new product', 'new platform', 'new service', 'new tool']
};

const ENTITY_KEYWORDS = ['OpenAI', 'Google', 'DeepMind', 'Anthropic', 'Meta', 'Microsoft', 'NVIDIA', 'Amazon', 'AWS', 'Groq', 'Mistral', 'Cohere', 'Perplexity'];

const ROLE_KEYWORDS = {
    'Product Leader': ['product', 'roadmap', 'feature', 'developer', 'workflow', 'adoption', 'ux', 'platform', 'strategy', 'metircs'],
    'Business Leader': ['revenue', 'margin', 'cost', 'operations', 'risk', 'compliance', 'governance', 'enterprise', 'roi', 'business model'],
    Founder: ['startup', 'growth', 'distribution', 'go to market', 'fundraising', 'customer', 'velocity', 'hiring', 'equity', 'scaling'],
    Other: ['strategy', 'planning', 'team', 'execution', 'management']
};

const DECISION_AREA_KEYWORDS = {
    Product: ['product', 'feature', 'roadmap', 'user', 'platform', 'experience', 'innovation'],
    Cost: ['cost', 'pricing', 'spend', 'efficiency', 'budget', 'inference', 'unit economics'],
    GTM: ['go to market', 'sales', 'customer', 'distribution', 'pipeline', 'acquisition', 'retention'],
    Productivity: ['automation', 'workflow', 'developer', 'velocity', 'time saved', 'efficiency', 'copilot'],
    Risk: ['risk', 'security', 'compliance', 'regulation', 'privacy', 'policy', 'governance']
};

const MAIN_CONCERN_SYNONYMS = {
    cost: ['pricing', 'spend', 'budget', 'efficiency', 'cheaper', 'inference cost', 'roi'],
    hiring: ['talent', 'recruiting', 'workforce', 'headcount', 'recruitment'],
    productivity: ['automation', 'workflow', 'velocity', 'copilot', 'efficiency'],
    regulation: ['policy', 'compliance', 'legal', 'governance', 'act'],
    security: ['breach', 'vulnerability', 'incident', 'safety', 'privacy'],
    leak: ['breach', 'exfiltration', 'exposure', 'spillage', 'leakage'],
    leaks: ['breach', 'exfiltration', 'exposure', 'spillage', 'leakage'],
    growth: ['adoption', 'distribution', 'go to market', 'customer', 'acquisition'],
    revenue: ['sales', 'monetization', 'pricing', 'enterprise deals', 'margin']
};

const STRATEGIC_KEYWORDS = [
    'breakthrough',
    'paradigm shift',
    'disruptive',
    'infrastructure',
    'low latency',
    'high throughput',
    'state of the art',
    'sota',
    'open weights',
    'open source',
    'enterprise ready',
    'production ready'
];

module.exports = {
    SOURCES,
    CATEGORY_KEYWORDS,
    EVENT_KEYWORDS,
    ENTITY_KEYWORDS,
    ROLE_KEYWORDS,
    DECISION_AREA_KEYWORDS,
    MAIN_CONCERN_SYNONYMS,
    STRATEGIC_KEYWORDS
};
