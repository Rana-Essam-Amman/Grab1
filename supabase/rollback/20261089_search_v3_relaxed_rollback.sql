BEGIN;

DROP FUNCTION IF EXISTS public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
);

DROP FUNCTION IF EXISTS public.search_relaxed_subsets(text);

COMMIT;
