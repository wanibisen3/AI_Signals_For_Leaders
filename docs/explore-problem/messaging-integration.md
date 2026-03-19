# Problem Exploration: Messaging Integration (WhatsApp/Telegram)

## Executive Summary
The AI Signals app suffers from a "retention friction" gap: users value the personalized strategic signals but often fail to return to the web dashboard daily among their busy workflows. While the core engine generates high-quality relevance, the delivery mechanism (pull-based web access) conflicts with the executive persona's habit of consuming mission-critical information in low-friction, high-attention threads (WhatsApp/Telegram). This exploration analyzes whether external messaging is the vital bridge for habit formation or a premature complexity that risks unit economics.

## Root Cause Analysis
1.  **High-Activation Energy (Pull vs. Push):** Entering a web URL, waiting for a dashboard to load, and scanning for updates requires a deliberate choice. Messaging apps are already "open" and push notifications provide passive consumption.
2.  **Context Switching Penalty:** Professionals live in communication tools. Moving from a WhatsApp client meeting to a dashboard is a psychological and technical context switch that many users skip.
3.  **Signal Silo-ing:** High-value signals generated for a specific user are currently "stuck" in their individual UI. The inability to naturally forward or share these signals into a team chat limits the product's viral potential and perceived utility.
4.  **Desktop Bias in a Mobile World:** Strategic signals often arrive during "stolen moments" (commutes, between meetings). Mobile web dashboards, while responsive, lack the native "feel" and immediate accessibility of a chat message.

## Impact Assessment
*   **User Retention (High):** Users who don't visit the site for 3 days are high-risk for churn. Messaging ensures the product is "seen" even if the dashboard isn't visited.
*   **Viral Growth (Medium):** Messaging integration enables the "Forward to Colleague" behavior, which is a primary growth engine for professional tools.
*   **Perceived Premium Value (High):** Premium users (Strategists, Leaders) associate "concierge delivery" with high-end services, justifying higher subscription tiers.

## Constraints & Context
*   **Technical Complexity:** WhatsApp Business API (via Twilio) involves vetting, verification, and recurring costs. Telegram is free but has a smaller (though tech-focused) footprint.
*   **Unit Economics:** Messaging costs must be balanced against LLM generation costs. A monthly subscription must cover the "per-message" cost of WhatsApp.
*   **MVP Constraint:** The product follows a "minimal useful scope" principle. Building full multi-platform messaging might be a "shiny object" that distracts from core algorithm refinement.
*   **Privacy & Mapping:** Securely linking a phone number or Telegram ID to a Supabase user without a clunky onboarding flow.

## Strategic Hypotheses
1.  **The Friction Hypothesis:** Professional churn is driven primarily by the "entry cost" of the web dashboard. Eliminating this cost via messaging will increase 7-day retention by >40%.
2.  **The Delivery Tier Hypothesis:** Users are willing to pay a >50% premium for the *delivery method* alone, regardless of the content quality.
3.  **The Telegram Wedge Hypothesis:** Starting with Telegram (free, technical audience) provides a high-leverage data point on "push" demand without the overhead of WhatsApp Business verification.

## Knowledge Gaps
1.  **Persona Preference:** Which platform (WhatsApp vs. Telegram vs. Email) is the *actual* primary habitat of our Ideal Customer Profile (ICP)?
2.  **Twilio Verification Lead Time:** How long does it actually take to get a WhatsApp Business sender approved for this specific use case (news/summary)?
3.  **Forwarding Frequency:** How often do users currently try to "copy-paste" signals to other apps? (Requires event tracking data).

## Save Artifact
docs/explore-problem/messaging-integration.md
