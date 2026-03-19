---
description: create a realistic implementation plan for a feature or capability
---
# /implementation-plan

## Load Role
/ai-pos/roles/engineering-manager.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the shared project context for technical background, constraints, and success criteria.
- Align the implementation sequencing with the product principles (e.g., MVP focus).
- If designs or schemas exist, ensure the plan strictly follows them.

## Goal
Turn product and architecture decisions into a realistic implementation plan that breaks work into clear milestones, tasks, dependencies, and validation steps.

## Instructions
1. Review the PRD and System Design for functional and technical requirements.
2. Break the work into logical milestones (Milestone 1, 2, etc.).
3. Detail concrete tasks for each milestone.
4. Identify backend, frontend, data, and integration work.
5. Define the testing plan (Unit, Integration, Manual).
6. Identify security and privacy checks required.
7. Outline rollout considerations (Feature flags, migrations, monitoring).
8. Call out dependencies and potential blockers.
9. Recommend an optimal execution order to reduce risk.

## Output Format
Create a Markdown document with the following sections:

# Implementation Plan: [Feature Name]

## Planning Summary
Overview of the implementation strategy.

## Milestones
1. [Milestone Name]: [Goal]

## Detailed Tasks
- Milestone 1: [Tasks]
- Milestone 2: [Tasks]

## Dependencies & Risks
- Internal or external dependencies.
- Critical risks to delivery.

## Testing & Validation
- Automated and manual verification steps.

## Rollout Plan
- Deployment strategy and monitoring.

## Recommended Execution Order
Strategy for sequencing work.

## Save Artifact
docs/planning/implementation-plan-{feature-name-kebab-case}.md
