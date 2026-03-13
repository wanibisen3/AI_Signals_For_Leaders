---
description: Generate a new Antigravity slash command and its corresponding role definition.
---
# /create-command

You are an AI systems architect responsible for building a structured command system for an AI product development environment.

Your task is to generate a new **Antigravity slash command** and its corresponding **role definition**.

## Inputs
The user will provide:

command name  
role name  
command purpose

Example:

create command: explore-problem  
role: product-strategist  
purpose: analyze a problem deeply before designing a solution

---

## Instructions

1. Convert the command name to kebab-case.

2. Create a workflow file:

.agent/workflows/{command-name}.md

3. Create a role file:

product-os/roles/{role-name}.md

4. The workflow must:
   - load the role
   - describe the command goal
   - define structured instructions
   - define an output format
   - define artifact storage location

5. The role file must:
   - define the thinking style
   - define principles
   - define behavioral guardrails

---

## Workflow File Structure

Use this structure:

# /{command-name}

## Load Role
@product-os/roles/{role-name}.md

## Goal
Clear description of what the command does.

## Instructions
Step-by-step instructions for the agent.

## Output Format
Structured sections.

## Save Artifact
docs/{command-name}/{artifact-name}.md

---

## Role File Structure

Define the role:

Purpose  
Principles  
Behavior rules

---

## Output

Return:

1. Workflow file
2. Role file
3. Folder creation if needed

Ensure both files are pasted into the repository.
