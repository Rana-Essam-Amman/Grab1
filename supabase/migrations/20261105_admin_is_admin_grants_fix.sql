-- ============================================================================
-- Fix: is_admin() lacked EXECUTE grant
-- The function created in 20261104 did not include explicit EXECUTE grants.
-- Production was patched manually after deployment, but the disposable
-- Postgres in CI never received the grants, breaking rls_security tests.
-- This migration adds the grant idempotently.
-- ============================================================================

begin;

grant execute on function public.is_admin() to anon, authenticated, service_role;

commit;
