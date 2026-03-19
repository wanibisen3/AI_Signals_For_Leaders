---
description: deploy the product by executing pre-flight checks and running deployment workflows
---
# /deploy

## Load Role
/ai-pos/roles/devops-engineer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Adhere to the repository and deployment environment structure specified in the context.
- Ensure all business goals and data integrity principles are respected during rollout.

## Goal
Manage a safe, reliable, and reproducible deployment of the product, including database migrations and environment validation.

## Instructions
1. Verify the current repository state (clean branch, reviewed code).
2. Execute pre-deployment build and testing scripts (if applicable).
3. Run database migration scripts and verify success.
4. Execute the deployment to the target environment (Staging/Production).
5. Verify post-deployment health and monitor for regressions.
6. Notify stakeholders of the deployment results.

## Output Format
Create a Markdown document with the following sections:

# Deployment Report: [Release/Tag]

## Status
Success | Failed | Partial Success

## Migration Summary
- [Migration ID]: [Status]

## Pre-flight Checks
- [x] Tests passing
- [x] Repo clean

## Environment Verification
- Results of health checks after deployment.

## Save Artifact
docs/deployments/release-{tag-kebab-case}.md
