# Implementation Plan

## Feature Name
AI Signals 3-Tier Payment Plan

## Planning Summary
This plan structures the payment integration to tackle the highest-risk technical item first (Stripe Webhook idempotency and database schemas) before moving to the user-facing UX. This ensures that when the UI is built, the backend is already fully capable of correctly granting access securely without spoofing vulnerabilities.

## Required Inputs
- **PRD:** `docs/prd/prd-3-tier-payment-plan.md`
- **UX Design:** `docs/ux/ux-payment-pop-up.md`
- **System Design:** `docs/architecture/system-design-payment.md`
- **Data Model:** `docs/architecture/data-model-payment-plan.md`
- **Security Review:** `docs/architecture/security-review-payment-plan.md`

## Milestones
1. **Milestone 1:** Database Schema & Stripe Configuration (Data Foundation)
2. **Milestone 2:** Secure Backend Infrastructure (Core Logic & Webhooks)
3. **Milestone 3:** Frontend Payment UI & API Integration (User Flow)

## Detailed Tasks

### Milestone 1: Database Schema & Stripe Configuration
- Task 1.1: Run Supabase migration to extend `users` table (`stripe_customer_id`, `stripe_subscription_id`, `subscription_tier`, `subscription_status`).
- Task 1.2: Run Supabase migration to create `stripe_events` table (with `id` as Primary Key for idempotency).
- Task 1.3: Add index to `users.stripe_customer_id`.
- Task 1.4: Set up Stripe Dashboard (Test Mode): Create the 3 Products (Tokens, Monthly, Annual) and note their Price IDs.
- Task 1.5: Configure `.env` with `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

### Milestone 2: Secure Backend Infrastructure
- Task 2.1: Build `POST /api/stripe/create-checkout-session` endpoint to generate valid checkout URLs, passing `auth.uid()` as the `client_reference_id`.
- Task 2.2: Implement `POST /api/stripe/webhook` with strict `stripe.webhooks.constructEvent()` validation (Security Review requirement).
- Task 2.3: Implement Webhook handlers for `checkout.session.completed` (Granting tokens or creating subscriptions).
- Task 2.4: Implement Webhook handlers for `customer.subscription.updated` and `customer.subscription.deleted`.
- Task 2.5: Ensure all webhook inserts to `stripe_events` use `ON CONFLICT (id) DO NOTHING` to prevent thundering herd double charges.
- Task 2.6: Refactor backend `POST /api/generate-brief` to strictly enforce server-side constraints (checking `subscription_status === 'active'` *before* `token_balance > 0`).

### Milestone 3: Frontend Payment UI & API Integration
- Task 3.1: Build `PaymentModal.tsx` overlay handling the 3 pricing tiers.
- Task 3.2: Update React global state/context to fetch and store `subscriptionStatus` alongside `tokenBalance`.
- Task 3.3: Wire the `PaymentModal` CTA buttons to call `/api/stripe/create-checkout-session` and redirect to Stripe.
- Task 3.4: Implement the "0 Tokens" triggering logic to open the modal gracefully.
- Task 3.5: Handle success/cancel URLs from Stripe, including a toast notification on return.

## Dependencies
- **External:** Stripe Account access (Developer/Test mode is sufficient for now).
- **Internal:** Existing Auth system must be passing valid UUIDs to link Stripe accounts.

## Testing Plan
- **Unit Tests:** Define mock payload tests for the Webhook handler to ensure signature failures throw 400s immediately.
- **Integration Tests:** Use the Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`) to intentionally fire duplicate `checkout.session.completed` events and verify identical end-state in Supabase.
- **Manual Validation:** Complete checkout flows for all 3 tiers using Stripe test cards. Complete a subscription cancellation flow inside the Stripe Customer Portal and verify the app correctly revokes access locally.

## Rollout Plan
- **Stage 1 (Internal Testing):** Implement directly in the development branch using Stripe Test Mode keys.
- **Stage 2 (Production Beta):** Swap to Live Stripe keys. Create a 100% discount promo code and manually test in production to verify Live Webhooks are securely penetrating Vercel to Supabase.
- **Stage 3 (Launch):** Remove discount code, announce feature to existing free users via email/dashboard banner.

## Risks and Blockers
- **Risk:** Failing to parse the webhook payload correctly across frameworks. (e.g., Next.js requires `bodyParser: false` to securely construct Stripe webhook signatures from raw buffers).
- **Blocker:** Missing final integer pricing decisions from Product Strategy. Defaulting to placeholders for now.

## Open Questions
- What URL should we provide to Stripe as the `cancel_url`? (e.g., return them to dashboard, or a specific "why did you cancel?" survey?)

## Recommended Execution Order
Execute Milestone 1 -> Milestone 2 -> Milestone 3 strictly in that order. Building UI before Webhooks guarantees broken state synchronization during testing.
