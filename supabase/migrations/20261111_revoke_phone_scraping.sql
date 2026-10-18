-- ============================================================================
-- Security Fix: Prevent PII Scraping via Rate-Limiting
-- 1. Create a table to log phone reveals.
-- 2. Create a rate-limited RPC (Max 20 per 24h).
-- 3. Revoke direct column access to force using the RPC.
-- ============================================================================

begin;

-- 1. Create log table
create table if not exists public.phone_reveal_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  revealed_at timestamptz default now()
);

-- Enable RLS (no one can read this table directly)
alter table public.phone_reveal_logs enable row level security;

-- 2. Create the secure, rate-limited RPC
create or replace function public.get_listing_phone(p_listing_id uuid)
returns text
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_phone text;
  v_reveal_count int;
begin
  -- Check rate limit (Max 20 reveals per 24 hours)
  select count(*) into v_reveal_count
  from public.phone_reveal_logs
  where user_id = auth.uid() and revealed_at > now() - interval '24 hours';

  if v_reveal_count >= 20 then
    raise exception 'RATE_LIMIT_EXCEEDED' using errcode = 'P0001';
  end if;

  -- Get phone
  select seller_phone into v_phone
  from public.listings
  where id = p_listing_id and status = 'active' and is_demo = false;

  -- Log the reveal if phone exists
  if v_phone is not null then
    insert into public.phone_reveal_logs (user_id, listing_id) values (auth.uid(), p_listing_id);
  end if;

  return v_phone;
end;
$$;

revoke execute on function public.get_listing_phone(uuid) from public;
grant execute on function public.get_listing_phone(uuid) to authenticated;

-- 3. Revoke direct column access
revoke select (seller_phone) on public.listings from anon, authenticated;
revoke select on public.premium_transactions from anon;

commit;
