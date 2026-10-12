create or replace function public.search_listings_semantic(
  p_query_vector extensions.vector(384),
  p_market text,
  p_limit integer,
  p_offset integer
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
  order by
    lse.embedding operator(extensions.<=>) p_query_vector,
    l.created_at desc
  limit greatest(coalesce(p_limit, 20), 1)
  offset greatest(coalesce(p_offset, 0), 0);
$function$;

comment on function public.search_listings_semantic(
  extensions.vector,
  text,
  integer,
  integer
) is
  'Pure SQL semantic listing search using cached 384-dimensional embeddings.';

grant execute on function public.search_listings_semantic(
  extensions.vector,
  text,
  integer,
  integer
) to anon, authenticated;
