-- rls_security_authenticated.sql
-- Authenticated RLS coverage. Complements rls_security.sql (anon).
--
-- rls_security.sql Test 8 runs as superuser (no SET LOCAL ROLE), so it
-- tests the SECURITY DEFINER trigger, NOT the RLS policy. These 3 tests
-- switch to the `authenticated` role and set request.jwt.claims to
-- exercise the actual listings_insert_own and
-- profiles_read_self_or_active_sellers policies.
--
-- Requires bootstrap_auth_stubs.sql to run first.
-- Requires rls_security_seed.sql (2 users, 2 listings, 2 profiles).
-- Wrapped in a transaction. All mutations roll back.

begin;

-- PREREQ: verify fixtures + capture countries BEFORE any role switch.
-- (Once `set local role authenticated` runs, RLS filters user B's profile.)
do $$
declare
  v_user_a uuid := '20000000-0000-4000-8000-000000000001'::uuid;
  v_user_b uuid := '20000000-0000-4000-8000-000000000002'::uuid;
  v_count int;
  v_country_a text;
  v_country_b text;
begin
  select count(*) into v_count from auth.users where id in (v_user_a, v_user_b);
  if v_count <> 2 then raise exception 'PREREQ FAIL: auth.users x2 (got %)', v_count; end if;

  select count(*) into v_count from public.profiles where id in (v_user_a, v_user_b);
  if v_count <> 2 then raise exception 'PREREQ FAIL: profiles x2 (got %)', v_count; end if;

  select country_code into v_country_a from public.profiles where id = v_user_a;
  if v_country_a is null then raise exception 'PREREQ FAIL: user A country missing'; end if;

  select country_code into v_country_b from public.profiles where id = v_user_b;
  if v_country_b is null then raise exception 'PREREQ FAIL: user B country missing'; end if;

  perform set_config('fox.country_a', v_country_a, true);
  perform set_config('fox.country_b', v_country_b, true);

  if (select rolbypassrls from pg_roles where rolname = 'authenticated') then
    raise exception 'PREREQ FAIL: authenticated has BYPASSRLS';
  end if;
  if not (select relrowsecurity from pg_class
          where relname = 'listings' and relnamespace = 'public'::regnamespace) then
    raise exception 'PREREQ FAIL: RLS not enabled on listings';
  end if;
end $$;

-- =========================================================================
-- A1: authenticated user inserts own listing → succeeds
-- =========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';

do $$
declare
  v_uid uuid;
  v_country text := current_setting('fox.country_a', true);
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'A1 FAIL: auth.uid() NULL'; end if;
  if v_uid <> '20000000-0000-4000-8000-000000000001'::uuid then
    raise exception 'A1 FAIL: auth.uid()=%', v_uid;
  end if;
  if v_country is null then raise exception 'A1 FAIL: country_a not set'; end if;

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
-- Must fail with SQLSTATE 42501 (insufficient_privilege), not FK.
-- =========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';

do $$
declare
  v_sqlstate text;
  v_msg text;
  v_country_a text := current_setting('fox.country_a', true);
begin
  if v_country_a is null then raise exception 'A2 FAIL: country_a not set'; end if;

  begin
    insert into public.listings (
      user_id, title, description, price, country_code,
      city, category_slug, status
    ) values (
      '20000000-0000-4000-8000-000000000002'::uuid,
      'A2 Cross Insert', 'auth rls test', '1', v_country_a,
      'Amman', 'cars', 'active'
    );
    raise exception 'A2 FAIL: insert for another user_id succeeded — RLS bypassed';
  exception
    when sqlstate '42501' then
      raise notice 'PASS A2: cross-user insert denied with SQLSTATE 42501 (RLS)';
    when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      raise exception 'A2 FAIL: unexpected sqlstate=% msg=%', v_sqlstate, v_msg;
  end;
end $$;

reset role;
reset request.jwt.claims;

-- =========================================================================
-- A3: authenticated user reads profile of non-active-seller → 0 rows
-- =========================================================================
do $$
declare
  v_b_profile int;
  v_b_active int;
begin
  select count(*) into v_b_profile from public.profiles
    where id = '20000000-0000-4000-8000-000000000002'::uuid;
  if v_b_profile <> 1 then
    raise exception 'A3 SETUP FAIL: user B profile missing — 0-row read meaningless';
  end if;

  select count(*) into v_b_active from public.listings
    where user_id = '20000000-0000-4000-8000-000000000002'::uuid
      and status = 'active';
  if v_b_active <> 0 then
    raise exception 'A3 SETUP FAIL: user B has % active listings, expected 0', v_b_active;
  end if;
end $$;

set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';

do $$
declare
  v_visible int;
begin
  select count(*) into v_visible from public.profiles
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
