-- Universal alias-based attribute matching for listing_passes_filters.
-- This replaces the exact-match logic with alias-aware matching.
-- It accepts attributes with `value` + optional `aliases` array.
-- No data is modified. Only the function logic is updated.

CREATE OR REPLACE FUNCTION public.listing_passes_filters(
  p_row listings,
  p_category_slug text DEFAULT NULL::text,
  p_subcategory_slug text DEFAULT NULL::text,
  p_min_price numeric DEFAULT NULL::numeric,
  p_max_price numeric DEFAULT NULL::numeric,
  p_city text DEFAULT NULL::text,
  p_neighborhood text DEFAULT NULL::text,
  p_attrs jsonb DEFAULT NULL::jsonb
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE PARALLEL SAFE
SET search_path TO 'public'
AS $function$
  SELECT
    (p_category_slug IS NULL OR p_row.category_slug = p_category_slug)
    AND (p_subcategory_slug IS NULL OR p_row.subcategory_slug = p_subcategory_slug)
    AND (
      (p_min_price IS NULL AND p_max_price IS NULL)
      OR (
        (nullif(regexp_replace(coalesce(p_row.price, ''), '[^0-9.]', '', 'g'), '')::numeric) IS NOT NULL
        AND (p_min_price IS NULL OR (nullif(regexp_replace(coalesce(p_row.price, ''), '[^0-9.]', '', 'g'), '')::numeric) >= p_min_price)
        AND (p_max_price IS NULL OR (nullif(regexp_replace(coalesce(p_row.price, ''), '[^0-9.]', '', 'g'), '')::numeric) <= p_max_price)
      )
    )
    AND (
      p_city IS NULL
      OR lower(coalesce(p_row.city, '')) = lower(p_city)
    )
    AND (
      p_neighborhood IS NULL
      OR lower(coalesce(p_row.neighborhood, '')) LIKE '%' || lower(p_neighborhood) || '%'
      OR lower(coalesce(p_row.city, '')) LIKE '%' || lower(p_neighborhood) || '%'
      OR lower(p_neighborhood) LIKE '%' || lower(coalesce(p_row.neighborhood, '')) || '%'
      OR lower(p_neighborhood) LIKE '%' || lower(coalesce(p_row.city, '')) || '%'
    )
    AND (
      p_attrs IS NULL
      OR jsonb_array_length(coalesce(p_attrs, '[]'::jsonb)) = 0
      OR NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(p_attrs) AS req
        WHERE NOT EXISTS (
          SELECT 1
          FROM jsonb_array_elements(coalesce(p_row.attributes, '[]'::jsonb)) AS att
          WHERE att->>'key' = req->>'key'
            AND (
              -- Primary match: exact value equality
              att->>'value' = req->>'value'
              -- Alias match: any alias in req.aliases equals stored value (case-insensitive, trimmed)
              OR (
                req ? 'aliases'
                AND jsonb_typeof(req->'aliases') = 'array'
                AND EXISTS (
                  SELECT 1
                  FROM jsonb_array_elements_text(req->'aliases') AS alias
                  WHERE lower(trim(alias)) = lower(trim(att->>'value'))
                )
              )
            )
        )
      )
    );
$function$;
