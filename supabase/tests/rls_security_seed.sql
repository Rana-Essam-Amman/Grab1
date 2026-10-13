-- rls_security_seed.sql
-- Deterministic seed for rls_security.sql.
--
-- Why this exists: on an empty DB, rls_security.sql passes trivially
-- (0 rows = 0 violations). This seed ensures the 8 assertions actually
-- exercise the RLS boundary with real data.
--
-- Runs BEFORE rls_security.sql in CI (test-search-rpc-local.sh).
-- Committed (not rolled back) so rls_security.sql can read it.
-- rls_security.sql's own transaction rolls back its Test-1 mutation,
-- so the seed data survives unmodified for the next assertion.
--
-- Fixtures:
--   Seller A → 1 active listing   (Test 1 will archive it)
--   Seller B → 1 archived listing (already non-active)
--   After Test 1: both have 0 active listings → their profiles must be
--   invisible to anon (Test 7).

begin;

-- Synthetic auth users (FK target for listings.user_id and profiles.id).
insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('20000000-0000-4000-8000-000000000001'::uuid, 'authenticated', 'authenticated',
   'rls-seller-a@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb),
  ('20000000-0000-4000-8000-000000000002'::uuid, 'authenticated', 'authenticated',
   'rls-seller-b@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

-- Profiles.
insert into public.profiles (id, first_name, country_code)
values
  ('20000000-0000-4000-8000-000000000001'::uuid, 'Seller A', 'JO'),
  ('20000000-0000-4000-8000-000000000002'::uuid, 'Seller B', 'JO')
on conflict (id) do nothing;

-- Listings: one active (will be flipped by Test 1), one archived.
insert into public.listings (id, user_id, title, description, price, city, category_slug, status, created_at)
values
  ('30000000-0000-4000-8000-000000000001'::uuid,
   '20000000-0000-4000-8000-000000000001'::uuid,
   'RLS Seed Active', 'Test fixture', '100', 'Amman', 'cars', 'active',
   now() - interval '1 hour'),
  ('30000000-0000-4000-8000-000000000002'::uuid,
   '20000000-0000-4000-8000-000000000002'::uuid,
   'RLS Seed Archived', 'Test fixture', '200', 'Amman', 'cars', 'archived',
   now() - interval '2 hours')
on conflict (id) do nothing;

-- Verify the seed landed. Fails loudly if any row is missing.
do $$
declare
  v_users int;
  v_profiles int;
  v_active int;
  v_archived int;
begin
  select count(*) into v_users
  from auth.users
  where id in ('20000000-0000-4000-8000-000000000001'::uuid,
               '20000000-0000-4000-8000-000000000002'::uuid);

  select count(*) into v_profiles
  from public.profiles
  where id in ('20000000-0000-4000-8000-000000000001'::uuid,
               '20000000-0000-4000-8000-000000000002'::uuid);

  select count(*) into v_active
  from public.listings
  where id = '30000000-0000-4000-8000-000000000001'::uuid and status = 'active';

  select count(*) into v_archived
  from public.listings
  where id = '30000000-0000-4000-8000-000000000002'::uuid and status = 'archived';

  if v_users <> 2 then raise exception 'SEED FAIL: expected 2 users, got %', v_users; end if;
  if v_profiles <> 2 then raise exception 'SEED FAIL: expected 2 profiles, got %', v_profiles; end if;
  if v_active <> 1 then raise exception 'SEED FAIL: expected 1 active listing, got %', v_active; end if;
  if v_archived <> 1 then raise exception 'SEED FAIL: expected 1 archived listing, got %', v_archived; end if;

  raise notice 'PASS: rls_security_seed loaded (2 users, 2 profiles, 1 active, 1 archived)';
end $$;

commit;
