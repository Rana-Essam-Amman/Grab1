-- 20261032_search_index_hardening.sql
-- Hardens the semantic search indexing pipeline so every active listing
-- (existing or future) is always searchable.
--
-- Fixes:
--   1. Trigger now fires on status change (sold/archived → active)
--   2. Daily orphan sweep adds jobs for active listings with no embedding
--   3. Stale jobs stuck in 'processing' > 15 min are reset to pending
--   4. Removes the leftover diag-1 cron job
--
-- CI note: pg_cron and pg_net are Supabase-managed and absent from the
-- CI Postgres image. Functions are created unconditionally; the cron
-- registration is guarded by a pg_extension check.

-- ============================================================
-- 1. Trigger: catch status change back to active
-- ============================================================

create or replace function public.enqueue_listing_embedding()
returns trigger
language plpgsql
security definer
set search_path = public
as $func$
begin
  if NEW.status <> 'active' then
    return NEW;
  end if;

  if TG_OP = 'UPDATE' then
    -- If status transitioned to active from anything else, enqueue.
    -- Otherwise, only enqueue if title/description/attributes changed.
    if OLD.status is not distinct from NEW.status then
      if NEW.title is not distinct from OLD.title
         and NEW.description is not distinct from OLD.description
         and NEW.attributes is not distinct from OLD.attributes then
        return NEW;
      end if;
    end if;
  end if;

  insert into public.search_embedding_jobs
    (job_key, job_type, listing_id, normalized_text, source_hash, status, next_attempt_at)
  values (
    'auto-' || NEW.id::text,
    'listing',
    NEW.id,
    public.normalize_search_text(
      coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, '')
    ),
    '',
    'pending',
    now()
  )
  on conflict (job_key) do update
    set status = 'pending',
        next_attempt_at = now(),
        updated_at = now(),
        attempts = 0,
        last_error = null
    where public.search_embedding_jobs.status in ('done', 'failed', 'processing');

  return NEW;
end;
$func$;

-- ============================================================
-- 2. Sweep: enqueue jobs for active listings with no embedding
-- ============================================================

create or replace function public.sweep_orphan_listings()
returns integer
language plpgsql
security definer
set search_path = public
as $func$
declare
  v_enqueued integer := 0;
begin
  insert into public.search_embedding_jobs
    (job_key, job_type, listing_id, normalized_text, source_hash, status, next_attempt_at)
  select
    'auto-' || l.id::text,
    'listing',
    l.id,
    public.normalize_search_text(
      coalesce(l.title, '') || ' ' || coalesce(l.description, '')
    ),
    '',
    'pending',
    now()
  from public.listings l
  where l.status = 'active'
    and not exists (
      select 1 from public.listing_search_embeddings e
      where e.listing_id = l.id
    )
  on conflict (job_key) do update
    set status = 'pending',
        next_attempt_at = now(),
        updated_at = now(),
        attempts = 0,
        last_error = null
    where public.search_embedding_jobs.status in ('done', 'failed', 'processing');

  get diagnostics v_enqueued = row_count;
  return v_enqueued;
end;
$func$;

revoke all on function public.sweep_orphan_listings() from public, anon, authenticated;

-- ============================================================
-- 3. Recovery: reset stale 'processing' jobs to pending
-- ============================================================

create or replace function public.recover_stale_embedding_jobs()
returns integer
language plpgsql
security definer
set search_path = public
as $func$
declare
  v_recovered integer := 0;
begin
  update public.search_embedding_jobs
     set status = 'pending',
         next_attempt_at = now(),
         updated_at = now(),
         dispatched_at = null,
         request_id = null,
         last_error = 'recovered: stale processing > 15 min'
   where status = 'processing'
     and dispatched_at is not null
     and dispatched_at < now() - interval '15 minutes';

  get diagnostics v_recovered = row_count;
  return v_recovered;
end;
$func$;

revoke all on function public.recover_stale_embedding_jobs() from public, anon, authenticated;

-- ============================================================
-- 4. Cron: remove diag-1, schedule daily sweep + hourly recovery
-- (conditional on pg_cron — CI Postgres does not ship pg_cron)
-- ============================================================

do $cron$
declare
  v_jobid bigint;
begin
  if not exists (select 1 from pg_extension where extname = 'pg_cron') then
    raise notice 'pg_cron not available — cron jobs skipped';
    return;
  end if;

  -- Remove leftover diag-1
  select jobid into v_jobid from cron.job where jobname = 'diag-1' limit 1;
  if v_jobid is not null then
    perform cron.unschedule(v_jobid);
  end if;

  -- Daily orphan sweep at 04:00
  select jobid into v_jobid from cron.job where jobname = 'search-orphan-sweep' limit 1;
  if v_jobid is not null then
    perform cron.unschedule(v_jobid);
  end if;
  perform cron.schedule(
    'search-orphan-sweep',
    '0 4 * * *',
    'select public.sweep_orphan_listings();'
  );

  -- Hourly stale recovery
  select jobid into v_jobid from cron.job where jobname = 'search-stale-recovery' limit 1;
  if v_jobid is not null then
    perform cron.unschedule(v_jobid);
  end if;
  perform cron.schedule(
    'search-stale-recovery',
    '15 * * * *',
    'select public.recover_stale_embedding_jobs();'
  );

  raise notice 'cron jobs scheduled: search-orphan-sweep, search-stale-recovery';
end;
$cron$;
