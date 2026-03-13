# Security Review

## Feature Name
AI Signals 3-Tier Payment Plan

## Security Overview
The payment architecture relies on delegating all sensitive financial data (credit cards, billing addresses) to Stripe. The primary security posture focuses on protecting the integrity of the Webhook receipt logic. If a malicious actor can spoof a Stripe Webhook or manipulate the state of `token_balance` or `subscription_status` on the client side, they can steal LLM compute resources (API fees) from our business.

## Data Involved
- **User Data:** Email addresses, Internal Supabase UUIDs.
- **System Data:** Stripe Customer IDs, Stripe Subscription IDs, Token Balances, Subscription Status.
- **Financial Data:** None strictly held on our servers (handled by Stripe PCI-compliant iframe/redirects).

## Authentication Risks
- **Session Hijacking:** If a user's Supabase session is hijacked, the attacker could theoretically utilize the user's paid tokens.
- **Webhook Spoofing:** The `/api/stripe/webhook` endpoint is public (no user Auth). If it doesn't correctly validate the Stripe Signature header, anyone can send an HTTP POST claiming "Payment Successful" and grant themselves free tokens.

## Authorization Risks
- **Client-Side Entitlement Spoofing:** If the frontend React app is the *only* thing checking `if (subscription_status === 'active')`, an attacker can simply modify the local React state or Network response to bypass the paywall UI.
- **IDOR (Insecure Direct Object Reference) on Checkout:** If the `/api/stripe/create-checkout-session` endpoint accepts a `user_id` in the POST body instead of reading it purely from the secure server-side session token, User A could theoretically buy a subscription for User B (or worse, manipulate parameters).

## Privacy Risks
- **PII Leakage in Webhooks:** Stripe webhook payloads contain a massive amount of PII (billing addresses, emails, names). If we blindly log the entire webhook `req.body` to Datadog/Vercel Logs for debugging, we violate GDPR/CCPA by pushing PII into plaintext logs.

## API and Abuse Risks
- **Card Testing / Spam Checkouts:** Malicious bots could hit the `/api/stripe/create-checkout-session` endpoint thousands of times a minute, generating thousands of abandoned Stripe sessions. This won't necessarily cost us money directly but could result in Stripe rate-limiting or suspending the account.
- **Thundering Herd / Race Conditions:** An attacker could attempt to trigger multiple checkout success callbacks simultaneously to try and double or triple their token balance artificially.

## AI-Specific Risks
- Not directly applicable to the payment layer. However, the resulting *theft* of tokens leads to free LLM API abuse, which directly drains our OpenAI credits. 

## Severity Assessment
- **High:** Webhook Verification Bypass (Leads to 100% free access and LLM cost drain).
- **High:** Client-Side Paywall Enforcement (Missing server-side entitlement checks).
- **Medium:** PII leakage in application logs.
- **Medium:** API rate-limiting on Checkout generation.
- **Low:** IDOR on checkout creation (Usually just results in paying for someone else).

## Recommended Mitigations
1. **Strict Webhook Signature Validation (High):** The `/api/stripe/webhook` endpoint *must* use the official `stripe.webhooks.constructEvent()` method using the securely stored `STRIPE_WEBHOOK_SECRET` environment variable. Never process the payload otherwise.
2. **Server-Side Enforcement (High):** The `/api/generate-brief` endpoint must query the Supabase `users` table directly using the `auth.uid()` of the requester to verify the `subscription_status` or `token_balance` state *before* pinging OpenAI. Do not trust state passed from the React frontend.
3. **Idempotency Locks (High):** Implement the `stripe_events` table (as defined in the Data Model) to guarantee that a specific standard webhook `evt_` ID never increments a token balance more than once.
4. **Log Sanitization (Medium):** Only log the `stripe_customer_id`, `event_type`, and `event_id` when handling webhooks. Explicitly scrub or omit the `req.body.data.object` when writing to Datadog/Vercel logs to protect PII.
5. **Rate Limiting (Medium):** Apply a strict rate limit based on IP and User-ID to the `create-checkout-session` endpoint to prevent automated session generation spam.

## Open Questions
- What is our exact policy for handling a Stripe webhook that fails to process 5 times in a row? Do we queue it in a Dead Letter Queue (DLQ) or rely entirely on Stripe's auto-retries?
