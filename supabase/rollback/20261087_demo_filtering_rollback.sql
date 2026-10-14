-- ROLLBACK for migration 20261087. DO NOT run unless production regression is confirmed.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

DO $safety$
DECLARE
  v_qual text;
BEGIN
  SELECT qual
  INTO v_qual
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'listings'
    AND policyname = 'listings_select_public_or_owner';

  IF v_qual IS NULL OR position('is_demo' IN lower(v_qual)) = 0 THEN
    RAISE EXCEPTION
      'Rollback refused: current listings_select_public_or_owner policy does not contain is_demo; migration may not be applied';
  END IF;
END
$safety$;

DROP POLICY IF EXISTS listings_select_public_or_owner
ON public.listings;

CREATE POLICY listings_select_public_or_owner
ON public.listings
FOR SELECT
TO public
USING (
  (status = 'active')
  OR (auth.uid() = user_id)
);

CREATE OR REPLACE FUNCTION public.listing_passes_filters(
  p_row public.listings,
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
IMMUTABLE
PARALLEL SAFE
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
            AND att->>'value' = req->>'value'
        )
      )
    );
$function$;

CREATE OR REPLACE FUNCTION public.search_listings_semantic(
  p_query_vector extensions.vector,
  p_market text,
  p_limit integer,
  p_offset integer,
  p_max_distance double precision DEFAULT NULL::double precision
)
RETURNS SETOF public.listings
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT l.*
  FROM public.listings AS l
  JOIN public.listing_search_embeddings AS lse
    ON lse.listing_id = l.id
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND (
      p_max_distance IS NULL
      OR (lse.embedding OPERATOR(extensions.<=>) p_query_vector) <= p_max_distance
    )
  ORDER BY
    lse.embedding OPERATOR(extensions.<=>) p_query_vector,
    l.created_at DESC
  LIMIT greatest(coalesce(p_limit, 20), 1)
  OFFSET greatest(coalesce(p_offset, 0), 0);
$function$;

CREATE OR REPLACE FUNCTION public.listings_by_seller(
  p_seller_key text,
  p_market text DEFAULT NULL::text,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS SETOF public.listings
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_key text;
  v_is_uuid boolean;
  v_user_ids uuid[];
BEGIN
  v_key := btrim(coalesce(p_seller_key, ''));
  IF v_key = '' THEN
    RETURN;
  END IF;

  v_is_uuid := v_key ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

  IF v_is_uuid THEN
    RETURN QUERY
    SELECT l.*
    FROM public.listings l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.user_id = v_key::uuid
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Phone key: find every user_id that ever used this phone.
  SELECT array_agg(DISTINCT l.user_id)
  INTO v_user_ids
  FROM public.listings l
  WHERE l.seller_phone = v_key
    AND l.user_id IS NOT NULL;

  IF v_user_ids IS NOT NULL AND array_length(v_user_ids, 1) > 0 THEN
    RETURN QUERY
    SELECT l.*
    FROM public.listings l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.user_id = ANY(v_user_ids)
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- No user_id found (orphan phone): fall back to direct match.
  RETURN QUERY
  SELECT l.*
  FROM public.listings l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND l.seller_phone = v_key
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

COMMIT;
