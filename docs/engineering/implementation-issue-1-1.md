# Issue Implementation

## Issue Summary
**Issue 1.1: Extend Users Table and Create Stripe Events Table**

Implemented the database schema migrations required to track Stripe references on the `users` table and ensure webhook idempotency via `stripe_events`. This is foundational for enabling token and subscription purchases.

## Files Modified
- `types.ts`
- `supabase/migrations/20260313033200_stripe_integration.sql` (Created)

## Files Created
- `supabase/migrations/20260313033200_stripe_integration.sql`

## Implementation Details
1. **Supabase Schema Migration:** Added a new SQL migration file to Supabase. This migration uses `ALTER TABLE` to add `stripe_customer_id`, `stripe_subscription_id`, `subscription_tier`, and `subscription_status` to the existing `users` table.
2. **Indexing:** Added a database index `idx_users_stripe_customer_id` on `stripe_customer_id` to speed up future queries triggered by Stripe Webhooks.
3. **Idempotency Table:** Created a new `stripe_events` table designed to track processed webhook IDs, preventing accidental double-crediting if Stripe sends duplicate events.
4. **Security:** Enabled Row Level Security (RLS) on the new `stripe_events` table and created a policy to ensure only service-role requests (like the backend server) can read or modify it, protecting it from public or authenticated frontend users.
5. **Type Safety:** Updated the frontend `User` interface in `types.ts` to reflect the new Stripe columns, ensuring TypeScript correctness when fetching user data.

## Code Changes
**Migration File Summary:**
```sql
ALTER TABLE users ADD COLUMN stripe_customer_id text, ADD COLUMN stripe_subscription_id text, ADD COLUMN subscription_tier text, ADD COLUMN subscription_status text;
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users (stripe_customer_id);
CREATE TABLE stripe_events ( id text PRIMARY KEY, type text NOT NULL, status text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL );
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
```

**Types Updated in `types.ts`:**
```typescript
export interface User {
  id?: string;
  email: string;
  preferences: UserPreferences;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_tier?: string;
  subscription_status?: string;
}
```

## Testing Requirements
- The migration should be applied to a local or staging Supabase instance to verify it runs without errors.
- The `User` type should be verified in the frontend to ensure no type errors have been introduced.
- Webhook tests (Issue 2.2) will later verify that the `stripe_events` table correctly enforces idempotency.

## Risks
- Supabase applies migrations sequentially. If `users` table does not exist or has been modified unexpectedly since the last known baseline, the `ALTER TABLE` might fail.
- Row Level security on `stripe_events` assumes our server will interact using the service role key and `auth.uid() IS NULL` policy. If we misconfigure the backend client, webhooks may fail to insert and cause 500 errors.
