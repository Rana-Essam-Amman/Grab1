-- ============================================================================
-- Admin storage override on listing-images bucket
-- Grants Sufyanyounis83@gmail.com full INSERT/DELETE/UPDATE on any folder
-- Enables admin to edit images on ANY listing (not just own).
-- Pattern: same as listings RLS — admin bypass via public.is_admin().
-- ============================================================================

begin;

drop policy if exists "admin_upload_any_folder" on storage.objects;
create policy "admin_upload_any_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and public.is_admin()
  );

drop policy if exists "admin_delete_any_folder" on storage.objects;
create policy "admin_delete_any_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and public.is_admin()
  );

drop policy if exists "admin_update_any_folder" on storage.objects;
create policy "admin_update_any_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'listing-images'
    and public.is_admin()
  )
  with check (
    bucket_id = 'listing-images'
    and public.is_admin()
  );

commit;
