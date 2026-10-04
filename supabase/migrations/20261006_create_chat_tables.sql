-- 20261006_create_chat_tables.sql
-- FOX Marketplace — Real-time chat between buyer and seller.
--
-- Replaces the localStorage-only chat with a proper backend:
--   • conversations: one per (listing, buyer) pair
--   • messages: append-only, soft-deletable by sender
--   • RLS: only participants can read/write
--   • Realtime: both sides receive updates instantly
--   • Market isolation: market_code enforced at app layer
--
-- Soft delete: sender sets deleted_at on their message. Both sides see
-- a "message deleted" placeholder. Text remains in DB for audit; the
-- app hides it in the UI when deleted_at is not null.

-- ─────────────────────────────────────────────────────────────
-- 1) conversations
-- ─────────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  market_code text not null check (market_code in ('JO','SA','LB','PS','SY')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

create index if not exists conversations_buyer_idx
  on public.conversations (buyer_id, updated_at desc);

create index if not exists conversations_seller_idx
  on public.conversations (seller_id, updated_at desc);

create index if not exists conversations_listing_idx
  on public.conversations (listing_id);

alter table public.conversations enable row level security;

drop policy if exists "conversations_read_participants" on public.conversations;
create policy "conversations_read_participants"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "conversations_insert_as_buyer" on public.conversations;
create policy "conversations_insert_as_buyer"
  on public.conversations for insert
  with check (auth.uid() = buyer_id and buyer_id <> seller_id);

drop policy if exists "conversations_update_participants" on public.conversations;
create policy "conversations_update_participants"
  on public.conversations for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id)
  with check (auth.uid() = buyer_id or auth.uid() = seller_id);

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 2) messages
-- ─────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 2000),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_time_idx
  on public.messages (conversation_id, created_at);

alter table public.messages enable row level security;

drop policy if exists "messages_read_participants" on public.messages;
create policy "messages_read_participants"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

drop policy if exists "messages_soft_delete_own" on public.messages;
create policy "messages_soft_delete_own"
  on public.messages for update
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);

-- ─────────────────────────────────────────────────────────────
-- 3) Trigger: touch conversation.updated_at on new message
-- ─────────────────────────────────────────────────────────────
create or replace function public.touch_conversation_on_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
    set updated_at = now()
    where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function public.touch_conversation_on_new_message();

-- ─────────────────────────────────────────────────────────────
-- 4) Realtime publication
-- ─────────────────────────────────────────────────────────────
do $$
begin
  begin
    alter publication supabase_realtime add table public.messages;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.conversations;
  exception when duplicate_object then null;
  end;
end $$;
