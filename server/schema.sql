create table if not exists raw_items (
  id bigserial primary key,
  source text not null,
  source_tier text not null,
  url text not null,
  title text not null,
  published_at timestamptz,
  content_snippet text,
  full_text text,
  author text,
  created_at timestamptz not null default now()
);

create index if not exists idx_raw_items_url on raw_items (url);
create index if not exists idx_raw_items_published_at on raw_items (published_at desc);

create table if not exists enriched_items (
  id bigserial primary key,
  item_id text,
  source text not null,
  source_tier text not null,
  source_trust numeric(4,3),
  url text,
  canonical_url text unique,
  clean_title text,
  clean_text text,
  entities text[] not null default '{}',
  category_tags text[] not null default '{}',
  event_type text,
  time_horizon_fit text,
  evidence_strength text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_enriched_items_event_type on enriched_items (event_type);
create index if not exists idx_enriched_items_time_horizon_fit on enriched_items (time_horizon_fit);

create table if not exists clusters (
  id bigserial primary key,
  cluster_id text not null unique,
  cluster_key text not null,
  event_type text,
  entity text,
  category text,
  representative_url text,
  representative_title text,
  source_tier text,
  first_seen_at timestamptz,
  last_updated_at timestamptz,
  peak_relevance_window text,
  supporting_source_count integer not null default 1,
  ranking_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_clusters_last_updated_at on clusters (last_updated_at desc);
create index if not exists idx_clusters_peak_relevance_window on clusters (peak_relevance_window);

create table if not exists cluster_items (
  id bigserial primary key,
  cluster_id text not null,
  item_id text not null,
  canonical_url text,
  source text,
  created_at timestamptz not null default now(),
  unique (cluster_id, item_id)
);

create index if not exists idx_cluster_items_cluster_id on cluster_items (cluster_id);

create table if not exists briefs (
  id bigserial primary key,
  brief_id text not null unique,
  cluster_id text,
  headline text not null,
  summary text,
  what_happened text,
  why_it_matters text,
  leader_takeaway text,
  source text,
  date date,
  category text,
  review_status text not null default 'pending_review',
  approved_at timestamptz,
  approved_by text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_briefs_review_status on briefs (review_status);
create index if not exists idx_briefs_date on briefs (date desc);

create table if not exists user_saved_briefs (
  id bigserial primary key,
  user_id text not null,
  brief_id text not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, brief_id)
);
