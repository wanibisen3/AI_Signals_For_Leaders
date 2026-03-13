---
description: analyze a problem deeply before designing a solution
---
# /explore-problem

## Load Role
@product-os/roles/product-strategist.md

## Goal
Deeply analyze a given problem, context, and user constraints before proposing any solutions. Ensure a comprehensive understanding of the root cause and strategic impact.

## Instructions
1.  **Ingest Context:** Read and analyze the provided problem statement, user feedback, or bug report.
2.  **Identify Root Causes:** Break down the problem using techniques like "Five Whys" or first-principles thinking to separate symptoms from fundamentally broken mechanics.
3.  **Analyze Impact:** Determine the blast radius of the problem. Who does this affect? How severely? What is the business or user-experience cost of not solving it?
4.  **Define Constraints:** Outline technical, business, and timeline constraints that any future solution must respect.
5.  **Formulate Hypotheses:** Propose 2-3 hypotheses regarding the true nature of the problem, avoiding implementation details.
6.  **Avoid Premature Solutions:** Do not design the architecture or write code. Focus purely on the *problem space*.

## Output Format
Create a Markdown document with the following sections:
- **Executive Summary:** A one-paragraph distillation of the problem.
- **Root Cause Analysis:** Detailed breakdown of underlying issues.
- **Impact Assessment:** Business and user cost of the problem.
- **Constraints & Context:** Known limitations and relevant background.
- **Strategic Hypotheses:** Proposed theories on the core issue.
- **Knowledge Gaps:** What information is still missing before a solution can be designed.

## Save Artifact
docs/explore-problem/{problem-name-kebab-case}.md
