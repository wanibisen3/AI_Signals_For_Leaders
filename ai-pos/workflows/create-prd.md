---
description: create a structured product requirement document (PRD) for a validated feature or direction
---
# /create-prd

## Load Role
/ai-pos/roles/product-manager.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the project context for principles, constraints, and target user definitions.
- Treat the user's prompt as the feature or capability to specify.
- Align requirements with the "What Good Looks Like" definition in the context.
- Adhere to the "MVP mindset" or specific constraints defined by the project.

## Goal
Create a clear, structured Product Requirement Document (PRD) that defines a feature's problem, users, scope, and success criteria for downstream development.

## Instructions
1. State the feature name and purpose clearly.
2. Identify the specific user problem being solved.
3. Define the target user persona (reference ICP if available).
4. Describe the user journey step-by-step.
5. Define the core functionality (minimal viable scope).
6. Detail what is in scope and what is intentionally excluded (Non-Goals).
7. Define success metrics based on the product's strategic goals.
8. Identify technical or business dependencies.
9. Identify risks and open questions.

## Output Format
Create a Markdown document with the following sections:

# Product Requirement Document: [Feature Name]

## Problem
What specific user problem this feature solves.

## Target User & Context
Who uses this and where/when it is experienced.

## User Stories
- As a {user} I want {capability} so that {outcome}

## Core Functionality
The minimal useful requirement.

## User Journey
Step-by-step flow of interaction.

## Scope & Non-Goals
- Included: [list]
- Excluded: [list]

## Success Metrics
How success is measured for this feature.

## Dependencies & Risks
- Systems or data required.
- Potential risks to adoption or implementation.

## Open Questions
- Unknowns requiring clarification.

## Save Artifact
docs/prd/prd-{feature-name-kebab-case}.md
