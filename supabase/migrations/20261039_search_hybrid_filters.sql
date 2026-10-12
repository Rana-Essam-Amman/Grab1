-- 20261039_search_hybrid_filters.sql
-- Extends search_listings_hybrid with the same filter params that
-- search_listings already supports. Filters are applied to both the FTS
-- branch and the semantic branch before RRF fusion.
--
-- Signature grows from 7 args to 12 args. All new params default NULL,
-- so existing callers keep working (Postgres resolves positional calls
-- to the defaults).

drop function if exists public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text
);

create or replace function public.search_listings_hybrid(
  p_query text,
  p_query_vector extensions.vector(384) default null,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0,
  p_max_distance float8 default 0.85,
  p_category_hint text default null,
  p_category_slug text default null,
  p_subcategory_slug text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_city text default null,
  p_neighborhood text default null,
  p_attrs jsonb default null
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
  v_effective_category text := coalesce(p_category_slug, p_category_hint);
begin
  if p_query_vector is null then
    return query
      select l.*
      from public.search_listings(
        p_query, p_market, v_limit, v_offset,
        v_effective_category, p_subcategory_slug,
        p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
      ) as l;
    return;
  end if;

  return query
  with
    fts_ranked as (
      select f.id as listing_id,
             row_number() over () as rank_fts
      from public.search_listings(
        p_query, p_market, v_fetch, 0,
        v_effective_category, p_subcategory_slug,
        p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
      ) as f
    ),
    sem_ranked as (
      select s.id as listing_id,
             row_number() over () as rank_sem
      from public.search_listings_semantic(
        p_query_vector, p_market, v_fetch, 0, p_max_distance
      ) as s
      where public.listing_passes_filters(
        s,
        v_effective_category, p_subcategory_slug,
        p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
      )
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
  text, extensions.vector, text, integer, integer, float8, text,
  text, text, numeric, numeric, text, text, jsonb
) is
  'RRF hybrid search with full server-side filters. FTS-only when vector is null.';

grant execute on function public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text,
  text, text, numeric, numeric, text, text, jsonb
) to anon, authenticated;
