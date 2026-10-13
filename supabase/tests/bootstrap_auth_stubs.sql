-- bootstrap_auth_stubs.sql
-- CI-only override for auth.uid() and auth.jwt() stubs created in
-- bootstrap_supabase_prereqs.sql. Those stubs return NULL / {} which
-- is correct for anon-only tests. rls_security_authenticated.sql
-- needs the stubs to read the current session's request.jwt.claims,
-- matching production Supabase behavior.
--
-- Runs AFTER rls_security.sql in test-search-rpc-local.sh so the
-- existing 8 anon tests keep their original auth.uid()=NULL semantics.
-- Never applied to production.

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid;
$$;

create or replace function auth.jwt()
returns jsonb
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb,
    '{}'::jsonb
  );
$$;

-- Ensure authenticated/anon can call auth.uid() and auth.jwt().
-- bootstrap_supabase_prereqs.sql doesn't grant these.
grant usage on schema auth to authenticated, anon, service_role;
grant execute on function auth.uid() to authenticated, anon, service_role;
grant execute on function auth.jwt() to authenticated, anon, service_role;
