-- 20261028_capture_semantic_drift.sql
-- Session 8 — captures three production-only tables into version control.
--
-- Idempotent. On production: no-op. On fresh Postgres without pgvector:
-- creates only the non-vector table. Never attempts to install pgvector
-- (CI Postgres does not ship it).

-- 1. Determine vector availability (no install attempt)
do $$
begin
  if not exists (select 1 from pg_extension where extname = 'vector') then
    raise notice 'pgvector missing — vector tables will be skipped';
  end if;
end $$;

-- 2. listing_search_embeddings (vector-dependent)
do $$
begin
  if exists (select 1 from pg_extension where extname = 'vector') then
    execute $ddl$
      create table if not exists public.listing_search_embeddings (
        listing_id uuid not null primary key,
        model_name text not null,
        source_hash text not null,
        embedding extensions.vector(384) not null,
        updated_at timestamptz not null default now()
      )
    $ddl$;
    execute $ddl$
      create index if not exists listing_search_embeddings_hnsw_idx
        on public.listing_search_embeddings
        using hnsw (embedding extensions.vector_cosine_ops)
        with (m='16', ef_construction='64')
    $ddl$;
    execute $ddl$
      create index if not exists listing_search_embeddings_model_idx
        on public.listing_search_embeddings using btree (model_name)
    $ddl$;
  end if;
end $$;

-- 3. search_query_embeddings (vector-dependent)
do $$
begin
  if exists (select 1 from pg_extension where extname = 'vector') then
    execute $ddl$
      create table if not exists public.search_query_embeddings (
        normalized_query text not null primary key,
        model_name text not null,
        embedding extensions.vector(384) not null,
        updated_at timestamptz not null default now()
      )
    $ddl$;
  end if;
end $$;

-- 4. search_embedding_jobs (no vector dependency)
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

-- 5. Grants + RLS (only for tables that exist)
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
    if exists (select 1 from pg_tables where schemaname = 'public' and tablename = t) then
      execute format('grant all on public.%I to service_role', t);
      execute format('revoke all on public.%I from anon, authenticated', t);
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;
