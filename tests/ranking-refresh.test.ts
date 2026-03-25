import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { scoreAndRankClusters } = require('../server/services/process.js');

function makeCluster({
  title,
  text,
  category,
  publishedAt
}: {
  title: string;
  text: string;
  category: string;
  publishedAt: string;
}) {
  return {
    category,
    event_type: 'update',
    peak_relevance_window: '30d',
    supporting_source_count: 2,
    representative: {
      clean_title: title,
      clean_text: text,
      published_at: publishedAt,
      source_trust: 0.95,
      source_tier: 'A'
    },
    items: [
      {
        source: 'Test Source',
        published_at: publishedAt
      }
    ]
  };
}

describe('signal reranking', () => {
  it('moves product-focused signals ahead when the focus changes to product innovation', () => {
    const recent = new Date().toISOString();
    const clusters = [
      makeCluster({
        title: 'Enterprise AI governance checklist released',
        text: 'New compliance policy helps leaders manage security, regulation, and privacy controls.',
        category: 'Risk',
        publishedAt: recent
      }),
      makeCluster({
        title: 'AI agents speed up roadmap delivery',
        text: 'Teams use workflow automation and product copilots to accelerate feature launches and product innovation.',
        category: 'Product',
        publishedAt: recent
      })
    ];

    const ranked = scoreAndRankClusters(clusters, {
      role: 'Product Leader',
      mainConcern: 'Accelerating Product Innovation',
      decisionAreas: ['Product']
    });

    expect(ranked[0].category).toBe('Product');
    expect(ranked[0].ranking.concernMatch).toBeGreaterThan(ranked[1].ranking.concernMatch);
  });

  it('moves risk-focused signals ahead when the focus changes to compliance and security', () => {
    const recent = new Date().toISOString();
    const clusters = [
      makeCluster({
        title: 'AI agents speed up roadmap delivery',
        text: 'Teams use workflow automation and product copilots to accelerate feature launches and product innovation.',
        category: 'Product',
        publishedAt: recent
      }),
      makeCluster({
        title: 'Enterprise AI governance checklist released',
        text: 'New compliance policy helps leaders manage security, regulation, and privacy controls.',
        category: 'Risk',
        publishedAt: recent
      })
    ];

    const ranked = scoreAndRankClusters(clusters, {
      role: 'Business Leader',
      mainConcern: 'Risk, Compliance & Security',
      decisionAreas: ['Risk']
    });

    expect(ranked[0].category).toBe('Risk');
    expect(ranked[0].ranking.personalizationMatch).toBeGreaterThan(ranked[1].ranking.personalizationMatch);
  });

  it('does not treat generic product funding stories as strong matches for data leak concerns', () => {
    const recent = new Date().toISOString();
    const clusters = [
      makeCluster({
        title: 'Listen Labs secures funding amid AI data integrity claims',
        text: 'A startup raised a large funding round and says it improves participant data integrity for AI research workflows.',
        category: 'Product',
        publishedAt: recent
      }),
      makeCluster({
        title: 'New framework addresses enterprise AI data leak prevention',
        text: 'Security and compliance teams are adopting controls for AI data leaks, privacy, and governance.',
        category: 'Risk',
        publishedAt: recent
      })
    ];

    const ranked = scoreAndRankClusters(clusters, {
      role: 'Business Leader',
      mainConcern: 'AI data leaks',
      decisionAreas: ['Risk']
    });

    expect(ranked[0].category).toBe('Risk');
    expect(ranked[0].ranking.concernMatch).toBeGreaterThan(ranked[1].ranking.concernMatch);
    expect(ranked[1].ranking.concernMatch).toBeLessThan(0.2);
    expect(ranked[1].ranking.focusMatch).toBeLessThan(0.3);
  });

  it('boosts signals that contain strategic breakthrough keywords', () => {
    const recent = new Date().toISOString();
    const clusters = [
      makeCluster({
        title: 'Minor update to AI assistant UI',
        text: 'The assistant now has a slightly different blue color for the chat bubble.',
        category: 'Product',
        publishedAt: recent
      }),
      makeCluster({
        title: 'New paradigm shift in low-latency infrastructure',
        text: 'Major breakthrough in high-throughput inference for production-ready open weights models.',
        category: 'Product',
        publishedAt: recent
      })
    ];

    const ranked = scoreAndRankClusters(clusters, {
      role: 'Product Leader',
      mainConcern: 'AI Performance',
      decisionAreas: ['Product']
    });

    // The strategic one should be first despite both being 'Product' and 'recent'
    expect(ranked[0].representative.clean_title).toContain('paradigm shift');
    expect(ranked[0].ranking.strategicMatch).toBeGreaterThan(0);
    expect(ranked[0].ranking.score).toBeGreaterThan(ranked[1].ranking.score);
  });
});
