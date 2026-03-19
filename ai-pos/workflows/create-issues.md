---
description: convert an implementation plan into structured development issues for engineers
---
# /create-issues

## Load Role
/ai-pos/roles/engineering-manager.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Ensure issue descriptions match the product's technical context and stack.
- Align acceptance criteria with the "What Good Looks Like" definition.

## Goal
Transform high-level implementation tasks into specific, actionable development issues (e.g., for Jira, Linear, or GitHub) that engineers can execute with minimal ambiguity.

## Instructions
1. Review the Implementation Plan for specific tasks.
2. Generate individual issues for each logical unit of work.
3. Include clear descriptions and context for each issue.
4. Define specific acceptance criteria for completion.
5. Identify cross-task dependencies.
6. Provide specific testing or validation requirements for each issue.

## Output Format
Create a Markdown document or list of issues:

# Development Issues: [Feature Name]

## [Issue ID]: [Title]
- **Description**: [Actionable summary]
- **Acceptance Criteria**: [List]
- **Dependencies**: [Other issues]
- **Validation**: [Tests/Manual steps]

## Save Artifact
docs/engineering/issues-{feature-name-kebab-case}.md
