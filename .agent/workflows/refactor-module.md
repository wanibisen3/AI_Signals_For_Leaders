---
description: refactor an existing module in AI Signals for Leaders by delegating repository analysis and code changes to Codex while preserving behavior and improving maintainability
---
# /refactor-module

## Load Role
@product-os/roles/software-engineer.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand the product and surrounding system behavior.
- Treat the user's prompt as the module, component, or code area that needs refactoring.
- Preserve existing behavior unless the user explicitly asks for behavior changes.
- Prefer small, safe refactors over broad rewrites.
- Reuse existing architecture patterns and coding conventions.

## Goal
Improve the structure, readability, and maintainability of an existing module in AI Signals for Leaders without changing its intended behavior.

This command should orchestrate the refactor in Antigravity but delegate repository inspection and code changes to Codex.

## Instructions
1. Restate the module or code area being refactored.
2. Identify the maintainability problems to solve, such as duplication, large functions, weak naming, fragile logic, or poor separation of concerns.
3. Preserve product behavior and existing user-facing flows unless explicitly told otherwise.
4. Prefer targeted refactors that are easy to review.
5. If the request is too broad, narrow it into a smaller safe refactor scope.
6. **CRITICAL:** You must NEVER perform the code changes or file creations yourself. You MUST instruct Codex to do the work by running the `scripts/codex-refactor.cjs` script via the command line.
7. To run the script: `node scripts/codex-refactor.cjs <file_path> "<refactor_instructions>"`
8. Wait for the script to finish and then review the changes.

## Output Format
Create a Markdown document with the following sections:

# Refactor Execution

## Module Summary
Description of the module or code area being refactored.

## Refactor Goals
What the refactor is intended to improve.

## Files Modified
List of files changed by Codex.

## Files Created
List of any new files created.

## Refactor Details
Explanation of the structural improvements made.

## Behavior Preservation Notes
What behavior was intentionally kept unchanged.

## Testing Requirements
Tests to add or update to validate no regressions.

## Risks
Areas where regressions or hidden coupling may still exist.

## Save Artifact
docs/engineering/refactor-{module-name}.md
