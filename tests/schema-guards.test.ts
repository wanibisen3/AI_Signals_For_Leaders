import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const schema = fs.readFileSync('server/schema.sql', 'utf8');

describe('token and billing schema guards', () => {
  it('enforces generation idempotency at DB level', () => {
    expect(schema).toMatch(/generation_request_id\s+uuid\s+not null\s+unique/i);
  });

  it('uses row locking during token claim to keep spend atomic', () => {
    expect(schema).toMatch(/for update/i);
    expect(schema).toMatch(/insert into token_transactions\(user_id, type, amount, reason, idempotency_key, metadata\)\s*values\s*\(\s*p_user_id,\s*'spend',\s*-1/i);
  });

  it('contains refund idempotency key for generation failures', () => {
    expect(schema).toMatch(/gen:refund:/i);
    expect(schema).toMatch(/if not exists\s*\(\s*select 1 from token_transactions\s*where idempotency_key = 'gen:refund:' \|\| p_generation_request_id::text/i);
  });

  it('contains Stripe webhook idempotency guard', () => {
    expect(schema).toMatch(/create table if not exists stripe_processed_events/i);
    expect(schema).toMatch(/stripe_event_id\s+text\s+primary key/i);
    expect(schema).toMatch(/if exists \(select 1 from stripe_processed_events where stripe_event_id = p_stripe_event_id\)/i);
  });
});
