---
description: review the security, privacy, and abuse risks of a feature in AI Signals for Leaders before implementation so the system remains safe, trustworthy, and production-ready
---
# /security-review

## Load Role
@product-os/roles/architect.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand the product, user data, and system behavior.
- Treat the user's prompt as the feature or capability requiring security review.
- If a PRD, system design, or data model exists, use them as the primary references.
- Focus on practical security and privacy risks relevant to the product.
- Prefer simple mitigations that fit the existing architecture.

## Goal
Review the security, privacy, and abuse risks of the proposed feature in AI Signals for Leaders.

The review should identify how the feature could expose user data, create authorization issues,
introduce unsafe API behavior, or increase abuse risk, and should recommend mitigations before implementation.

## Instructions
1. Restate the feature being reviewed.
2. Identify what user data, system data, or generated data is involved.
3. Identify authentication risks.
4. Identify authorization and permissions risks.
5. Identify data privacy risks.
6. Identify API abuse or misuse risks.
7. Identify AI-specific risks such as prompt injection, unsafe outputs, or overexposure of internal logic if relevant.
8. Identify logging or observability considerations that may affect security.
9. Recommend mitigations for each major risk.
10. Distinguish between high, medium, and low severity risks.

## Output Format
Create a Markdown document with the following sections:

# Security Review

## Feature Name

## Security Overview
High-level summary of the security posture for this feature.

## Data Involved
What user, product, or system data is touched by this feature.

## Authentication Risks
Risks related to identity verification.

## Authorization Risks
Risks related to permissions and access control.

## Privacy Risks
Risks related to user data exposure, retention, or misuse.

## API and Abuse Risks
Risks related to misuse, spam, scraping, or abusive usage.

## AI-Specific Risks
Prompt injection, unsafe generation, data leakage through prompts or outputs, or model misuse if relevant.

## Severity Assessment
- High
- Medium
- Low

## Recommended Mitigations
Concrete actions to reduce the identified risks.

## Open Questions
Unknowns that need clarification before implementation.

## Save Artifact
docs/architecture/security-review-{feature-name-kebab-case}.md
