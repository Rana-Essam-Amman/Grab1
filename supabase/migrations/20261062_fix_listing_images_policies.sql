-- 20261062_fix_listing_images_policies.sql
-- Fix misconfigured listing-images RLS policies.
--
-- Discovered (Session 15): storage.objects had 4 INSERT policies for
-- bucket 'listing-images', 3 of them wrong:
--   - "public_read 1i0okip_0"     cmd=INSERT role=public   → anon can upload
--   - "auth_upload 1i0okip_0"     cmd=INSERT no foldername → cross-user upload
--   - "auth_delete_own 1i0okip_0" cmd=INSERT no foldername → misnamed
-- Only "auth_upload" (with foldername check) was correct.
--
-- Additionally, NO DELETE policy existed, so supabase.storage.remove()
-- failed silently — orphan images accumulated until the daily
-- service_role cleanup job.
--
-- PostgreSQL combines permissive policies with OR, so a single loose
-- policy bypasses the folder restriction. Dropping all and recreating
-- the intended set.
--
-- Also runs on CI's disposable Postgres (bootstrap creates storage.objects
-- without these policies), so this migration is the source of truth.

begin;

-- Drop all existing listing-images policies (bad + the one good one).
drop policy if exists "public_read 1i0okip_0" on storage.objects;
drop policy if exists "auth_upload 1i0okip_0" on storage.objects;
drop policy if exists "auth_delete_own 1i0okip_0" on storage.objects;
drop policy if exists "auth_upload" on storage.objects;
drop policy if exists "auth_delete_own" on storage.objects;

-- INSERT: authenticated users upload only inside their own folder.
create policy "auth_upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- DELETE: authenticated users delete only inside their own folder.
-- Required by removeListingImages (rollback on publish failure +
-- deleteListing). No UPDATE policy: no code path calls storage.update().
create policy "auth_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

commit;
