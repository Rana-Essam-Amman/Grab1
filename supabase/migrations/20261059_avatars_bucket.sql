-- 20261059_avatars_bucket.sql
-- Session 13 — create avatars storage bucket + RLS.
--
-- Currently the only bucket is 'listing-images'. Avatar uploads have no
-- home. Local avatars live as base64 data URLs in Zustand, which do not
-- survive refresh (or appear on other devices).
--
-- Creates:
--   - bucket 'avatars' (public read, 2 MB max, jpeg/png/webp)
--   - RLS: authenticated users upload to avatars/<their-uid>/*
--   - RLS: public read of all objects
--
-- Idempotent. Safe to re-apply.

begin;

-- 1) Create bucket (idempotent).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 2) RLS policies on storage.objects for the avatars bucket.
--    Drop first so re-apply is safe.

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_auth_insert" on storage.objects;
create policy "avatars_auth_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

drop policy if exists "avatars_auth_update" on storage.objects;
create policy "avatars_auth_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

drop policy if exists "avatars_auth_delete" on storage.objects;
create policy "avatars_auth_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

commit;
