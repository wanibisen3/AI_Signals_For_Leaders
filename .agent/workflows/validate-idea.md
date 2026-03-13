---
description: rigorously evaluate whether a product idea, feature, or direction for AI Signals for Leaders is worth pursuing based on user pain, strategic fit, differentiation, monetization potential, and execution complexity
---
# /validate-idea

## Load Role
@product-os/roles/product-strategist.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the specific idea, feature, or product direction to evaluate within that product.
- If the request conflicts with the project context, explicitly call out the conflict.
- Do not assume the idea is good just because it sounds interesting.
- Always ground analysis in the AI Signals for Leaders product unless explicitly told otherwise.

## Goal
Evaluate whether the proposed idea is worth pursuing for AI Signals for Leaders.
The command should help decide whether the idea should be shipped, explored further, narrowed, delayed, or rejected.
It must be critical, commercially aware, and focused on real user value rather than novelty.

## Instructions
1. Restate the idea clearly.
2. Identify the user problem the idea is trying to solve.
3. Assess whether the problem is real, frequent, and painful enough.
4. Evaluate whether the idea fits the product direction and principles in the project context.
5. Assess differentiation versus generic AI news or summarization products.
6. Evaluate whether the idea improves relevance, retention, engagement, or monetization.
7. Assess willingness-to-pay signals for this idea or feature.
8. Evaluate build complexity relative to likely value.
9. Identify major risks, assumptions, and open questions.
10. Identify whether the idea should be narrowed before building.
11. Be direct if the idea is weak, distracting, or premature.

## Output Format
Create a Markdown document with the following sections:

# Idea Validation

## Idea Summary
A clear restatement of the idea.

## User Problem
What user problem this idea is trying to solve.

## Strategic Fit
How well this idea fits AI Signals for Leaders.

## User Value
Why this would matter to the target user.

## Differentiation
Whether this creates meaningful product differentiation.

## Monetization Potential
Whether this idea could support conversion, retention, or willingness to pay.

## Build Complexity
Low / Medium / High, with explanation.

## Risks
- risk
- risk

## Assumptions
- assumption
- assumption

## Open Questions
- question
- question

## Recommendation
Choose one:
- Build now
- Worth exploring
- Narrow the scope
- Delay
- Reject

## Reason for Recommendation
Brief explanation of the decision.

## Save Artifact
docs/discovery/idea-validation-{idea-name-kebab-case}.md
