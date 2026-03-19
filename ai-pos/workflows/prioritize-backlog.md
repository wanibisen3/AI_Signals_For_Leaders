---
description: evaluate and rank features or development issues based on impact, effort, and strategic alignment
---
# /prioritize-backlog

## Load Role
/ai-pos/roles/product-manager.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the business goals and product principles defined in the context to weight importance.
- Consider constraints (budget/time) when evaluating feasibility.

## Goal
Rank a list of product features or technical issues to ensure the team is always working on the highest-value items first.

## Instructions
1. Review the current backlog or candidate features.
2. Assess each item for user impact (Problem Severity).
3. Assess technical effort (Complexity).
4. Evaluate alignment with the current product direction.
5. Calculate a priority score or rank (High/Medium/Low).
6. Provide a clear rationale for the ranking.

## Output Format
Create a Markdown document with the following sections:

# Backlog Prioritization: [Release/Sprint Name]

## Prioritized List
- [Rank 1]: [Item Name] ([Impact]/[Effort])
- [Rank 2]: [Item Name] ([Impact]/[Effort])

## Rationale
- Explanation of why top items were selected over others.

## Trade-offs
- What was postponed and why.

## Save Artifact
docs/planning/prioritization-{name-kebab-case}.md
