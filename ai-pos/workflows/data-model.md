---
description: define the data entities, relationships, and storage structures required for a feature
---
# /data-model

## Load Role
/ai-pos/roles/architect.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Align the data structures with the existing storage stack (see project context).
- Follow the data integrity and simplicity principles of the project.

## Goal
Define a clear and efficient data model that supports the feature's functional requirements and ensuring long-term maintainability.

## Instructions
1. Identify the core entities required for the feature.
2. Define the attributes/columns for each entity.
3. Establish relationships (one-to-one, one-to-many, etc.).
4. Identify indexing and performance considerations.
5. Ensure data types are consistent with the existing schema.

## Output Format
Create a Markdown document with the following sections:

# Data Model: [Feature Name]

## Entities
- **[Entity Name]**: [Description]

## Schema Definition
State the table structure (name, type, constraints).

## Relationships
How entities connect to each other.

## Data Integrity Rules
Constraints, default values, or triggers.

## Performance Considerations
Indices or partitioning strategies.

## Save Artifact
docs/engineering/data-model-{feature-name-kebab-case}.md
