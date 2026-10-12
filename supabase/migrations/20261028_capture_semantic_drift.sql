-- 20261028_capture_semantic_drift.sql
-- Session 8 — captures three production-only tables into version control.
--
-- Context: 20261026_rls_security_fix.sql referenced three tables that were
-- created manually via Supabase SQL Editor and never committed:
--   listing_search_embeddings, search_query_embeddings, search_embedding_jobs
-- Fresh CI Postgres failed on REVOKE, revealing the drift. This migration
-- documents their real schema so a Supabase reset would not lose them.
--
-- Idempotent: every statement uses IF NOT EXISTS or a DO block. Safe to
-- apply on production where the objects already exist — this is a no-op
-- there. On fresh Postgres it creates the schema faithfully.
--
-- RLS: 20261026 enables RLS conditionally. If those tables did not exist
-- at 20261026 time (fresh CI), RLS was skipped. This migration re-applies
-- the revoke + enable at the end so both environments converge.

create schema if not exists extensions;
create extension if not exists vector with schema extensions;

-- 1. listing_search_embeddings
create table if not exists public.listing_search_embeddings (
  listing_id uuid not null primary key,
  model_name text not null,
  source_hash text not null,
  embedding extensions.vector(384) not null,
  updated_at timestamptz not null default now()
);

create index if not exists listing_search_embeddings_hnsw_idx
  on public.listing_search_embeddings
  using hnsw (embedding extensions.vector_cosine_ops)
  with (m='16', ef_construction='64');

create index if not exists listing_search_embeddings_model_idx
  on public.listing_search_embeddings using btree (model_name);

-- 2. search_query_embeddings
create table if not exists public.search_query_embeddings (
  normalized_query text not null primary key,
  model_name text not null,
  embedding extensions.vector(384) not null,
  updated_at timestamptz not null default now()
);

-- 3. search_embedding_jobs
create table if not exists public.search_embedding_jobs (
  job_key text not null primary key,
  job_type text not null,
  listing_id uuid,
  normalized_text text not null,
  source_hash text not null,
  status text not null default 'pending',
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  request_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  dispatched_at timestamptz,
  completed_at timestamptz,
  last_error text
);

create index if not exists search_embedding_jobs_pending_idx
  on public.search_embedding_jobs (next_attempt_at, created_at)
  where status = 'pending';

create index if not exists search_embedding_jobs_request_idx
  on public.search_embedding_jobs (request_id)
  where request_id is not null;

-- 4. Grants — match production. anon/authenticated are explicitly excluded.
grant all on public.listing_search_embeddings to service_role;
grant all on public.search_query_embeddings to service_role;
grant all on public.search_embedding_jobs to service_role;

-- 5. Security — apply to both environments (idempotent)
do $$
declare
  t text;
  tables text[] := array[
    'listing_search_embeddings',
    'search_query_embeddings',
    'search_embedding_jobs'
  ];
begin
  foreach t in array tables loop
    if exists (
      select 1 from pg_tables
      where schemaname = 'public' and tablename = t
    ) then
      execute format('revoke all on public.%I from anon, authenticated', t);
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;
