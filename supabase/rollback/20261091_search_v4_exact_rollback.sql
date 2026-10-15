BEGIN;

DROP FUNCTION IF EXISTS public.search_listings_v4_exact(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
);

COMMIT;
