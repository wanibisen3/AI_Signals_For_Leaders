---
description: rigorously evaluate whether a product idea, feature, or direction is worth pursuing based on user pain and strategic fit
---
# /validate-idea

## Load Role
/ai-pos/roles/product-strategist.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the shared project context as the primary source for product background and principles.
- Treat the user's prompt as a specific idea or direction to evaluate.
- If the idea conflicts with the project context (e.g., constraints or principles), explicitly call out the conflict.
- Do not assume an idea is good just because it sounds interesting or technologically advanced.

## Goal
Evaluate whether a proposed idea is worth pursuing. Help decide whether the idea should be shipped, explored further, narrowed, delayed, or rejected based on real user value and strategic fit.

## Instructions
1. Restate the idea clearly.
2. Identify the specific user problem the idea addresses.
3. Assess whether the problem is real, frequent, and painful enough for the target users.
4. Evaluate strategic fit with the product direction and principles.
5. Assess differentiation versus existing solutions or competitors (see project context).
6. Evaluate value for retention, engagement, or monetization.
7. Assess build complexity relative to likely value.
8. Identify major risks, assumptions, and open questions.
9. Recommend whether the idea should be narrowed or simplified.

## Output Format
Create a Markdown document with the following sections:

# Idea Validation: [Idea Name]

## Idea Summary
A clear restatement of the idea.

## User Problem
What user problem this idea is trying to solve.

## Strategic Fit
How well this idea fits the current product direction.

## User Value
Why this would matter to the target user.

## Differentiation
Whether this creates meaningful product differentiation.

## Monetization Potential
Whether this idea could support conversion or retention.

## Build Complexity
Low / Medium / High, with explanation.

## Risks & Assumptions
- Critical risks to implementation or adoption.
- Underlying assumptions that need testing.

## Open Questions
- Unknowns that require clarification.

## Recommendation
Choose one: Build now | Worth exploring | Narrow the scope | Delay | Reject

## Reason for Recommendation
Brief explanation of the decision.

## Save Artifact
docs/discovery/idea-validation-{idea-name-kebab-case}.md
