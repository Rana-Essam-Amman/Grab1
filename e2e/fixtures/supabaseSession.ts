/**
 * Helpers for seeding a valid Supabase-format session in E2E tests.
 *
 * Background: commit 1ee361f made the production auth listener treat
 * INITIAL_SESSION with a null session as authoritative. E2E tests
 * that only seed `catch_auth` (Zustand) but not a real Supabase
 * session under `sb-<projectRef>-auth-token` would otherwise be
 * logged out by the app on load.
 *
 * These helpers seed BOTH:
 *   - The Zustand catch_auth entry (synchronous bootstrap)
 *   - A Supabase-format session under sb-<projectRef>-auth-token
 *     (async, so INITIAL_SESSION fires with a valid session)
 */

export interface E2ESeedUser {
  readonly id: string;
  readonly email?: string;
  readonly phone?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly countryCode?: string;
}

/**
 * Derives the Supabase project reference from VITE_SUPABASE_URL.
 * Falls back to reading from process.env if not provided.
 * Throws if the URL cannot be determined (fail loud, not silent).
 */
export function getSupabaseStorageKey(): string {
  const url =
    process.env.VITE_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    'https://wmchqotsforwcoxilaeo.supabase.co';
  if (!url) {
    throw new Error(
      'E2E: VITE_SUPABASE_URL not set. Cannot derive Supabase storage key.',
    );
  }
  const host = new URL(url).hostname;
  const projectRef = host.split('.')[0];
  return `sb-${projectRef}-auth-token`;
}

/**
 * Builds a Supabase-format session object that matches what
 * supabase-js v2 writes to localStorage under sb-<ref>-auth-token.
 *
 * expires_at is set 24h in the future so the auto-refresh timer never
 * fires during an E2E test.
 */
export function buildFakeSupabaseSession(user: E2ESeedUser): {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: {
    id: string;
    aud: 'authenticated';
    role: 'authenticated';
    email: string | null;
    phone: string | null;
    app_metadata: Record<string, unknown>;
    user_metadata: {
      full_name: string;
      first_name: string;
      last_name: string;
    };
    is_anonymous: false;
    created_at: string;
  };
} {
  const nowSec = Math.floor(Date.now() / 1000);
  const ttl = 86400; // 24h — refresh timer will not fire during tests
  return {
    access_token: 'e2e-fake-access-token',
    token_type: 'bearer',
    expires_in: ttl,
    expires_at: nowSec + ttl,
    refresh_token: 'e2e-fake-refresh-token',
    user: {
      id: user.id,
      aud: 'authenticated',
      role: 'authenticated',
      email: user.email ?? null,
      phone: user.phone ?? null,
      app_metadata: {},
      user_metadata: {
        full_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        first_name: user.firstName ?? '',
        last_name: user.lastName ?? '',
      },
      is_anonymous: false,
      created_at: new Date().toISOString(),
    },
  };
}
