-- rls_security_rpc.sql
-- Security tests for listings_by_seller.
--
-- This RPC is SECURITY DEFINER — it executes as its owner (postgres),
-- so RLS on public.listings is bypassed. The internal WHERE clauses
-- ARE the security boundary. These tests verify that boundary.
--
-- Requires rls_rpc_seed.sql to run first.
-- All reads only — no mutations, no rollback.

begin;

-- =========================================================================
-- PREREQ: fixtures present + function definition matches expectations.
-- =========================================================================
do $$
declare
  v_x uuid := '40000000-0000-4000-8000-000000000001'::uuid;
  v_y uuid := '40000000-0000-4000-8000-000000000002'::uuid;
  v_count int;
  v_secdef boolean;
begin
  select count(*) into v_count from public.listings
    where user_id in (v_x, v_y);
  if v_count <> 5 then raise exception 'PREREQ FAIL: expected 5 listings, got %', v_count; end if;

  select prosecdef into v_secdef from pg_proc
    where proname = 'listings_by_seller'
      and pronamespace = 'public'::regnamespace;
  if not v_secdef then
    raise exception 'PREREQ FAIL: listings_by_seller is not SECURITY DEFINER';
  end if;
end $$;

-- =========================================================================
-- R1: UUID key → active-only (archived must NOT leak)
-- User X has 2 active JO + 1 archived JO. Expect exactly 2 rows.
-- =========================================================================
do $$
declare
  v_ids uuid[];
begin
  select array_agg(id) into v_ids from public.listings_by_seller(
    p_seller_key => '40000000-0000-4000-8000-000000000001',
    p_market => null,
    p_limit => 100
  );

  if v_ids is null then raise exception 'R1 FAIL: no rows returned'; end if;
  if array_length(v_ids, 1) <> 2 then
    raise exception 'R1 FAIL: expected 2 active rows, got % (%)',
      array_length(v_ids, 1), v_ids;
  end if;
  if '50000000-0000-4000-8000-000000000003'::uuid = any(v_ids) then
    raise exception 'R1 FAIL: archived listing leaked';
  end if;

  raise notice 'PASS R1: UUID key returns active-only (archived excluded)';
end $$;

-- =========================================================================
-- R2: p_market scoping — JO query must NOT return SA listings
-- User X has 2 active JO + 1 active SA. JO query → 2 rows, SA query → 1.
-- =========================================================================
do $$
declare
  v_jo_count int;
  v_sa_count int;
begin
  select count(*) into v_jo_count from public.listings_by_seller(
    p_seller_key => '40000000-0000-4000-8000-000000000001',
    p_market => 'JO',
    p_limit => 100
  );

  select count(*) into v_sa_count from public.listings_by_seller(
    p_seller_key => '40000000-0000-4000-8000-000000000001',
    p_market => 'SA',
    p_limit => 100
  );

  if v_jo_count <> 2 then
    raise exception 'R2 FAIL: JO count=% expected 2', v_jo_count;
  end if;
  if v_sa_count <> 1 then
    raise exception 'R2 FAIL: SA count=% expected 1', v_sa_count;
  end if;

  raise notice 'PASS R2: market filter isolates JO from SA';
end $$;

-- =========================================================================
-- R3: phone key → user_id resolution (Session 14 regression guard)
-- User X's phone (+962790000001) must return BOTH active JO listings,
-- not just one (v1 bug returned a single row per phone match).
-- =========================================================================
do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.listings_by_seller(
    p_seller_key => '+962790000001',
    p_market => 'JO',
    p_limit => 100
  );

  if v_count <> 2 then
    raise exception 'R3 FAIL: phone key returned % rows, expected 2 (Session 14 regression)',
      v_count;
  end if;

  raise notice 'PASS R3: phone key resolves to user_id and returns all active listings';
end $$;

-- =========================================================================
-- R4: caller isolation — User X's key must NOT return User Y's listing
-- =========================================================================
do $$
declare
  v_ids uuid[];
begin
  select array_agg(id) into v_ids from public.listings_by_seller(
    p_seller_key => '40000000-0000-4000-8000-000000000001',
    p_market => 'JO',
    p_limit => 100
  );

  if '50000000-0000-4000-8000-000000000005'::uuid = any(v_ids) then
    raise exception 'R4 FAIL: user Y listing leaked into user X results';
  end if;

  raise notice 'PASS R4: caller isolation — user Y listings not in user X results';
end $$;

rollback;

select 'ALL RPC SECURITY TESTS PASSED' as result;
