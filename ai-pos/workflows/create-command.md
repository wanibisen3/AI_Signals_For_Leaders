---
description: generate a new Antigravity slash command and its corresponding role definition
---
# /create-command

## Load Role
/ai-pos/roles/architect.md

## Load Context
/ai-pos/context/project-context.md

## Goal
Extend the `ai-pos` framework by creating new product-agnostic slash commands and roles that follow the context-driven pattern.

## Instructions
1. Define the purpose and mission of the new command or role.
2. Ensure the command/role is product-agnostic and relies on `project-context.md`.
3. Follow the standardized file structure for `/ai-pos`.
4. Define the inputs, instructions, and output format for the new workflow.
5. Define the mission, responsibilities, and principles for the new role.

## Output Format
Output the code content for the new `.md` files in `/ai-pos/workflows/` and `/ai-pos/roles/`.

## Save Artifact
/ai-pos/workflows/{command-name}.md
/ai-pos/roles/{role-name}.md
