-- 20261026_rls_security_fix.sql
-- Session 8 — Critical RLS hardening (idempotent + drift-safe)
--
-- Fixes:
--   1. anon/authenticated had write access on 5 internal search tables
--   2. profiles read exposed to any visitor
--   3. listings_read_all = true → any visitor reads drafts/sold/archived
--
-- Drift note (2026-10-12): listing_search_embeddings, search_query_embeddings,
-- and search_embedding_jobs exist on production but are not created by any
-- migration. This migration only touches them if they exist, so a fresh
-- Postgres (CI) does not fail. Follow-up 20261028_capture_semantic_drift.sql
-- will capture their schema.

-- 1. Listings — public reads active only; owner reads own
drop policy if exists listings_read_all on public.listings;
drop policy if exists listings_select_public_or_owner on public.listings;

create policy listings_select_public_or_owner
  on public.listings for select to public
  using (status = 'active' or auth.uid() = user_id);

-- 2. Profiles — self or active sellers
drop policy if exists profiles_read_all on public.profiles;
drop policy if exists profiles_read_self_or_active_sellers on public.profiles;

create policy profiles_read_self_or_active_sellers
  on public.profiles for select to public
  using (
    auth.uid() = id
    or exists (
      select 1 from public.listings
      where listings.user_id = profiles.id and listings.status = 'active'
    )
  );

-- 3. Internal search tables — revoke + enable RLS (only if they exist)
do $$
declare
  t text;
  tables text[] := array[
    'search_keywords',
    'listing_search_embeddings',
    'search_query_embeddings',
    'search_embedding_jobs',
    'storage_orphans'
  ];
begin
  foreach t in array tables loop
    if exists (
      select 1 from pg_tables
      where schemaname = 'public' and tablename = t
    ) then
      execute format('revoke all on public.%I from anon, authenticated', t);
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;
