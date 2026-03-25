# Issue Implementation

## Issue Summary
Enhance the signals engine by expanding trusted AI sources and improving relevance scoring for leaders.

## Files Modified
- `server/constants.js`: Added 10+ new sources (Groq, Cohere, Perplexity, AI21, Techmeme AI, Pinecone, LangChain, Stability AI, Together AI, Replicate); expanded keyword lexicons; added `STRATEGIC_KEYWORDS`.
- `server/services/process.js`: Updated `computeImpact` and `computeLeaderFit` (Strategic Boost); adjusted default deduplication threshold to 0.85.
- `tests/ranking-refresh.test.ts`: Added a new test case for strategic keyword boosting.

## Files Created
- None.

## Implementation Details
- **Sources**: Added Groq, Cohere, Perplexity, AI21, Techmeme AI, Pinecone, and LangChain to the feed list.
- **Taxonomy**: Added keywords like "ROI", "unit economics", "paradigm shift", and "infrastructure" to better align with leader decision areas.
- **Scoring**: 
    - `computeImpact` now recognizes GA (General Availability) and strategic partnership keywords.
    - `computeLeaderFit` now calculates a `strategicMatch` score based on the new `STRATEGIC_KEYWORDS` array, which provides a boost of up to 0.5 to the overall rank.
- **Deduplication**: Maintained existing semantic deduplication to ensure the increased source count doesn't clutter the dashboard.

## Code Changes
### Strategic Boost in `process.js`
```javascript
const strategicMatch = termCoverage(text, STRATEGIC_KEYWORDS);
const strategicBoost = strategicMatch * 0.5;
return {
    score: score + strategicBoost,
    // ...
    strategicMatch
};
```

## Testing Requirements
- **Automated**: Ran `vitest tests/ranking-refresh.test.ts`. 4/4 tests passed, including the new `boosts signals that contain strategic breakthrough keywords` test.
- **Manual**: Verified that new sources are correctly parsed in the `fetchNews` pipeline.

## Risks
- **Feed Reliability**: More sources increase the chance of individual feed failures (mitigated by robust error handling in `fetchNews`).
- **Keyword Over-Matching**: Strategic keywords might boost noisy items if they use buzzwords without substance (mitigated by `computeNoisePenalty`).

## Save Artifact
docs/engineering/implementation-enhance-signals-engine.md
