-- 20261009_create_wishlists.sql
-- User favorites (wishlist) — replaces localStorage implementation.
--
-- Market-scoped: each entry carries market_code so a user's JO and SA 
-- wishlists stay separate, mirroring the conversations pattern.
--
-- No FK on listing_id (matches conversations.listing_id pattern) to 
-- tolerate legacy seed IDs that may not exist in the listings table.
--
-- PK (user_id, listing_id): favorites are idempotent.

create table if not exists public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null,
  market_code text not null check (market_code in ('JO','SA','LB','PS','SY')),
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index if not exists wishlists_user_market_idx
  on public.wishlists (user_id, market_code, created_at desc);

alter table public.wishlists enable row level security;

drop policy if exists "wishlists_read_own" on public.wishlists;
create policy "wishlists_read_own"
  on public.wishlists for select
  using (auth.uid() = user_id);

drop policy if exists "wishlists_insert_own" on public.wishlists;
create policy "wishlists_insert_own"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

drop policy if exists "wishlists_delete_own" on public.wishlists;
create policy "wishlists_delete_own"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- No update policy: rows are immutable (add/remove only).
