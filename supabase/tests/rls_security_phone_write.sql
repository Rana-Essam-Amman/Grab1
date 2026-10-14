-- H4 phone-write lockdown regression tests.
-- LOCAL ONLY: run via test-search-rpc-local.sh.
--
-- Phase 1: privileged fixture/RPC verification. The JWT subject remains
-- the test user, so auth.uid() resolves to that user without requiring
-- authenticated to have direct SELECT access to profiles.phone.
--
-- Phase 2: authenticated direct-write denial assertions.
-- The entire test runs in one transaction and rolls back at the end.

BEGIN;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '60000000-0000-4000-8000-000000000082',
  'authenticated',
  'authenticated',
  'phone-lockdown-test@example.invalid',
  '',
  now(),
  '{}'::jsonb,
  '{}'::jsonb
);

SELECT set_config(
  'request.jwt.claim.sub',
  '60000000-0000-4000-8000-000000000082',
  true
);

-- PHASE 1: RPC behavior and database-state verification.
-- Do not SET ROLE authenticated here: profiles.phone is intentionally
-- not directly readable by authenticated.

DO $$
DECLARE
  v_user_id uuid := auth.uid();
  v_request_id uuid;
  v_status text;
BEGIN
  IF v_user_id IS DISTINCT FROM
     '60000000-0000-4000-8000-000000000082'::uuid THEN
    RAISE EXCEPTION 'FAIL 1: test JWT subject did not resolve';
  END IF;

  IF public.set_initial_phone('+962791234567') IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'FAIL 2: initial-phone RPC did not set the phone';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = v_user_id
      AND phone = '+962791234567'
      AND phone_locked = true
  ) THEN
    RAISE EXCEPTION 'FAIL 3: phone not stored and locked';
  END IF;

  IF public.set_initial_phone('+962791234568') IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'FAIL 4: initial phone was overwritten';
  END IF;

  v_request_id := public.request_phone_change(
    '+962791234568',
    'My current number has changed'
  );

  IF v_request_id IS NULL THEN
    RAISE EXCEPTION 'FAIL 5: request RPC returned NULL';
  END IF;

  SELECT status
    INTO v_status
    FROM public.phone_change_requests
   WHERE id = v_request_id
     AND user_id = v_user_id;

  IF v_status IS DISTINCT FROM 'pending' THEN
    RAISE EXCEPTION 'FAIL 6: request is not stored as pending';
  END IF;

  BEGIN
    PERFORM public.request_phone_change(
      '+962791234570',
      'A second request'
    );

    RAISE EXCEPTION 'FAIL 7: second pending request unexpectedly succeeded';
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'PASS 7: duplicate pending request denied';
  END;
END;
$$;

-- PHASE 2: verify direct writes are blocked for authenticated.
SET LOCAL ROLE authenticated;

DO $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS DISTINCT FROM
     '60000000-0000-4000-8000-000000000082'::uuid THEN
    RAISE EXCEPTION 'FAIL 8: authenticated JWT subject did not resolve';
  END IF;

  BEGIN
    UPDATE public.profiles
       SET phone = '+962791234569'
     WHERE id = v_user_id;

    RAISE EXCEPTION 'FAIL 9: direct phone update unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 9: direct phone update denied';
  END;

  BEGIN
    UPDATE public.profiles
       SET phone_locked = false
     WHERE id = v_user_id;

    RAISE EXCEPTION 'FAIL 10: direct phone_locked update unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 10: direct phone_locked update denied';
  END;

  BEGIN
    UPDATE public.phone_change_requests
       SET status = 'approved'
     WHERE user_id = v_user_id
       AND status = 'pending';

    RAISE EXCEPTION 'FAIL 11: direct request approval unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 11: direct request update denied';
  END;

  BEGIN
    DELETE FROM public.phone_change_requests
     WHERE user_id = v_user_id
       AND status = 'pending';

    RAISE EXCEPTION 'FAIL 12: direct request delete unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 12: direct request delete denied';
  END;
END;
$$;

RESET ROLE;
ROLLBACK;

SELECT 'H4 phone-write tests completed; transaction rolled back' AS result;
