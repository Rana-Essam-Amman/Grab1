-- 20261064_revoke_truncate_and_fix_defaults.sql
-- Two related findings from the Session 15 RLS re-audit:
--
-- 1. anon/authenticated have TRUNCATE on all public tables. RLS does
--    not protect against TRUNCATE — it bypasses row-level policies.
--    Same applies to TRIGGER and REFERENCES (defense-in-depth).
--
-- 2. search_intent_markers has RLS disabled (all other search_* tables
--    have it enabled with default-deny policies).
--
-- Note: ALTER DEFAULT PRIVILEGES affects only future objects created by
-- the role it is attached to. Existing tables are handled by the explicit
-- REVOKE block above.

begin;

-- =========================================================================
-- 1. Revoke TRUNCATE, TRIGGER, REFERENCES from anon/authenticated on all
--    current public tables. RLS doesn't guard TRUNCATE.
-- =========================================================================
revoke truncate, trigger, references
  on all tables in schema public
  from anon, authenticated;

-- =========================================================================
-- 2. Default privileges for future tables created by postgres.
--    Current default: {postgres=arwdDxtm, anon=arwdDxtm, ...}
--    Target: remove D (truncate), t (trigger), m (maintain/references).
--    Keep SELECT/INSERT/UPDATE/DELETE — RLS filters them properly.
-- =========================================================================
alter default privileges for role postgres in schema public
  revoke truncate, trigger, references on tables from anon, authenticated;

-- =========================================================================
-- 3. Enable RLS on search_intent_markers (was missed).
--    Default deny — matching other search_* lookup tables.
-- =========================================================================
alter table public.search_intent_markers enable row level security;

commit;
