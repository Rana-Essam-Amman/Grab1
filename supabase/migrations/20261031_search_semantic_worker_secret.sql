-- 20261031_search_semantic_worker_secret.sql
-- Adds x-worker-secret header to the embed-listing worker dispatch.
-- Reads worker_secret from Supabase Vault.
-- Safe before the secret exists: header is omitted, worker behaves as before.
-- Safe before WORKER_SECRET env var is set: gate stays off on edge side.

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
        v_worker_secret text;
        v_job record;
        v_request_id bigint;
        v_now timestamptz;
        v_headers jsonb;
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

        select decrypted_secret
          into v_worker_secret
          from vault.decrypted_secrets
         where name = 'worker_secret'
         limit 1;

        if coalesce(trim(v_project_url), '') = ''
           or coalesce(trim(v_anon_key), '') = '' then
          raise exception
            'Missing Vault secrets: edge_function_url and/or edge_function_anon_key';
        end if;

        v_project_url := regexp_replace(trim(v_project_url), '/+$', '');

        v_headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'apikey', v_anon_key,
          'Authorization', 'Bearer ' || v_anon_key
        );

        if coalesce(trim(v_worker_secret), '') <> '' then
          v_headers := v_headers || jsonb_build_object(
            'x-worker-secret', v_worker_secret
          );
        end if;

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
              headers := v_headers,
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

    raise notice 'dispatcher updated (worker-secret aware)';
  else
    raise notice 'pg_cron/pg_net missing — dispatcher not updated';
  end if;
end;
$outer$;
