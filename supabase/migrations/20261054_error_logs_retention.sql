-- 20261054_error_logs_retention.sql
-- Session 11 — auto-delete error_logs older than 30 days.
--
-- error_logs is append-only and rate-limited at 20/hour/user, but
-- nothing removes old rows. Without retention, the table grows forever.
--
-- Schedules a daily pg_cron job at 03:15 UTC. If pg_cron is not
-- installed in the target environment (e.g. disposable CI postgres),
-- the migration is a no-op rather than a failure.

do $$
begin
  if not exists (select 1 from pg_extension where extname = 'pg_cron') then
    raise notice 'pg_cron not installed — error_logs retention not scheduled';
    return;
  end if;

  -- Idempotent: drop prior schedule with same name if it exists.
  begin
    perform cron.unschedule('error-logs-retention');
  exception when others then
    null;
  end;

  perform cron.schedule(
    'error-logs-retention',
    '15 3 * * *',
    $cron$delete from public.error_logs where created_at < now() - interval '30 days';$cron$
  );

  raise notice 'error-logs-retention scheduled at 03:15 UTC daily';
exception when others then
  raise notice 'error_logs retention scheduling failed: %', sqlerrm;
end $$;
