-- ============================================================================
-- Admin full override on public.listings
-- Grants Sufyanyounis83@gmail.com unrestricted UPDATE / DELETE / SELECT
-- on ANY listing regardless of owner.
-- Follows the existing admin-RPC pattern exactly:
--   - auth.uid() to identify caller
--   - email lookup from auth.users (no email column in profiles)
--   - lower() normalization on both sides
-- ============================================================================

begin;

-- 1. Reusable admin helper (matches existing admin RPC check verbatim)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select lower(coalesce(
    (select email from auth.users where id = auth.uid()),
    ''
  )) = 'sufyanyounis83@gmail.com'
$$;

-- 2. UPDATE: owner OR admin (full override — no field restrictions)
drop policy if exists "listings_update_own" on public.listings;
create policy "listings_update_own_or_admin" on public.listings
  for update
  to public
  using (
    auth.uid() = user_id
    or public.is_admin()
  )
  with check (
    auth.uid() = user_id
    or public.is_admin()
  );

-- 3. DELETE: owner OR admin
drop policy if exists "listings_delete_own" on public.listings;
create policy "listings_delete_own_or_admin" on public.listings
  for delete
  to public
  using (
    auth.uid() = user_id
    or public.is_admin()
  );

-- 4. SELECT: public active OR owner OR admin (admin sees hidden/archived/sold)
drop policy if exists "listings_select_public_or_owner" on public.listings;
create policy "listings_select_public_or_owner_or_admin" on public.listings
  for select
  to public
  using (
    status = 'active'
    or auth.uid() = user_id
    or public.is_admin()
  );

commit;
