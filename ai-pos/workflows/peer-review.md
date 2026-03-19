---
description: review code changes to detect problems, risks, and maintainability issues before merging
---
# /peer-review

## Load Role
/ai-pos/roles/senior-engineer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Review against the "What Good Looks Like" definition and technical constraints.
- Ensure implementations do not violate user privacy or data security principles.

## Goal
Analyze code changes to identify bugs, security risks, architectural drift, or maintainability problems. Provide actionable feedback to the developers.

## Instructions
1. Review the PRD/Issue to understand the intent of the change.
2. Examine the code diff for correctness and logical flaws.
3. Identify security or privacy risks.
4. Assess test coverage and quality.
5. Identify technical debt or "hacky" solutions.
6. Provide specific recommendations for improvement.

## Output Format
Create a Markdown document with the following sections:

# Peer Review: [Feature/Module Name]

## Summary of Changes
Brief description of what is being reviewed.

## Critical Issues (Blocking)
- Serious bugs or security risks.

## Maintainability & Style
- Suggestions for cleaner or more efficient code.

## Test Coverage Review
- Feedback on the provided automated tests.

## Verdict
- Approved | Changes Requested | Rejected

## Save Artifact
docs/quality/review-code-{name-kebab-case}.md
