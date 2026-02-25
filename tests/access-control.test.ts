import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { __resetTestClients, __setTestClients, handleDashboardState } from '../api/_lib/backend';

type MockRes = {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  status: (code: number) => MockRes;
  setHeader: (k: string, v: string) => void;
  json: (payload: any) => MockRes;
};

function createRes(): MockRes {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    setHeader(k: string, v: string) {
      this.headers[k] = v;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    }
  };
}

describe('access control', () => {
  beforeEach(() => {
    __setTestClients({ auth: {} as any, admin: {} as any });
  });

  it('rejects dashboard requests without auth token', async () => {
    const req: any = { method: 'GET', headers: {} };
    const res = createRes();

    await handleDashboardState(req, res as any);

    expect(res.statusCode).toBe(401);
    expect(res.body?.success).toBe(false);
  });

  it('rejects wrong HTTP method', async () => {
    const req: any = { method: 'POST', headers: {} };
    const res = createRes();

    await handleDashboardState(req, res as any);

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('GET');
  });

  afterEach(() => {
    __resetTestClients();
  });
});
