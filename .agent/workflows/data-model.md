---
description: define the data entities, relationships, and storage structures required to support a feature in AI Signals for Leaders
---
# /data-model

## Load Role
@product-os/roles/architect.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the project context to understand the product structure.
- Treat the user's prompt as the feature requiring data modeling.
- If a system design document exists, use it as the primary architectural reference.
- Prefer extending existing data structures rather than creating unnecessary new ones.
- Design data models that are simple, scalable, and easy to maintain.

## Goal
Define the data entities, attributes, and relationships required to implement the feature
in AI Signals for Leaders.

The data model should clearly describe what data needs to be stored, how it is structured,
and how entities relate to each other.

## Instructions
1. Identify the core entities involved in the feature.
2. Define the attributes for each entity.
3. Define relationships between entities.
4. Identify primary keys and unique identifiers.
5. Identify indexes that may improve performance.
6. Identify fields required for auditing, timestamps, or tracking.
7. Consider how the model scales with increasing users and data volume.
8. Identify potential normalization or denormalization needs.

## Output Format
Create a Markdown document with the following sections:

# Data Model

## Feature Name

## Core Entities
List the main entities required for the feature.

## Entity Definitions

### Entity: {Entity Name}

Attributes:
- attribute
- attribute

Primary Key:
identifier

Relationships:
- relationship to other entities

## Indexing Strategy
Indexes that may improve query performance.

## Data Lifecycle
Creation, updates, and deletion patterns.

## Scaling Considerations
How the model handles increasing data volume.

## Data Risks
Potential data integrity or consistency issues.

## Save Artifact
docs/architecture/data-model-{feature-name-kebab-case}.md
