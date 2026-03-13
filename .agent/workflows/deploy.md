---
description: deploy AI Signals for Leaders by pushing the current codebase to GitHub and executing Supabase database migrations
---

# /deploy

## Load Role
@product-os/roles/devops-engineer.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand the deployment environment.
- Treat the user's prompt as a deployment request.
- Ensure that code changes have passed peer-review, qa-review, and security-audit before deployment when possible.

## Goal
Deploy the latest version of AI Signals for Leaders by pushing the repository
to GitHub and running Supabase database migrations.

## Instructions
1. Verify the repository is in a clean state.
2. Ensure there are no uncommitted changes.
3. Push the latest code to the configured GitHub repository.
4. Run Supabase migrations to update the database schema.
5. Confirm migrations executed successfully.
6. Report deployment status.

## Execution Steps

### step_1
name: push-code
command: |
  git add .
  git commit -m "deployment update"
  git push origin main

### step_2
name: run-supabase-migrations
command: |
  supabase db push

### step_3
name: verify-deployment
command: |
  supabase migration list

## Output Format
Create a Markdown document with the following sections:

# Deployment Report

## GitHub Push
Status of code push.

## Supabase Migration
Result of database migration execution.

## Deployment Status
- Success
- Failed

## Notes
Any warnings or follow-up actions.

## Save Artifact
docs/deployment/deploy-{timestamp}.md
