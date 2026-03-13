# Backlog Prioritization

## Items Evaluated

### Issue 1.1: Extend Users Table and Create Stripe Events Table
**Description:** Implement the database schema migrations required to track Stripe references on the `users` table and ensure webhook idempotency via `stripe_events`.
**User Value:** Invisible to the user, but foundational for enabling the ability to purchase tokens and subscriptions.
**Strategic Fit:** High. Aligns perfectly with the business goal of building a product people pay for and tracking tokens/entitlements.
**Implementation Effort:** Low
**Dependencies:** None

### Issue 1.2: Configure Stripe Dashboard & Environment
**Description:** Manually configure the 3 pricing tiers in the Stripe Dashboard and map the secret keys to local and staging environments.
**User Value:** Invisible to the user, but required to map payment plans.
**Strategic Fit:** High. Enables monetization. 
**Implementation Effort:** Low
**Dependencies:** None

### Issue 2.1: Implement Checkout Session API
**Description:** Create a secure endpoint that generates a Stripe Checkout URL based on a requested tier, injecting the current user's UUID.
**User Value:** Enables users to initiate a purchase securely.
**Strategic Fit:** High. Core bridge between our app and the payment provider.
**Implementation Effort:** Medium
**Dependencies:** Issue 1.2

### Issue 2.2: Implement Checkout Webhook Handler
**Description:** Create highly secure webhook receiver that processes successful payments, verifying signatures and granting tokens/subscriptions.
**User Value:** Ensures users actually receive what they paid for instantly.
**Strategic Fit:** High. Prevents lost revenue and guarantees entitlement updates are idempotent.
**Implementation Effort:** High
**Dependencies:** Issue 1.1, Issue 2.1

### Issue 2.3: Implement Subscription Lifecycle Webhooks
**Description:** Extend the webhook handler to process recurring billing events that remove or update a user's subscription access.
**User Value:** Ensures that when users cancel or update their cards, their access is properly managed.
**Strategic Fit:** Medium. Important for long-term subscription management, but less critical for the very first transaction.
**Implementation Effort:** Medium
**Dependencies:** Issue 2.2

### Issue 2.4: Secure AI Generation Route
**Description:** Update the core brief generation route to rely strictly on server-side entitlement validation, not client-passed state.
**User Value:** Protects the platform's resources so paying users get reliable service.
**Strategic Fit:** High. Enforces the business rule that prevents free usage beyond the allowed tokens.
**Implementation Effort:** Medium
**Dependencies:** Issue 1.1

### Issue 3.1: Build PaymentModal Component
**Description:** Create the React component for the paywall UI allowing users to select a plan.
**User Value:** High. Gives users a clear, understandable interface to see pricing options.
**Strategic Fit:** High. Essential for conversion.
**Implementation Effort:** Medium
**Dependencies:** None

### Issue 3.2: Wire Paywall Trigger Logic
**Description:** Connect the `/api/generate-brief` failures to gracefully open the Payment Modal.
**User Value:** High. Clearly explains to users why they cannot generate a brief (out of tokens) and provides an immediate solution.
**Strategic Fit:** High. Drives conversion precisely at the moment of highest intent.
**Implementation Effort:** Medium
**Dependencies:** Issue 3.1

### Issue 3.3: Connect Stripe Redirects & Success Toasts
**Description:** Connect the `PaymentModal` buttons to the actual `/api/stripe/create-checkout-session` endpoint and handle user returns.
**User Value:** High. Provides closure and confirmation that their payment was successful.
**Strategic Fit:** Medium. Important for UX polish.
**Implementation Effort:** Medium
**Dependencies:** Issue 2.1, Issue 3.1

## Priority Ranking

1. **Issue 1.1 & Issue 1.2**: Foundational setup required before anything else can be built.
2. **Issue 2.4**: Securing the generation route stops unmonetized leaks early.
3. **Issue 3.1 & Issue 2.1**: Can be worked on in parallel. One sets up the UI component independently, the other sets up the session API.
4. **Issue 2.2**: The core webhook handler to actually grant tokens/subscriptions.
5. **Issue 3.2 & Issue 3.3**: Tying the frontend flows together, triggering the paywall on generation failure, and handling the redirect loops.
6. **Issue 2.3**: Subscription lifecycle webhooks. Less urgent for the initial payment flow release but needed shortly after for recurring management.

## Quick Wins
- **Issue 1.1 and Issue 1.2**: Setting up the DB schema and Stripe dashboard takes minimal time and unblocks the rest of the team.
- **Issue 3.1**: The payment modal component can be built strictly with mock data and no backend dependencies, offering immediate visual progress.

## Strategic Investments
- **Issue 2.2**: The core webhook handler requires careful security (signature verification, idempotency) and testing. This is a large investment to ensure the billing system is robust and trustworthy.
- **Issue 2.4**: Securing the AI generation route is a strategic investment in the platform's unit economics, ensuring costly AI inferences are only provided to entitled users.

## Recommended Execution Order

1. **Phase 1: Foundation (Zero Dependencies)**
   - Issue 1.1: Extend Users Table and Create Stripe Events Table
   - Issue 1.2: Configure Stripe Dashboard & Environment
   - Issue 3.1: Build PaymentModal Component (Mocked)

2. **Phase 2: Entitlements and Checkouts**
   - Issue 2.4: Secure AI Generation Route (Relies on 1.1 schema)
   - Issue 2.1: Implement Checkout Session API (Relies on 1.2 Stripe config)

3. **Phase 3: Webhooks and Granting Access**
   - Issue 2.2: Implement Checkout Webhook Handler (Relies on 1.1, 2.1)

4. **Phase 4: Frontend Integration & Polish**
   - Issue 3.2: Wire Paywall Trigger Logic (Relies on 3.1, 2.4 failures)
   - Issue 3.3: Connect Stripe Redirects & Success Toasts (Relies on 2.1, 3.1)

5. **Phase 5: Day-2 Operations**
   - Issue 2.3: Implement Subscription Lifecycle Webhooks (Relies on 2.2)
