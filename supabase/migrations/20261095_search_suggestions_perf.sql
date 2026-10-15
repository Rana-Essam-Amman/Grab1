BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

-- 1. Token pool table + index
CREATE TABLE public.search_suggestion_tokens (
  word          text PRIMARY KEY,
  frequency     int NOT NULL DEFAULT 1,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX search_suggestion_tokens_word_idx
  ON public.search_suggestion_tokens (word text_pattern_ops);

-- 2. Refresh function (void, callable from migration and tests)
CREATE OR REPLACE FUNCTION public.refresh_suggestion_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  TRUNCATE public.search_suggestion_tokens;

  INSERT INTO public.search_suggestion_tokens (word, frequency)
  SELECT word, count(*)::int
  FROM (
    SELECT regexp_split_to_table(
      public.normalize_search_text(l.search_text),
      '[[:space:]]+'
    ) AS word
    FROM public.listings l
    WHERE l.status = 'active'
      AND l.search_text IS NOT NULL
      AND l.search_text <> ''
  ) t
  WHERE length(word) >= 3
    -- Match Unicode letters and digits only.
    -- Use E-string for \uXXXX escapes (PostgreSQL requires E prefix).
    -- Do NOT use [[:alpha:]] — not UTF-8-compliant for Arabic.
    -- Arabic Unicode block: U+0600 to U+06FF.
    AND word ~ E'^[a-zA-Z0-9\u0600-\u06FF]+$'
  GROUP BY word;
END;
$function$;

-- 3. Statement-level trigger wrapper (RETURNS trigger required by PostgreSQL)
CREATE OR REPLACE FUNCTION public.trigger_refresh_suggestion_tokens()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  PERFORM public.refresh_suggestion_tokens();
  RETURN NULL;
END;
$function$;

CREATE TRIGGER refresh_suggestion_tokens_on_listing_change
  AFTER INSERT OR UPDATE OR DELETE ON public.listings
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_refresh_suggestion_tokens();

-- 4. Functional indexes (normalize_search_text is IMMUTABLE)
CREATE INDEX search_keywords_norm_keyword_idx
  ON public.search_keywords
  ((public.normalize_search_text(keyword)) text_pattern_ops);

CREATE INDEX search_synonyms_norm_term_idx
  ON public.search_synonyms
  ((public.normalize_search_text(term)) text_pattern_ops);

CREATE INDEX search_category_labels_norm_name_ar_idx
  ON public.search_category_labels
  ((public.normalize_search_text(name_ar)) text_pattern_ops);

CREATE INDEX search_category_labels_norm_name_en_idx
  ON public.search_category_labels
  ((public.normalize_search_text(name_en)) text_pattern_ops);

CREATE INDEX search_subcategory_labels_norm_name_ar_idx
  ON public.search_subcategory_labels
  ((public.normalize_search_text(name_ar)) text_pattern_ops);

CREATE INDEX search_subcategory_labels_norm_name_en_idx
  ON public.search_subcategory_labels
  ((public.normalize_search_text(name_en)) text_pattern_ops);

-- 5. Brand keywords (WHERE NOT EXISTS)
INSERT INTO public.search_keywords (group_key, keyword)
SELECT v.group_key, v.keyword
FROM (VALUES
  ('brand_iphone', 'ايفون'),
  ('brand_iphone', 'آيفون'),
  ('brand_iphone', 'iphone'),
  ('brand_iphone', 'أيفون'),
  ('brand_tesla', 'تسلا'),
  ('brand_tesla', 'tesla'),
  ('brand_samsung', 'سامسونج'),
  ('brand_samsung', 'samsung'),
  ('brand_samsung', 'سامسونغ'),
  ('brand_samsung', 'جالاكسي'),
  ('brand_samsung', 'galaxy'),
  ('brand_hyundai', 'هيونداي'),
  ('brand_hyundai', 'hyundai'),
  ('brand_hyundai', 'هيونداى'),
  ('brand_toyota', 'تويوتا'),
  ('brand_toyota', 'toyota'),
  ('brand_toyota', 'تيوتا'),
  ('brand_kia', 'كيا'),
  ('brand_kia', 'kia'),
  ('brand_honda', 'هوندا'),
  ('brand_honda', 'honda'),
  ('brand_nissan', 'نيسان'),
  ('brand_nissan', 'nissan'),
  ('brand_bmw', 'بي ام دبليو'),
  ('brand_bmw', 'bmw'),
  ('brand_mercedes', 'مرسيدس'),
  ('brand_mercedes', 'mercedes'),
  ('brand_mercedes', 'بنز'),
  ('brand_huawei', 'هواوي'),
  ('brand_huawei', 'huawei'),
  ('brand_xiaomi', 'شاومي'),
  ('brand_xiaomi', 'xiaomi'),
  ('brand_xiaomi', 'redmi'),
  ('brand_lg', 'ال جي'),
  ('brand_lg', 'lg'),
  ('brand_dell', 'ديل'),
  ('brand_dell', 'dell'),
  ('brand_hp', 'اتش بي'),
  ('brand_hp', 'hp'),
  ('brand_lenovo', 'لينوفو'),
  ('brand_lenovo', 'lenovo')
) AS v(group_key, keyword)
WHERE NOT EXISTS (
  SELECT 1 FROM public.search_keywords k
  WHERE k.group_key = v.group_key AND k.keyword = v.keyword
);

-- 6. Initial population
SELECT public.refresh_suggestion_tokens();

-- 7. Updated search_suggestions (tokens from pool)
CREATE OR REPLACE FUNCTION public.search_suggestions(
  p_query text,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  suggestion text,
  suggestion_type text,
  weight numeric,
  category_slug text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
#variable_conflict use_column
DECLARE
  v_norm text;
  v_limit integer;
BEGIN
  -- Guards
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  IF v_norm IS NULL OR v_norm = '' OR length(v_norm) < 2 THEN
    RETURN;
  END IF;

  -- Only stopwords (or no meaningful tokens) → empty
  IF NOT EXISTS (
    SELECT 1
    FROM regexp_split_to_table(v_norm, '[[:space:]]+') AS tok
    WHERE length(tok) >= 2
      AND NOT EXISTS (
        SELECT 1
        FROM public.search_stopwords sw
        WHERE public.normalize_search_text(sw.word) = tok
      )
  ) THEN
    RETURN;
  END IF;

  v_limit := greatest(1, least(coalesce(p_limit, 10), 20));

  RETURN QUERY
  WITH keywords AS (
    SELECT
      k.keyword AS suggestion,
      'keyword'::text AS suggestion_type,
      1.0::numeric AS weight,
      NULL::text AS category_slug
    FROM public.search_keywords k
    WHERE public.normalize_search_text(k.keyword) LIKE v_norm || '%'
  ),
  synonyms AS (
    SELECT
      s.term AS suggestion,
      'synonym'::text AS suggestion_type,
      0.9::numeric AS weight,
      NULL::text AS category_slug
    FROM public.search_synonyms s
    WHERE public.normalize_search_text(s.term) LIKE v_norm || '%'
       OR EXISTS (
         SELECT 1
         FROM unnest(s.expansions) AS e(exp)
         WHERE public.normalize_search_text(e.exp) LIKE v_norm || '%'
       )
  ),
  categories AS (
    SELECT
      CASE
        WHEN public.normalize_search_text(c.name_ar) LIKE v_norm || '%' THEN c.name_ar
        ELSE c.name_en
      END AS suggestion,
      'category'::text AS suggestion_type,
      0.8::numeric AS weight,
      c.category_slug
    FROM public.search_category_labels c
    WHERE public.normalize_search_text(c.name_ar) LIKE v_norm || '%'
       OR public.normalize_search_text(c.name_en) LIKE v_norm || '%'
  ),
  subcategories AS (
    SELECT
      CASE
        WHEN public.normalize_search_text(sc.name_ar) LIKE v_norm || '%' THEN sc.name_ar
        ELSE sc.name_en
      END AS suggestion,
      'subcategory'::text AS suggestion_type,
      0.8::numeric AS weight,
      sc.category_slug
    FROM public.search_subcategory_labels sc
    WHERE public.normalize_search_text(sc.name_ar) LIKE v_norm || '%'
       OR public.normalize_search_text(sc.name_en) LIKE v_norm || '%'
  ),
  tokens AS (
    SELECT
      t.word AS suggestion,
      'token'::text AS suggestion_type,
      0.6::numeric AS weight,
      NULL::text AS category_slug
    FROM public.search_suggestion_tokens t
    WHERE t.word LIKE v_norm || '%'
    ORDER BY t.frequency DESC, t.word ASC
    LIMIT 200
  ),
  combined AS (
    SELECT * FROM keywords
    UNION ALL
    SELECT * FROM synonyms
    UNION ALL
    SELECT * FROM categories
    UNION ALL
    SELECT * FROM subcategories
    UNION ALL
    SELECT * FROM tokens
  ),
  deduped AS (
    SELECT DISTINCT ON (suggestion)
      suggestion,
      suggestion_type,
      weight,
      category_slug
    FROM combined
    ORDER BY suggestion, weight DESC
  )
  SELECT
    d.suggestion,
    d.suggestion_type,
    d.weight,
    d.category_slug
  FROM deduped d
  ORDER BY
    (public.normalize_search_text(d.suggestion) LIKE v_norm || '%') DESC,
    d.weight DESC,
    length(d.suggestion) ASC,
    d.suggestion ASC
  LIMIT v_limit;
END;
$function$;

COMMENT ON FUNCTION public.search_suggestions IS
  'Autocomplete suggestions from keywords, synonyms, taxonomy, and precomputed listing tokens';

COMMIT;
