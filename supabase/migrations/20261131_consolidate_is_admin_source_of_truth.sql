-- ============================================================================
-- Fix F1.1: Consolidate public.is_admin() source of truth
-- ----------------------------------------------------------------------------
-- Problem (schema drift):
--   20261104_admin_full_override.sql defines public.is_admin() using a
--   hard-coded email comparison against auth.users. But the deployed database
--   uses a table-based version that reads public.admins. On any fresh
--   environment (`supabase db reset`, CI, staging), the migration replays the
--   hard-coded version and silently overrides the deployed one.
--
--   This matters because the F1 fix (20261130's
--   trg_prevent_listing_market_change) calls public.is_admin() as its admin
--   bypass. If is_admin() drifts between environments, the market-integrity
--   guarantee drifts with it.
--
-- Fix:
--   This migration runs AFTER 20261104 and AFTER 20261130, and is idempotent.
--   It:
--     1. Ensures public.admins exists (no-op if the deployed table already does).
--     2. Enables RLS (no policies = deny all for anon/authenticated, as designed).
--     3. Seeds the known admin email (idempotent).
--     4. Redefines public.is_admin() to the table-based implementation.
--
-- Result:
--   - Fresh environments: full schema rebuilt from migrations, is_admin() works.
--   - Deployed environment: is_admin() unchanged in behavior (same body already).
--   - No more silent override on `db push`.
-- ============================================================================

begin;

-- 1. Ensure public.admins exists (idempotent). Minimal shape only —
--    on environments where the table already exists with more columns,
--    CREATE IF NOT EXISTS is a no-op.
create table if not exists public.admins (
  email text primary key
);

-- 2. Lock down the table. RLS enabled + zero policies = deny all for
--    anon/authenticated. service_role (with BYPASSRLS) is unaffected.
--    This matches the deployed state verified in the F1.1 audit.
alter table public.admins enable row level security;

-- 3. Seed the known admin. Idempotent so replays are safe.
insert into public.admins (email)
values ('sufyanyounis83@gmail.com')
on conflict (email) do nothing;

-- 4. Redefine is_admin() to the table-based implementation — the deployed
--    reality. This overrides the hard-coded-email version from 20261104
--    on every fresh migration replay.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

comment on function public.is_admin() is
  'F1.1 fix: single source of truth = public.admins table. Overrides hard-coded email in 20261104 to prevent schema drift across environments.';

commit;
