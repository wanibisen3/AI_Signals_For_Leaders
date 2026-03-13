# UX Design

## Feature Name
AI Signals Payment Pop-Up (3-Tier Paywall)

## Target User
The "Overwhelmed Strategist" (Product Leaders, Directors, Managers) who values speed, clarity, and hates aggressive or confusing SaaS upsells.

## Entry Point
1. **Hard Paywall:** The user attempts to generate a new AI Brief but has 0 Insight Tokens remaining.
2. **Soft Paywall (Persistent):** The user clicks an ever-present "Upgrade / Get Tokens" button located in the primary navigation or dashboard header next to their current token balance.

## Primary User Flow
1. **Trigger:** User interacts with one of the entry points.
2. **Display Pop-Up:** A modal overlays the current screen (dimming the background to maintain context without navigating away from their workflow).
3. **Plan Selection:** The modal displays three clear, side-by-side or stacked options:
   - *Pay-As-You-Go* (Token Pack)
   - *Professional* (Monthly)
   - *Executive* (Annual - highlighted as "Best Value")
4. **Action:** User clicks the primary CTA (e.g., "Continue to Payment") on their chosen tier.
5. **Handoff:** The pop-up transitions into a loading state briefly before redirecting the user seamlessly into a secure Stripe Checkout session.
6. **Return:** After Stripe completes, the user is redirected back to the dashboard with a subtle success toast notification ("Payment successful. Your account has been upgraded.") and their new limits immediately applied.

## Screens / UI Components
- **Payment Modal (Pop-Up):** 
  - Header: "Unlock More Insights"
  - Subtext: "Choose a plan to continue generating personalized AI signals."
  - 3-Column Pricing Cards (or stacked rows for mobile): Price, cadence, and 2-3 bullet points of what is included.
  - Close "X" button and CTA buttons.
- **Loading Overlay:** A subtle spinner indicating transition to Stripe.
- **Success Toast:** Brief notification upon returning from Stripe.

## System Responses
- **On Trigger:** Rapidly render the modal containing up-to-date pricing logic (cached for speed). 
- **On Checkout Initiation:** Disable the CTA buttons to prevent duplicate clicks and show a loading spinner.
- **On Successful Payment Return:** Re-fetch the user's token balance/subscription status from the API immediately so the UI reflects the purchase without requiring a manual refresh.

## Empty States
Not explicitly applicable, as pricing tiers are static options. However, if the payment gateway is unreachable, an empty state in the modal should say: "Unable to load pricing at this time. Please try again later."

## Error States
- **API Failure on Click:** If initiating the Stripe session fails: "Something went wrong connecting to our payment provider. Please try again." 
- **Payment Failed Return:** If the user returns from Stripe with a failed/cancelled payment: A toast notification reading "Payment was cancelled or failed. No charges were made." The paywall modal does *not* automatically reopen, avoiding annoyance.

## Edge Cases
- **User already has an active subscription:** If they click the persistent "Upgrade" button, the modal should detect their status. Instead of selling them the Monthly/Annual plan again, it should say "You are on the Professional Plan" and offer a "Manage Subscription" button (routing to Stripe Customer Portal), while still allowing them to buy one-off token packs if needed.
- **Network drop during redirect:** If the network drops between the modal and Stripe, the browser handles it, but the UI must correctly recover when they return.

## UX Principles Applied
- **Minimize Cognitive Load:** We are using a modal instead of a dedicated pricing page so the user doesn't lose their place (e.g., staring at a news brief they *really* want to analyze).
- **Prefer Obvious Interactions:** 3 clear choices, no complex sliders for token amounts, and standard Stripe patterns.
- **Respect the Professional:** No dark patterns, timers, or aggressive "Wait don't go!" exit-intent behaviors. If they close the modal, it closes instantly.
