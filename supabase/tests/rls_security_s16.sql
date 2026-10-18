-- rls_security_s16.sql
-- Regression guards for Session 16.
-- Metadata checks only — no rows touched. Rollback at end.

begin;

-- A. Missing triggers are restored
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname='listings_rate_limit'
      and tgrelid='public.listings'::regclass
  ) then
    raise exception 'FAIL A: listings_rate_limit trigger missing';
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname='listings_set_updated_at'
      and tgrelid='public.listings'::regclass
  ) then
    raise exception 'FAIL A: listings_set_updated_at trigger missing';
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname='seller_reviews_set_updated_at'
      and tgrelid='public.seller_reviews'::regclass
  ) then
    raise exception 'FAIL A: seller_reviews_set_updated_at trigger missing';
  end if;

  raise notice 'PASS A: all three restored triggers present';
end $$;

-- B. Messages UPDATE lockdown
do $$
begin
  if has_column_privilege('authenticated', 'public.messages', 'text', 'UPDATE') then
    raise exception 'FAIL B: authenticated has UPDATE on messages.text';
  end if;
  if has_column_privilege('authenticated', 'public.messages', 'conversation_id', 'UPDATE') then
    raise exception 'FAIL B: authenticated has UPDATE on messages.conversation_id';
  end if;
  if has_column_privilege('authenticated', 'public.messages', 'created_at', 'UPDATE') then
    raise exception 'FAIL B: authenticated has UPDATE on messages.created_at';
  end if;
  if has_column_privilege('authenticated', 'public.messages', 'id', 'UPDATE') then
    raise exception 'FAIL B: authenticated has UPDATE on messages.id';
  end if;
  if not has_column_privilege('authenticated', 'public.messages', 'deleted_at', 'UPDATE') then
    raise exception 'FAIL B: authenticated missing UPDATE on messages.deleted_at';
  end if;
  raise notice 'PASS B: messages UPDATE grants locked to deleted_at';
end $$;

-- C. bump_listing RPC has been removed (B.3.2 deprecation)
do $$
declare
  v_exists boolean;
begin
  select exists(
    select 1 from pg_proc
    where proname='bump_listing'
      and pronamespace='public'::regnamespace
  ) into v_exists;

  if v_exists then
    raise exception 'FAIL C: bump_listing should be dropped but still exists';
  end if;

  raise notice 'PASS C: bump_listing RPC was dropped as expected';
end $$;

rollback;
