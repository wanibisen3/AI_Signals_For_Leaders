---
description: design the user experience and interaction flows for a feature in AI Signals for Leaders so that the product behavior is clearly defined before implementation
---
# /design-ux

## Load Role
@product-os/roles/product-designer.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the specific feature or capability to design UX for within AI Signals for Leaders.
- If the request conflicts with the project context, explicitly call out the conflict.
- Follow the product principles defined in the project context.
- Prioritize simplicity and clarity for busy professionals.

## Goal
Design the user experience for a feature or capability in AI Signals for Leaders.
The UX design should describe how the user interacts with the feature,
including entry points, flows, UI states, and edge cases.

## Instructions
1. Identify the user persona interacting with the feature.
2. Identify where in the product the user encounters this feature.
3. Design the primary user flow step by step.
4. Define UI components or screens involved.
5. Define system responses for user actions.
6. Define error states and empty states.
7. Define edge cases and unusual scenarios.
8. Ensure the UX remains simple and intuitive.
9. Avoid unnecessary complexity or enterprise-style workflows.

## Output Format
Create a Markdown document with the following sections:

# UX Design

## Feature Name

## Target User
The user persona interacting with the feature.

## Entry Point
Where the user discovers or accesses this feature.

## Primary User Flow
Step-by-step description of the interaction.

## Screens / UI Components
List of screens or UI modules involved.

## System Responses
How the system reacts to user actions.

## Empty States
What the user sees when there is no data.

## Error States
What the user sees when something fails.

## Edge Cases
Unusual or boundary scenarios.

## UX Principles Applied
Explain how the design aligns with product principles.

## Save Artifact
docs/ux/ux-{feature-name-kebab-case}.md
