---
description: design the system architecture required to implement a feature in AI Signals for Leaders while ensuring scalability, maintainability, and alignment with the existing codebase
---
# /system-design

## Load Role
@product-os/roles/architect.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand how the product works.
- Treat the user prompt as the feature that needs architecture design.
- If a PRD exists, use it as the primary specification.
- Prefer designs that extend the current system rather than rewriting it.
- Avoid unnecessary complexity.

## Goal
Design a scalable and maintainable architecture for implementing the feature
in AI Signals for Leaders.

The design should identify system components, data flows, integrations,
and operational concerns required to build the feature.

## Instructions
1. Restate the feature being designed.
2. Identify the components involved in implementing the feature.
3. Identify backend services required.
4. Identify frontend components or UI modules.
5. Identify APIs or endpoints needed.
6. Identify data storage requirements.
7. Identify integrations with external services such as AI APIs.
8. Define the data flow between components.
9. Identify observability requirements including logs and metrics.
10. Identify scalability considerations.
11. Identify potential architectural risks.

## Output Format
Create a Markdown document with the following sections:

# System Design

## Feature Name

## Architecture Overview
High-level explanation of how the system supports this feature.

## System Components
- frontend components
- backend services
- background jobs
- integrations

## API Design
Endpoints required for this feature.

## Data Storage
Databases or storage systems required.

## Data Flow
Step-by-step description of how data moves through the system.

## External Integrations
Any external APIs or services required.

## Observability
Logging, monitoring, and metrics.

## Scalability Considerations
Potential scaling issues and mitigation strategies.

## Architectural Risks
Possible design risks.

## Save Artifact
docs/architecture/system-design-{feature-name-kebab-case}.md
