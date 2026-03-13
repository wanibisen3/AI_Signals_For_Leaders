---
description: review code changes for AI Signals for Leaders and automatically create issue files for blocking problems or technical debt discovered during review
codex_delegation:
  enabled: true
  task: |
    Inspect the repository changes and perform a peer review.

    Codex should:
    - inspect modified files
    - detect bugs or maintainability problems
    - identify missing tests
    - detect architecture violations
    - generate issue files for blocking problems
---

# /peer-review

## Load Role
@product-os/roles/senior-engineer.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand product behavior and architecture.
- Treat the user input as the change, module, issue, or PR to review.
- Focus on correctness, maintainability, architecture alignment, and test quality.
- Prefer high-signal feedback over style comments.

## Goal
Perform a senior engineering peer review of the code change.
If blocking issues or serious problems are discovered,
automatically create issue files so they can be tracked and fixed.

## Instructions
1. Inspect the code change or module being reviewed.
2. Identify correctness issues.
3. Identify maintainability issues.
4. Identify missing tests.
5. Identify architectural violations.
6. Classify issues into:
    - blocking issues
    - improvements
7. For each blocking issue, generate a new issue file.
8. **CRITICAL:** You must NEVER perform the code changes or file creations yourself. You MUST instruct Codex to do the work by running the `scripts/codex-refactor.cjs` script via the command line, adapting it or passing instructions to perform the review.

## Output Format
Create a Markdown document with the following sections:

# Peer Review

## Review Summary

## Verdict
- Approve
- Approve with fixes
- Block

## Blocking Issues
- issue
- issue

## Improvements
- improvement
- improvement

## Issue Files Created
List of generated issue files.

## Save Artifact
docs/engineering/peer-review-{module-name}.md
