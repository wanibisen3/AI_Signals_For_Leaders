---
description: define a specific ideal customer profile (ICP) to focus product development and marketing efforts
---
# /define-icp

## Load Role
/ai-pos/roles/product-strategist.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the project context to understand the broad target user segments.
- Align the ICP with the product's core value proposition and problem space.

## Goal
Define a specific, actionable Ideal Customer Profile to ensure the product solves for a narrow, high-value user segment rather than a generic audience.

## Instructions
1. Identify the specific sub-segment of the target users who feel the core problem most acutely.
2. Define the persona's role, responsibilities, and key challenges.
3. Identify the persona's "habitat" (where they live, work, and consume information).
4. Describe the "Trigger Event" that makes them need the product.
5. Define the "Success State" they achieve using the product.
6. List specific criteria for what makes someone a *bad* fit for this profile.

## Output Format
Create a Markdown document with the following sections:

# Ideal Customer Profile: [Persona Name]

## Persona Overview
Demographics, role, and industry context.

## Core Pain Points
The specific problems this persona needs to solve.

## Jobs-to-be-Done (JTBD)
What the user is actually trying to accomplish.

## Product Fit
How the core value proposition matches this persona.

## Triggers & Motivation
Why they look for a solution *now*.

## Success Metrics (User-side)
How the user knows they have achieved value.

## Exclusions
Who is NOT a fit for this ICP and why.

## Save Artifact
docs/discovery/icp-{persona-name-kebab-case}.md
