#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: Set DATABASE_URL to a LOCAL Supabase/PostgreSQL connection." >&2
  exit 2
fi

# Safety boundary: only loopback databases are allowed. This deliberately rejects
# hosted Supabase and every non-local host, even if credentials are available.
node - "$DATABASE_URL" <<'NODE'
const raw = process.argv[2];
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

if ! command -v psql >/dev/null 2>&1; then
  echo "ERROR: psql is required. Start local Supabase and install/use PostgreSQL client tools." >&2
  exit 4
fi

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/search_listings_rpc.sql

# RLS — anon suite (8 assertions).
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_seed.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security.sql

# RLS — authenticated suite (3 assertions).
# Stubs override auth.uid()/auth.jwt() AFTER the anon suite runs.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/bootstrap_auth_stubs.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_authenticated.sql

# RLS — profiles.phone closure (4 assertions). Uses auth stubs above.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_profiles.sql

# RPC — listings_by_seller security (4 assertions).
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_rpc_seed.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_rpc.sql

# Session 16 batch 1 + 2 (metadata guards).
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_s16.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_s16_batch2.sql

# Session 16 fix — last_bumped_at column exists.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_s16_fix.sql

# SEC-2 — required Realtime publication tables (metadata only).
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/realtime_publication_check.sql

# H4 — phone-write lockdown.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_phone_write.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/schema_demo_marker.sql

# Wave 2B — demo filtering.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_demo_filter.sql

# Wave 4 — schema contract.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/schema_contract.sql

# Attribute-only search regression — must pass before CI succeeds.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/attribute_search.sql

# v3_relaxed progressive relaxation regression.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/attribute_search_v3.sql

# v4 exact-first search regression.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/search_v4_exact.sql
