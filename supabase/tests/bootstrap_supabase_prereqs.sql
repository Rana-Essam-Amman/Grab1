-- Disposable-test prerequisites only.
-- These objects are provided by the Supabase platform and are not created by
-- repository migrations. They exist so a fresh PostgreSQL service container
-- can apply the checked-in migration chain. This is not a production schema
-- and must never be applied to hosted Supabase.
--
-- Exact platform gap: public migrations reference auth.users, auth.uid(),
-- storage.objects, storage.buckets, and storage.foldername. Those schemas
-- are not in supabase/migrations/.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Supabase platform roles referenced by RLS policies and GRANTs.
-- Not created by repository migrations.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
  END IF;
END
$$;

-- Supabase realtime publication referenced by chat migration.
-- Platform-provided; not created by repository migrations.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY,
  aud text,
  role text,
  email text,
  encrypted_password text,
  email_confirmed_at timestamptz,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULL::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT '{}'::jsonb;
$$;

CREATE SCHEMA IF NOT EXISTS storage;

-- Storage.objects — referenced by listing-images RLS policies.
CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text,
  name text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Storage.buckets — referenced by the avatars bucket migration (20261059).
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  owner uuid,
  public boolean DEFAULT false,
  avif_autodetection boolean DEFAULT false,
  file_size_limit bigint,
  allowed_mime_types text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- storage.foldername(name) — returns the folder components of a path.
-- Used in RLS policies that gate uploads to <uid>/.
-- Supabase platform provides this; we stub it for the disposable postgres.
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1];
$$;

-- ---------------------------------------------------------------------------
-- Baseline privileges (mirrors Supabase platform defaults).
--
-- Supabase grants USAGE on schema public and default table/function
-- privileges to anon/authenticated. Bootstrap creates the roles but not
-- the grants, so `set local role anon` in rls_security.sql fails with
-- "permission denied for table listings" before RLS can evaluate.
--
-- Individual migrations REVOKE sensitive tables (search_keywords, etc.),
-- so the effective post-migration state matches production.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

alter default privileges in schema public
  grant select on tables to anon;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant all on tables to service_role;

alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated, service_role;

alter default privileges in schema public
  grant execute on functions to anon, authenticated, service_role;

-- Storage schema access (mirrors Supabase platform grants).
grant usage on schema storage to anon, authenticated, service_role;
grant select on storage.buckets to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;
grant all on storage.buckets, storage.objects to service_role;
