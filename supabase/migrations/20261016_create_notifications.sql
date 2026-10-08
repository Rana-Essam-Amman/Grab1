-- 20261016_create_notifications.sql
-- Notifications system: schema, indexes, RLS, RPCs.
-- PR 1/3 — schema + service. Trigger wiring (PR 2) + UI (PR 3) come later.
--
-- Design (Facebook/Etsy pattern):
--   - JSONB payload = flexible, no migration per new type.
--   - read_at timestamptz (not boolean) = richer + analytics-ready.
--   - RLS: SELECT own + DELETE own. NO UPDATE policy.
--   - Mark-read ONLY via SECURITY DEFINER RPC (prevents payload tampering).

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in (
    'message',
    'review',
    'listing_status',
    'price_alert',
    'system'
  )),
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Recent-first per user (the primary UI query).
create index if not exists notifications_user_recent_idx
  on public.notifications (user_id, created_at desc);

-- Unread badge — partial index for fast COUNT(*) WHERE read_at IS NULL.
create index if not exists notifications_user_unread_idx
  on public.notifications (user_id)
  where read_at is null;

alter table public.notifications enable row level security;

-- SELECT: users read their own notifications.
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

-- DELETE: users delete their own notifications.
drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- NO UPDATE policy. Mark-read ONLY via SECURITY DEFINER RPC below.
-- NO INSERT policy. Inserts happen via service_role or SECURITY DEFINER triggers.

-- RPC: mark one notification as read.
create or replace function public.mark_notification_read(p_notification_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.notifications
    set read_at = now()
    where id = p_notification_id
      and user_id = auth.uid()
      and read_at is null;
end;
$$;

-- RPC: mark all notifications of the current user as read. Returns count.
create or replace function public.mark_all_notifications_read()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_count integer;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.notifications
    set read_at = now()
    where user_id = auth.uid() and read_at is null;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- RPC: unread count for the current user.
create or replace function public.get_unread_notification_count()
returns integer
language sql
security definer
set search_path to 'public'
as $$
  select count(*)::integer
    from public.notifications
    where user_id = auth.uid() and read_at is null;
$$;

grant execute on function public.mark_notification_read(uuid) to authenticated;
grant execute on function public.mark_all_notifications_read() to authenticated;
grant execute on function public.get_unread_notification_count() to authenticated;
