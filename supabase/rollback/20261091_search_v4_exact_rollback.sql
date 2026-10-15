BEGIN;

-- No trace table is created by 20261091. Nothing to drop or revoke.
-- DROP FUNCTION IF EXISTS is idempotent: applying this twice succeeds.

DROP FUNCTION IF EXISTS public.search_listings_v4_exact(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
);

COMMIT;
