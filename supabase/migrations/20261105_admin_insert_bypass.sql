-- 20261105_admin_insert_bypass.sql
-- Fix: Allow admins to bypass the country restriction when inserting a listing.

DROP POLICY IF EXISTS "listings_insert_own" ON public.listings;

CREATE POLICY "Allow authenticated insert with admin bypass"
ON public.listings
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id)
  AND (COALESCE(((auth.jwt() ->> 'is_anonymous')::boolean), false) = false)
  AND (NULLIF(TRIM(public.get_own_phone()), '') IS NOT NULL)
  AND (
    public.is_admin() 
    OR (SELECT country_code FROM public.profiles WHERE id = auth.uid()) IS NULL
    OR country_code = (SELECT country_code FROM public.profiles WHERE id = auth.uid())
  )
);
