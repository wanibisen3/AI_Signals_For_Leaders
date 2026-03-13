---
description: define the ideal customer profile for AI Signals for Leaders so the product targets a specific user segment instead of a broad generic audience
---
# /define-icp

## Load Role
@product-os/roles/product-strategist.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the specific product direction, user segment, or decision to analyze within that product.
- If the request conflicts with the project context, explicitly call out the conflict.
- Do not assume the user request is correct; analyze critically.
- Always ground analysis in the AI Signals for Leaders product unless explicitly told otherwise.

## Goal
Define the Ideal Customer Profile for the product or feature being considered.
The command should identify the specific user segment most likely to experience the problem,
benefit from the product, and eventually pay for it.
Avoid broad generic audiences.

## Instructions
1. Identify the most relevant user segment for this problem.
2. Define the buyer persona, meaning who decides to pay.
3. Define the user persona, meaning who actually uses the product.
4. Identify the company type and company size where this problem is strongest.
5. Identify the industry segments where this problem is strongest.
6. Identify the triggers that would cause this user to actively look for a solution.
7. Identify willingness-to-pay signals or budget signals.
8. Identify adoption barriers that may slow adoption.
9. Identify why this ICP is better than other possible segments.
10. Be specific and avoid vague labels like professionals or business users.

## Output Format
Create a Markdown document with the following sections:

# Ideal Customer Profile

## Primary User Persona
Who uses the product.

## Buyer Persona
Who pays for or approves the purchase.

## Company Type
Startup / Scale-up / Enterprise / Independent professional

## Company Size
Typical employee size range.

## Industry Segments
Industries where the problem is strongest.

## Job Titles
Common roles likely to use the product.

## Problem Intensity
Why this ICP feels the problem strongly.

## Triggers
Events that make the user actively search for a solution.

## Willingness to Pay Signals
Indicators that this segment may pay.

## Adoption Barriers
What might prevent adoption.

## Why This ICP Is the Best Initial Target
Explain why this segment is better than alternatives.

## Alternative ICPs Worth Exploring
Other segments that might also benefit.

## Save Artifact
docs/discovery/icp-{segment-name}.md
