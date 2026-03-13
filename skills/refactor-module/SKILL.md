---
name: refactor-module
description: Safely refactor an existing module to improve maintainability while preserving behavior. Use when Codex is asked to clean up a specific file or module, reduce duplication, shorten long functions, improve naming, separate concerns, or make fragile logic easier to maintain without changing intended behavior.
---

# Refactor Module

## Overview

Refactor the smallest practical slice of an existing module. Preserve behavior, align with local architecture and conventions, and make regression risks explicit.

## Workflow

### 1. Inspect the module and its nearby context

Read the target file and the closest related types, tests, and callers needed to understand behavior. Prefer the narrowest repository slice that explains the module's responsibilities and constraints.

Identify:

- Public entry points and expected outputs
- Side effects, I/O boundaries, and stateful dependencies
- Existing tests that already pin behavior
- Local naming, formatting, and abstraction patterns

### 2. Identify maintainability problems

Prioritize issues that materially reduce clarity or increase change risk:

- Duplication
- Long or mixed-responsibility functions
- Poor naming
- Weak separation of concerns
- Conditional complexity or fragile branching
- Hidden coupling to external state
- Repeated data-shaping or validation logic

Do not refactor for style alone unless the surrounding codebase already expects that convention.

### 3. Choose the smallest safe refactor

Prefer low-risk changes such as:

- Extracting a helper with a clear name
- Consolidating duplicated branches
- Replacing ad hoc intermediate values with a small local abstraction
- Renaming unclear identifiers when usage remains obvious
- Isolating side effects from pure transformation logic
- Splitting a function only when the new boundaries are stable and meaningful

Avoid:

- Broad architectural rewrites
- Cross-cutting renames without test coverage
- Mixing behavior changes into cleanup
- Introducing abstractions that are not already justified by repetition or complexity

### 4. Preserve behavior deliberately

Before editing, state the behavior that must remain unchanged. During the refactor, keep interfaces, return shapes, side effects, and error handling stable unless the user explicitly requests otherwise.

When behavior is ambiguous, infer the least disruptive interpretation from nearby callers and tests. If ambiguity creates material risk, surface it explicitly.

### 5. Validate with the strongest local signal available

Run focused tests first. If targeted tests do not exist, use the nearest relevant test suite, build step, typecheck, or lint command that exercises the refactored area.

If validation cannot be run, say so and list the exact checks that should be executed.

## Reporting Format

Return results in this structure:

- `Module summary`
- `Current issues`
- `Files modified`
- `Refactor details`
- `Behavior preservation notes`
- `Testing requirements`
- `Risks`

Keep the report concrete. Name the module, call out the specific maintainability issues found, summarize the exact refactor, and list regression risks and recommended tests.
