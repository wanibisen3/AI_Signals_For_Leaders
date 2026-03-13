---
description: generate automated tests for a feature or module in AI Signals for Leaders and execute them to validate correctness and detect regressions
codex_delegation:
  enabled: true
  task: |
    Inspect the repository and generate tests for the specified module or feature.

    Codex should:
    - detect the existing testing framework
    - create unit tests
    - create integration tests when appropriate
    - follow repository conventions
    - execute the test command
    - report results
    - identify failing tests and possible causes
---

# /generate-and-run-tests

## Load Role
@product-os/roles/software-engineer.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand the product behavior.
- Treat the user's prompt as the module, feature, or code area requiring tests.
- Preserve existing behavior and architecture.
- Prefer test patterns already used in the repository.

## Goal
Automatically generate and execute tests for the specified feature
or module in AI Signals for Leaders.

The command should generate meaningful tests, run them,
and report results so regressions or issues can be detected early.

## Instructions
1. Identify the module or feature being tested.
2. Inspect the repository to determine existing test frameworks.
3. Generate appropriate unit tests.
4. Generate integration tests where relevant.
5. Add edge case coverage.
6. Save the test files in the correct location.
7. Execute the repository test command.
8. Capture test results and failures.
9. Identify possible fixes for failing tests.
10. **CRITICAL:** You must NEVER perform the code changes or file creations yourself. You MUST instruct Codex to do the work by running the `scripts/codex-refactor.cjs` script via the command line, adapting it or passing instructions to generate tests. 

## Output Format
Create a Markdown document with the following sections:

# Test Generation and Execution

## Target Module
Module or feature being tested.

## Test Files Created
List of generated test files.

## Test Coverage Areas
Functions, components, or flows covered.

## Test Execution Results
Summary of test run results.

## Failed Tests
List of failing tests if any.

## Possible Causes
Explanation of failures.

## Recommended Fixes
Suggestions to fix failing tests.

## Save Artifact
docs/engineering/test-results-{module-name}.md
