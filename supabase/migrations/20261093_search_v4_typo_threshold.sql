-- 20261093_search_v4_typo_threshold.sql
-- Adds a trigram stage before related, and a related-token threshold.
-- Does not modify v1/v2/v3 or helpers.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

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
  IF v_norm = '' OR length(v_norm) < 3 THEN
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

  -- Trigram fallback for single-token typos only. Multi-token near
  -- matches stay in related so a missing token is not promoted to exact.
  IF v_n = 1 THEN
  SELECT count(*) INTO v_trigram_count
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.listing_passes_filters(
      l, p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    )
    AND word_similarity(
      v_norm,
      public.normalize_search_text(coalesce(l.search_text, ''))
    ) >= 0.5;

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
      AND word_similarity(
        v_norm,
        public.normalize_search_text(coalesce(l.search_text, ''))
      ) >= 0.5
    ORDER BY word_similarity(
      v_norm,
      public.normalize_search_text(coalesce(l.search_text, ''))
    ) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;
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
  'v4 with trigram fallback and related threshold';

GRANT EXECUTE ON FUNCTION public.search_listings_v4_exact(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;
