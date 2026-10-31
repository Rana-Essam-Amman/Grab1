-- ANONYMOUS GUARD: Reject anonymous-authenticated sessions at DB level
-- Supabase assigns the `authenticated` role to both real users AND anonymous sign-ins.
-- The SQL grants from the hardening migration are NOT enough on their own.
-- This migration adds an in-function check using auth.jwt()->>'is_anonymous'.
-- Idempotent: safe to re-run.

create or replace function public.record_neighborhood_usage(
  p_country_code text,
  p_city_name text,
  p_neighborhood_name text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cc text;
  v_city text;
  v_neigh text;
  v_is_anon boolean;
begin
  -- 1. Reject anonymous-authenticated sessions (Supabase sets is_anonymous=true)
  v_is_anon := coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
  if v_is_anon = true then
    return;
  end if;

  -- 2. Null guard
  if p_country_code is null or p_city_name is null or p_neighborhood_name is null then
    return;
  end if;

  -- 3. Trim inputs
  v_cc := upper(trim(p_country_code));
  v_city := trim(p_city_name);
  v_neigh := trim(p_neighborhood_name);

  -- 4. Empty guard
  if length(v_cc) = 0 or length(v_city) = 0 or length(v_neigh) = 0 then
    return;
  end if;

  -- 5. Length limits
  if length(v_cc) > 5 then return; end if;
  if length(v_city) > 100 then return; end if;
  if length(v_neigh) > 150 then return; end if;

  -- 6. Country whitelist
  if v_cc not in ('JO', 'SA', 'PS', 'LB', 'SY', 'KW') then
    return;
  end if;

  -- 7. Atomic upsert-increment
  insert into public.crowdsourced_neighborhoods
    (country_code, city_name, neighborhood_name, usage_count)
  values
    (v_cc, v_city, v_neigh, 1)
  on conflict (country_code, city_name, neighborhood_name)
  do update set
    usage_count = public.crowdsourced_neighborhoods.usage_count + 1,
    last_seen = now();
end;
$$;

-- Re-apply grants (idempotent — preserves hardened state)
revoke execute on function public.record_neighborhood_usage(text, text, text) from public;
revoke execute on function public.record_neighborhood_usage(text, text, text) from anon;
grant execute on function public.record_neighborhood_usage(text, text, text) to authenticated;

comment on function public.record_neighborhood_usage(text, text, text) is
  'SECURITY DEFINER. Rejects anonymous-authenticated sessions via auth.jwt()->>is_anonymous. Requires real authenticated users only. Validates country whitelist + input length. Silent on invalid input.';
