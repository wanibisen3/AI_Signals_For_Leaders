---
description: generate automated tests for a feature or module and execute them to validate correctness
---
# /generate-and-run-tests

## Load Role
/ai-pos/roles/software-engineer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the technical context to identify the correct testing framework and environment.
- Align test scenarios with the product principles and user stories in the context.

## Goal
Ensure code quality and correctness by generating and executing a comprehensive suite of automated tests for a specified feature or module.

## Instructions
1. Identify the target module or file to test.
2. Generate unit tests for core logic and edge cases.
3. Generate integration tests for cross-module interactions.
4. Execute the tests and capture output.
5. Resolve any failures and re-verify.

## Output Format
Create a Markdown document with the following sections:

# Test Report: [Module Name]

## Test Coverage Summary
- Areas tested.

## Execution Results
- [Pass/Fail]: [Test Name]

## Critical Failures
- Detailed logs for any failed tests.

## Recommendations
- Next steps for quality improvement.

## Save Artifact
docs/quality/test-report-{name-kebab-case}.md
