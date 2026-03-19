# Product OS (ai-pos) Roles

This directory contains product-agnostic role definitions for the `ai-pos` framework.

## Structure
Each role is defined with:
- **Mission**: The broad purpose of the role.
- **Responsibilities**: Specific duties.
- **Inputs**: Required context (usually `project-context.md`).
- **Decision Principles**: Guidelines for making choices.
- **Collaboration Rules**: How this role interacts with others.
- **Anti-patterns**: Common pitfalls to avoid.

## Decoupling Principle
Roles must NOT contain hardcoded product names, tech stacks, or domain specific details. These must be derived from the `project-context.md` at runtime.
