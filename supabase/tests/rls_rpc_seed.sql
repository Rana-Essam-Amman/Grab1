-- rls_rpc_seed.sql
-- Fixtures for rls_security_rpc.sql (listings_by_seller security).
--
-- Separate from rls_security_seed.sql so RLS and RPC tests can evolve
-- independently. Different UUID prefix ranges (4xxx users, 5xxx listings)
-- guarantee no collision with the RLS seed.
--
-- Layout:
--   User X ─── 2 active JO  (phone +962790000001)
--            ├ 1 archived JO (must not appear)
--            └ 1 active SA   (must not appear in JO queries)
--   User Y ─── 1 active JO  (isolated from User X's results)
--
-- Committed. All test mutations are read-only; no rollback needed.

begin;

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('40000000-0000-4000-8000-000000000001'::uuid, 'authenticated', 'authenticated',
   'rpc-seller-x@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb),
  ('40000000-0000-4000-8000-000000000002'::uuid, 'authenticated', 'authenticated',
   'rpc-seller-y@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

insert into public.profiles (id, first_name, country_code)
values
  ('40000000-0000-4000-8000-000000000001'::uuid, 'RPC Seller X', 'JO'),
  ('40000000-0000-4000-8000-000000000002'::uuid, 'RPC Seller Y', 'JO')
on conflict (id) do nothing;

insert into public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, seller_phone, created_at
)
values
  -- User X: 2 active JO
  ('50000000-0000-4000-8000-000000000001'::uuid,
   '40000000-0000-4000-8000-000000000001'::uuid,
   'RPC X JO active 1', '', '1', 'JOD', 'JO', 'Amman', 'cars',
   'active', '+962790000001', now() - interval '1 hour'),
  ('50000000-0000-4000-8000-000000000002'::uuid,
   '40000000-0000-4000-8000-000000000001'::uuid,
   'RPC X JO active 2', '', '2', 'JOD', 'JO', 'Amman', 'cars',
   'active', '+962790000001', now() - interval '2 hours'),

  -- User X: 1 archived JO (must NOT appear)
  ('50000000-0000-4000-8000-000000000003'::uuid,
   '40000000-0000-4000-8000-000000000001'::uuid,
   'RPC X JO archived', '', '3', 'JOD', 'JO', 'Amman', 'cars',
   'archived', '+962790000001', now() - interval '3 hours'),

  -- User X: 1 active SA (must NOT appear in JO queries)
  ('50000000-0000-4000-8000-000000000004'::uuid,
   '40000000-0000-4000-8000-000000000001'::uuid,
   'RPC X SA active', '', '4', 'SAR', 'SA', 'Riyadh', 'cars',
   'active', '+962790000001', now() - interval '4 hours'),

  -- User Y: 1 active JO (must NOT appear in User X's results)
  ('50000000-0000-4000-8000-000000000005'::uuid,
   '40000000-0000-4000-8000-000000000002'::uuid,
   'RPC Y JO active', '', '5', 'JOD', 'JO', 'Amman', 'cars',
   'active', '+962790000002', now() - interval '5 hours')
on conflict (id) do nothing;

do $$
declare
  v_users int;
  v_profiles int;
  v_listings int;
begin
  select count(*) into v_users from auth.users
    where id in ('40000000-0000-4000-8000-000000000001'::uuid,
                 '40000000-0000-4000-8000-000000000002'::uuid);
  if v_users <> 2 then raise exception 'RPC SEED FAIL: users=%', v_users; end if;

  select count(*) into v_profiles from public.profiles
    where id in ('40000000-0000-4000-8000-000000000001'::uuid,
                 '40000000-0000-4000-8000-000000000002'::uuid);
  if v_profiles <> 2 then raise exception 'RPC SEED FAIL: profiles=%', v_profiles; end if;

  select count(*) into v_listings from public.listings
    where id in ('50000000-0000-4000-8000-000000000001'::uuid,
                 '50000000-0000-4000-8000-000000000002'::uuid,
                 '50000000-0000-4000-8000-000000000003'::uuid,
                 '50000000-0000-4000-8000-000000000004'::uuid,
                 '50000000-0000-4000-8000-000000000005'::uuid);
  if v_listings <> 5 then raise exception 'RPC SEED FAIL: listings=%', v_listings; end if;

  raise notice 'PASS: rls_rpc_seed loaded (2 users, 2 profiles, 5 listings)';
end $$;

commit;
