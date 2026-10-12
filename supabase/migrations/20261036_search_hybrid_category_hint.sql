-- 20261036_search_hybrid_category_hint.sql
-- Adds an optional p_category_hint to search_listings_hybrid.
--
-- When the frontend detects a query's implied category (via
-- detect_query_category from 20261035), it passes that as p_category_hint
-- so FTS and semantic results are narrowed to that vertical. Solves the
-- "سيارات returns villa" case: villa mentions "3 سيارات" (parking) in the
-- description, but it is not a car.
--
-- Safe: p_category_hint defaults to NULL, preserving the previous behavior
-- when the caller does not pass it.

drop function if exists public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8
);

create or replace function public.search_listings_hybrid(
  p_query text,
  p_query_vector extensions.vector(384) default null,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0,
  p_max_distance float8 default 0.85,
  p_category_hint text default null
)
returns setof public.listings
language plpgsql
stable
security definer
set search_path = public
as $function$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_rrf_k constant integer := 60;
  v_fetch integer := least(greatest(v_limit * 3, 30), 100);
begin
  if p_query_vector is null then
    return query
      select l.*
      from public.search_listings(p_query, p_market, v_limit, v_offset) as l
      where (p_category_hint is null or l.category_slug = p_category_hint);
    return;
  end if;

  return query
  with
    fts_ranked as (
      select f.id as listing_id,
             row_number() over () as rank_fts
      from public.search_listings(p_query, p_market, v_fetch, 0) as f
      where (p_category_hint is null or f.category_slug = p_category_hint)
    ),
    sem_ranked as (
      select s.id as listing_id,
             row_number() over () as rank_sem
      from public.search_listings_semantic(
        p_query_vector, p_market, v_fetch, 0, p_max_distance
      ) as s
      where (p_category_hint is null or s.category_slug = p_category_hint)
    ),
    fused as (
      select
        coalesce(f.listing_id, s.listing_id) as listing_id,
        (
          case when f.rank_fts is not null then 1.0 / (v_rrf_k + f.rank_fts) else 0.0 end
          +
          case when s.rank_sem is not null then 1.0 / (v_rrf_k + s.rank_sem) else 0.0 end
        )::float8 as rrf_score
      from fts_ranked f
      full outer join sem_ranked s on f.listing_id = s.listing_id
    )
  select l.*
  from fused
  join public.listings l on l.id = fused.listing_id
  order by fused.rrf_score desc, l.created_at desc, l.id asc
  limit v_limit
  offset v_offset;
end;
$function$;

comment on function public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text
) is
  'RRF hybrid search with optional category hint filter. FTS-only when vector is null.';

grant execute on function public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text
) to anon, authenticated;
