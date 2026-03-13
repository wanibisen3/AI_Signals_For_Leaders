---
description: implement a development issue for AI Signals for Leaders by analyzing the repository, writing the required code, and validating the change
---
# /execute-issue

## Load Role
@product-os/roles/software-engineer.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand how the product behaves.
- Treat the user's prompt as the issue or task to implement.
- If a development issue exists, use it as the primary reference.
- If an implementation plan or system design exists, use those as technical guidance.
- Prefer modifying existing components rather than creating new unnecessary ones.

## Goal
Implement the requested issue by analyzing the repository, writing the required code, and ensuring the change aligns with the existing architecture of AI Signals for Leaders.

## Instructions
1. Restate the issue being implemented.
2. Inspect the repository structure.
3. Identify the files that must be modified.
4. Identify any new files or modules that must be created.
5. Implement the required logic.
6. Ensure the implementation aligns with the system design and data model.
7. Ensure the code is clean and maintainable.
8. Identify tests that should be written.
9. Summarize the changes made.

## Output Format
Create a Markdown document with the following sections:

# Issue Implementation

## Issue Summary
Description of the issue being implemented.

## Files Modified
List of files that were updated.

## Files Created
List of new files added.

## Implementation Details
Explanation of the logic implemented.

## Code Changes
Key code snippets or patches.

## Testing Requirements
Tests that should be written or updated.

## Risks
Possible issues introduced by the change.

## Save Artifact
docs/engineering/implementation-{issue-name}.md
