-- 20261037_search_filter_helper.sql
-- Shared filter predicate used by search RPCs.
-- Mirrors the semantics of src/shared/lib/filterListings.ts on the client.
-- IMMUTABLE + PARALLEL SAFE — no table reads, pure input → boolean.

create or replace function public.listing_passes_filters(
  p_row public.listings,
  p_category_slug text default null,
  p_subcategory_slug text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_city text default null,
  p_neighborhood text default null,
  p_attrs jsonb default null
)
returns boolean
language sql
immutable
parallel safe
as $func$
  select
    (p_category_slug is null or p_row.category_slug = p_category_slug)
    and (p_subcategory_slug is null or p_row.subcategory_slug = p_subcategory_slug)
    and (
      (p_min_price is null and p_max_price is null)
      or (
        (nullif(regexp_replace(coalesce(p_row.price, ''), '[^0-9.]', '', 'g'), '')::numeric) is not null
        and (p_min_price is null or (nullif(regexp_replace(coalesce(p_row.price, ''), '[^0-9.]', '', 'g'), '')::numeric) >= p_min_price)
        and (p_max_price is null or (nullif(regexp_replace(coalesce(p_row.price, ''), '[^0-9.]', '', 'g'), '')::numeric) <= p_max_price)
      )
    )
    and (
      p_city is null
      or lower(coalesce(p_row.city, '')) = lower(p_city)
    )
    and (
      p_neighborhood is null
      or lower(coalesce(p_row.neighborhood, '')) like '%' || lower(p_neighborhood) || '%'
      or lower(coalesce(p_row.city, '')) like '%' || lower(p_neighborhood) || '%'
      or lower(p_neighborhood) like '%' || lower(coalesce(p_row.neighborhood, '')) || '%'
      or lower(p_neighborhood) like '%' || lower(coalesce(p_row.city, '')) || '%'
    )
    and (
      p_attrs is null
      or jsonb_array_length(coalesce(p_attrs, '[]'::jsonb)) = 0
      or not exists (
        select 1
        from jsonb_array_elements(p_attrs) as req
        where not exists (
          select 1
          from jsonb_array_elements(coalesce(p_row.attributes, '[]'::jsonb)) as att
          where att->>'key' = req->>'key' and att->>'value' = req->>'value'
        )
      )
    );
$func$;

comment on function public.listing_passes_filters is
  'Shared filter predicate for search RPCs. Mirrors filterListings.ts.';

grant execute on function public.listing_passes_filters(
  public.listings, text, text, numeric, numeric, text, text, jsonb
) to anon, authenticated;
