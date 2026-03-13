# Development Issues

## Feature Name
AI Signals 3-Tier Payment Plan

## Parent Issue
**Title:** Implement 3-Tier Payment Plan
**Description:** Build and integrate a Stripe-backed 3-tier payment gateway (Tokens, Monthly Subscription, Annual Subscription) into AI Signals for Leaders, protecting core AI generation operations from unpaid usage.
**Acceptance Criteria:**
- Free users hit a paywall when out of generated tokens.
- Users can purchase one-off token packs or subscribe to Monthly/Annual recurring plans.
- Backend API securely enforces Stripe Webhooks to update user balances/entitlements.
- "Dual State" handled gracefully (e.g. residual tokens + active subscription).

---

## Child Issues

### Milestone 1: Database Schema & Stripe Configuration

#### Issue 1.1: Extend Users Table and Create Stripe Events Table
**Title:** DB: Add Stripe fields and Idempotency table to Supabase
**Description:** Implement the database schema migrations required to track Stripe references on the `users` table and ensure webhook idempotency via `stripe_events`.
**Acceptance Criteria:**
- `users` table contains: `stripe_customer_id` (indexed), `stripe_subscription_id`, `subscription_tier`, `subscription_status` (enum).
- `stripe_events` table is created with `id` as PK, `type`, `status`, and `created_at`.
**Dependencies:** None

#### Issue 1.2: Configure Stripe Dashboard & Environment
**Title:** Setup: Create Test-Mode Stripe Products
**Description:** Manually configure the 3 pricing tiers in the Stripe Dashboard and map the secret keys to our local and staging environments.
**Acceptance Criteria:**
- Token Pack, Monthly, and Annual products exist in Stripe.
- `.env` file updated with `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the 3 Price IDs.
**Dependencies:** None

---

### Milestone 2: Secure Backend Infrastructure

#### Issue 2.1: Implement Checkout Session API
**Title:** API: Build `/api/stripe/create-checkout-session`
**Description:** Create a secure endpoint that generates a Stripe Checkout URL based on a requested tier, injecting the current user's UUID.
**Acceptance Criteria:**
- Endpoint accepts a `tierId`.
- Verifies user authentication via request context.
- Passes `auth.uid()` to Stripe as `client_reference_id`.
- Returns valid `checkout.session.url` or throws 40x.
**Dependencies:** Issue 1.2

#### Issue 2.2: Implement Checkout Webhook Handler
**Title:** API: Handle `checkout.session.completed` webhook
**Description:** Create highly secure webhook receiver that processes successful payments, verifying signatures and granting tokens/subscriptions.
**Acceptance Criteria:**
- Uses `stripe.webhooks.constructEvent()` to verify signature.
- Handles `checkout.session.completed`.
- Upserts to `stripe_events` to guarantee idempotency (`ON CONFLICT (id) DO NOTHING`).
- Updates `users` table `token_balance` or `subscription_status` based on product type.
**Dependencies:** Issue 1.1, Issue 2.1

#### Issue 2.3: Implement Subscription Lifecycle Webhooks
**Title:** API: Handle subscription modify/cancel webhooks
**Description:** Extend the webhook handler to process recurring billing events that remove or update a user's subscription access.
**Acceptance Criteria:**
- Handles `customer.subscription.updated` and `customer.subscription.deleted`.
- Accurately strips or modifies access in the `users` table if a subscription invoice fails or is canceled.
**Dependencies:** Issue 2.2

#### Issue 2.4: Secure AI Generation Route
**Title:** API: Enforce Entitlements in `/api/generate-brief`
**Description:** Update the core brief generation route to rely strictly on server-side entitlement validation, not client-passed state.
**Acceptance Criteria:**
- Checks `subscription_status === 'active'` first.
- If not active, checks `token_balance > 0` and decrements it upon successful generation.
- Throws 403 Forbidden if neither condition is met.
**Dependencies:** Issue 1.1

---

### Milestone 3: Frontend Payment UI & API Integration

#### Issue 3.1: Build PaymentModal Component
**Title:** UI: Build 3-Tier Payment Overlay Modal
**Description:** Create the React component for the paywall UI allowing users to select a plan.
**Acceptance Criteria:**
- Displays Tokens, Monthly, and Annual tiers side-by-side.
- Dimmed background overlay.
- "Continue to Payment" CTAs trigger loading spinners.
- If user has active subscription, shows "Manage Subscription" instead of buy buttons.
**Dependencies:** None (Can be mocked)

#### Issue 3.2: Wire Paywall Trigger Logic
**Title:** UI: Integrate Paywall Triggers & State
**Description:** Connect the `/api/generate-brief` failures to gracefully open the Payment Modal.
**Acceptance Criteria:**
- If user attempts generation with 0 tokens, modal opens.
- Global app state tracks `subscriptionStatus` and `tokenBalance` correctly.
- Clicking the persistent "Upgrade" button opens the modal.
**Dependencies:** Issue 3.1

#### Issue 3.3: Connect Stripe Redirects & Success Toasts
**Title:** UI: Wire checkout sessions and handle return URLs
**Description:** Connect the `PaymentModal` buttons to the actual `/api/stripe/create-checkout-session` endpoint and handle user returns.
**Acceptance Criteria:**
- Clicking a tier calls the endpoint and redirects browser to Stripe.
- Returning from Stripe success URL triggers a "Payment Successful" toast notification and local state refresh.
- Returning from Stripe cancel URL triggers "Payment Cancelled" toast notification silently.
**Dependencies:** Issue 2.1, Issue 3.1

---

## Suggested Execution Order
1. Issue 1.1 (Supabase Migrations)
2. Issue 1.2 (Stripe Setup)
3. **[Parallelizable]** Issue 3.1 (UI Mockup) & Issue 2.1 (Checkout Session API)
4. Issue 2.2 (Core Webhook Handler - **High Priority**)
5. Issue 2.3 (Subscription Webhooks)
6. Issue 2.4 (Secure API Entitlements)
7. Issue 3.2 (Paywall Triggers)
8. Issue 3.3 (Final E2E Stripe Returns)
