-- 20261066_revoke_profiles_phone.sql
-- Close the profiles.phone exposure confirmed in Session 15 audit.
--
-- Anon could read profiles.phone for active-seller profiles via the
-- profiles_read_self_or_active_sellers policy. Live test showed a real
-- phone number was exposed. Phase A added get_own_phone() RPC; Phase B
-- split the frontend service; Phase C (this file) removes the direct
-- column access entirely.

begin;

-- 1. Revoke table-level SELECT from all roles
revoke select on table public.profiles from public, anon, authenticated;

-- 2. Revoke column-level SELECT on all 16 columns
revoke select (
  id, first_name, last_name, phone, avatar_url, country_code,
  created_at, updated_at, phone_locked, nickname, feed_layout,
  rating_avg, rating_count, browse_market, vip_store, vip_store_expires_at
) on table public.profiles from public, anon, authenticated;

-- 3. anon: revoke column-level INSERT
revoke insert (
  id, first_name, last_name, phone, avatar_url, country_code,
  created_at, updated_at, phone_locked, nickname, feed_layout,
  rating_avg, rating_count, browse_market, vip_store, vip_store_expires_at
) on table public.profiles from anon;

-- 4. anon: revoke column-level UPDATE
revoke update (
  id, first_name, last_name, phone, avatar_url, country_code,
  created_at, updated_at, phone_locked, nickname, feed_layout,
  rating_avg, rating_count, browse_market, vip_store, vip_store_expires_at
) on table public.profiles from anon;

-- 5. anon: revoke table-level INSERT/UPDATE/DELETE
revoke insert, update, delete on table public.profiles from anon;

-- 6. authenticated: revoke table-level DELETE
--    (handleDeleteAccount in useProfileActions.ts is localStorage-only)
revoke delete on table public.profiles from authenticated;

-- 7. anon: grant minimal public SELECT columns
grant select (
  id, nickname, avatar_url, rating_avg, rating_count, vip_store
) on table public.profiles to anon;

-- 8. authenticated: grant SELECT on all columns EXCEPT phone
grant select (
  id, first_name, last_name, nickname, avatar_url, country_code,
  phone_locked, feed_layout, browse_market, rating_avg, rating_count,
  vip_store, vip_store_expires_at, created_at, updated_at
) on table public.profiles to authenticated;

-- 9. Default privileges: fix for postgres on public schema
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all privileges on tables from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all privileges on sequences from public, anon, authenticated;

commit;
