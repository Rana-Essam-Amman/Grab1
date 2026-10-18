-- ============================================================================
-- Restore is_demo filter on listings SELECT policy
-- 20261104 accidentally dropped the is_demo = false filter when adding
-- admin override. Result: 80 active demo listings became visible to anon.
-- This migration restores the filter while keeping admin override intact.
-- Reference: 20261087_demo_public_filtering.sql original syntax.
-- ============================================================================

begin;

drop policy if exists "listings_select_public_or_owner_or_admin" on public.listings;

create policy "listings_select_public_or_owner_or_admin" on public.listings
  for select
  to public
  using (
    (auth.uid() = user_id)
    or (status = 'active' and is_demo = false)
    or public.is_admin()
  );

commit;
