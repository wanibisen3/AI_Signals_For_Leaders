import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { fallbackBrief } = require('../server/services/generation.js');

describe('generated brief ranking metadata', () => {
  it('preserves backend ranking score in the brief payload', () => {
    const brief = fallbackBrief({
      cluster_id: 'cluster-1',
      category: 'Product',
      event_type: 'update',
      representative: {
        clean_title: 'AI agents improve workflow speed',
        clean_text: 'A new release improves agent workflows for product teams.',
        source: 'Test Source',
        published_at: new Date().toISOString()
      },
      items: [{ source: 'Test Source', url: 'https://example.com' }],
      ranking: {
        score: 8.75,
        personalizationMatch: 0.82,
        roleMatch: 0.75,
        focusMatch: 0.88,
        areaMatch: 0.7
      }
    });

    expect(brief.rankingScore).toBe(8.75);
    expect(brief.matchScore).toBe(82);
  });
});
