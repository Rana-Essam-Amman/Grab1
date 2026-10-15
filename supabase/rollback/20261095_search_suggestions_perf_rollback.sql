-- Rollback for 20261095_search_suggestions_perf.sql
-- Idempotent.
-- Deletes only keywords that this migration actually inserted
-- (tracked in search_keywords_migration_log). Pre-existing keywords
-- are never deleted.

BEGIN;

DROP TRIGGER IF EXISTS refresh_suggestion_tokens_on_listing_change ON public.listings;
DROP FUNCTION IF EXISTS public.trigger_refresh_suggestion_tokens();
DROP FUNCTION IF EXISTS public.refresh_suggestion_tokens();
DROP TABLE IF EXISTS public.search_suggestion_tokens;

DROP INDEX IF EXISTS public.search_keywords_norm_keyword_idx;
DROP INDEX IF EXISTS public.search_synonyms_norm_term_idx;
DROP INDEX IF EXISTS public.search_category_labels_norm_name_ar_idx;
DROP INDEX IF EXISTS public.search_category_labels_norm_name_en_idx;
DROP INDEX IF EXISTS public.search_subcategory_labels_norm_name_ar_idx;
DROP INDEX IF EXISTS public.search_subcategory_labels_norm_name_en_idx;

-- Remove only brand keywords that this migration actually inserted
DELETE FROM public.search_keywords sk
USING public.search_keywords_migration_log log
WHERE log.migration_name = '20261095_search_suggestions_perf'
  AND sk.group_key = log.group_key
  AND sk.keyword   = log.keyword;

-- Clean up the log entries for this migration
DELETE FROM public.search_keywords_migration_log
WHERE migration_name = '20261095_search_suggestions_perf';

-- Drop the log table (this migration is its only user)
DROP TABLE IF EXISTS public.search_keywords_migration_log;

-- Restore search_suggestions body from 20261094 (with #variable_conflict)
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
  token_pool AS (
    SELECT DISTINCT word
    FROM (
      SELECT regexp_split_to_table(
        public.normalize_search_text(l.search_text),
        '[[:space:]]+'
      ) AS word
      FROM public.listings l
      WHERE l.status = 'active'
        AND l.search_text IS NOT NULL
        AND l.search_text <> ''
    ) raw
    WHERE length(word) >= 3
    LIMIT 200
  ),
  tokens AS (
    SELECT
      tp.word AS suggestion,
      'token'::text AS suggestion_type,
      0.6::numeric AS weight,
      NULL::text AS category_slug
    FROM token_pool tp
    WHERE tp.word LIKE v_norm || '%'
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

COMMIT;
