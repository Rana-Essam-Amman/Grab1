-- 20261065_get_own_phone_rpc.sql
-- Phase 1 of profiles.phone exposure fix.
--
-- Anon currently reads profiles.phone via RLS on active-seller profiles.
-- Fix requires three phases:
--   A) This file: add get_own_phone() RPC (safe to deploy — additive only)
--   B) Frontend: split fetchProfile into public/own paths
--   C) Migration: revoke direct phone access from anon + authenticated
--
-- This file is Phase A. It has zero runtime impact on existing behavior.

begin;

create or replace function public.get_own_phone()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select phone
  from public.profiles
  where id = auth.uid();
$$;

comment on function public.get_own_phone() is
  'Returns the caller''s own phone (auth.uid()). NULL if unauthenticated.';

-- Lock down: no PUBLIC/anon execution. Authenticated only.
revoke execute on function public.get_own_phone() from public, anon, authenticated;
grant execute on function public.get_own_phone() to authenticated;

commit;
