-- 20261066_revoke_profiles_phone.sql
-- Close the profiles.phone exposure confirmed in Session 15 audit.
--
-- Anon could read profiles.phone for active-seller profiles via the
-- profiles_read_self_or_active_sellers policy. Live test showed a real
-- phone number was exposed. Phase A added get_own_phone() RPC; Phase B
-- split the frontend service; Phase C (this file) removes direct column
-- access entirely.
--
-- Column lists are computed dynamically to handle schema drift: some
-- columns (feed_layout, browse_market, vip_store, vip_store_expires_at,
-- rating_avg, rating_count) exist in production but not in the CI
-- migration chain.

begin;

-- 1. Revoke table-level SELECT
revoke select on table public.profiles from public, anon, authenticated;

-- 2-4. Revoke column-level SELECT/INSERT/UPDATE, computed from the live
--      column list so missing (drifted) columns don't abort the migration.
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(column_name), ', ')
  into v_cols
  from information_schema.columns
  where table_schema = 'public' and table_name = 'profiles';

  if v_cols is not null then
    execute format('revoke select (%s) on table public.profiles from public, anon, authenticated', v_cols);
    execute format('revoke insert (%s) on table public.profiles from anon', v_cols);
    execute format('revoke update (%s) on table public.profiles from anon', v_cols);
  end if;
end $$;

-- 5. anon: revoke table-level INSERT/UPDATE/DELETE
revoke insert, update, delete on table public.profiles from anon;

-- 6. authenticated: revoke table-level DELETE
revoke delete on table public.profiles from authenticated;

-- 7. anon: grant minimal public SELECT columns (guarded for drift)
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(c), ', ')
  into v_cols
  from unnest(array['id', 'nickname', 'avatar_url', 'rating_avg', 'rating_count', 'vip_store']) as c
  where exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = c
  );

  if v_cols is not null then
    execute format('grant select (%s) on table public.profiles to anon', v_cols);
  end if;
end $$;

-- 8. authenticated: grant SELECT on all columns EXCEPT phone (guarded)
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(c), ', ')
  into v_cols
  from unnest(array[
    'id', 'first_name', 'last_name', 'nickname', 'avatar_url',
    'country_code', 'phone_locked', 'feed_layout', 'browse_market',
    'rating_avg', 'rating_count', 'vip_store', 'vip_store_expires_at',
    'created_at', 'updated_at'
  ]) as c
  where exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = c
  );

  if v_cols is not null then
    execute format('grant select (%s) on table public.profiles to authenticated', v_cols);
  end if;
end $$;

-- 9. Default privileges: fix for postgres on public schema
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all privileges on tables from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all privileges on sequences from public, anon, authenticated;

commit;
