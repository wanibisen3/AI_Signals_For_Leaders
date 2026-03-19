---
description: design the user experience and interaction flows for a feature
---
# /design-ux

## Load Role
/ai-pos/roles/product-designer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the project context to understand the brand personality, user context, and product principles.
- Ensure the design minimizes cognitive load according to the core principles.

## Goal
Design the user experience and interaction flows for a feature to ensure product behavior is clearly defined and intuitive before development starts.

## Instructions
1. Review the PRD for internal logic and user stories.
2. Design the primary user flow (happy path).
3. Identify and design critical edge cases and error states.
4. Ensure interaction patterns are consistent with the existing product.
5. Define the "state changes" (what happens when a user clicks/interacts).
6. Validate that the design satisfies the "What Good Looks Like" definition.

## Output Format
Create a Markdown document with the following sections:

# UX Design: [Feature Name]

## User Flow
Step-by-step interaction sequence.

## Critical States
- Loading state
- Empty state
- Error conditions
- Success feedback

## Interaction Logic
Explanation of how the system responds to specific user actions.

## Consistency Check
How this design follows the product's established patterns.

## Save Artifact
docs/ux/design-{feature-name-kebab-case}.md
