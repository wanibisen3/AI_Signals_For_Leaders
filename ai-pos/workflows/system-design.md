---
description: design the technical architecture and systems required to implement a feature
---
# /system-design

## Load Role
/ai-pos/roles/architect.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Adhere to the technical constraints and stack specified in the project context.
- Ensure the design is proportionate to the product's current scale and MVP stage.

## Goal
Create a technical blueprint for a feature that is scalable, maintainable, and secure.

## Instructions
1. Review the PRD and UX designs for functional requirements.
2. Define the high-level system components (Services, APIs, Workers).
3. Define the data flow between components.
4. Identify third-party dependencies or integrations.
5. Address security, privacy, and performance requirements.
6. Identify potential technical debt or trade-offs made for speed.

## Output Format
Create a Markdown document with the following sections:

# System Design: [Feature Name]

## Architectural Overview
High-level description of the technical approach.

## Components & Responsibilities
- [Service Name]: [Purpose]

## Data Flow
Sequence or description of how data moves through the system.

## Performance & Scalability
How the system handles load and data growth.

## Security & Privacy
Protections for user data and integrity.

## Trade-offs
Decisions made and why (e.g., speed vs. future-proofing).

## Save Artifact
docs/engineering/system-design-{feature-name-kebab-case}.md
