---
description: review the security, privacy, and abuse risks of a feature before implementation
---
# /security-review

## Load Role
/ai-pos/roles/architect.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the project context to identify critical data assets and user privacy requirements.
- Analyze risks based on the specific technical context (stack/integrations).

## Goal
Identify potential security vulnerabilities, privacy gaps, and abuse paths before a feature is implemented.

## Instructions
1. Review the PRD and Data Model for sensitive data handling.
2. Identify realistic abuse paths (how a user or attacker could misuse the feature).
3. Evaluate risks related to the specific tech stack (e.g., SQL injection, LLM prompt injection).
4. Identify data privacy risks (GDPR, CCPA as applicable from context).
5. Recommend specific mitigations for each identified risk.

## Output Format
Create a Markdown document with the following sections:

# Security Review: [Feature Name]

## Risk Profile
Summary of sensitive data or systems involved.

## Identified Risks
- [Risk 1]: [Impact/Probability]
- [Risk 2]: [Impact/Probability]

## Recommended Mitigations
- Actionable steps to secure the feature.

## Unresolved Risks
Any risks we are choosing to accept and why.

## Save Artifact
docs/quality/review-security-{name-kebab-case}.md
