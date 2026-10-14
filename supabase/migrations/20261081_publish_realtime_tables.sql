-- 20261081_publish_realtime_tables.sql
-- Reconcile supabase_realtime publication membership.
--
-- Drift: production has conversations, messages, notifications in the
-- publication. But only conversations + messages are added by migration
-- 20261006. notifications was added manually (Supabase Dashboard auto-
-- enable). CI's disposable Postgres never sees notifications in the
-- publication, so realtime_publication_check.sql fails.
--
-- This migration makes publication membership reproducible from
-- migrations. Idempotent — safe to apply to production (all 3 already
-- present → no-op) and to CI (adds missing memberships).
--
-- See also: 20261069_restore_missing_triggers.sql (same drift pattern).

do $$
declare
  v_table text;
begin
  -- Publication must exist (bootstrap creates it in CI).
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    raise exception
      'SEC-2: required publication supabase_realtime does not exist';
  end if;

  -- Add each required table if missing.
  foreach v_table in array array[
    'conversations',
    'messages',
    'notifications'
  ]
  loop
    if to_regclass(format('public.%I', v_table)) is null then
      raise exception
        'SEC-2: required table public.% does not exist',
        v_table;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = v_table
    ) then
      execute format(
        'alter publication supabase_realtime add table public.%I',
        v_table
      );
    end if;
  end loop;
end $$;
