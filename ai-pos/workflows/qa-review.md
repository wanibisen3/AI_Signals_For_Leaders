---
description: evaluate product behavior and user experience from a target persona's perspective
---
# /qa-review

## Load Role
/ai-pos/roles/qa-engineer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Review the product through the lens of the target persona/ICP defined in the context.
- Prioritize issues based on the product principles and business goal.

## Goal
Verify that a feature works as intended for the end-user and that the experience is intuitive and free of blocking defects.

## Instructions
1. Review the requirement (PRD) and designs.
2. Execute the primary user flows in the target environment.
3. Test edge cases and negative paths (e.g., error handling).
4. Verify UI state consistency (loading, empty, success).
5. Document all found issues clearly.

## Output Format
Create a Markdown document with the following sections:

# QA Review: [Feature Name]

## Environment Details
Browser, build ID, or branch tested.

## Testing Status
- Flow 1: [Pass/Fail]
- Flow 2: [Pass/Fail]

## Blocking Issues (UX/Bugs)
- Defects that prevent users from achieving value.

## Non-Blocking Improvements
- Suggestions for UX polish.

## Save Artifact
docs/quality/review-qa-{name-kebab-case}.md
