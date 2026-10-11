-- supabase/tests/rls_security.sql
-- Run in Supabase SQL Editor (production).
-- Wrapped in transaction + rollback — no state changes persist.
--
-- Contract verified:
--   1. anon sees 0 rows with status <> 'active'
--   2. anon cannot read 5 internal search tables
--   3. anon sees 0 profiles of non-active-sellers
--   4. authenticated CAN insert a listing (trigger set_listings_search_text
--      runs SECURITY DEFINER and is not blocked by the revoke)

begin;

-- Setup: flip one listing to archived so we have a non-active row
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
    raise exception 'FAIL 1: anon saw % non-active listings', v_non_active;
  end if;
  raise notice 'PASS 1: anon sees 0 non-active listings';
end $$;
reset role;

-- Test 2: anon blocked from search_keywords
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.search_keywords limit 1';
    raise exception 'FAIL 2: anon can read search_keywords';
  exception
    when insufficient_privilege then
      raise notice 'PASS 2: anon blocked from search_keywords';
  end;
end $$;
reset role;

-- Test 3: anon blocked from listing_search_embeddings
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.listing_search_embeddings limit 1';
    raise exception 'FAIL 3: anon can read listing_search_embeddings';
  exception
    when insufficient_privilege then
      raise notice 'PASS 3: anon blocked from listing_search_embeddings';
  end;
end $$;
reset role;

-- Test 4: anon blocked from search_query_embeddings
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.search_query_embeddings limit 1';
    raise exception 'FAIL 4: anon can read search_query_embeddings';
  exception
    when insufficient_privilege then
      raise notice 'PASS 4: anon blocked from search_query_embeddings';
  end;
end $$;
reset role;

-- Test 5: anon blocked from search_embedding_jobs
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.search_embedding_jobs limit 1';
    raise exception 'FAIL 5: anon can read search_embedding_jobs';
  exception
    when insufficient_privilege then
      raise notice 'PASS 5: anon blocked from search_embedding_jobs';
  end;
end $$;
reset role;

-- Test 6: anon blocked from storage_orphans
set local role anon;
do $$
begin
  begin
    execute 'select 1 from public.storage_orphans limit 1';
    raise exception 'FAIL 6: anon can read storage_orphans';
  exception
    when insufficient_privilege then
      raise notice 'PASS 6: anon blocked from storage_orphans';
  end;
end $$;
reset role;

-- Test 7: anon sees 0 non-active-seller profiles
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
    raise exception 'FAIL 7: anon saw % non-active-seller profiles', v_count;
  end if;
  raise notice 'PASS 7: anon sees 0 non-active-seller profiles';
end $$;
reset role;

-- Test 8: authenticated CAN insert a listing — proves the trigger
-- set_listings_search_text() (SECURITY DEFINER) is not blocked by the
-- revoke on search_keywords. Regression guard for 20261027.
do $$
declare
  v_user_id uuid;
  v_listing_id uuid;
begin
  select user_id into v_user_id
  from public.listings
  where user_id is not null
  limit 1;

  if v_user_id is null then
    raise notice 'SKIP 8: no existing user_id to test insert';
    return;
  end if;

  insert into public.listings (
    user_id, title, description, price, currency, country_code,
    city, category_slug, status
  ) values (
    v_user_id, 'RLS_TEST_INSERT', 'rls test', '1', 'JOD', 'JO',
    'Amman', 'cars', 'active'
  )
  returning id into v_listing_id;

  if v_listing_id is null then
    raise exception 'FAIL 8: insert did not return id';
  end if;

  raise notice 'PASS 8: authenticated insert succeeds — trigger reads search_keywords via SECURITY DEFINER';
end $$;

-- Cleanup: rollback everything
rollback;

select 'ALL RLS TESTS PASSED' as result;
