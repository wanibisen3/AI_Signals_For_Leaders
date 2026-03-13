import { describe, it, expect, vi } from 'vitest';
import handler from './dashboard';
import { handleDashboardState, handleRunGeneration, handleSavePersonalization } from './_lib/backend.js';

vi.mock('./_lib/backend.js', () => ({
  handleDashboardState: vi.fn(),
  handleRunGeneration: vi.fn(),
  handleSavePersonalization: vi.fn(),
}));

describe('Dashboard Handler', () => {
  it('should call handleRunGeneration when action is "generate"', async () => {
    const req = { query: { action: 'generate' }, body: {} };
    const res = {};
    await handler(req, res);
    expect(handleRunGeneration).toHaveBeenCalledWith(req, res);
  });

  it('should call handleSavePersonalization when action is "personalization"', async () => {
    const req = { query: { action: 'personalization' }, body: {} };
    const res = {};
    await handler(req, res);
    expect(handleSavePersonalization).toHaveBeenCalledWith(req, res);
  });

  it('should call handleDashboardState when action is not specified', async () => {
    const req = { query: {}, body: {} };
    const res = {};
    await handler(req, res);
    expect(handleDashboardState).toHaveBeenCalledWith(req, res);
  });

  it('should call handleDashboardState when action is an empty string', async () => {
    const req = { query: { action: '' }, body: {} };
    const res = {};
    await handler(req, res);
    expect(handleDashboardState).toHaveBeenCalledWith(req, res);
  });

  it('should call handleDashboardState when action is not recognized', async () => {
    const req = { query: { action: 'unknown' }, body: {} };
    const res = {};
    await handler(req, res);
    expect(handleDashboardState).toHaveBeenCalledWith(req, res);
  });
});