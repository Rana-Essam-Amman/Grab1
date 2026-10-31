-- HARDENING: Restrict crowdsourced_neighborhoods to authenticated users only
-- Fixes: anon spam, missing input validation, public data leak
-- Safe: idempotent, no data loss

-- 1. REVOKE execute from anon and public
revoke execute on function public.record_neighborhood_usage(text, text, text) from public;
revoke execute on function public.record_neighborhood_usage(text, text, text) from anon;

-- Ensure only authenticated users can call it
grant execute on function public.record_neighborhood_usage(text, text, text) to authenticated;

-- 2. REPLACE function with strict validation
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
begin
  if p_country_code is null or p_city_name is null or p_neighborhood_name is null then
    return;
  end if;

  v_cc := upper(trim(p_country_code));
  v_city := trim(p_city_name);
  v_neigh := trim(p_neighborhood_name);

  if length(v_cc) = 0 or length(v_city) = 0 or length(v_neigh) = 0 then
    return;
  end if;

  if length(v_cc) > 5 then return; end if;
  if length(v_city) > 100 then return; end if;
  if length(v_neigh) > 150 then return; end if;

  if v_cc not in ('JO', 'SA', 'PS', 'LB', 'SY', 'KW') then
    return;
  end if;

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

-- Re-apply grants after replace
revoke execute on function public.record_neighborhood_usage(text, text, text) from public;
revoke execute on function public.record_neighborhood_usage(text, text, text) from anon;
grant execute on function public.record_neighborhood_usage(text, text, text) to authenticated;

-- 3. TIGHTEN RLS: Remove public read access
drop policy if exists "crowdsourced_read_all" on public.crowdsourced_neighborhoods;

comment on function public.record_neighborhood_usage(text, text, text) is
  'SECURITY DEFINER. Requires authentication. Validates country code (whitelist), input length, and trims values. Never blocks on invalid input — silently ignores.';
