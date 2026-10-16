-- 20261102_search_raw_stopword_guard.sql
-- Raw stopword recognition before normalization (P3) + strict typo fallback (P6).
-- Does not rewrite historical migrations. Replaces functions with raw-query guard.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

-- ============================================================
-- PART 1: Add raw stopword على (NOT علي)
-- ============================================================
INSERT INTO public.search_stopwords(word)
VALUES ('على')
ON CONFLICT (word) DO NOTHING;

-- ============================================================
-- PART 2: Replace helper with raw-token semantics
-- Same signature type (text), same name.
-- ============================================================
CREATE OR REPLACE FUNCTION public.query_has_meaningful_tokens(
  p_norm_query text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $func$
  SELECT EXISTS (
    SELECT 1
    FROM regexp_split_to_table(
      btrim(coalesce(p_norm_query, '')),
      '[[:space:]]+'
    ) AS tok(raw_token)
    WHERE tok.raw_token <> ''
      AND length(tok.raw_token) >= 3
      AND NOT EXISTS (
        SELECT 1
        FROM public.search_stopwords AS sw
        WHERE sw.word = tok.raw_token
      )
  );
$func$;

COMMENT ON FUNCTION public.query_has_meaningful_tokens(text) IS
  'Accepts a raw query. Returns true when at least one raw token has length >= 3 and is not an exact raw stopword. Stopword comparison occurs before normalization.';

GRANT EXECUTE ON FUNCTION public.query_has_meaningful_tokens(text)
  TO anon, authenticated;

-- ============================================================
-- PART 3: Update search_listings_v2_intent to pass raw query
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_listings_v2_intent(
  p_query text,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0,
  p_category_slug text default null,
  p_subcategory_slug text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_city text default null,
  p_neighborhood text default null,
  p_attrs jsonb default null
)
RETURNS setof public.listings
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_intent text;
  v_contradiction text;
  v_fetch_limit integer;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  IF v_norm = '' OR length(v_norm) < 3 THEN RETURN; END IF;

  -- Guard: zero meaningful raw tokens (stopwords or short).
  IF NOT public.query_has_meaningful_tokens(coalesce(p_query, '')) THEN
    RETURN;
  END IF;

  v_intent := public.detect_query_intent(v_norm);

  -- No intent: delegate to v2 unchanged.
  IF v_intent IS NULL THEN
    RETURN QUERY
      SELECT l.* FROM public.search_listings_v2(
        p_query, p_market, v_limit, v_offset,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      ) AS l;
    RETURN;
  END IF;

  v_contradiction := CASE v_intent
    WHEN 'rental' THEN public.normalize_search_text('للبيع')
    WHEN 'sale'   THEN public.normalize_search_text('للايجار')
    WHEN 'new'    THEN public.normalize_search_text('مستعمل')
    WHEN 'used'   THEN public.normalize_search_text('جديد')
    ELSE NULL
  END;

  -- Intent but unknown contradiction kind: delegate to v2 unchanged.
  IF v_contradiction IS NULL THEN
    RETURN QUERY
      SELECT l.* FROM public.search_listings_v2(
        p_query, p_market, v_limit, v_offset,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      ) AS l;
    RETURN;
  END IF;

  -- Intent detected: always apply the contradiction filter.
  v_fetch_limit := least(greatest(v_limit * 5, 30), 100);

  RETURN QUERY
  SELECT l.*
  FROM public.search_listings_v2(
    p_query, p_market, v_fetch_limit, 0,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price,
    p_city, p_neighborhood, p_attrs
  ) AS l
  WHERE public.normalize_search_text(l.search_text)
        NOT LIKE '%' || v_contradiction || '%'
  LIMIT v_limit
  OFFSET v_offset;
END;
$function$;

COMMENT ON FUNCTION public.search_listings_v2_intent(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) IS
  'Wrapper around search_listings_v2. Applies intent hard filter. Raw stopword guard.';

GRANT EXECUTE ON FUNCTION public.search_listings_v2_intent(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- ============================================================
-- PART 4: Strict fuzzy helper (does not replace fuzzy)
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_text_has_all_tokens_strict(
  p_search_text text,
  p_norm_query text,
  p_threshold float8 DEFAULT 0.4
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $func$
  WITH meaningful AS (
    SELECT public.normalize_search_text(tok) AS tok
    FROM regexp_split_to_table(
      btrim(coalesce(p_norm_query, '')), '[[:space:]]+'
    ) AS tok
    WHERE tok <> ''
      AND length(public.normalize_search_text(tok)) >= 3
      AND public.normalize_search_text(tok) NOT IN (
        SELECT public.normalize_search_text(word)
        FROM public.search_stopwords
      )
  ),
  norm_text AS (
    SELECT public.normalize_search_text(coalesce(p_search_text, '')) AS s
  )
  SELECT
    EXISTS (SELECT 1 FROM meaningful)
    AND NOT EXISTS (
      SELECT 1
      FROM meaningful m
      CROSS JOIN norm_text nt
      WHERE nt.s NOT LIKE '%' || m.tok || '%'
        AND strict_word_similarity(m.tok, nt.s) < p_threshold
    );
$func$;

COMMENT ON FUNCTION public.search_text_has_all_tokens_strict(text, text, float8) IS
  'Strict token guard. Returns false on zero meaningful tokens. Token passes if LIKE match OR strict_word_similarity >= threshold.';

GRANT EXECUTE ON FUNCTION public.search_text_has_all_tokens_strict(text, text, float8)
  TO anon, authenticated;

-- ============================================================
-- PART 5: Update search_listings_v2_intent_typo to use strict + raw guard
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_listings_v2_intent_typo(
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
RETURNS setof public.listings
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  IF v_norm = '' OR length(v_norm) < 3 THEN RETURN; END IF;

  -- Raw stopword guard before any fallback.
  IF NOT public.query_has_meaningful_tokens(coalesce(p_query, '')) THEN
    RETURN;
  END IF;

  -- Path 1: existing v2_intent behavior.
  RETURN QUERY
    SELECT * FROM public.search_listings_v2_intent(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    );

  IF FOUND THEN
    RETURN;
  END IF;

  -- Path 2: strict fuzzy fallback. Ranked by best per-token strict_word_similarity.
  RETURN QUERY
  SELECT l.*
  FROM public.listings l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.listing_passes_filters(
      l,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    )
    AND public.search_text_has_all_tokens_strict(l.search_text, v_norm, 0.35)
  ORDER BY (
    SELECT max(
      strict_word_similarity(
        public.normalize_search_text(tok),
        public.normalize_search_text(l.search_text)
      )
    )
    FROM regexp_split_to_table(v_norm, '[[:space:]]+') AS tok
    WHERE tok <> ''
      AND length(public.normalize_search_text(tok)) >= 3
      AND public.normalize_search_text(tok) NOT IN (
        SELECT public.normalize_search_text(word)
        FROM public.search_stopwords
      )
  ) DESC NULLS LAST,
    l.created_at DESC,
    l.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

COMMENT ON FUNCTION public.search_listings_v2_intent_typo(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) IS
  'Typo-tolerant wrapper. v2_intent first; strict fuzzy fallback if empty. Raw stopword guard.';

GRANT EXECUTE ON FUNCTION public.search_listings_v2_intent_typo(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- ============================================================
-- PART 6: Add raw guard to search_listings_v4_exact
-- (body otherwise identical to 20261100)
-- ============================================================
-- NOTE: Full body copied from 20261100 with single early raw guard inserted
-- after the length check. All other logic preserved.

CREATE OR REPLACE FUNCTION public.search_listings_v4_exact(
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
  total_matched_tokens integer
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_tokens text[];
  v_n integer;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_exact_count integer;
  v_trigram_count integer;
  v_threshold integer;
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  -- Fold Persian yeh/kaf so measured typos like كمری match كامري.
  v_norm := translate(v_norm, 'یک', 'يك');
  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  -- Raw stopword guard (before normalized token extraction).
  IF NOT public.query_has_meaningful_tokens(coalesce(p_query, '')) THEN
    RETURN;
  END IF;

  SELECT array_agg(t.token ORDER BY t.ordinality)
  INTO v_tokens
  FROM (
    SELECT
      s.ordinality,
      public.normalize_search_text(s.token) AS token
    FROM regexp_split_to_table(v_norm, '[[:space:]]+')
         WITH ORDINALITY AS s(token, ordinality)
  ) AS t
  WHERE t.token <> ''
    AND length(t.token) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM public.search_stopwords w
      WHERE public.normalize_search_text(w.word) = t.token
    );

  v_n := coalesce(cardinality(v_tokens), 0);

  IF v_n = 0 THEN
    RETURN;
  END IF;

  SELECT count(*) INTO v_exact_count
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
      FROM unnest(v_tokens) AS required(token)
      WHERE strpos(
        public.normalize_search_text(coalesce(l.search_text, '')),
        required.token
      ) = 0
    );

  IF v_exact_count > 0 THEN
    IF current_setting('app.v4_trace', true) = 'on'
       AND to_regclass('public.search_v4_trace') IS NOT NULL THEN
      INSERT INTO public.search_v4_trace(branch) VALUES ('exact');
    END IF;

    RETURN QUERY
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug,
      l.subcategory_slug, l.images, l.attributes, l.status, l.views,
      l.seller_name, l.seller_phone, l.created_at, l.updated_at,
      l.is_demo,
      'exact'::text,
      v_tokens,
      v_n
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
        FROM unnest(v_tokens) AS required(token)
        WHERE strpos(
          public.normalize_search_text(coalesce(l.search_text, '')),
          required.token
        ) = 0
      )
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Trigram stage uses strict_word_similarity >= 0.35 (unchanged from 20261100).
  SELECT count(*) INTO v_trigram_count
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.listing_passes_filters(
      l, p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    )
    AND strict_word_similarity(
      v_norm,
      public.normalize_search_text(coalesce(l.search_text, ''))
    ) >= 0.35;

  IF v_trigram_count > 0 THEN
    IF current_setting('app.v4_trace', true) = 'on'
       AND to_regclass('public.search_v4_trace') IS NOT NULL THEN
      INSERT INTO public.search_v4_trace(branch) VALUES ('trigram');
    END IF;

    RETURN QUERY
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug,
      l.subcategory_slug, l.images, l.attributes, l.status, l.views,
      l.seller_name, l.seller_phone, l.created_at, l.updated_at,
      l.is_demo,
      'trigram'::text,
      v_tokens,
      v_n
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND public.listing_passes_filters(
        l, p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      )
      AND strict_word_similarity(
        v_norm,
        public.normalize_search_text(coalesce(l.search_text, ''))
      ) >= 0.35
    ORDER BY strict_word_similarity(
      v_norm,
      public.normalize_search_text(coalesce(l.search_text, ''))
    ) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Related threshold. N=1 is never related.
  v_threshold := CASE
    WHEN v_n <= 1 THEN NULL
    WHEN v_n = 2 THEN 2
    WHEN v_n = 3 THEN 2
    WHEN v_n = 4 THEN 3
    ELSE ceil(v_n * 0.6)::integer
  END;

  IF v_threshold IS NULL THEN
    RETURN;
  END IF;

  IF current_setting('app.v4_trace', true) = 'on'
     AND to_regclass('public.search_v4_trace') IS NOT NULL THEN
    INSERT INTO public.search_v4_trace(branch) VALUES ('related');
  END IF;

  RETURN QUERY
  SELECT
    s.id, s.user_id, s.title, s.description, s.price, s.currency,
    s.country_code, s.city, s.neighborhood, s.category_slug,
    s.subcategory_slug, s.images, s.attributes, s.status, s.views,
    s.seller_name, s.seller_phone, s.created_at, s.updated_at,
    s.is_demo,
    'related'::text,
    s.matched_tokens,
    s.total_matched_tokens
  FROM (
    SELECT
      l.*,
      (
        SELECT array_agg(required.token ORDER BY required.token)
        FROM unnest(v_tokens) AS required(token)
        WHERE strpos(
          public.normalize_search_text(coalesce(l.search_text, '')),
          required.token
        ) > 0
      ) AS matched_tokens,
      (
        SELECT count(*)::integer
        FROM unnest(v_tokens) AS required(token)
        WHERE strpos(
          public.normalize_search_text(coalesce(l.search_text, '')),
          required.token
        ) > 0
      ) AS total_matched_tokens
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND public.listing_passes_filters(
        l, p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      )
  ) AS s
  WHERE s.total_matched_tokens >= v_threshold
  ORDER BY s.total_matched_tokens DESC, s.created_at DESC, s.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

COMMENT ON FUNCTION public.search_listings_v4_exact(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) IS
  'v4 with trigram fallback and related threshold. Raw stopword guard.';

GRANT EXECUTE ON FUNCTION public.search_listings_v4_exact(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- ============================================================
-- PART 7: Early raw guard on search_listings_v4_tiered_v2
-- (delegates to C1/v4_exact; guard prevents lossy normalize)
-- ============================================================
-- Minimal change: insert guard immediately after BEGIN, before normalize.
-- Full body otherwise identical to 20261099.

CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered_v2(
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
  p_attrs jsonb DEFAULT NULL,
  p_tier2_limit integer DEFAULT 5
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
  tier_reason text,
  rank_in_tier integer
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $func$
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
  v_c1_tier2_max_rank integer := 0;
BEGIN
  -- Raw stopword guard before any normalization or delegation.
  IF NOT public.query_has_meaningful_tokens(coalesce(p_query, '')) THEN
    RETURN;
  END IF;

  -- 1. Normalize query (same as v4 / C1)
  v_norm_query := btrim(public.normalize_search_text(coalesce(p_query, '')));
  v_norm_query := translate(v_norm_query, 'یک', 'يك');

  -- Clamp p_tier2_limit: 0..5
  v_tier2_limit_clamped := least(greatest(coalesce(p_tier2_limit, 5), 0), 5);

  -- 2. Materialize C1 results into temp table (preserves order via ordinality)
  DROP TABLE IF EXISTS pg_temp._c2_c1_rows;
  CREATE TEMP TABLE _c2_c1_rows (
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
    tier_reason text,
    c1_order integer
  ) ON COMMIT DROP;

  TRUNCATE _c2_c1_rows;

  INSERT INTO _c2_c1_rows (
    id, user_id, title, description, price, currency, country_code,
    city, neighborhood, category_slug, subcategory_slug, images,
    attributes, status, views, seller_name, seller_phone,
    created_at, updated_at, is_demo, match_kind, matched_tokens,
    total_matched_tokens, tier, tier_reason, c1_order
  )
  SELECT
    c.id, c.user_id, c.title, c.description, c.price, c.currency,
    c.country_code, c.city, c.neighborhood, c.category_slug,
    c.subcategory_slug, c.images, c.attributes, c.status, c.views,
    c.seller_name, c.seller_phone, c.created_at, c.updated_at,
    c.is_demo, c.match_kind, c.matched_tokens, c.total_matched_tokens,
    c.tier, c.tier_reason,
    row_number() OVER ()::integer
  FROM public.search_listings_v4_tiered(
    p_query, p_market, p_limit, p_offset,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price,
    p_city, p_neighborhood, p_attrs
  ) AS c;

  -- Collect tier IDs
  SELECT array_agg(id) FILTER (WHERE tier = 1) INTO v_tier1_ids FROM _c2_c1_rows;
  SELECT array_agg(id) FILTER (WHERE tier = 2) INTO v_tier2_ids_c1 FROM _c2_c1_rows;
  v_tier1_ids := coalesce(v_tier1_ids, ARRAY[]::uuid[]);
  v_tier2_ids_c1 := coalesce(v_tier2_ids_c1, ARRAY[]::uuid[]);
  v_excluded_ids := v_tier1_ids || v_tier2_ids_c1;
  v_has_tier1 := cardinality(v_tier1_ids) > 0;

  IF v_has_tier1 THEN
    SELECT category_slug, subcategory_slug, city
    INTO v_tier2_category, v_top_tier1_subcategory, v_top_tier1_city
    FROM _c2_c1_rows
    WHERE tier = 1
    ORDER BY c1_order
    LIMIT 1;

    SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY price::numeric)
    INTO v_median_tier1_price
    FROM _c2_c1_rows
    WHERE tier = 1 AND price ~ '^[0-9.]+$';
  END IF;

  SELECT coalesce(max(rank_in_tier), 0) INTO v_c1_tier2_max_rank
  FROM (
    SELECT row_number() OVER (PARTITION BY tier ORDER BY c1_order)::integer AS rank_in_tier
    FROM _c2_c1_rows
    WHERE tier = 2
  ) t;

  -- Independent same-category recommendations (Tier 2)
  IF v_has_tier1 AND v_tier2_category IS NOT NULL AND v_tier2_limit_clamped > 0 THEN
    INSERT INTO _c2_c1_rows (
      id, user_id, title, description, price, currency, country_code,
      city, neighborhood, category_slug, subcategory_slug, images,
      attributes, status, views, seller_name, seller_phone,
      created_at, updated_at, is_demo, match_kind, matched_tokens,
      total_matched_tokens, tier, tier_reason, c1_order
    )
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug,
      l.subcategory_slug, l.images, l.attributes, l.status, l.views,
      l.seller_name, l.seller_phone, l.created_at, l.updated_at,
      l.is_demo, 'related'::text, NULL::text[], 0,
      2, 'same_category_recommendation',
      10000 + row_number() OVER ()::integer
    FROM public.listings l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.category_slug = v_tier2_category
      AND NOT (l.id = ANY(v_excluded_ids))
      AND public.listing_passes_filters(
        l, NULL, NULL,  -- category already filtered
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      )
    ORDER BY
      CASE WHEN l.subcategory_slug = v_top_tier1_subcategory THEN 0 ELSE 1 END,
      CASE WHEN l.city = v_top_tier1_city THEN 0 ELSE 1 END,
      abs(coalesce(l.price::numeric, 0) - coalesce(v_median_tier1_price, 0)),
      l.created_at DESC,
      l.id ASC
    LIMIT v_tier2_limit_clamped;
  END IF;

  -- Final return: C1 rows + recommendations, ranked
  RETURN QUERY
  SELECT
    r.id, r.user_id, r.title, r.description, r.price, r.currency, r.country_code,
    r.city, r.neighborhood, r.category_slug, r.subcategory_slug, r.images,
    r.attributes, r.status, r.views, r.seller_name, r.seller_phone,
    r.created_at, r.updated_at, r.is_demo, r.match_kind, r.matched_tokens,
    r.total_matched_tokens, r.tier, r.tier_reason,
    row_number() OVER (PARTITION BY r.tier ORDER BY r.c1_order)::integer AS rank_in_tier
  FROM _c2_c1_rows r
  ORDER BY r.tier ASC, r.c1_order ASC;
END;
$func$;

COMMENT ON FUNCTION public.search_listings_v4_tiered_v2(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb, integer
) IS
  'C2 wrapper: C1 classified rows + independent same-category Tier 2 recommendations. Raw stopword guard.';

GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_v2(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb, integer
) TO anon, authenticated;

COMMIT;

-- ROLLBACK PROCEDURE (comments only; do not execute without approval):
-- 1. Re-apply 20261097 to restore search_listings_v2_intent and original query_has_meaningful_tokens.
-- 2. Re-apply 20261100 to restore search_listings_v4_exact (strict 0.35 preserved).
-- 3. Re-apply 20261099 to restore search_listings_v4_tiered_v2.
-- 4. Re-apply 20261056 to restore search_listings_v2_intent_typo.
-- 5. DROP FUNCTION IF EXISTS public.search_text_has_all_tokens_strict(text, text, float8);
-- 6. DELETE FROM public.search_stopwords WHERE word = 'على'
--    (only if confirmed inserted by this migration and no prior existence).
-- 7. Verify 'علي' was never added.
