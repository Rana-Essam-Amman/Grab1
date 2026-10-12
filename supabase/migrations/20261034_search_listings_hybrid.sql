-- 20261034_search_listings_hybrid.sql
-- Reciprocal Rank Fusion (RRF) over FTS + semantic candidates.
--
-- Each path is fetched independently, then combined by rank (not raw score):
--     rrf_score(d) = Σ 1 / (k + rank_i(d))
-- with k = 60 (OpenSearch default).
--
-- Uses row_number() over () instead of WITH ORDINALITY — the latter binds
-- the first composite column to a scalar alias, causing PostgREST error
-- 42809 ("column notation .id applied to type uuid").
--
-- Safe properties:
--   - Zero changes to search_listings or search_listings_semantic.
--   - Read-only (STABLE + SECURITY DEFINER + search_path locked).
--   - Degrades to FTS-only when p_query_vector is NULL.
--   - Deterministic tie-break by created_at DESC, id ASC.

create or replace function public.search_listings_hybrid(
  p_query text,
  p_query_vector extensions.vector(384) default null,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0,
  p_max_distance float8 default 0.85
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
      select * from public.search_listings(p_query, p_market, v_limit, v_offset);
    return;
  end if;

  return query
  with
    fts_ranked as (
      select f.id as listing_id,
             row_number() over () as rank_fts
      from public.search_listings(p_query, p_market, v_fetch, 0) as f
    ),
    sem_ranked as (
      select s.id as listing_id,
             row_number() over () as rank_sem
      from public.search_listings_semantic(
        p_query_vector, p_market, v_fetch, 0, p_max_distance
      ) as s
    ),
    fused as (
      select
        coalesce(f.listing_id, s.listing_id) as listing_id,
        (
          case when f.rank_fts is not null
               then 1.0 / (v_rrf_k + f.rank_fts)
               else 0.0 end
          +
          case when s.rank_sem is not null
               then 1.0 / (v_rrf_k + s.rank_sem)
               else 0.0 end
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
  text, extensions.vector, text, integer, integer, float8
) is
  'RRF hybrid search: FTS + semantic fused by rank (k=60). FTS-only when vector is null.';

grant execute on function public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8
) to anon, authenticated;
