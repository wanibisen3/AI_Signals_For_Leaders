---
description: convert an implementation plan for AI Signals for Leaders into clear, structured development issues that can be executed by engineers and tracked in Linear
---
# /create-issues

## Load Role
@product-os/roles/engineering-manager.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the feature whose implementation plan must be converted into issues.
- If an implementation plan exists, use it as the primary reference.
- If the implementation plan is missing, explicitly warn and request it.
- Prefer small, well-scoped issues that can be completed independently.

## Goal
Convert a feature implementation plan into structured development issues that are clear,
actionable, and ready to be tracked in an issue tracker such as Linear.

Each issue should represent a meaningful piece of work that can be assigned to an engineer.

## Instructions
1. Restate the feature being implemented.
2. Identify the milestones defined in the implementation plan.
3. Convert each milestone into logical issues.
4. Break issues down so they represent small, achievable units of work.
5. Clearly define acceptance criteria for each issue.
6. Identify dependencies between issues.
7. Identify backend, frontend, data, and integration work separately if relevant.
8. Identify testing tasks where appropriate.
9. Avoid overly large issues.

## Output Format
Create a Markdown document with the following sections:

# Development Issues

## Feature Name

## Parent Issue
High-level issue describing the feature.

Title:
Description:
Acceptance Criteria:

## Child Issues

### Issue 1
Title:
Description:
Acceptance Criteria:
Dependencies:

### Issue 2
Title:
Description:
Acceptance Criteria:
Dependencies:

### Issue 3
Title:
Description:
Acceptance Criteria:
Dependencies:

## Suggested Execution Order
The recommended order in which issues should be completed.

## Save Artifact
docs/planning/issues-{feature-name-kebab-case}.md
