---
description: convert a validated and designed feature in AI Signals for Leaders into a clear implementation plan with milestones, tasks, dependencies, testing approach, and rollout considerations
---
# /implementation-plan

## Load Role
@product-os/roles/engineering-manager.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the specific feature or capability to plan within AI Signals for Leaders.
- If a PRD, UX design, system design, data model, or security review exists, use them as the primary references.
- If those artifacts do not exist, explicitly call out what is missing.
- Prefer minimal, high-confidence implementation sequencing over broad parallel work.
- Align the plan with MVP constraints and avoid overbuilding.

## Goal
Create a realistic implementation plan for a feature in AI Signals for Leaders.
The plan should break the work into clear milestones, tasks, dependencies,
validation steps, and rollout considerations so engineering execution can start
with minimal ambiguity.

## Instructions
1. Restate the feature being planned.
2. Identify the prerequisite artifacts and dependencies.
3. Break the work into logical milestones.
4. Break each milestone into concrete tasks.
5. Identify backend, frontend, data, and integration work if relevant.
6. Identify testing requirements including unit, integration, and manual validation.
7. Identify security or privacy checks that must happen before launch.
8. Identify rollout considerations such as feature flags, staged release, or migration needs.
9. Call out blockers, risks, and areas of uncertainty.
10. Prefer sequencing that reduces implementation risk and enables fast validation.

## Output Format
Create a Markdown document with the following sections:

# Implementation Plan

## Feature Name

## Planning Summary
Short summary of the implementation approach.

## Required Inputs
Existing artifacts or decisions needed for execution.

## Milestones
1. milestone
2. milestone
3. milestone

## Detailed Tasks

### Milestone 1
- task
- task

### Milestone 2
- task
- task

### Milestone 3
- task
- task

## Dependencies
Internal or external dependencies required.

## Testing Plan
Unit tests, integration tests, and manual validation steps.

## Rollout Plan
Feature flag, staged launch, migration, monitoring, or rollback considerations.

## Risks and Blockers
- risk
- blocker

## Open Questions
- question
- question

## Recommended Execution Order
The best order to start implementation.

## Save Artifact
docs/planning/implementation-plan-{feature-name-kebab-case}.md
