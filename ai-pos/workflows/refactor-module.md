---
description: refactor an existing module to improve maintainability while preserving behavior
---
# /refactor-module

## Load Role
/ai-pos/roles/senior-engineer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Ensure the refactor aligns with the technical stack and architectural principles.
- Preserve all domain-specific logic as defined in the context and existing tests.

## Goal
Improve the structure, readability, and maintainability of a specific module or codebase without changing its external behavior.

## Instructions
1. Analyze the target module for complexity, debt, or pattern violations.
2. Identify areas for improvement (e.g., decoupling, simplification).
3. Draft a refactoring approach that preserves existing behavior.
4. Execute the changes in small, testable steps.
5. Verify behavior preservation through regression testing.

## Output Format
Create a Markdown document with the following sections:

# Refactoring Report: [Module Name]

## Rationale
Why this module needed refactoring.

## Changes Made
Detailed description of refactored logic.

## Risk Assessment
Any potential areas where behavior might have subtly shifted.

## Verification Results
Test output confirm behavior preservation.

## Save Artifact
docs/engineering/refactor-{name-kebab-case}.md
