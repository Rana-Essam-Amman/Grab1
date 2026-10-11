-- 20261026_rls_security_fix.sql
-- Session 8 — Critical RLS hardening (idempotent)
-- Fixes:
--   1. anon/authenticated had write access on 5 internal search tables
--   2. profiles read exposed to any visitor
--   3. listings_read_all = true → any visitor reads drafts/sold/archived

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

-- 3. Internal search tables — revoke + enable RLS
revoke all on public.search_keywords from anon, authenticated;
revoke all on public.listing_search_embeddings from anon, authenticated;
revoke all on public.search_query_embeddings from anon, authenticated;
revoke all on public.search_embedding_jobs from anon, authenticated;
revoke all on public.storage_orphans from anon, authenticated;

alter table public.search_keywords enable row level security;
alter table public.listing_search_embeddings enable row level security;
alter table public.search_query_embeddings enable row level security;
alter table public.search_embedding_jobs enable row level security;
alter table public.storage_orphans enable row level security;
