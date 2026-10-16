-- 20261098_search_v4_tiered.sql
-- Wrapper around search_listings_v4_exact.
-- Reclassifies trigram fallback (currently labelled match_kind='exact')
-- and related results into Tier 2. True exact matches (every meaningful
-- token present as substring) stay Tier 1.
-- v4 itself is unchanged. No rows are dropped.
-- Tier ordering is PAGE-LOCAL ONLY (guaranteed within a page, not across pages).
-- Within each tier, v4's emitted row order is preserved via ORDINALITY.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered(
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
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  description text,
  price text,
  currency text,
  country_code text,
  city text,
  neighborhood text,
  category_slug text,
  subcategory_slug text,
  images text[],
  attributes jsonb,
  status text,
  views integer,
  seller_name text,
  seller_phone text,
  created_at timestamptz,
  updated_at timestamptz,
  is_demo boolean,
  match_kind text,
  matched_tokens text[],
  total_matched_tokens integer,
  tier integer,
  tier_reason text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $func$
DECLARE
  v_norm_query text;
  v_tokens text[];
BEGIN
  -- Normalize query EXACTLY as v4 does (Constraint 1).
  -- Copied from 20261093_search_v4_typo_threshold.sql lines 47-50.
  v_norm_query := btrim(public.normalize_search_text(coalesce(p_query, '')));
  -- Fold Persian yeh/kaf so measured typos like كمری match كامري.
  v_norm_query := translate(v_norm_query, 'یک', 'يك');

  -- Extract meaningful tokens exactly as v4's exact stage does
  -- (lines 55-70 of 20261093). Length >= 3, not stopword.
  SELECT array_agg(t.token ORDER BY t.ordinality)
  INTO v_tokens
  FROM (
    SELECT
      s.ordinality,
      public.normalize_search_text(s.token) AS token
    FROM regexp_split_to_table(v_norm_query, '[[:space:]]+')
         WITH ORDINALITY AS s(token, ordinality)
  ) AS t
  WHERE t.token <> ''
    AND length(t.token) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM public.search_stopwords w
      WHERE public.normalize_search_text(w.word) = t.token
    );

  RETURN QUERY
  WITH v4r AS (
    SELECT *,
           ordinality AS v4_order
    FROM public.search_listings_v4_exact(
      p_query, p_market, p_limit, p_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    ) WITH ORDINALITY
  )
  SELECT
    v4r.id,
    v4r.user_id,
    v4r.title,
    v4r.description,
    v4r.price,
    v4r.currency,
    v4r.country_code,
    v4r.city,
    v4r.neighborhood,
    v4r.category_slug,
    v4r.subcategory_slug,
    v4r.images,
    v4r.attributes,
    v4r.status,
    v4r.views,
    v4r.seller_name,
    v4r.seller_phone,
    v4r.created_at,
    v4r.updated_at,
    v4r.is_demo,
    v4r.match_kind,
    v4r.matched_tokens,
    v4r.total_matched_tokens,
    CASE
      -- Tier 1: every meaningful token appears as substring
      -- (same check as v4 exact stage, lines 88-104).
      WHEN v_tokens IS NOT NULL
           AND cardinality(v_tokens) > 0
           AND NOT EXISTS (
             SELECT 1
             FROM unnest(v_tokens) AS required(token)
             WHERE strpos(
               public.normalize_search_text(coalesce(l.search_text, '')),
               required.token
             ) = 0
           ) THEN 1
      WHEN v4r.match_kind = 'related' THEN 2
      ELSE 2
    END AS tier,
    CASE
      WHEN v_tokens IS NOT NULL
           AND cardinality(v_tokens) > 0
           AND NOT EXISTS (
             SELECT 1
             FROM unnest(v_tokens) AS required(token)
             WHERE strpos(
               public.normalize_search_text(coalesce(l.search_text, '')),
               required.token
             ) = 0
           ) THEN 'exact_substring'
      WHEN v4r.match_kind = 'related' THEN 'related'
      ELSE 'trigram_fuzzy'
    END AS tier_reason
  FROM v4r
  JOIN public.listings AS l ON l.id = v4r.id
  -- Order: Tier 1 first, then Tier 2.
  -- Within each tier preserve the order v4 emitted (v4_order).
  -- PAGE-LOCAL ONLY (Constraint 2).
  ORDER BY
    (CASE
      WHEN v_tokens IS NOT NULL
           AND cardinality(v_tokens) > 0
           AND NOT EXISTS (
             SELECT 1
             FROM unnest(v_tokens) AS required(token)
             WHERE strpos(
               public.normalize_search_text(coalesce(l.search_text, '')),
               required.token
             ) = 0
           ) THEN 1
      ELSE 2
    END) ASC,
    v4r.v4_order ASC;
END;
$func$;

COMMENT ON FUNCTION public.search_listings_v4_tiered(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) IS
  'Wrapper around v4_exact. Reclassifies trigram and related results into Tier 2. Page-local tier ordering. v4 unchanged.';

GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;

-- ROLLBACK PROCEDURE:
-- DROP FUNCTION IF EXISTS public.search_listings_v4_tiered(
--   text, text, integer, integer, text, text,
--   numeric, numeric, text, text, jsonb
-- );
-- No data change. No v4 change.
