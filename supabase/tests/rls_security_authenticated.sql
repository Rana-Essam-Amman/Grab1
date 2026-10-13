-- rls_security_authenticated.sql
-- Authenticated RLS coverage. Complements rls_security.sql (anon).
--
-- rls_security.sql Test 8 runs as superuser (no SET LOCAL ROLE), so it
-- tests the SECURITY DEFINER trigger, NOT the RLS policy. These 3 tests
-- switch to the `authenticated` role and set request.jwt.claims to
-- exercise the actual listings_insert_own and
-- profiles_read_self_or_active_sellers policies.
--
-- Requires bootstrap_auth_stubs.sql to run first (auth.uid()/auth.jwt()
-- read request.jwt.claims in production; the anon-only stub returns
-- NULL, which would make every authenticated test fail spuriously).
--
-- Requires rls_security_seed.sql (2 users, 2 listings, 2 profiles).
--
-- Wrapped in a transaction. All mutations roll back.

begin;

-- Sanity: prerequisites must be in place, otherwise abort loudly.
do $$
declare
  v_user_a uuid := '20000000-0000-4000-8000-000000000001'::uuid;
  v_user_b uuid := '20000000-0000-4000-8000-000000000002'::uuid;
  v_count int;
begin
  select count(*) into v_count
  from auth.users where id in (v_user_a, v_user_b);
  if v_count <> 2 then
    raise exception 'PREREQ FAIL: expected 2 seeded auth.users, got %', v_count;
  end if;

  select count(*) into v_count
  from public.profiles where id in (v_user_a, v_user_b);
  if v_count <> 2 then
    raise exception 'PREREQ FAIL: expected 2 seeded profiles, got %', v_count;
  end if;

  if (select rolbypassrls from pg_roles where rolname = 'authenticated') then
    raise exception 'PREREQ FAIL: authenticated has BYPASSRLS — tests would be void';
  end if;

  if not (select relrowsecurity from pg_class
          where relname = 'listings'
            and relnamespace = 'public'::regnamespace) then
    raise exception 'PREREQ FAIL: RLS not enabled on listings';
  end if;
end $$;

-- =========================================================================
-- A1: authenticated user inserts own listing → succeeds
-- Proves: auth.uid() resolves, is_anonymous=false, country matches profile.
-- =========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';

do $$
declare
  v_uid uuid;
  v_country text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'A1 FAIL: auth.uid() returned NULL under authenticated role';
  end if;
  if v_uid <> '20000000-0000-4000-8000-000000000001'::uuid then
    raise exception 'A1 FAIL: auth.uid()=% expected 20000000-...-0001', v_uid;
  end if;

  select country_code into v_country from public.profiles where id = v_uid;
  if v_country is null then
    raise exception 'A1 FAIL: profile missing for seeded user';
  end if;

  insert into public.listings (
    user_id, title, description, price, country_code,
    city, category_slug, status
  ) values (
    v_uid, 'A1 Own Insert', 'auth rls test', '1', v_country,
    'Amman', 'cars', 'active'
  );

  raise notice 'PASS A1: authenticated user inserted own listing';
end $$;

reset role;
reset request.jwt.claims;

-- =========================================================================
-- A2: authenticated user inserts listing for another user → RLS denial
-- Must fail with SQLSTATE 42501 (insufficient_privilege), not FK or other.
-- =========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';

do $$
declare
  v_sqlstate text;
  v_msg text;
  v_target_country text;
begin
  -- Ensure target user B exists so a FK error can't mask the RLS denial.
  select country_code into v_target_country
  from public.profiles where id = '20000000-0000-4000-8000-000000000002'::uuid;
  if v_target_country is null then
    raise exception 'A2 SETUP FAIL: target user B profile missing — FK would obscure RLS';
  end if;

  begin
    insert into public.listings (
      user_id, title, description, price, country_code,
      city, category_slug, status
    ) values (
      '20000000-0000-4000-8000-000000000002'::uuid,
      'A2 Cross Insert', 'auth rls test', '1', v_target_country,
      'Amman', 'cars', 'active'
    );
    raise exception 'A2 FAIL: insert for another user_id succeeded — RLS bypassed';
  exception
    when sqlstate '42501' then
      raise notice 'PASS A2: cross-user insert denied with SQLSTATE 42501 (RLS)';
    when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      raise exception 'A2 FAIL: unexpected error sqlstate=% msg=%', v_sqlstate, v_msg;
  end;
end $$;

reset role;
reset request.jwt.claims;

-- =========================================================================
-- A3: authenticated user reads profile of non-active-seller → 0 rows
-- Fixture check ensures the 0 rows is RLS, not missing data.
-- =========================================================================
do $$
declare
  v_b_profile_count int;
  v_b_active_listings int;
begin
  -- Sanity: user B HAS a profile (so a 0-row read is meaningful).
  select count(*) into v_b_profile_count
  from public.profiles where id = '20000000-0000-4000-8000-000000000002'::uuid;
  if v_b_profile_count <> 1 then
    raise exception 'A3 SETUP FAIL: user B profile missing — 0-row read meaningless';
  end if;

  -- Sanity: user B has zero active listings (post-seed invariant).
  select count(*) into v_b_active_listings
  from public.listings
  where user_id = '20000000-0000-4000-8000-000000000002'::uuid
    and status = 'active';
  if v_b_active_listings <> 0 then
    raise exception 'A3 SETUP FAIL: user B has % active listings, expected 0',
      v_b_active_listings;
  end if;
end $$;

set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';

do $$
declare
  v_visible int;
begin
  select count(*) into v_visible
  from public.profiles
  where id = '20000000-0000-4000-8000-000000000002'::uuid;

  if v_visible <> 0 then
    raise exception 'A3 FAIL: user A saw user B''s profile (% rows) — RLS leak', v_visible;
  end if;

  raise notice 'PASS A3: non-active-seller profile hidden from other authenticated user';
end $$;

reset role;
reset request.jwt.claims;

rollback;

select 'ALL AUTHENTICATED RLS TESTS PASSED' as result;
