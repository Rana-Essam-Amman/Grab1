
-- Guard direct user-owned writes while account deletion is in progress.
-- Preserve existing ownership, admin and validation rules.
-- SECURITY DEFINER functions are handled in a separate migration.

BEGIN;

-- Listings: INSERT
DROP POLICY IF EXISTS "Allow authenticated insert with admin bypass"
  ON public.listings;

CREATE POLICY "Allow authenticated insert with admin bypass"
  ON public.listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND COALESCE(
      (auth.jwt() ->> 'is_anonymous')::boolean,
      false
    ) = false
    AND NULLIF(TRIM(get_own_phone()), '') IS NOT NULL
    AND (
      is_admin()
      OR country_code = (
        SELECT profiles.country_code
        FROM public.profiles
        WHERE profiles.id = auth.uid()
      )
    )
    AND private.account_user_can_write()
  );

-- Listings: UPDATE
DROP POLICY IF EXISTS "listings_update_own_or_admin"
  ON public.listings;

CREATE POLICY "listings_update_own_or_admin"
  ON public.listings
  FOR UPDATE
  USING (
    (auth.uid() = user_id OR is_admin())
    AND private.account_user_can_write()
  )
  WITH CHECK (
    (auth.uid() = user_id OR is_admin())
    AND private.account_user_can_write()
  );

-- Listings: DELETE
DROP POLICY IF EXISTS "listings_delete_own_or_admin"
  ON public.listings;

CREATE POLICY "listings_delete_own_or_admin"
  ON public.listings
  FOR DELETE
  USING (
    (auth.uid() = user_id OR is_admin())
    AND private.account_user_can_write()
  );


-- Profiles: INSERT
DROP POLICY IF EXISTS "profiles_insert_own"
  ON public.profiles;

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    AND private.account_user_can_write()
  );

-- Profiles: UPDATE
DROP POLICY IF EXISTS "profiles_update_own"
  ON public.profiles;

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    AND private.account_user_can_write()
  )
  WITH CHECK (
    auth.uid() = id
    AND private.account_user_can_write()
  );


-- Wishlists: INSERT
DROP POLICY IF EXISTS "wishlists_insert_own"
  ON public.wishlists;

CREATE POLICY "wishlists_insert_own"
  ON public.wishlists
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND private.account_user_can_write()
  );

-- Wishlists: DELETE
DROP POLICY IF EXISTS "wishlists_delete_own"
  ON public.wishlists;

CREATE POLICY "wishlists_delete_own"
  ON public.wishlists
  FOR DELETE
  USING (
    auth.uid() = user_id
    AND private.account_user_can_write()
  );


-- Phone change requests: INSERT
DROP POLICY IF EXISTS "phone_change_requests_insert_own"
  ON public.phone_change_requests;

CREATE POLICY "phone_change_requests_insert_own"
  ON public.phone_change_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND private.account_user_can_write()
  );


-- Phone reveal logs: INSERT
DROP POLICY IF EXISTS "users_insert_own_reveal_logs"
  ON public.phone_reveal_logs;

CREATE POLICY "users_insert_own_reveal_logs"
  ON public.phone_reveal_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND private.account_user_can_write()
  );


-- Listing reports: INSERT
DROP POLICY IF EXISTS "listing_reports_insert_own"
  ON public.listing_reports;

CREATE POLICY "listing_reports_insert_own"
  ON public.listing_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reporter_id
    AND private.account_user_can_write()
  );


-- Error logs: preserve anonymous/unattributed logs.
-- Authenticated user-attributed logs require an unlocked account.
DROP POLICY IF EXISTS "error_logs_insert_own"
  ON public.error_logs;

CREATE POLICY "error_logs_insert_own"
  ON public.error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IS NULL
    OR (
      user_id = auth.uid()
      AND private.account_user_can_write()
    )
  );

COMMIT;
