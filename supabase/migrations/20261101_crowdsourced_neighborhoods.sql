-- Crowdsourcing: Track neighborhoods users select from Live Search
-- Purpose: Aggregate popular neighborhoods over time to promote to static data
-- Safe: Additive only, no existing tables modified

create table if not exists public.crowdsourced_neighborhoods (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  city_name text not null,
  neighborhood_name text not null,
  usage_count int not null default 1,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  promoted_to_static boolean not null default false,
  unique (country_code, city_name, neighborhood_name)
);

create index if not exists idx_crowdsourced_neighborhoods_promo
  on public.crowdsourced_neighborhoods (promoted_to_static, usage_count desc);

create index if not exists idx_crowdsourced_neighborhoods_country
  on public.crowdsourced_neighborhoods (country_code, usage_count desc);

alter table public.crowdsourced_neighborhoods enable row level security;

-- Public read (for future aggregation API)
drop policy if exists "crowdsourced_read_all" on public.crowdsourced_neighborhoods;
create policy "crowdsourced_read_all"
  on public.crowdsourced_neighborhoods
  for select using (true);

-- Atomic upsert-increment RPC
create or replace function public.record_neighborhood_usage(
  p_country_code text,
  p_city_name text,
  p_neighborhood_name text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Defensive: skip empty inputs
  if p_country_code is null or p_city_name is null or p_neighborhood_name is null
     or length(trim(p_country_code)) = 0
     or length(trim(p_city_name)) = 0
     or length(trim(p_neighborhood_name)) = 0 then
    return;
  end if;

  insert into public.crowdsourced_neighborhoods
    (country_code, city_name, neighborhood_name, usage_count)
  values
    (trim(p_country_code), trim(p_city_name), trim(p_neighborhood_name), 1)
  on conflict (country_code, city_name, neighborhood_name)
  do update set
    usage_count = public.crowdsourced_neighborhoods.usage_count + 1,
    last_seen = now();
end;
$$;

grant execute on function public.record_neighborhood_usage(text, text, text)
  to anon, authenticated;

comment on table public.crowdsourced_neighborhoods is
  'Tracks neighborhood selections from Live Search. Once usage_count > 100, neighborhoods can be promoted to static .geo.ts files.';
