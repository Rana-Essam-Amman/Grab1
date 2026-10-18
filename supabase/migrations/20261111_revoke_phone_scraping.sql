-- ============================================================================
-- Security Fix: Prevent PII Scraping (Phone Numbers)
-- 1. Revoke column-level SELECT on seller_phone from anon and authenticated.
-- 2. Revoke SELECT on premium_transactions from anon.
-- 3. Create a secure RPC to fetch the phone on demand.
-- ============================================================================

begin;

-- 1. Revoke direct access to seller_phone
REVOKE SELECT (seller_phone) ON public.listings FROM anon, authenticated;

-- 2. Revoke anon access to premium_transactions (no policy for anon anyway)
REVOKE SELECT ON public.premium_transactions FROM anon;

-- 3. Create a secure RPC to get the phone number (can add rate-limiting here later)
CREATE OR REPLACE FUNCTION public.get_listing_phone(p_listing_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT seller_phone 
  FROM public.listings 
  WHERE id = p_listing_id AND status = 'active' AND is_demo = false;
$$;

-- Grant execution to all users
GRANT EXECUTE ON FUNCTION public.get_listing_phone(uuid) TO anon, authenticated;

commit;
