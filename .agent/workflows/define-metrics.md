---
description: define measurable success metrics for a feature in AI Signals for Leaders so the product team can evaluate adoption, engagement, retention, and value delivered
---
# /define-metrics

## Load Role
@product-os/roles/product-analyst.md

## Load Context
@product-os/context/project-context.md

## Context Usage Rules
- Use the shared project context as the default product background.
- Treat the user's prompt as the feature or capability whose success must be measured.
- Ensure the metrics align with the product principles and business goals defined in the project context.
- If the feature does not clearly impact user value, call that out.
- Prefer actionable metrics over vanity metrics.

## Goal
Define measurable success criteria for a feature or capability in AI Signals for Leaders.
Metrics should help determine whether the feature improves user value, engagement,
and product growth.

## Instructions
1. Restate the feature or capability being measured.
2. Identify the primary user action the feature enables.
3. Define the north star metric impacted by the feature.
4. Define activation metrics.
5. Define engagement metrics.
6. Define retention metrics.
7. Define revenue or monetization signals if applicable.
8. Identify leading indicators of success.
9. Identify failure signals that indicate the feature is not working.
10. Ensure metrics can realistically be measured within the product.

## Output Format
Create a Markdown document with the following sections:

# Feature Success Metrics

## Feature Name

## Primary User Outcome
What valuable action the feature enables.

## North Star Metric Impact
How the feature contributes to the core product value.

## Activation Metrics
Metrics indicating users first experience the value.

## Engagement Metrics
Metrics indicating ongoing usage.

## Retention Signals
Indicators that the feature contributes to repeat usage.

## Revenue or Monetization Signals
Indicators that the feature contributes to willingness to pay.

## Leading Indicators
Early signals the feature is working.

## Failure Signals
Signs the feature is not delivering value.

## Measurement Plan
How these metrics will be tracked in the product.

## Save Artifact
docs/metrics/metrics-{feature-name-kebab-case}.md
