import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

describe('backend generation wiring', () => {
  it('exports generateBrief from the generation service', () => {
    const generation = require('../server/services/generation.js');
    expect(typeof generation.generateBrief).toBe('function');
  });

  it('does not export generateBrief from the process service', () => {
    const processService = require('../server/services/process.js');
    expect(processService.generateBrief).toBeUndefined();
  });
});
