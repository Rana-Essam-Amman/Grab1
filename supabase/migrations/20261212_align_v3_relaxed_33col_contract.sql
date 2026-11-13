-- ============================================================================
-- 20261212 — Align search_listings_v3_relaxed to the 33-column production
-- contract used by search_listings_v2_intent_typo.
--
-- 20261089 declared RETURNS SETOF public.listings and selected l.* from
-- search_listings_v2_intent_typo. After 20261210 that function returns an
-- explicit 33-column TABLE, so the SETOF path fails with:
--   Number of returned columns (33) does not match expected column count (36).
--
-- DROP + CREATE is required because PostgreSQL forbids changing the return
-- type via CREATE OR REPLACE. No CASCADE is used.
-- Both result paths project the same 33 columns with NULL::text AS seller_phone.
-- Filters, ranking, pagination, subset selection, and grants are unchanged.
-- ============================================================================

BEGIN;

DROP FUNCTION IF EXISTS public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
);

CREATE FUNCTION public.search_listings_v3_relaxed(
  p_query text,
  p_market text DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_category_slug text DEFAULT NULL,
  p_subcategory_slug text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_neighborhood text DEFAULT NULL,
  p_attrs jsonb DEFAULT NULL
)
RETURNS TABLE(
  id uuid, user_id uuid, title text, description text, price text, currency text,
  country_code text, city text, neighborhood text, category_slug text,
  subcategory_slug text, images text[], attributes jsonb, status text, views integer,
  seller_name text, seller_phone text, created_at timestamptz, updated_at timestamptz,
  bumps_today integer, bumps_reset_date date, is_premium boolean,
  premium_expires_at timestamptz, auto_bump_active boolean, auto_bump_expires_at timestamptz,
  image_width integer, image_height integer, search_text text, fts tsvector,
  search_chars text[], search_version integer, last_bumped_at timestamptz, is_demo boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_subset record;
  v_meaningful_count integer;
  v_has_any boolean;
BEGIN
  v_norm := btrim(
    public.normalize_search_text(coalesce(p_query, ''))
  );

  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  SELECT count(*) INTO v_meaningful_count
  FROM regexp_split_to_table(v_norm, '[[:space:]]+') AS s(token)
  WHERE length(public.normalize_search_text(s.token)) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM public.search_stopwords w
      WHERE public.normalize_search_text(w.word) =
            public.normalize_search_text(s.token)
    );

  IF v_meaningful_count = 0 THEN
    RETURN;
  END IF;

  -- >5 meaningful tokens: delegate to v2_intent_typo (already 33-col, masked).
  IF v_meaningful_count > 5 THEN
    RETURN QUERY
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug, l.subcategory_slug,
      l.images, l.attributes, l.status, l.views, l.seller_name,
      NULL::text AS seller_phone,
      l.created_at, l.updated_at, l.bumps_today, l.bumps_reset_date,
      l.is_premium, l.premium_expires_at, l.auto_bump_active, l.auto_bump_expires_at,
      l.image_width, l.image_height, l.search_text, l.fts, l.search_chars,
      l.search_version, l.last_bumped_at, l.is_demo
    FROM public.search_listings_v2_intent_typo(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    ) AS l;
    RETURN;
  END IF;

  -- 1-5 meaningful tokens: progressive relaxation. First non-empty subset wins.
  FOR v_subset IN
    SELECT s.attempt_no, s.subset_tokens
    FROM public.search_relaxed_subsets(v_norm) AS s
    ORDER BY s.attempt_no
  LOOP
    SELECT EXISTS (
      SELECT 1
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND public.listing_passes_filters(
          l, p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs
        )
        AND NOT EXISTS (
          SELECT 1
          FROM unnest(v_subset.subset_tokens) AS required(token)
          WHERE strpos(
            public.normalize_search_text(coalesce(l.search_text, '')),
            public.normalize_search_text(required.token)
          ) = 0
        )
    ) INTO v_has_any;

    IF v_has_any THEN
      RETURN QUERY
      SELECT
        l.id, l.user_id, l.title, l.description, l.price, l.currency,
        l.country_code, l.city, l.neighborhood, l.category_slug, l.subcategory_slug,
        l.images, l.attributes, l.status, l.views, l.seller_name,
        NULL::text AS seller_phone,
        l.created_at, l.updated_at, l.bumps_today, l.bumps_reset_date,
        l.is_premium, l.premium_expires_at, l.auto_bump_active, l.auto_bump_expires_at,
        l.image_width, l.image_height, l.search_text, l.fts, l.search_chars,
        l.search_version, l.last_bumped_at, l.is_demo
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND public.listing_passes_filters(
          l, p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs
        )
        AND NOT EXISTS (
          SELECT 1
          FROM unnest(v_subset.subset_tokens) AS required(token)
          WHERE strpos(
            public.normalize_search_text(coalesce(l.search_text, '')),
            public.normalize_search_text(required.token)
          ) = 0
        )
      ORDER BY l.created_at DESC, l.id ASC
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END LOOP;

  RETURN;
END;
$function$;

COMMENT ON FUNCTION public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) IS
  'Progressive relaxation RPC. 33-column contract matching search_listings_v2_intent_typo. seller_phone is always NULL.';

GRANT EXECUTE ON FUNCTION public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;
