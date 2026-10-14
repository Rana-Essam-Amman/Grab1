-- 20261070_lock_messages_update.sql
-- Lock messages UPDATE to `deleted_at` only. Same pattern as C1/C2 for
-- profiles/listings: RLS scopes rows but does not restrict columns.
--
-- Verified frontend write surface (src/features/chat/services/chatService.ts):
--   sendMessage      → INSERT (conversation_id, sender_id, text)
--   softDeleteMessage → UPDATE (deleted_at)
--   markMessagesRead → RPC mark_messages_read (SECURITY DEFINER)
--
-- Current grant to authenticated exposes UPDATE on text, conversation_id,
-- id, read_at, created_at, sender_id, deleted_at. Sender could rewrite
-- sent text or move a message into an unrelated conversation.
--
-- Column lists computed dynamically to tolerate schema drift in CI.

begin;

-- 1. Revoke table-level INSERT/UPDATE
revoke insert, update on table public.messages from authenticated;

-- 2. Revoke column-level INSERT/UPDATE on every column
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(column_name), ', ')
  into v_cols
  from information_schema.columns
  where table_schema='public' and table_name='messages';
  if v_cols is not null then
    execute format('revoke insert (%s) on table public.messages from authenticated', v_cols);
    execute format('revoke update (%s) on table public.messages from authenticated', v_cols);
  end if;
end $$;

-- 3. Grant INSERT (conversation_id, sender_id, text)
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(c), ', ')
  into v_cols
  from unnest(array['conversation_id','sender_id','text']) as c
  where exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='messages' and column_name=c
  );
  if v_cols is not null then
    execute format('grant insert (%s) on table public.messages to authenticated', v_cols);
  end if;
end $$;

-- 4. Grant UPDATE (deleted_at only)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='messages' and column_name='deleted_at'
  ) then
    execute 'grant update (deleted_at) on table public.messages to authenticated';
  end if;
end $$;

commit;
