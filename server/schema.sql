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

-- =============================
-- Token + Billing + Batch Model
-- =============================

create extension if not exists pgcrypto;

create table if not exists app_users (
  user_id uuid primary key,
  email text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_personalizations (
  user_id uuid primary key,
  role text not null default '',
  company_maturity text not null default '',
  main_focus text not null default '',
  keywords text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists user_token_balances (
  user_id uuid primary key,
  balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists token_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null check (type in ('grant', 'spend', 'refund', 'purchase')),
  amount integer not null,
  reason text,
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (idempotency_key)
);

create index if not exists idx_token_transactions_user_created on token_transactions (user_id, created_at desc);

create table if not exists brief_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  generation_request_id uuid not null unique,
  status text not null check (status in ('pending', 'completed', 'failed')),
  error_message text,
  requested_brief_count integer not null default 18,
  personalization_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_brief_batches_user_created on brief_batches (user_id, created_at desc);

create table if not exists brief_items (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references brief_batches(id) on delete cascade,
  user_id uuid not null,
  item_order integer not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_brief_items_batch on brief_items (batch_id, item_order);

create table if not exists stripe_price_catalog (
  package_code text primary key,
  currency text not null default 'sgd',
  amount_cents integer not null,
  tokens integer not null,
  stripe_product_id text not null,
  stripe_price_id text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists stripe_processed_events (
  stripe_event_id text primary key,
  stripe_event_type text not null,
  processed_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create table if not exists free_token_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  requested_tokens integer not null,
  why_needed text not null,
  suggestions text,
  current_balance integer not null default 0,
  last_batch_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function ensure_user_initialized(
  p_user_id uuid,
  p_email text
)
returns void
language plpgsql
as $$
begin
  insert into app_users(user_id, email)
  values (p_user_id, coalesce(p_email, ''))
  on conflict (user_id) do update set
    email = excluded.email,
    updated_at = now();

  insert into user_personalizations(user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  if not exists (select 1 from user_token_balances where user_id = p_user_id) then
    insert into user_token_balances(user_id, balance) values (p_user_id, 10);
    insert into token_transactions(user_id, type, amount, reason, idempotency_key, metadata)
    values (
      p_user_id,
      'grant',
      10,
      'Initial token grant',
      'grant:init:' || p_user_id::text,
      jsonb_build_object('source', 'system')
    );
  end if;
end;
$$;

create or replace function claim_generation_token(
  p_user_id uuid,
  p_generation_request_id uuid,
  p_requested_brief_count integer,
  p_personalization_snapshot jsonb
)
returns table(
  batch_id uuid,
  status text,
  balance_after integer,
  error_code text
)
language plpgsql
as $$
declare
  v_existing brief_batches;
  v_balance integer;
  v_batch_id uuid;
begin
  select * into v_existing
  from brief_batches
  where generation_request_id = p_generation_request_id
    and user_id = p_user_id;

  if found then
    return query
    select v_existing.id, v_existing.status, null::integer, 'duplicate_request'::text;
    return;
  end if;

  select balance into v_balance
  from user_token_balances
  where user_id = p_user_id
  for update;

  if v_balance is null then
    return query select null::uuid, 'failed'::text, null::integer, 'missing_balance'::text;
    return;
  end if;

  if v_balance < 1 then
    return query select null::uuid, 'failed'::text, v_balance, 'insufficient_tokens'::text;
    return;
  end if;

  insert into brief_batches(
    user_id, generation_request_id, status, requested_brief_count, personalization_snapshot
  )
  values (
    p_user_id,
    p_generation_request_id,
    'pending',
    greatest(1, coalesce(p_requested_brief_count, 18)),
    coalesce(p_personalization_snapshot, '{}'::jsonb)
  )
  returning id into v_batch_id;

  insert into token_transactions(user_id, type, amount, reason, idempotency_key, metadata)
  values (
    p_user_id,
    'spend',
    -1,
    'Brief generation',
    'gen:spend:' || p_generation_request_id::text,
    jsonb_build_object('generationRequestId', p_generation_request_id::text, 'batchId', v_batch_id::text)
  );

  update user_token_balances
  set balance = balance - 1, updated_at = now()
  where user_id = p_user_id
  returning balance into v_balance;

  return query
  select v_batch_id, 'pending'::text, v_balance, null::text;
end;
$$;

create or replace function complete_generation_batch(
  p_user_id uuid,
  p_batch_id uuid,
  p_items jsonb
)
returns void
language plpgsql
as $$
begin
  delete from brief_items where batch_id = p_batch_id;

  insert into brief_items(batch_id, user_id, item_order, payload)
  select
    p_batch_id,
    p_user_id,
    row_number() over (),
    value
  from jsonb_array_elements(coalesce(p_items, '[]'::jsonb));

  update brief_batches
  set status = 'completed',
      completed_at = now(),
      error_message = null
  where id = p_batch_id and user_id = p_user_id;
end;
$$;

create or replace function fail_generation_and_refund(
  p_user_id uuid,
  p_batch_id uuid,
  p_generation_request_id uuid,
  p_error text
)
returns integer
language plpgsql
as $$
declare
  v_balance integer;
begin
  update brief_batches
  set status = 'failed',
      completed_at = now(),
      error_message = left(coalesce(p_error, 'Unknown error'), 1000)
  where id = p_batch_id and user_id = p_user_id;

  if not exists (
    select 1 from token_transactions
    where idempotency_key = 'gen:refund:' || p_generation_request_id::text
  ) then
    insert into token_transactions(user_id, type, amount, reason, idempotency_key, metadata)
    values (
      p_user_id,
      'refund',
      1,
      'Generation refund',
      'gen:refund:' || p_generation_request_id::text,
      jsonb_build_object('generationRequestId', p_generation_request_id::text, 'batchId', p_batch_id::text)
    );

    update user_token_balances
    set balance = balance + 1, updated_at = now()
    where user_id = p_user_id;
  end if;

  select balance into v_balance from user_token_balances where user_id = p_user_id;
  return coalesce(v_balance, 0);
end;
$$;

create or replace function grant_purchased_tokens(
  p_user_id uuid,
  p_tokens integer,
  p_stripe_event_id text,
  p_session_id text
)
returns integer
language plpgsql
as $$
declare
  v_balance integer;
begin
  if exists (select 1 from stripe_processed_events where stripe_event_id = p_stripe_event_id) then
    select balance into v_balance from user_token_balances where user_id = p_user_id;
    return coalesce(v_balance, 0);
  end if;

  insert into stripe_processed_events(stripe_event_id, stripe_event_type, payload)
  values (
    p_stripe_event_id,
    'checkout.session.completed',
    jsonb_build_object('sessionId', p_session_id, 'userId', p_user_id::text, 'tokens', p_tokens)
  );

  insert into token_transactions(user_id, type, amount, reason, idempotency_key, metadata)
  values (
    p_user_id,
    'purchase',
    greatest(0, p_tokens),
    'Stripe token purchase',
    'stripe:purchase:' || p_stripe_event_id,
    jsonb_build_object('sessionId', p_session_id, 'eventId', p_stripe_event_id)
  );

  update user_token_balances
  set balance = balance + greatest(0, p_tokens),
      updated_at = now()
  where user_id = p_user_id
  returning balance into v_balance;

  return coalesce(v_balance, 0);
end;
$$;
