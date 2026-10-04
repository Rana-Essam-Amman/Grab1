-- 20261007_chat_read_receipts.sql
-- Read receipts for chat messages.
--
-- Adds `read_at` to messages. Recipient calls `mark_messages_read(conv)` 
-- to set read_at on messages not sent by them. Sender learns via realtime.

alter table public.messages
  add column if not exists read_at timestamptz;

-- Efficient "unread count" queries
create index if not exists messages_unread_idx
  on public.messages (conversation_id, read_at)
  where read_at is null;

-- RPC: mark all messages in a conversation as read (for the calling user).
-- Bypasses RLS via SECURITY DEFINER, but validates caller is participant.
create or replace function public.mark_messages_read(p_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.conversations c
    where c.id = p_conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  ) then
    raise exception 'Not a participant of conversation %', p_conversation_id;
  end if;

  update public.messages
    set read_at = now()
    where conversation_id = p_conversation_id
      and sender_id <> auth.uid()
      and read_at is null;
end;
$$;

grant execute on function public.mark_messages_read(uuid) to authenticated;
