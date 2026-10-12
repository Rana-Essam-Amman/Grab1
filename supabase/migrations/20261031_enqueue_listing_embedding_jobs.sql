-- 20261031_enqueue_listing_embedding_jobs.sql
-- After INSERT or UPDATE on listings, enqueue a semantic embedding job.
-- Idempotent: uses a stable job_key per listing; re-enqueues only when
-- the previous job is done/failed/processing, so a pending job is not
-- reset while it is in flight.
--
-- Companion to 20261030_search_semantic_worker.sql which drains the queue.

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
    if NEW.title is not distinct from OLD.title
       and NEW.description is not distinct from OLD.description
       and NEW.attributes is not distinct from OLD.attributes then
      return NEW;
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

drop trigger if exists trg_enqueue_listing_embedding on public.listings;

create trigger trg_enqueue_listing_embedding
after insert or update on public.listings
for each row
execute function public.enqueue_listing_embedding();

revoke all on function public.enqueue_listing_embedding()
  from public, anon, authenticated;
