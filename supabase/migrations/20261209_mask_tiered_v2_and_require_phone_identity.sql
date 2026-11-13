-- ============================================================================
-- Forward-only phone masking for search_listings_v4_tiered_v2.
--
-- 20261110 and 20261205 are restored to their original history. 20261205's
-- location and tier-2 selection behavior is unchanged. 20261203 already
-- masks search_listings_v4_exact, and 20261205's slug path already returns
-- NULL seller_phone. tiered_v2 is the remaining public RPC from that
-- history that still projects the stored phone on its similar-category
-- insert and its final RETURN QUERY. Signature, filters, ordering, and
-- grants are unchanged.
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered_v2(
  p_query text,
  p_market text DEFAULT NULL::text,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_category_slug text DEFAULT NULL::text,
  p_subcategory_slug text DEFAULT NULL::text,
  p_min_price numeric DEFAULT NULL::numeric,
  p_max_price numeric DEFAULT NULL::numeric,
  p_city text DEFAULT NULL::text,
  p_neighborhood text DEFAULT NULL::text,
  p_attrs jsonb DEFAULT NULL::jsonb,
  p_tier2_limit integer DEFAULT 5
)
RETURNS TABLE(
  id uuid, user_id uuid, title text, description text, price text, currency text,
  country_code text, city text, neighborhood text, category_slug text,
  subcategory_slug text, images text[], attributes jsonb, status text, views integer,
  seller_name text, seller_phone text, created_at timestamptz, updated_at timestamptz,
  is_demo boolean, match_kind text, matched_tokens text[], total_matched_tokens integer,
  tier integer, tier_reason text, rank_in_tier integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
#variable_conflict use_column
DECLARE
  v_norm_query text;
  v_tier1_ids uuid[] := ARRAY[]::uuid[];
  v_tier2_ids_c1 uuid[] := ARRAY[]::uuid[];
  v_excluded_ids uuid[] := ARRAY[]::uuid[];
  v_tier2_category text;
  v_top_tier1_subcategory text;
  v_top_tier1_city text;
  v_median_tier1_price numeric;
  v_has_tier1 boolean := false;
  v_tier2_limit_clamped integer;
BEGIN
  IF NOT public.query_has_meaningful_tokens(coalesce(p_query, '')) THEN
    RETURN;
  END IF;

  v_norm_query := btrim(public.normalize_search_text(coalesce(p_query, '')));
  v_norm_query := translate(v_norm_query, 'یک', 'يك');
  v_tier2_limit_clamped := least(greatest(coalesce(p_tier2_limit, 5), 0), 5);

  DROP TABLE IF EXISTS pg_temp._c2_c1_rows;
  CREATE TEMP TABLE _c2_c1_rows (
    id uuid, user_id uuid, title text, description text, price text, currency text,
    country_code text, city text, neighborhood text, category_slug text,
    subcategory_slug text, images text[], attributes jsonb, status text, views integer,
    seller_name text, seller_phone text, created_at timestamptz, updated_at timestamptz,
    is_demo boolean, match_kind text, matched_tokens text[], total_matched_tokens integer,
    tier integer, tier_reason text, c1_order integer
  ) ON COMMIT DROP;

  TRUNCATE _c2_c1_rows;

  INSERT INTO _c2_c1_rows (
    id, user_id, title, description, price, currency, country_code, city, neighborhood,
    category_slug, subcategory_slug, images, attributes, status, views, seller_name,
    seller_phone, created_at, updated_at, is_demo, match_kind, matched_tokens,
    total_matched_tokens, tier, tier_reason, c1_order
  )
  SELECT
    c.id, c.user_id, c.title, c.description, c.price, c.currency, c.country_code,
    c.city, c.neighborhood, c.category_slug, c.subcategory_slug, c.images, c.attributes,
    c.status, c.views, c.seller_name, NULL::text AS seller_phone, c.created_at, c.updated_at,
    c.is_demo, c.match_kind, c.matched_tokens, c.total_matched_tokens, c.tier, c.tier_reason,
    row_number() OVER ()::integer
  FROM public.search_listings_v4_tiered(
    p_query, p_market, p_limit, p_offset, p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
  ) c;

  SELECT array_agg(id) FILTER (WHERE tier = 1) INTO v_tier1_ids FROM _c2_c1_rows;
  SELECT array_agg(id) FILTER (WHERE tier = 2) INTO v_tier2_ids_c1 FROM _c2_c1_rows;
  v_tier1_ids := coalesce(v_tier1_ids, ARRAY[]::uuid[]);
  v_tier2_ids_c1 := coalesce(v_tier2_ids_c1, ARRAY[]::uuid[]);
  v_excluded_ids := v_tier1_ids || v_tier2_ids_c1;
  v_has_tier1 := cardinality(v_tier1_ids) > 0;

  IF p_category_slug IS NOT NULL THEN
    v_tier2_category := p_category_slug;
    IF v_has_tier1 THEN
      SELECT subcategory_slug, city
      INTO v_top_tier1_subcategory, v_top_tier1_city
      FROM _c2_c1_rows
      WHERE tier = 1
      ORDER BY c1_order
      LIMIT 1;
    END IF;
  ELSIF v_has_tier1 THEN
    SELECT category_slug, subcategory_slug, city
    INTO v_tier2_category, v_top_tier1_subcategory, v_top_tier1_city
    FROM _c2_c1_rows
    WHERE tier = 1
    ORDER BY c1_order
    LIMIT 1;
  ELSE
    v_tier2_category := public.detect_query_category(v_norm_query);
  END IF;

  SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY price::numeric)
  INTO v_median_tier1_price
  FROM _c2_c1_rows
  WHERE tier = 1 AND price ~ '^[0-9.]+$';

  IF v_tier2_category IS NOT NULL AND v_tier2_limit_clamped > 0 THEN
    INSERT INTO _c2_c1_rows (
      id, user_id, title, description, price, currency, country_code, city, neighborhood,
      category_slug, subcategory_slug, images, attributes, status, views, seller_name,
      seller_phone, created_at, updated_at, is_demo, match_kind, matched_tokens,
      total_matched_tokens, tier, tier_reason, c1_order
    )
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency, l.country_code,
      l.city, l.neighborhood, l.category_slug, l.subcategory_slug, l.images, l.attributes,
      l.status, l.views, l.seller_name, NULL::text AS seller_phone, l.created_at, l.updated_at,
      l.is_demo, 'related'::text, NULL::text[], 0, 2, 'similar_category',
      10000 + row_number() OVER ()::integer
    FROM public.listings l
    WHERE l.status = 'active'
      AND l.is_demo = false
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.category_slug = v_tier2_category
      AND NOT (l.id = ANY(v_excluded_ids))
      AND public.listing_passes_filters(
        l, NULL, NULL, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
      )
    ORDER BY
      CASE WHEN l.subcategory_slug = v_top_tier1_subcategory THEN 0 ELSE 1 END,
      CASE WHEN l.city = v_top_tier1_city THEN 0 ELSE 1 END,
      abs(coalesce(l.price::numeric, 0) - coalesce(v_median_tier1_price, 0)),
      l.created_at DESC, l.id ASC
    LIMIT v_tier2_limit_clamped;
  END IF;

  RETURN QUERY
  SELECT
    r.id, r.user_id, r.title, r.description, r.price, r.currency, r.country_code,
    r.city, r.neighborhood, r.category_slug, r.subcategory_slug, r.images, r.attributes,
    r.status, r.views, r.seller_name, NULL::text AS seller_phone, r.created_at, r.updated_at,
    r.is_demo, r.match_kind, r.matched_tokens, r.total_matched_tokens, r.tier, r.tier_reason,
    row_number() OVER (PARTITION BY r.tier ORDER BY r.c1_order)::integer AS rank_in_tier
  FROM _c2_c1_rows r
  ORDER BY r.tier ASC, r.c1_order ASC;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_v2(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb, integer
) TO anon, authenticated;

-- Preserve verified production get_listing_phone semantics:
-- * Requires auth.uid()
-- * Calls public.is_admin()
-- * 20 reveals / 24h rate limit applies ONLY to non-admins
-- * Admins may reveal active demo listing phones
-- * Non-admins cannot reveal demo listing phones
-- * Successful reveals are logged for both admins and non-admins
-- * authenticated has EXECUTE; anon does not
CREATE OR REPLACE FUNCTION public.get_listing_phone(p_listing_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_phone text;
  v_reveal_count int;
  v_uid uuid;
  v_is_admin boolean;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED' USING ERRCODE = '42501';
  END IF;

  v_is_admin := public.is_admin();

  IF NOT v_is_admin THEN
    PERFORM pg_advisory_xact_lock(hashtext(v_uid::text));

    SELECT count(*) INTO v_reveal_count
    FROM public.phone_reveal_logs
    WHERE user_id = v_uid AND revealed_at > now() - interval '24 hours';

    IF v_reveal_count >= 20 THEN
      RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED' USING ERRCODE = 'P0001';
    END IF;
  END IF;

  IF v_is_admin THEN
    SELECT seller_phone INTO v_phone
    FROM public.listings
    WHERE id = p_listing_id AND status = 'active';
  ELSE
    SELECT seller_phone INTO v_phone
    FROM public.listings
    WHERE id = p_listing_id AND status = 'active' AND is_demo = false;
  END IF;

  IF v_phone IS NOT NULL THEN
    INSERT INTO public.phone_reveal_logs (user_id, listing_id)
    VALUES (v_uid, p_listing_id);
  END IF;

  RETURN v_phone;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_listing_phone(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_listing_phone(uuid) TO authenticated;

COMMIT;
