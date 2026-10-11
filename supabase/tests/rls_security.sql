-- supabase/tests/rls_security.sql
-- Run in Supabase SQL Editor (production).
-- Wrapped in transaction + rollback — no state changes persist.
--
-- Contract verified:
--   1. anon sees 0 rows with status <> 'active'
--   2. anon cannot read 5 internal search tables
--   3. anon sees 0 profiles of non-active-sellers
--
-- Run manually:
--   Paste this file in Supabase SQL Editor → Run.
--   Expected: "ALL RLS TESTS PASSED" at the end.

begin;

-- Setup: flip one listing to archived so we have a non-active row to test against
update public.listings
set status = 'archived'
where id = (
  select id from public.listings
  where status = 'active'
  order by created_at desc
  limit 1
);

-- Test 1: anon sees ONLY active listings
set local role anon;
do $$
declare
  v_non_active int;
begin
  select count(*) into v_non_active
  from public.listings
  where status <> 'active';

  if v_non_active <> 0 then
    raise exception 'FAIL: anon saw % non-active listings', v_non_active;
  end if;
  raise notice 'PASS 1: anon sees 0 non-active listings';
end $$;
reset role;

-- Test 2: anon cannot read search_keywords
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.search_keywords limit 1';
    raise exception 'FAIL: anon can read search_keywords';
  exception
    when insufficient_privilege then
      raise notice 'PASS 2: anon blocked from search_keywords';
  end;
end $$;
reset role;

-- Test 3: anon cannot read listing_search_embeddings
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.listing_search_embeddings limit 1';
    raise exception 'FAIL: anon can read listing_search_embeddings';
  exception
    when insufficient_privilege then
      raise notice 'PASS 3: anon blocked from listing_search_embeddings';
  end;
end $$;
reset role;

-- Test 4: anon cannot read search_query_embeddings
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.search_query_embeddings limit 1';
    raise exception 'FAIL: anon can read search_query_embeddings';
  exception
    when insufficient_privilege then
      raise notice 'PASS 4: anon blocked from search_query_embeddings';
  end;
end $$;
reset role;

-- Test 5: anon cannot read search_embedding_jobs
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.search_embedding_jobs limit 1';
    raise exception 'FAIL: anon can read search_embedding_jobs';
  exception
    when insufficient_privilege then
      raise notice 'PASS 5: anon blocked from search_embedding_jobs';
  end;
end $$;
reset role;

-- Test 6: anon cannot read storage_orphans
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.storage_orphans limit 1';
    raise exception 'FAIL: anon can read storage_orphans';
  exception
    when insufficient_privilege then
      raise notice 'PASS 6: anon blocked from storage_orphans';
  end;
end $$;
reset role;

-- Test 7: anon sees no profiles of non-active-sellers
set local role anon;
do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.profiles p
  where not exists (
    select 1 from public.listings l
    where l.user_id = p.id and l.status = 'active'
  );
  if v_count <> 0 then
    raise exception 'FAIL: anon saw % non-active-seller profiles', v_count;
  end if;
  raise notice 'PASS 7: anon sees 0 non-active-seller profiles';
end $$;
reset role;

-- Cleanup: rollback everything, including the archived flip
rollback;

select 'ALL RLS TESTS PASSED' as result;
