-- 20261053_error_logs_rate_limit.sql
-- Session 11 — rate limit error_logs inserts.
--
-- error_logs had no insert rate limit. Any authenticated user could
-- flood the table (spam vector). A single crashing app in a render
-- loop could also produce thousands of rows per minute.
--
-- Adds a BEFORE INSERT trigger: max 20 logs per user per hour.
-- NULL user_id (anon errors) is not rate-limited here; anon cannot
-- insert anyway (RLS blocks it).
--
-- Client impact: the exception is swallowed by logError's try/catch
-- (silent fail by design). Rate-limited events are dropped, not retried.

begin;

create or replace function public.check_error_logs_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
declare
  recent_count integer;
begin
  -- Anon inserts have user_id = null and are blocked by RLS before
  -- reaching this trigger. Only rate-limit authenticated inserts.
  if new.user_id is null then
    return new;
  end if;

  select count(*) into recent_count
    from public.error_logs
    where user_id = new.user_id
      and created_at > now() - interval '1 hour';

  if recent_count >= 20 then
    raise exception 'Rate limit: max 20 error logs per hour per user';
  end if;

  return new;
end;
$function$;

comment on function public.check_error_logs_rate_limit() is
  'BEFORE INSERT trigger for error_logs. Caps at 20 rows/hour/user.';

drop trigger if exists error_logs_rate_limit on public.error_logs;
create trigger error_logs_rate_limit
  before insert on public.error_logs
  for each row execute function public.check_error_logs_rate_limit();

commit;
