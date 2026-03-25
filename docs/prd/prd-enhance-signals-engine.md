# Product Requirement Document

## Feature Name
Enhanced Signals Engine: Expanded Sources & Intelligent Relevance

## Problem
The current signals engine is limited to a small set of AI sources and often fails to surface the most relevant news for leaders. Users report that "relevant news is still not shown properly," likely due to simplistic keyword matching and missing critical updates from emerging AI leaders (Groq, Mistral, Perplexity, etc.).

## Target User
Decision-makers (Managers, Founders, Strategy Professionals) who need to filter the AI noise and find actionable signals for their business context.

## User Context
The user checks their dashboard to understand how recent AI breakthroughs affect their specific role or industry. They are frustrated by generic news and want to see high-impact, trustworthy updates first.

## User Stories
- As a **Leader**, I want to receive updates from a broader range of primary AI sources (like Groq and Mistral) so I don't miss platform shifts.
- As a **Leader**, I want the signals to be ranked by business impact and strategic relevance, not just keyword frequency.
- As a **Leader**, I want to see "why" a signal is relevant to my specific role or concern.

## Core Functionality
1. **Expanded Source Library**: Add Tier A and Tier B RSS feeds for emerging AI infrastructure and tool providers.
2. **Impact-Based Ranking**: Refine the scoring algorithm to prioritize "Business Impact" (pricing, partnerships, enterprise features) over general updates.
3. **Strategic Relevance Scoring**: Improve the `leaderFit` logic to better match user interests with signal contents using a more nuanced taxonomy.
4. **Noise Reduction**: Implement stricter penalties for "noisy" or "hype-based" content that lacks substance for professionals.

## User Journey
1. User logs in to AI Signals for Leaders.
2. The background engine fetches news from an expanded list of 30+ sources (up from ~15).
3. The processing engine identifies high-impact clusters (e.g., "Mistral Large 2 Release").
4. The relevance engine calculates a "Leader Score" based on the user's role (e.g., Product Leader) and focus areas (e.g., Cost Efficiency).
5. The user sees a prioritized list where the top items are both high-trust and high-relevance.

## Scope
- Update `server/constants.js` with 10+ new high-quality AI sources.
- Refine `server/services/process.js` scoring logic (weights for trust, impact, and fit).
- Expand keyword lexicons for Roles and Decision Areas.
- Improve deduplication to handle similar news across 30+ sources.

## Non-Goals
- Real-time streaming (scheduled batching is sufficient).
- LLM-based summarization for every raw item (too expensive; focus on cluster-level).
- Social media sourcing (stick to RSS/Blogs for higher signal-to-noise).

## Success Metrics
- **Relevance Rating**: Increase in user-reported relevance of top 5 signals.
- **Source Coverage**: 95% of major AI model/infrastructure announcements captured within 4 hours.
- **Quality**: Reduction in "low relevance" items appearing in the top of the dashboard.

## Dependencies
- Reliable RSS feeds for new sources.
- `rss-parser` stability with increased source count.
- Consistent user personalization metadata.

## Risks
- **Inference Cost**: More sources might lead to more clusters to process (offset by stricter filtering).
- **Keyword Overlap**: Expanding keywords might increase "false positives" if not tuned carefully.
- **Source Fragility**: RSS feeds can break or change format.

## Open Questions
- Should we include arXiv for technical leaders, or keep it strictly business-focused?
- How do we handle "paywalled" sources (e.g., The Information) where RSS snippets are minimal?

## Save Artifact
docs/prd/prd-enhance-signals-engine.md
