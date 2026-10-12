-- 20261030_search_semantic_worker.sql
-- Semantic search job dispatcher.
--
-- pg_cron and pg_net are Supabase-managed extensions. They exist on
-- production but are NOT available in the CI Postgres image
-- (pgvector/pgvector:pg16 does not ship them).
--
-- This migration is conditional: it installs/creates the dispatcher and
-- the cron schedule when the extensions exist, and silently skips
-- otherwise. On production: full setup. On CI: no-op so the migration
-- chain remains valid.

do $outer$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    execute 'create extension if not exists pg_cron';
    raise notice 'pg_cron installed';
  else
    raise notice 'pg_cron not available — dispatcher will be skipped';
  end if;

  if exists (select 1 from pg_available_extensions where name = 'pg_net') then
    execute 'create extension if not exists pg_net';
    raise notice 'pg_net installed';
  else
    raise notice 'pg_net not available — dispatcher will be skipped';
  end if;
end;
$outer$;

do $outer$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron')
     and exists (select 1 from pg_extension where extname = 'pg_net') then
    execute $fn$
      create or replace function public.dispatch_search_embedding_jobs()
      returns void
      language plpgsql
      security definer
      set search_path = public
      as $body$
      declare
        v_project_url text;
        v_anon_key text;
        v_job record;
        v_request_id bigint;
        v_now timestamptz;
      begin
        select decrypted_secret
          into v_project_url
          from vault.decrypted_secrets
         where name = 'edge_function_url'
         limit 1;

        select decrypted_secret
          into v_anon_key
          from vault.decrypted_secrets
         where name = 'edge_function_anon_key'
         limit 1;

        if coalesce(trim(v_project_url), '') = ''
           or coalesce(trim(v_anon_key), '') = '' then
          raise exception
            'Missing Vault secrets: edge_function_url and/or edge_function_anon_key';
        end if;

        v_project_url := regexp_replace(trim(v_project_url), '/+$', '');

        for v_job in
          select j.job_key, j.listing_id
            from public.search_embedding_jobs as j
           where j.status = 'pending'
             and j.next_attempt_at <= now()
             and j.listing_id is not null
           order by j.next_attempt_at, j.created_at
           limit 50
           for update skip locked
        loop
          v_now := now();

          begin
            v_request_id := net.http_post(
              url := v_project_url || '/functions/v1/embed-listing',
              headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'apikey', v_anon_key,
                'Authorization', 'Bearer ' || v_anon_key
              ),
              body := jsonb_build_object(
                'listing_id', v_job.listing_id::text
              ),
              timeout_milliseconds := 10000
            );

            update public.search_embedding_jobs
               set status = 'dispatched',
                   request_id = v_request_id,
                   dispatched_at = v_now,
                   updated_at = v_now,
                   last_error = null
             where job_key = v_job.job_key;
          exception when others then
            update public.search_embedding_jobs
               set status = 'pending',
                   attempts = attempts + 1,
                   next_attempt_at = now() + make_interval(
                     secs => least(
                       3600,
                       30 * power(2, least(attempts, 7))::integer
                     )
                   ),
                   request_id = null,
                   dispatched_at = null,
                   updated_at = now(),
                   last_error = left(sqlerrm, 1000)
             where job_key = v_job.job_key;
          end;
        end loop;
      end;
      $body$;
    $fn$;

    execute 'revoke all on function public.dispatch_search_embedding_jobs() from public, anon, authenticated';

    raise notice 'dispatcher created';
  else
    raise notice 'dispatcher skipped — pg_cron/pg_net missing';
  end if;
end;
$outer$;

do $outer$
declare
  v_existing_job_id bigint;
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron')
     and exists (select 1 from pg_proc where proname = 'dispatch_search_embedding_jobs') then

    select jobid
      into v_existing_job_id
      from cron.job
     where jobname = 'search-embedding-dispatcher'
     limit 1;

    if v_existing_job_id is not null then
      perform cron.unschedule(v_existing_job_id);
    end if;

    perform cron.schedule(
      'search-embedding-dispatcher',
      '*/5 * * * *',
      'select public.dispatch_search_embedding_jobs();'
    );

    raise notice 'cron schedule created';
  else
    raise notice 'cron schedule skipped — pg_cron or dispatcher missing';
  end if;
end;
$outer$;
