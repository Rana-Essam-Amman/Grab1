-- 20261033_search_semantic_threshold.sql
-- Adds a max_distance parameter to search_listings_semantic.
-- When set, results with cosine distance greater than the threshold are
-- excluded. This prevents the "Kia → كلب" failure mode where the RPC
-- returns top-N regardless of relevance.
--
-- Backward compatible: default NULL means "no threshold" (old behavior).

create or replace function public.search_listings_semantic(
  p_query_vector extensions.vector(384),
  p_market text,
  p_limit integer,
  p_offset integer,
  p_max_distance float8 default null
)
returns setof public.listings
language sql
stable
security definer
set search_path = public
as $function$
  select l.*
  from public.listings as l
  join public.listing_search_embeddings as lse
    on lse.listing_id = l.id
  where l.status = 'active'
    and (
      p_market is null
      or l.country_code = upper(p_market)
    )
    and (
      p_max_distance is null
      or (lse.embedding operator(extensions.<=>) p_query_vector) <= p_max_distance
    )
  order by
    lse.embedding operator(extensions.<=>) p_query_vector,
    l.created_at desc
  limit greatest(coalesce(p_limit, 20), 1)
  offset greatest(coalesce(p_offset, 0), 0);
$function$;

comment on function public.search_listings_semantic(
  extensions.vector, text, integer, integer, float8
) is
  'Pure SQL semantic search. Optional p_max_distance cuts weakly-related results.';

grant execute on function public.search_listings_semantic(
  extensions.vector, text, integer, integer, float8
) to anon, authenticated;
