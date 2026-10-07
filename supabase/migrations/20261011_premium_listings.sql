-- 20261011_premium_listings.sql
-- Premium listing infrastructure — Phase 1 monetization.
-- Aligns with src/data/monetization.ts (turboAd, autoBump, featuredAd, vipStore).
-- DB only — Paddle adapter in follow-up PR.

-- ═══════════════════════════════════════════════════════════════
-- 1) Add premium columns to listings
-- ═══════════════════════════════════════════════════════════════

alter table public.listings
  add column if not exists is_premium boolean not null default false,
  add column if not exists premium_expires_at timestamptz,
  add column if not exists auto_bump_active boolean not null default false,
  add column if not exists auto_bump_expires_at timestamptz;

create index if not exists listings_premium_idx
  on public.listings (is_premium, premium_expires_at)
  where is_premium = true;

-- ═══════════════════════════════════════════════════════════════
-- 2) Add vip_store columns to profiles
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles
  add column if not exists vip_store boolean not null default false,
  add column if not exists vip_store_expires_at timestamptz;

-- ═══════════════════════════════════════════════════════════════
-- 3) premium_transactions — one row per purchase
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.premium_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  product text not null check (product in ('turbo', 'auto_bump', 'featured', 'vip_store')),
  provider text not null default 'paddle',
  provider_session_id text,
  amount_cents integer not null,
  currency text not null,
  duration_days integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired', 'refunded')),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  applied_at timestamptz
);

create index if not exists premium_tx_user_idx on public.premium_transactions (user_id);
create index if not exists premium_tx_listing_idx on public.premium_transactions (listing_id);
create index if not exists premium_tx_session_idx on public.premium_transactions (provider_session_id);
create index if not exists premium_tx_status_idx on public.premium_transactions (status, created_at desc);

alter table public.premium_transactions enable row level security;

drop policy if exists "premium_tx_read_own" on public.premium_transactions;
create policy "premium_tx_read_own" on public.premium_transactions
  for select to authenticated
  using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- 4) RPC: apply paid premium product to listing/profile
--    Called by payment webhook (service_role only, via SECURITY DEFINER)
-- ═══════════════════════════════════════════════════════════════

create or replace function public.apply_premium_purchase(p_transaction_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_tx public.premium_transactions%rowtype;
  v_new_expiry timestamptz;
begin
  select * into v_tx from public.premium_transactions
    where id = p_transaction_id for update;

  if v_tx.id is null then
    raise exception 'transaction not found';
  end if;
  if v_tx.status <> 'paid' then
    raise exception 'transaction not paid (status=%)', v_tx.status;
  end if;
  if v_tx.applied_at is not null then
    return; -- idempotent
  end if;

  if v_tx.product = 'featured' and v_tx.listing_id is not null then
    select coalesce(premium_expires_at, now()) + (v_tx.duration_days || ' days')::interval
      into v_new_expiry
      from public.listings where id = v_tx.listing_id;
    update public.listings
      set is_premium = true, premium_expires_at = v_new_expiry
      where id = v_tx.listing_id;

  elsif v_tx.product = 'auto_bump' and v_tx.listing_id is not null then
    select coalesce(auto_bump_expires_at, now()) + (v_tx.duration_days || ' days')::interval
      into v_new_expiry
      from public.listings where id = v_tx.listing_id;
    update public.listings
      set auto_bump_active = true, auto_bump_expires_at = v_new_expiry
      where id = v_tx.listing_id;

  elsif v_tx.product = 'turbo' and v_tx.listing_id is not null then
    update public.listings
      set last_bumped_at = now(), bumps_today = 0
      where id = v_tx.listing_id;

  elsif v_tx.product = 'vip_store' then
    select coalesce(vip_store_expires_at, now()) + (v_tx.duration_days || ' days')::interval
      into v_new_expiry
      from public.profiles where id = v_tx.user_id;
    update public.profiles
      set vip_store = true, vip_store_expires_at = v_new_expiry
      where id = v_tx.user_id;
  end if;

  update public.premium_transactions
    set applied_at = now() where id = p_transaction_id;
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- 5) RPC: expire old premiums (called daily by cron)
-- ═══════════════════════════════════════════════════════════════

create or replace function public.expire_premiums()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_count integer;
begin
  with expired as (
    update public.listings
      set is_premium = false
      where is_premium = true and premium_expires_at is not null and premium_expires_at < now()
      returning 1
  )
  select count(*) into v_count from expired;
  return v_count;
end;
$$;
