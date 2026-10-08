-- 20261015_listings_fts.sql: Full-text search on listings.
create extension if not exists unaccent;

create or replace function public.normalize_arabic(t text)
returns text language sql immutable as $$
  select regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(unaccent(lower(coalesce(t, ''))), U&'[\064B-\065F\0670]', '', 'g'),
        '[أإآا]', 'ا', 'g'
      ),
      '[ىي]', 'ي', 'g'
    ),
    'ة', 'ه', 'g'
  );
$$;

alter table public.listings add column if not exists search_text text;

update public.listings
  set search_text = public.normalize_arabic(
    coalesce(title, '') || ' ' || coalesce(description, '') || ' ' ||
    coalesce(city, '') || ' ' || coalesce(neighborhood, '')
  )
  where search_text is null;

alter table public.listings
  add column if not exists fts tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(search_text, '')), 'A')
  ) stored;

create index if not exists listings_fts_idx on public.listings using gin(fts);

create or replace function public.search_listings(
  p_query text,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns setof public.listings
language sql security definer set search_path to 'public' as $$
  with q as (
    select websearch_to_tsquery('simple', public.normalize_arabic(p_query)) as query
  )
  select l.*
  from public.listings l, q
  where l.status = 'active'
    and (p_market is null or l.country_code = upper(p_market))
    and l.fts @@ q.query
  order by ts_rank_cd(l.fts, q.query) desc, l.created_at desc
  limit greatest(1, least(p_limit, 100))
  offset greatest(0, p_offset);
$$;

create or replace function public.set_listings_search_text()
returns trigger language plpgsql as $$
begin
  new.search_text := public.normalize_arabic(
    coalesce(new.title, '') || ' ' ||
    coalesce(new.description, '') || ' ' ||
    coalesce(new.city, '') || ' ' ||
    coalesce(new.neighborhood, '')
  );
  return new;
end;
$$;

drop trigger if exists listings_search_text_sync on public.listings;
create trigger listings_search_text_sync
  before insert or update of title, description, city, neighborhood
  on public.listings
  for each row execute function public.set_listings_search_text();
