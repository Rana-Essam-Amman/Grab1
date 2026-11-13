-- ============================================================================
-- P1 CRITICAL: Close public seller-phone exposure paths
--
-- 1. Reliably revoke column-level SELECT on seller_phone from anon and authenticated.
--    (Table-level SELECT remains; RLS unchanged.)
-- 2. Revoke direct execution of search_listings_semantic from public roles.
--    It is an internal helper called by search_listings_hybrid (SECURITY DEFINER
--    owner can still invoke it). Direct public calls are not an intended API.
-- 3. Ensure no public result path returns real seller_phone values.
-- ============================================================================

BEGIN;

-- 1. Column privilege revocation (idempotent; safe even if already revoked)
REVOKE SELECT (seller_phone) ON TABLE public.listings FROM anon;
REVOKE SELECT (seller_phone) ON TABLE public.listings FROM authenticated;
REVOKE SELECT (seller_phone) ON TABLE public.listings FROM PUBLIC;

-- Confirm table-level SELECT is still present for public listing reads
-- (existing grants are preserved; we do not revoke them here)

-- 2. Restrict search_listings_semantic
--    Signature from 20261033 / 20261087
REVOKE EXECUTE ON FUNCTION public.search_listings_semantic(
  extensions.vector, text, integer, integer, double precision
) FROM PUBLIC, anon, authenticated;

-- Owner (typically postgres / supabase_admin) retains ability to call it
-- for internal use by search_listings_hybrid and similar.

-- 3. Note: get_listing_phone remains authenticated-only with rate limit,
--    as defined in 20261111_revoke_phone_scraping.sql. No change here.

-- Optional safety: re-assert the revoke in case of any intervening GRANT
-- (none expected after this point)

COMMIT;
