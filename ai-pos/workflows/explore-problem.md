---
description: deep exploration of a user problem before solutioning or designing features
---
# /explore-problem

## Load Role
/ai-pos/roles/product-strategist.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the project context to understand the target users, domain, and current product direction.
- Ground the exploration in the product's primary value proposition.
- If the problem identified conflicts with product principles, call it out.

## Goal
Rigorously explore and define a user problem to understand its root causes, impact, and constraints before proposing a solution. This avoids building features that don't solve real pain.

## Instructions
1. State the problem clearly as experienced by the target user.
2. Identify the root causes of the problem.
3. Assess the impact of the problem on user retention, growth, or revenue.
4. Identify constraints specified in the project context.
5. Formulate strategic hypotheses for potential solutions.
6. Identify knowledge gaps that need to be filled before implementation.

## Output Format
Create a Markdown document with the following sections:

# Problem Exploration: [Problem Name]

## Executive Summary
Concise overview of the problem and why it matters now.

## Root Cause Analysis
- Detailed breakdown of why this problem exists.

## Impact Assessment
- Severity of the problem for the target user.
- Business impact (Churn, Acquisition, etc.).

## Constraints & Context
- Technical or business constraints from the project context.
- Domain-specific considerations.

## Strategic Hypotheses
- "If we build X, then Y will happen because Z."

## Knowledge Gaps
- What we still don't know.

## Save Artifact
docs/explore-problem/{problem-name-kebab-case}.md
