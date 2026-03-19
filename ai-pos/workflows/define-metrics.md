---
description: define measurable success metrics for a feature or product growth to evaluate value delivery
---
# /define-metrics

## Load Role
/ai-pos/roles/product-analyst.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Align metrics with the business goals and product principles defined in the context.
- Ensure measurement plan is realistic within the technical context.

## Goal
Define clear, measurable metrics that reveal whether a feature or the product is meeting its functional and commercial objectives.

## Instructions
1. Identify the "North Star" metric for the feature/product.
2. Define supporting outcome metrics (Retention, Conversion, Activation).
3. Identify leading indicators (Engagement, Usage frequency).
4. Define counter-metrics to watch for negative trade-offs.
5. Outline the measurement plan (how and where data is captured).

## Output Format
Create a Markdown document with the following sections:

# Success Metrics: [Feature/Product Name]

## North Star Metric
The single most important indicator of success.

## Outcome Metrics
- Primary business or user results.

## Leading Indicators
- Early signals that we are on the right track.

## Counter-Metrics
- What could go wrong (e.g., higher churn in a different segment).

## Measurement Plan
- Event tracking requirements.
- Data sources (Analytics, DB, etc.).

## Evaluation Schedule
- When and how these metrics will be reviewed.

## Save Artifact
docs/analytics/metrics-{name-kebab-case}.md
