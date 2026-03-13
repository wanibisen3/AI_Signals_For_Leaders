# QA Review

## Review Summary
QA review of the Dashboard feature, encompassing the `DashboardView` UI in `App.tsx`, the empty state experiences, token balance display, the briefs list, and the related error/loading flows.

## Verdict
- Pass with fixes

## Blocking Issues
1. **Misleading Error State on Load Failure**: If fetching briefs fails (`loadDashboard` throws an exception), the application displays a generic error banner at the top (`statusMessage`), but the `DashboardView` renders its empty state ("No briefs yet... Set personalization and generate your first brief batch"). This falsely implies the user has no data, rather than informing them of a network/system failure.

## Improvements
1. **Disabled/Warn State for 0 Tokens**: If `tokenBalance` is 0, the user should be warned *before* they open the Personalization modal and attempt to generate briefs. Currently, they go through the whole flow just to get a `statusOutOfTokens` error message afterwards.
2. **Direct Brief Generation**: The primary way to get new briefs from the dashboard is clicking "Refresh Signals", which forces the user to reopen the `PersonalizationModal`. If a user is already personalized, they should be able to trigger generation directly with one click.
3. **Date Formatting**: Brief cards render `{brief.date}` directly. If the backend serves an ISO 8601 string, this will appear unformatted and unnatural to the executive user.

## User Flow Risks
- **Dead End on Token Purchase**: The `BuyTokensModal` is currently a placeholder ("Coming Soon"). If users run out of tokens, they reach a hard dead end with no workaround.
- **Double Error Display**: If a user runs out of tokens during generation, they receive an error banner, but the empty dashboard state *also* renders below it if they have no previous briefs.

## Missing States
- **Dedicated Error State for Dashboard**: The dashboard lacks a dedicated `error` prop and associated UI state when data fails to load entirely.

## Validation Gaps
- **Client-Side Token Validation**: The client relies solely on the backend `requiresTopUp` flag to detect a 0 balance post-submission, rather than validating `tokenBalance > 0` before enabling the generation checkbox.

## Recommended Fixes
1. Introduce an explicitly handled error state in `DashboardView` so that a network failure does not masquerade as an empty "No briefs yet" state.
2. Add a client-side check `disabled={tokenBalance === 0}` on the generation triggers to block the user from wasting time when they have no balance.
3. Apply standard `Intl.DateTimeFormat` or localized date parsing to `brief.date` in the list items.
