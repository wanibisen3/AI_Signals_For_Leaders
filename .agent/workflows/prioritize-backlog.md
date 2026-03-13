---
description: evaluate and rank features or development issues for AI Signals for Leaders based on impact, effort, user value, and strategic alignment
---
# /prioritize-backlog

## Load Role
@product-os/roles/product-manager.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as a list of features, issues, or initiatives to prioritize.
- If implementation plans or issues exist, use them as the primary references.
- Align prioritization with the product principles and business goals in the project context.
- Prefer decisions that improve user value and product retention.

## Goal
Evaluate and prioritize product work so the team focuses on the most valuable tasks first.

The prioritization should consider user value, strategic importance, development effort,
and potential impact on engagement or monetization.

## Instructions
1. List the items that need prioritization.
2. Evaluate each item based on user value.
3. Evaluate the strategic fit with AI Signals for Leaders.
4. Estimate relative implementation effort.
5. Identify dependencies between items.
6. Identify quick wins that deliver value quickly.
7. Identify large investments that may require phased delivery.
8. Rank the items in a recommended execution order.

## Output Format
Create a Markdown document with the following sections:

# Backlog Prioritization

## Items Evaluated

### Item 1
Description:
User Value:
Strategic Fit:
Implementation Effort: Low / Medium / High
Dependencies:

### Item 2
Description:
User Value:
Strategic Fit:
Implementation Effort: Low / Medium / High
Dependencies:

### Item 3
Description:
User Value:
Strategic Fit:
Implementation Effort: Low / Medium / High
Dependencies:

## Priority Ranking

1. Highest priority item
2. Next item
3. Lower priority item

## Quick Wins
Items that can deliver value quickly.

## Strategic Investments
Larger items that may require phased development.

## Recommended Execution Order
Final recommended order for development.

## Save Artifact
docs/planning/backlog-priority-{topic-kebab-case}.md
