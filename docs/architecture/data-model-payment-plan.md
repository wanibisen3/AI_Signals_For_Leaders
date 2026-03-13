# Data Model

## Feature Name
AI Signals 3-Tier Payment Plan

## Core Entities
Per the Architect role principles, we will extend the existing `users` table where possible and introduce a new `stripe_events` table for webhook idempotency and auditing, rather than creating an overly complex subscription ledger system.

1.  **Users** (Extended)
2.  **Stripe Events** (New)

## Entity Definitions

### Entity: Users

*Represents the core application user and their entitlement state.*

Attributes:
- `id` (uuid, references auth.users)
- `email` (varchar)
- `token_balance` (integer, default 0) - *Existing: Tracks strictly Pay-As-You-Go tokens.*
- `stripe_customer_id` (varchar, nullable, unique) - *Links user to Stripe.*
- `stripe_subscription_id` (varchar, nullable, unique) - *Tracks active recurring plan.*
- `subscription_tier` (varchar, nullable) - *e.g., 'price_monthly', 'price_annual'*
- `subscription_status` (enum: 'active', 'canceled', 'past_due', 'unpaid', 'none') - *Drives paywall bypass logic.*
- `current_period_end` (timestamp, nullable) - *When the current subscription cycle ceases if canceled.*

Primary Key:
- `id`

Relationships:
- 1:1 with `auth.users` (Supabase implicit mapping)
- 1:N with `Stripe Events`

---

### Entity: Stripe Events

*An append-only audit log of processed Stripe Webhooks. Critical for resolving "Thundering Herd" race conditions and double-delivery issues.*

Attributes:
- `id` (varchar) - *The exact `evt_xxxx` ID sent by Stripe.*
- `user_id` (uuid, nullable)
- `type` (varchar) - *e.g., 'checkout.session.completed'*
- `status` (enum: 'processed', 'failed')
- `created_at` (timestamp, default now())

Primary Key:
- `id` (Enforces idempotency natively at the database level).

Relationships:
- N:1 with `Users` (via `user_id`)

## Indexing Strategy
- **`users.stripe_customer_id`**: High priority. Webhooks often arrive with only the Stripe Customer ID, so we need a B-Tree index here to quickly locate the correct user row to update their `subscription_status`.
- **`stripe_events.id`**: Naturally indexed as the Primary Key for O(1) idempotency checks.

## Data Lifecycle
- **Creation:** `stripe_customer_id` is appended to the user row during their first checkout session. `Stripe Events` are inserted whenever a webhook fires.
- **Updates:** `subscription_status` and `subscription_tier` fluctuate based on `customer.subscription.updated` / `deleted` webhook events.
- **Deletion:** `stripe_events` can be aggressively pruned (e.g., delete records > 90 days old) as they are only needed for real-time idempotency checks and short-term debugging. User data is only purged upon account deletion.

## Scaling Considerations
- **Idempotency Execution:** Because Stripe guarantees *at-least-once* delivery, webhooks can fire concurrently. By using `stripe_events.id` as a Primary Key, we can use a standard UPSERT (`ON CONFLICT (id) DO NOTHING`) to guarantee that a `token_balance` payload is never applied twice to a user's account, preventing severe revenue loss at high scale.
- **Dual State Reads:** The API generation route reads `subscription_status` and `token_balance` constantly. Adding an index to these columns is unnecessary right now because we always query by the `user.id` (Primary Key).

## Data Risks
- **Data Inconsistency (Sync Lag):** If the Stripe API marks a subscription active, but the webhook delivery to our server is delayed or fails, the user explores the web app expecting access but the database `subscription_status` still says 'none'. 
  - *Mitigation:* Ensure robust alerts on webhook 5xx errors. 
- **Over-Normalization Risk Avoided:** We explicitly decided *not* to create a separate `subscriptions` table. Managing joins across a `users`, `tokens`, and `subscriptions` table for every single AI brief generation check would add unnecessary latency. Flattening the active subscription state onto the `users` table directly adheres to the simple data structure principle.
