-- rls_security_profiles.sql
-- Regression coverage for the profiles.phone closure (Phase C).
--
-- Guards against any future migration that re-grants SELECT on
-- profiles.phone to anon/authenticated, or re-exposes get_own_phone()
-- to anon.
--
-- Requires:
--   - bootstrap_auth_stubs.sql (auth.uid / auth.jwt read JWT claims)
--   - rls_security_seed.sql (user A = ...0001, user B = ...0002)
--
-- Wrapped in a transaction. All mutations roll back.

begin;

-- =========================================================================
-- PREREQ: seed fixtures present + prerequisites met
-- =========================================================================
do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.profiles
    where id in (
      '20000000-0000-4000-8000-000000000001'::uuid,
      '20000000-0000-4000-8000-000000000002'::uuid
    );
  if v_count <> 2 then
    raise exception 'PREREQ FAIL: expected 2 seeded profiles, got %', v_count;
  end if;
end $$;

-- =========================================================================
-- P1: anon cannot SELECT profiles.phone
-- =========================================================================
set local role anon;
do $$
declare
  v_sqlstate text;
  v_msg text;
begin
  begin
    perform phone from public.profiles limit 1;
    raise exception 'P1 FAIL: anon read profiles.phone — RLS leak';
  exception
    when sqlstate '42501' then
      raise notice 'PASS P1: anon denied SELECT profiles.phone';
    when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      raise exception 'P1 FAIL: unexpected sqlstate=% msg=%', v_sqlstate, v_msg;
  end;
end $$;
reset role;

-- =========================================================================
-- P2: authenticated cannot SELECT profiles.phone (own row either)
-- =========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';
do $$
declare
  v_sqlstate text;
  v_msg text;
begin
  begin
    perform phone from public.profiles
      where id = '20000000-0000-4000-8000-000000000001'::uuid;
    raise exception 'P2 FAIL: authenticated read own profiles.phone';
  exception
    when sqlstate '42501' then
      raise notice 'PASS P2: authenticated denied SELECT profiles.phone';
    when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      raise exception 'P2 FAIL: unexpected sqlstate=% msg=%', v_sqlstate, v_msg;
  end;
end $$;
reset role;
reset request.jwt.claims;

-- =========================================================================
-- P3: anon cannot EXECUTE get_own_phone()
-- =========================================================================
set local role anon;
do $$
declare
  v_sqlstate text;
  v_msg text;
begin
  begin
    perform public.get_own_phone();
    raise exception 'P3 FAIL: anon executed get_own_phone';
  exception
    when sqlstate '42501' then
      raise notice 'PASS P3: anon denied EXECUTE get_own_phone';
    when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      raise exception 'P3 FAIL: unexpected sqlstate=% msg=%', v_sqlstate, v_msg;
  end;
end $$;
reset role;

-- =========================================================================
-- P4: authenticated get_own_phone() returns CALLER's own phone only
-- =========================================================================
-- Seed distinct phones so a leak (returning another user's phone) is
-- observable. Both are cleared by the outer ROLLBACK.
update public.profiles set phone = '+962790000001'
  where id = '20000000-0000-4000-8000-000000000001'::uuid;
update public.profiles set phone = '+962790000002'
  where id = '20000000-0000-4000-8000-000000000002'::uuid;

set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-4000-8000-000000000001","is_anonymous":false}';

do $$
declare
  v_a_phone text;
  v_b_phone text;
begin
  v_a_phone := public.get_own_phone();
  if v_a_phone is distinct from '+962790000001' then
    raise exception 'P4 FAIL: user A got % expected +962790000001', coalesce(v_a_phone, 'NULL');
  end if;

  perform set_config(
    'request.jwt.claims',
    '{"sub":"20000000-0000-4000-8000-000000000002","is_anonymous":false}',
    true
  );

  v_b_phone := public.get_own_phone();
  if v_b_phone is distinct from '+962790000002' then
    raise exception 'P4 FAIL: user B got % expected +962790000002', coalesce(v_b_phone, 'NULL');
  end if;

  if v_a_phone = v_b_phone then
    raise exception 'P4 FAIL: A and B returned same phone (% = %)', v_a_phone, v_b_phone;
  end if;

  raise notice 'PASS P4: get_own_phone() scoped to auth.uid()';
end $$;

reset role;
reset request.jwt.claims;

rollback;

select 'ALL PROFILES PHONE TESTS PASSED' as result;
