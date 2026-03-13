# Feature Success Metrics

## Feature Name
AI Signals for Leaders (Whole Application)

## Primary User Outcome
The user receives highly relevant, curated intelligence on how AI developments affect their specific industry, role, and company maturity—vastly reducing cognitive overhead while maintaining strategic awareness.

## North Star Metric Impact
**Active Signal Consumption Rate (ASCR):** The percentage of weekly active users who explicitly view and interact with at least one "Signal" or "Brief" per week. 
This directly measures the core value proposition: are users actually finding and consuming the personalized intelligence we aggregate?

## Activation Metrics
- **Time to First Signal (TTFS):** Time elapsed between user sign-up and viewing their first personalized brief. (Target: < 2 minutes).
- **Personalization Completion Rate:** Percentage of new users who complete their context profile (Role, Focus, Industry, etc.) rather than skipping to generic news.

## Engagement Metrics
- **Briefs Viewed per User per Session:** Average number of generated signals clicking into "detail/brief mode."
- **W0 to W1 Retention (Week 0 to Week 1):** The percentage of users who return to consume another signal in the week following their signup.
- **Session Frequency:** How many calendar days per week a user logs into the dashboard (Target: 2-3 days for "Overwhelmed Strategists").

## Retention Signals
- **Saved/Bookmarked Signals:** If users are saving briefs, it proves long-term utility beyond just reading the news.
- **Profile Updates:** Users who return to update their "Main Focus" or "Keywords" are highly retained, as they are actively tuning the AI to their evolving strategy needs.

## Revenue or Monetization Signals
- **Paywall Hit Rate:** Percentage of active users who trigger the "0 Tokens" state or click the "Upgrade" persistent button.
- **Token Purchase Conversion Rate:** The percentage of users who convert to a paid tier (Tokens, Monthly, or Annual) after hitting the paywall.

## Leading Indicators
- **High brief generation velocity:** High volume of API calls to the LLM backend per user indicates strong initial perceived value.
- **High personalization score usage:** A high percentage of users passing custom `preferences` objects to the backend rather than using default/blank parameters.

## Failure Signals
- **The "One-and-Done" Churn:** High percentage of users who create an account, view 0 or 1 briefs, and never return. This indicates poor onboarding or the first generated brief was "noisy summaries" instead of "clear signal."
- **Dashboard Bouncing:** Users hit the dashboard, see the cluster headlines, and leave without consuming the executive brief (indicates headlines aren't relevant enough to command a click).
- **Paywall Abandonment:** High traffic to the Stripe checkout session but >90% drop-off (indicates pricing mismatch or low perceived value).

## Measurement Plan
- **Supabase Tracking:** We will track `last_login`, `briefs_generated`, and `personalization_completed` via direct timestamps and counts in the `users` and `tokens` tables.
- **Client-side events (e.g., PostHog/Mixpanel):** We need to track `brief_viewed`, `paywall_triggered`, and `checkout_initiated` within `App.tsx` and the API routes to capture precise interaction flows.
- **Stripe Dashboard:** Direct tracking for ARR, MRR, and conversion across the 3 pricing tiers.
