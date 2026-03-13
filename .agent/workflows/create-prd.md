---
description: create a structured product requirement document for a validated feature or product direction in AI Signals for Leaders
---
# /create-prd

## Load Role
@product-os/roles/product-manager.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the specific feature or capability to design within AI Signals for Leaders.
- If the request conflicts with the project context, explicitly call out the conflict.
- Always align the PRD with the product principles defined in the project context.
- Avoid overbuilding and prefer minimal useful scope.

## Goal
Create a clear and structured Product Requirement Document for a feature or capability
in AI Signals for Leaders.

The PRD should define the problem, users, scope, and success criteria clearly enough
that downstream commands such as system-design and implementation-plan can use it.

## Instructions
1. Restate the feature or capability clearly.
2. Identify the user problem being solved.
3. Identify the user persona and context where the feature is used.
4. Describe the user journey for the feature.
5. Define the core functionality.
6. Define scope and non-goals to prevent overbuilding.
7. Define success metrics for the feature.
8. Identify dependencies.
9. Identify risks and unknowns.
10. Prefer minimal viable functionality rather than complex feature sets.

## Output Format
Create a Markdown document with the following sections:

# Product Requirement Document

## Feature Name

## Problem
What problem this feature solves.

## Target User
The user persona that benefits from this feature.

## User Context
When and where the user experiences this problem.

## User Stories
- As a {user} I want {capability} so that {outcome}

## Core Functionality
The minimal functionality required.

## User Journey
Step-by-step flow of how the user interacts with this feature.

## Scope
What is included in the feature.

## Non-Goals
What is intentionally excluded.

## Success Metrics
How success will be measured.

## Dependencies
Systems or capabilities required.

## Risks
Potential product or technical risks.

## Open Questions
Unknowns that require clarification.

## Save Artifact
docs/prd/prd-{feature-name-kebab-case}.md
