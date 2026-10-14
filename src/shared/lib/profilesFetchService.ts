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
 * Discriminated result for fetchOwnProfile. Distinguishes RPC failure
 * from a legitimately null phone, so hydration cannot silently overwrite
 * a valid phone with null on transient errors.
 */
export type FetchOwnProfileResult =
  | { readonly ok: true; readonly profile: OwnProfileRecord }
  | { readonly ok: false; readonly reason: 'profile_error' | 'phone_error' | 'not_found' };

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
    return (data as PublicProfileRecord | null) ?? null;
  } catch (err) {
    console.warn('[profilesFetchService] fetchPublicProfile threw', err);
    return null;
  }
}

/**
 * Fetch the signed-in user's own profile.
 *
 * Phone comes from get_own_phone() RPC (authenticated-only, uses auth.uid()).
 * If the RPC fails, returns { ok: false, reason: 'phone_error' } — callers
 * must NOT treat this as "no phone" and must NOT overwrite existing state.
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
    if (phoneRes.error) {
      console.warn('[profilesFetchService] phone RPC error', phoneRes.error.message);
      return { ok: false, reason: 'phone_error' };
    }

    const phone = (phoneRes.data as string | null) ?? null;
    return {
      ok: true,
      profile: {
        ...(profileRes.data as Omit<OwnProfileRecord, 'phone'>),
        phone,
      },
    };
  } catch (err) {
    console.warn('[profilesFetchService] fetchOwnProfile threw', err);
    return { ok: false, reason: 'profile_error' };
  }
}
