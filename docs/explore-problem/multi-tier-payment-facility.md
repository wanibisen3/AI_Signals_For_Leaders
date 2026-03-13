# Problem Exploration: Multi-Tier Payment Facility

## Executive Summary
The core problem we are exploring is the current inability for users to seamlessly exchange value for the recurring and discrete usage of the "AI Signals for Leaders" application. Without a flexible payment facility offering recurring (monthly/yearly) and episodic (one-time token) options, the business cannot sustainably monetize its core value proposition (personalized, curated AI signals), and users cannot predictably secure access to the features they rely on.

## Root Cause Analysis
Applying "Five Whys" to the lack of a payment facility:
1.  **Why do we need a payment facility?** Because users need a way to pay for the value the app provides.
2.  **Why do users need to pay?** Because generating personalized AI signals incurs compute and LLM API costs for our business.
3.  **Why do we need *both* subscription and one-time token options?** Because our target audience (managers, founders, operators) consumes information differently. Some need continuous monitoring (subscription pain), while others have acute, episodic research needs (token pain).
4.  **Why does the lack of this facility block growth?** Without monetization, the product cannot scale, iterate, or support the underlying LLM costs sustainably. We are building a valuable tool, but failing to capture a portion of that value.
5.  **Fundamentally:** The product has established user value (the "what") but lacks the commercial infrastructure (the "how" of exchange) to support a habit-forming, monetized business model.

## Impact Assessment
*   **Business Cost:** High and compounding. Every unmonetized active user represents a direct loss (LLM API overhead) and an opportunity cost (unrealized MRR/ARR). Without revenue, product development sustainability is threatened.
*   **User Cost:** High friction. Without clear plans or tokens, users may experience rate limits, unpredictable access, or anxiety about losing access to a tool they've integrated into their workflow. A lack of commercial clarity can ironically reduce trust in B2B/prosumer SaaS.
*   **Blast Radius:** This affects 100% of the active user base (who must eventually transition to a paid paradigm) and the core business viability model.

## Constraints & Context
*   **Business Constraints:** The solution must clearly map to the "relevance over volume" and "simple UX" principles. Pricing must reflect the professional/B2B nature of the target audience.
*   **Technical Constraints:** Must integrate securely with existing authentication (Supabase) and likely an industry-standard payment processor (e.g., Stripe) without adding massive latency. 
*   **Strategic Context:** We are operating with an "MVP mindset." We must avoid overbuilding enterprise procurement complexity while still offering enough flexibility (subscriptions vs. tokens) to capture different user behaviors.
*   **Operational Constraints:** Managing three distinct billing paradigms (monthly recurring, annual recurring, and consumable tokens) introduces complex state management (e.g., what happens to token balances if a subscription lapses?).

## Strategic Hypotheses
1.  **The "Safety Net" Hypothesis:** Offering one-time token purchases acts as a low-friction entry point for skeptical users. Once they experience the value of a personalized brief, they will have higher conversion rates to recurring subscriptions.
2.  **The "Corporate Card" Hypothesis:** A significant portion of our target users (Product Leaders, Strategy Professionals) will expense this tool. Offering annual/yearly plans aligns better with corporate procurement cycles than monthly or piecemeal token purchases.
3.  **The "Usage Paradox" Hypothesis:** Users strongly desire the *option* of tokens to feel in control, but ultimately find subscriptions easier to manage cognitively once they establish a habit of checking the dashboard.

## Knowledge Gaps
*   **Unit Economics:** What is our exact blended cost to generate a personalized brief? (We need this to price tokens and subscriptions profitably).
*   **User Behavior:** What is the average frequency of use for an active user? (Are they logging in daily, weekly, or just when big news drops? This dictates whether a subscription or token model is more natural).
*   **Willingness to Pay (WTP):** What price anchor do professionals associate with this level of curated intelligence versus generic tools like ChatGPT Plus?
*   **Current Infrastructure:** How much of the Stripe/Supabase billing logic is already architected in the codebase, and what is the technical delta to support hybrid billing (subscriptions + consumable tokens)?
