-- Remove the NULL profile-country exception from listings INSERT market enforcement.
-- Admins retain the explicit bypass; non-admins must match their profile market.

BEGIN;

DROP POLICY IF EXISTS "Allow authenticated insert with admin bypass" ON public.listings;

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
    OR country_code = (SELECT country_code FROM public.profiles WHERE id = auth.uid())
  )
);

COMMIT;
