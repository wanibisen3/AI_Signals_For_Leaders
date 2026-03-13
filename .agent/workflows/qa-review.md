---
description: review a feature or change in AI Signals for Leaders from a product behavior and user experience perspective to identify broken flows, missing states, validation gaps, and edge cases before release
---

# /qa-review

## Load Role
@product-os/roles/qa-engineer.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the feature or change that needs QA validation.
- If a PRD or UX design exists, use it as the expected behavior reference.
- Focus on product behavior and UX correctness, not code style.

## Goal
Perform a QA review of the feature or change in AI Signals for Leaders
to ensure the user experience works correctly and edge cases are handled.

## Instructions
1. Restate the feature or flow being reviewed.
2. Identify the entry point for the user.
3. Walk through the expected user journey step by step.
4. Identify broken flows or unexpected behavior.
5. Identify missing UI states such as loading, empty, or error states.
6. Identify validation issues or incorrect user feedback.
7. Identify edge cases such as missing data, repeated actions, or stale state.
8. Classify findings as blocking issues or improvements.

## Output Format
Create a Markdown document with the following sections:

# QA Review

## Review Summary
What feature or change was reviewed.

## Verdict
- Pass
- Pass with fixes
- Block

## Blocking Issues
Issues that must be fixed before release.

## Improvements
Non-blocking UX or behavior improvements.

## User Flow Risks
Steps where users may get stuck or confused.

## Missing States
Loading, empty, or error states not handled correctly.

## Validation Gaps
Missing input validation or unclear error messages.

## Recommended Fixes
Actions required before shipping.

## Save Artifact
docs/quality/qa-review-{feature-name}.md
