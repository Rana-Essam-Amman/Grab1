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

# RLS security tests: seed deterministic fixtures, then run assertions.
# Seed is committed; rls_security.sql rolls back its own Test-1 mutation.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security_seed.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_security.sql
