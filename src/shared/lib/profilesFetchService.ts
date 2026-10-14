import { supabase } from './supabase';

/**
 * Public profile fields — safe for anonymous guest viewing on seller pages.
 * Mirrors the column allowlist that Phase C will expose to anon/authenticated.
 */
export interface PublicProfileRecord {
  readonly id: string;
  readonly nickname: string | null;
  readonly avatar_url: string | null;
  readonly rating_avg?: number | null;
  readonly rating_count?: number | null;
  readonly vip_store?: boolean | null;
}

/**
 * Signed-in user's own profile — adds private fields.
 * `phone` comes from the get_own_phone() RPC (not a direct column read),
 * so Phase C can revoke direct column access without breaking hydration.
 */
export interface OwnProfileRecord extends PublicProfileRecord {
  readonly first_name: string | null;
  readonly last_name: string | null;
  readonly country_code: string | null;
  readonly phone: string | null;
  readonly phone_locked?: boolean | null;
  readonly feed_layout?: 'list' | 'grid' | null;
  readonly browse_market?: 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | null;
  readonly created_at?: string;
  readonly updated_at?: string;
}

/**
 * Discriminated result for fetchOwnProfile.
 *
 * - ok: true, phoneError: false — full profile, phone present (may be null)
 * - ok: true, phoneError: true  — profile loaded, phone RPC failed.
 *                                 Callers must NOT overwrite existing phone state.
 * - ok: false                   — profile SELECT failed or row not found.
 */
export type FetchOwnProfileResult =
  | { readonly ok: true; readonly profile: OwnProfileRecord; readonly phoneError: boolean }
  | { readonly ok: false; readonly reason: 'profile_error' | 'not_found' };

const PUBLIC_COLUMNS =
  'id, nickname, avatar_url, rating_avg, rating_count, vip_store';

const OWN_COLUMNS =
  'id, first_name, last_name, nickname, avatar_url, country_code, ' +
  'phone_locked, feed_layout, browse_market, rating_avg, rating_count, ' +
  'vip_store, created_at, updated_at';

/**
 * Fetch a seller's public profile. Safe for anonymous callers.
 * Returns null on any error (never throws).
 */
export async function fetchPublicProfile(
  userId: string,
): Promise<PublicProfileRecord | null> {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(PUBLIC_COLUMNS)
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.warn('[profilesFetchService] fetchPublicProfile error', error.message);
      return null;
    }
    return (data as unknown as PublicProfileRecord | null) ?? null;
  } catch (err) {
    console.warn('[profilesFetchService] fetchPublicProfile threw', err);
    return null;
  }
}

/**
 * Fetch the signed-in user's own profile.
 *
 * Phone comes from get_own_phone() RPC (authenticated-only, uses auth.uid()).
 * If the RPC fails, returns { ok: true, phoneError: true } so hydration can
 * still apply nickname/feed_layout/preferences — callers must check the flag
 * and skip phone updates in that case.
 */
export async function fetchOwnProfile(
  userId: string,
): Promise<FetchOwnProfileResult> {
  if (!userId) return { ok: false, reason: 'profile_error' };
  try {
    const [profileRes, phoneRes] = await Promise.all([
      supabase.from('profiles').select(OWN_COLUMNS).eq('id', userId).maybeSingle(),
      supabase.rpc('get_own_phone'),
    ]);

    if (profileRes.error) {
      console.warn('[profilesFetchService] profile error', profileRes.error.message);
      return { ok: false, reason: 'profile_error' };
    }
    if (!profileRes.data) {
      return { ok: false, reason: 'not_found' };
    }

    const row = profileRes.data as unknown as Omit<OwnProfileRecord, 'phone'>;

    if (phoneRes.error) {
      console.warn('[profilesFetchService] phone RPC error', phoneRes.error.message);
      return {
        ok: true,
        phoneError: true,
        profile: { ...row, phone: null },
      };
    }

    const phone = (phoneRes.data as string | null) ?? null;
    return {
      ok: true,
      phoneError: false,
      profile: { ...row, phone },
    };
  } catch (err) {
    console.warn('[profilesFetchService] fetchOwnProfile threw', err);
    return { ok: false, reason: 'profile_error' };
  }
}
