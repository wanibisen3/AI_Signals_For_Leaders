---
description: Context and guidelines for the high-signal intelligence backend pipeline (Fetch -> Normalize -> Cluster -> Rank). Use this as the architecture reference when implementing backend features.
---

### 1) Fetching pipeline (reliable first, fancy later)

**Source tiers**

*   **Tier A: Primary sources (highest trust)**
    *   OpenAI (blog, release notes)
    *   Google / DeepMind (blog, product updates)
    *   Anthropic (news, research/blog)
    *   Major model/platform release notes (where available)

*   **Tier B: High-quality secondary**
    *   Established tech press + reputable analyst blogs/newsletters (use as corroboration + context, not as the “truth”)

*   **Tier C: Emerging companies (Sierra, Manus, Lovable, etc.)**
    *   Only include if there’s credible traction signal (funding isn’t enough; you want enterprise adoption, product availability, real customer stories, pricing, etc.)

**Ingestion methods (in order)**

1.  RSS feeds (fastest, most stable)
2.  Official changelogs / release pages
3.  Email newsletters → parser (optional later)
4.  Selective crawling (only for sources without RSS; cache aggressively)

Store raw items in `raw_items` table with: `source`, `url`, `title`, `published_at`, `content_snippet`, `full_text`, `author`, `source_tier`.

### 2) Normalize + enrich (make items machine-rankable)

For each raw item, produce an `enriched_item` with:

*   `canonical_url` (strip tracking params)
*   `clean_title`, `clean_text`
*   `entities` (OpenAI, Google, Anthropic, Sierra…)
*   `category_tags` (Product, Cost, GTM, Productivity, Risk)
*   `event_type` (release, pricing, partnership, regulation, acquisition, benchmark, security, product launch)
*   `time_horizon_fit` (30d vs 6m vs 12m relevance)
*   `evidence_strength` (primary vs secondary vs rumor)

This is where you prevent “news soup”.

### 3) Dedupe + cluster (critical for leader UX)

**Dedupe**

Two layers:

1.  URL canonicalization (exact duplicates)
2.  Semantic duplicate detection (same story across outlets)

*Implementation:*
Create embeddings for `clean_title` + key sentences. If cosine similarity > threshold (e.g., 0.90), mark as duplicates and keep the best representative (prefer Tier A, then earliest primary, then best-written).

**Cluster**

Cluster remaining items into “story clusters”:
*   “OpenAI model release”
*   “Google enterprise AI updates”
*   “Agentic workflow tools”
*   “AI regulation/enterprise risk”

Leaders want themes, not 18 links.

### 4) Ranking (the scoring model)

You want a transparent scoring function you can tune.

`Score = Trust × Impact × Urgency × Leader-fit − Noise`

**Concrete factors:**

**A) Trust score (0–1)**
*   Tier A primary: 1.0
*   Tier B: 0.7–0.9 (depends on outlet)
*   Tier C: 0.4–0.7 unless corroborated (Boost if multiple independent confirmations).

**B) Impact score (0–3)**
Does it change one of: Cost (price, efficiency), Capability (workflows), Speed (time-to-ship), Distribution (reach), Risk (compliance).
*   *Heuristics:* pricing change (+2), major product capability (+2–3), benchmark-only (+0.5).

**C) Urgency score (0–2)**
*   Breaking change / deprecation / security issue: +2
*   Product launch with immediate availability: +1–1.5
*   Research-only: +0–0.5

**D) Leader-fit score (0–2)** (Differentiation)
*   If it creates a roadmap/procurement question: +2
*   If it’s mostly engineering interest: +0.5

**E) Noise penalty (0–2)**
*   Subtract for: hypey language, thin announcements, repetitive syndication, “AI can now do X” demo posts.

**Output:** Rank clusters, not individual articles. Each cluster gets a representative item + supporting sources.

### 5) Time horizons: 30d vs 6m vs 12m

Store each cluster with: `first_seen_at`, `last_updated_at`, `peak_relevance_window` (30/6m/12m).

*   **30 days**: breaking changes, launches, pricing, security, major partnerships
*   **6 months**: trend shifts (agents adoption, enterprise patterns)
*   **12 months**: structural truths (platform shifts, regulation, cost curves)

UI should show fewer, higher-confidence clusters as the window expands.

### 6) Generate the “decision brief” (post-ranking)

For each top cluster, generate a brief with rigid structure:
1.  **What happened** (facts)
2.  **Why it matters** (for product/business)
3.  **What to do next** (action) - be conservative (e.g., "Monitor", "Run experiment", NOT "Rewrite roadmap").

### 7) Human-in-the-loop (non-negotiable early)

For v1: Pipeline produces ranked clusters -> You approve top N (5–7/week) -> Publish.
Why: Ranking will be wrong at first. Protect trust.

### 8) Minimum tech stack (simple + scalable)

*   **Scheduler**: cron (Vercel cron / GitHub Actions)
*   **Fetcher**: Node/Python workers
*   **DB**: Postgres (Supabase works)
*   **Embeddings**: Chosen model or lightweight API
*   **Queue**: Optional at first (sequential ok)

**Tables:**
`sources`, `raw_items`, `enriched_items`, `clusters`, `cluster_items`, `briefs`, `user_saved_briefs`.

### 9) What you should NOT do yet

*   Don’t try to “cover all legitimate sites”
*   Don’t scrape the whole web
*   Don’t promise completeness
*   Promise: **high-signal coverage**, not exhaustive coverage.
