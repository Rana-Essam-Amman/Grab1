-- H4 phone-write lockdown regression tests.
-- LOCAL ONLY: run via test-search-rpc-local.sh.

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

SET LOCAL ROLE authenticated;

DO $$
DECLARE
  v_request_id uuid;
  v_status text;
BEGIN
  IF public.set_initial_phone('+962791234567') IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'FAIL 1: initial-phone RPC did not set the phone';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND phone = '+962791234567'
      AND phone_locked = true
  ) THEN
    RAISE EXCEPTION 'FAIL 2: phone not stored and locked';
  END IF;

  IF public.set_initial_phone('+962791234568') IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'FAIL 3: initial phone was overwritten';
  END IF;

  BEGIN
    UPDATE public.profiles SET phone = '+962791234569' WHERE id = auth.uid();
    RAISE EXCEPTION 'FAIL 4: direct phone update unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 4: direct phone update denied';
  END;

  BEGIN
    UPDATE public.profiles SET phone_locked = false WHERE id = auth.uid();
    RAISE EXCEPTION 'FAIL 5: direct phone_locked update unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 5: direct phone_locked update denied';
  END;

  v_request_id := public.request_phone_change(
    '+962791234568',
    'My current number has changed'
  );

  IF v_request_id IS NULL THEN
    RAISE EXCEPTION 'FAIL 6: request RPC returned NULL';
  END IF;

  SELECT status INTO v_status
  FROM public.phone_change_requests
  WHERE id = v_request_id AND user_id = auth.uid();

  IF v_status IS DISTINCT FROM 'pending' THEN
    RAISE EXCEPTION 'FAIL 7: request is not visible as pending';
  END IF;

  BEGIN
    UPDATE public.phone_change_requests SET status = 'approved' WHERE id = v_request_id;
    RAISE EXCEPTION 'FAIL 8: direct request approval unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 8: direct request update denied';
  END;

  BEGIN
    DELETE FROM public.phone_change_requests WHERE id = v_request_id;
    RAISE EXCEPTION 'FAIL 9: direct request delete unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS 9: direct request delete denied';
  END;

  BEGIN
    PERFORM public.request_phone_change('+962791234570', 'A second request');
    RAISE EXCEPTION 'FAIL 10: second pending request unexpectedly succeeded';
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'PASS 10: duplicate pending request denied';
  END;

  RAISE NOTICE 'ALL H4 PHONE WRITE TESTS PASSED';
END;
$$;

RESET ROLE;
ROLLBACK;

SELECT 'H4 phone-write tests completed' AS result;
