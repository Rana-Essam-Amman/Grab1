#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: Set DATABASE_URL to a LOCAL Supabase/PostgreSQL connection." >&2
  exit 2
fi

# Safety boundary: only loopback databases are allowed. DATABASE_URL is read
# from the environment, never from argv, so it does not appear in `ps`.
assert_loopback() {
  node <<'NODE'
const raw = process.env.DATABASE_URL || '';
let url;
try {
  url = new URL(raw);
} catch {
  console.error('ERROR: DATABASE_URL is not a valid PostgreSQL URL.');
  process.exit(2);
}
const host = url.hostname.toLowerCase();
const allowed = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
if (!allowed.has(host)) {
  console.error(`ERROR: Refusing to run fixtures against non-local host: ${host}`);
  process.exit(3);
}
NODE
}

# Prove a hosted Supabase URL is rejected before any SQL runs.
if DATABASE_URL='postgresql://postgres:secret@db.example.supabase.co:5432/postgres' assert_loopback; then
  echo "ERROR: hosted Supabase URL was not rejected." >&2
  exit 5
fi

assert_loopback

if ! command -v psql >/dev/null 2>&1; then
  echo "ERROR: psql is required. Start local Supabase and install/use PostgreSQL client tools." >&2
  exit 4
fi

# Hand connection params to psql via the environment, not argv.
eval "$(node <<'NODE'
const url = new URL(process.env.DATABASE_URL);
const q = (v) => `'${String(v).replace(/'/g, `'\\''`)}'`;
process.stdout.write(`export PGHOST=${q(url.hostname)}\n`);
process.stdout.write(`export PGPORT=${q(url.port || '5432')}\n`);
process.stdout.write(`export PGUSER=${q(decodeURIComponent(url.username))}\n`);
process.stdout.write(`export PGPASSWORD=${q(decodeURIComponent(url.password))}\n`);
process.stdout.write(`export PGDATABASE=${q(url.pathname.replace(/^\//, ''))}\n`);
NODE
)"

run_sql() {
  psql -v ON_ERROR_STOP=1 -f "$1"
}

run_sql supabase/tests/search_listings_rpc.sql

# RLS — anon suite (8 assertions).
run_sql supabase/tests/rls_security_seed.sql
run_sql supabase/tests/rls_security.sql

# RLS — authenticated suite (3 assertions).
# Stubs override auth.uid()/auth.jwt() AFTER the anon suite runs.
run_sql supabase/tests/bootstrap_auth_stubs.sql
run_sql supabase/tests/rls_security_authenticated.sql

# RLS — profiles.phone closure (4 assertions). Uses auth stubs above.
run_sql supabase/tests/rls_security_profiles.sql

# RPC — listings_by_seller security (4 assertions).
run_sql supabase/tests/rls_rpc_seed.sql
run_sql supabase/tests/rls_security_rpc.sql

# Session 16 batch 1 + 2 (metadata guards).
run_sql supabase/tests/rls_security_s16.sql
run_sql supabase/tests/rls_security_s16_batch2.sql

# Session 16 fix — last_bumped_at column exists.
run_sql supabase/tests/rls_security_s16_fix.sql

# SEC-2 — required Realtime publication tables (metadata only).
run_sql supabase/tests/realtime_publication_check.sql

# H4 — phone-write lockdown.
run_sql supabase/tests/rls_security_phone_write.sql
run_sql supabase/tests/schema_demo_marker.sql

# Wave 2B — demo filtering.
run_sql supabase/tests/rls_security_demo_filter.sql

# Wave 4 — schema contract.
run_sql supabase/tests/schema_contract.sql

# Attribute-only search regression — must pass before CI succeeds.
run_sql supabase/tests/attribute_search.sql

# v3_relaxed progressive relaxation regression.
run_sql supabase/tests/attribute_search_v3.sql

# v4 exact-first search regression.
run_sql supabase/tests/search_v4_exact.sql

# v4 rollback idempotence — run twice, then assert function is gone.
run_sql supabase/tests/search_v4_rollback_idempotence.sql
