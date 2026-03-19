# Product OS (ai-pos) Workflows

This directory contains product-agnostic slash command workflows.

## Pattern
Every workflow follows the **Load Role + Load Context** pattern:
1. **Load Role**: Injects the behavioral persona.
2. **Load Context**: Injects the specific product metadata (`ai-pos/context/project-context.md`).

## Customization
To use these workflows for a new product, simply update `ai-pos/context/project-context.md` using the `project-context-template.md`. No changes to the workflow files should be required.
