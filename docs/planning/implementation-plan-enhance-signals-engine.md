# Implementation Plan

## Feature Name
Enhanced Signals Engine: Expanded Sources & Intelligent Relevance

## Planning Summary
This plan focuses on increasing the "signal" density of the AI Signals for Leaders engine. We will achieve this by doubling our trusted RSS sources and shifting the relevance scoring from simple keyword matching to a more "strategic importance" weighted model. This ensures leaders see breakthroughs in infrastructure, pricing, and platform shifts rather than general news.

## Required Inputs
- [Project Context](file:///Users/wanibisen/Documents/AI_Projects/AI_Signals_For_Leaders/product-os/context/project-context.md)
- [PRD: Enhanced Signals Engine](file:///Users/wanibisen/Documents/AI_Projects/AI_Signals_For_Leaders/docs/prd/prd-enhance-signals-engine.md)

## Milestones
1. **Source & Taxonomy Expansion**: Update source lists and keyword lexicons.
2. **Scoring Logic Enhancement**: Refine the processing pipeline for business impact.
3. **Verification & Quality Tuning**: Validate against new test cases and manual data.

## Detailed Tasks

### Milestone 1: Source & Taxonomy Expansion
- [ ] **Task 1.1: Add New RSS Sources**: Update `server/constants.js` with validated Tier A/B sources (Groq, Mistral, Cohere, Perplexity, LangChain, etc.).
- [ ] **Task 1.2: Refine Role Keywords**: Add strategic terms like "ROI", "unit economics", "platform shift", and "compliance" to `ROLE_KEYWORDS`.
- [ ] **Task 1.3: Update Decision Area Keywords**: Expand `DECISION_AREA_KEYWORDS` to better capture "Competitive Advantage" and "System Design" shifts.

### Milestone 2: Scoring Logic Enhancement
- [ ] **Task 2.1: Enhance Impact Scoring**: Update `computeImpact` in `server/services/process.js` to give higher weights to "Pricing", "Partnerships", and "Enterprise Features".
- [ ] **Task 2.2: Implement Strategic Fit**: Add a `STRATEGIC_KEYWORDS` filter or weight (e.g., "Agentic", "Multimodal", "Inference costs") that boosts relevance for all leaders.
- [ ] **Task 2.3: Optimize Noise Penalty**: Improve `computeNoisePenalty` to catch modern AI clickbait patterns (e.g., "AI is over", "Everyone is using X").

### Milestone 3: Verification & Quality Tuning
- [ ] **Task 3.1: Unit Test Expansion**: Add 3-5 new test cases to `tests/ranking-refresh.test.ts` representing "Strategic Wins" for different user personas.
- [ ] **Task 3.2: Pipeline Validation**: Run the full ingestion/clustering pipeline manually and verify that the 30+ sources are handled correctly without performance degradation.

## Dependencies
- **RSS Availability**: Current dependency on active RSS feeds for third-party blogs.
- **`rss-parser`**: Backend relies on this for normalization.

## Testing Plan
- **Unit Tests**: `vitest run tests/ranking-refresh.test.ts`. Focus on ensuring high-impact clusters outrank low-impact ones even with similar keywords.
- **Integration**: Verify that `server/index.js` correctly propagates the new ranking scores to the frontend.
- **Manual**: Use the `bypassCache` flag on `/api/signals` to see fresh, expanded results.

## Rollout Plan
- **Pre-Rollout**: Run a full fetch in dev to detect broken RSS links among new sources.
- **Launch**: Deploy to production; the cron job will automatically pick up new sources and re-rank the cached signals.
- **Monitoring**: Check server logs for failed RSS fetches and adjust source trust scores if necessary.

## Risks and Blockers
- **Risk**: Increased source count might lead to cluster "hallucination" if deduplication threshold is too low.
- **Risk**: Stale data from new sources that don't update frequently (mitigated by existing freshness decay).

## Open Questions
- Should we prioritize "Emerging Research" (arXiv) for leaders with a "Product" focus?
- How frequently should we audit the source list for reliability?

## Recommended Execution Order
1. **Source Expansion (M1)**: Get the data flowing first.
2. **Test Generation (M3)**: Define what "good" looks like in code before changing weights.
3. **Logic Tuning (M2)**: Adjust weights until tests pass.
