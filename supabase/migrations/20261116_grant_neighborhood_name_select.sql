
-- ============================================================================
-- Grant safe read access to the optional free-text neighborhood name.
--
-- The listings table uses column-level SELECT grants.
-- This migration grants access to this column only.
--
-- It does NOT grant table-level SELECT.
-- It does NOT expose seller_phone or restricted listing columns.
-- It does NOT modify RLS policies or existing listing data.
-- ============================================================================

BEGIN;

GRANT SELECT (neighborhood_name)
ON TABLE public.listings
TO anon, authenticated;

COMMIT;
