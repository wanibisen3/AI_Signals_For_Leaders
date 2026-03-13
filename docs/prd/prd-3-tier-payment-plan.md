# Product Requirement Document

## Feature Name
AI Signals 3-Tier Payment Plan

## Problem
Currently, the product lacks a sustainable monetization strategy that aligns with different user consumption patterns. Users either extract value for free (costing the business LLM API fees) or face high a friction paywall that doesn't match their usage pattern. Some users have acute, one-time research needs, while others want continuous monitoring, requiring different packaging and pricing structures.

## Target User
The "Overwhelmed Strategist" (Product Leaders, Directors of Strategy, Managers). 
- **Buyer Persona:** The user themselves (via discretionary budget) or their department head.

## User Context
The user is either exploring the platform for the first time and needs to test the value of a personalized report without committing to a subscription, or they are an active user who relies on the continuous stream of signals to prevent being blindsided by industry AI developments.

## User Stories
- As a new user, I want the ability to buy a one-time pack of tokens so that I can rigorously test the personalization quality without committing a corporate credit card to a recurring monthly subscription.
- As a daily active strategy professional, I want a monthly subscription plan so that I can continuously receive personalized briefs without having to authorize micro-transactions every week.
- As a department leader, I want an annual subscription plan so that I can expense the software during annual budget planning and receive a discount for upfront payment.

## Core Functionality
A clear, three-tiered pricing architecture implemented via Stripe:
1. **Tier 1: Pay-As-You-Go (Tokens)** - Users can buy a set block of "Insight Tokens" (e.g., $10 for 50 tokens) for generating individual briefs on-demand.
2. **Tier 2: Professional (Monthly)** - A recurring monthly subscription (e.g., $29/mo) granting a high or semi-unlimited allocation of tokens or briefs per month.
3. **Tier 3: Executive (Annual)** - An annual version of the Professional tier, billed once per year at a discounted rate (e.g., $290/yr).

## User Journey
1. User reaches a paywall after consuming a free trial snippet or creating an account.
2. User clicks "Upgrade" or "Get Tokens".
3. User is presented with a clean pricing table displaying three clear options: Tokens, Monthly, Annual.
4. User selects a tier.
5. User is routed to a Stripe Checkout Session.
6. Upon successful payment, Stripe Webhook updates the `server/schema.sql` database (either granting tokens or setting `stripe_subscription_status` to active).
7. User is returned to the dashboard with unlocked access.

## Scope
- Front-end pricing table UI (`App.tsx` or new component).
- Stripe Checkout integrations for 1 one-time product and 2 recurring products.
- Backend API endpoints (`tokens.ts`, `backend.ts`) to initiate Stripe sessions.
- Stripe Webhook handler to securely update user balance/subscription status in Supabase.
- Paywall logic enforcing token deduction logic vs. active subscription logic.

## Non-Goals
- Complex team billing or multi-seat Enterprise management (violates MVP constraint).
- Overage billing (users on a subscription should either have unlimited access or a hard cap, not complex metered overage invoicing).
- Crypto payments or alternative gateways (Stripe only).

## Success Metrics
- **Conversion Rate:** % of free users who purchase *any* tier.
- **Tier Distribution:** Ratio of Token vs. Monthly vs. Annual purchases. (Goal: Use tokens as a wedge to drive Monthly/Annual).
- **Churn Rate:** % of monthly users who cancel in month 1 or 2.

## Dependencies
- Stripe Account (Standard).
- Supabase Database (Requires schema updates to track subscription IDs and expiration dates alongside existing token balances).
- Existing authentication flow to link Stripe IDs to Supabase User UIDs.

## Risks
- **State Complexity:** Managing dual-state logic where a user might have a lapsed subscription *but* still have residual one-time tokens in their wallet.
- **Stripe Webhook Failures:** If webhooks drop, users pay but don't get access, causing massive support debt.

## Open Questions
- What happens if a user buys tokens, then later subscribes to Monthly? Do the purchased tokens stack on top of the monthly allocation, or roll over?
- What are the exact price points and token allocations per tier? (Requires unit economic analysis of OpenAI API costs).
