# System Design

## Feature Name
AI Signals 3-Tier Payment Plan

## Architecture Overview
The payment architecture integrates Stripe Checkout with our existing React frontend and Node.js/Vercel backend. It leverages Supabase as the source of truth for user entitlements (tokens balance and active subscription status). The flow relies heavily on asynchronous Stripe Webhooks to guarantee that database state is only mutated upon verified, successful payment intent resolution, avoiding client-side spoofing.

## System Components
- **Frontend Components:**
  - `PaymentModal.tsx`: The UI overlay presenting the 3 tiers.
  - Context Provider/Hooks: Upgraded to track `subscriptionStatus` alongside `tokenBalance`.
- **Backend Services:**
  - Node.js API Route for Stripe Checkout session creation.
  - Node.js API Route for Stripe Webhook handling.
- **Background Jobs:**
  - None required for MVP (Stripe handles recurring billing cron automatically).
- **Integrations:**
  - Stripe API (Checkout & Webhooks)
  - Supabase Database (Users, Balances, Subscriptions)

## API Design
- `POST /api/stripe/create-checkout-session`
  - Body: `{ tierId: 'price_token_pack' | 'price_monthly' | 'price_annual' }`
  - Returns: `{ url: string }` (Stripe redirect URL)
- `POST /api/stripe/webhook`
  - Stripe signature verification required.
  - Handles events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`.

## Data Storage
Supabase modifications:
- Existing `users` table needs new columns:
  - `stripe_customer_id` (varchar, unique)
  - `stripe_subscription_id` (varchar, nullable)
  - `subscription_status` (enum: 'active', 'canceled', 'past_due', 'none')
  - `subscription_tier` (varchar, nullable)
- Existing `token_balance` logic remains for Tier 1 purchases.

## Data Flow
1. User clicks a tier in the Frontend `PaymentModal`.
2. Frontend calls `POST /api/stripe/create-checkout-session` with the selected tier.
3. Backend fetches the user's `stripe_customer_id` from Supabase (creates one via Stripe API if it doesn't exist).
4. Backend creates a Stripe Checkout Session and returns the `session.url`.
5. Frontend redirects the user to the Stripe-hosted checkout page.
6. User completes payment. Stripe redirects the user back to the application's success URL.
7. Asynchronously, Stripe fires a `checkout.session.completed` event to `POST /api/stripe/webhook`.
8. The Webhook parses the payload securely, identifies the user via `client_reference_id` or `stripe_customer_id`, and runs a Supabase RPC or direct update to either increase `token_balance` (for Tier 1) OR set `subscription_status = 'active'` (for Tier 2/3).
9. The Frontend re-fetches the user's profile state to reflect the upgraded access.

## External Integrations
- **Stripe**: Handles all PCI compliance, credit card storage, and recurring billing logic.
- **Supabase**: Handles user mapping and strict Row Level Security (RLS) to ensure users can only ever access their own purchased tokens or brief entitlements.

## Observability
- **Logging:** Log all incoming Stripe Webhook events and their processing status (success/fail) to a secure backend log stream (e.g., Datadog, Vercel Logs). 
- **Monitoring:** Alerting on 5xx errors to the `/api/stripe/webhook` endpoint is critical, as a failing webhook means revenue is collected but access is not granted.
- **Metrics:** Track checkout session initiation vs. completion rates to monitor paywall drop-off.

## Scalability Considerations
- **Webhook Thundering Herd:** If Stripe fires many webhooks simultaneously, the Node.js endpoint must be able to handle concurrent database (Supabase) connections. 
- **Mitigation:** Ensure Supabase connection pooling (e.g., PgBouncer) is enabled. Write webhook handlers to be idempotent (if the same webhook is delivered twice, the database is only updated once).

## Architectural Risks
- **Dual State Complexity:** If a user has both a residual token balance (Tier 1) AND an active subscription (Tier 2/3), the paywall enforcement logic (`/api/generate-brief`) must be updated. *Risk:* Accidentally deducting tokens from a user who has an active "unlimited" subscription. *Mitigation:* The API must check `subscription_status === 'active'` *before* evaluating `token_balance > 0`.
