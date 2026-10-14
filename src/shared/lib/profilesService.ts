/**
 * Profile persistence service.
 *
 * Wraps Supabase writes for the public.profiles table.
 * Reads live in profilesFetchService (fetchPublicProfile / fetchOwnProfile).
 *
 * Note on phone:
 *  - SELECT on profiles.phone is revoked from authenticated (Phase C).
 *    Reads go through get_own_phone() RPC.
 *  - INSERT/UPDATE on profiles.phone is still granted for the registration
 *    and phone-capture flows. Writes go through savePhone here.
 */

import { supabase } from './supabase';

export interface ProfileRecord {
  readonly id: string;
  readonly first_name: string | null;
  readonly last_name: string | null;
  readonly nickname: string | null;
  readonly phone_locked?: boolean | null;
  readonly avatar_url: string | null;
  readonly country_code: string | null;
  readonly feed_layout?: 'list' | 'grid' | null;
  readonly browse_market?: 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | null;
  readonly rating_avg?: number | null;
  readonly rating_count?: number | null;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface ProfileUpdate {
  readonly first_name?: string;
  readonly last_name?: string;
  readonly nickname?: string;
  readonly avatar_url?: string;
  readonly country_code?: string;
  readonly feed_layout?: 'list' | 'grid';
  readonly browse_market?: 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | null;
}

/**
 * Read-back projection for upsert. Deliberately excludes `phone` — SELECT
 * on that column is revoked from authenticated (Phase C), so RETURNING it
 * would raise 42501. Callers needing their own phone use fetchOwnProfile().
 */
const RETURN_COLUMNS =
  'id, first_name, last_name, nickname, phone_locked, avatar_url, ' +
  'country_code, feed_layout, browse_market, rating_avg, rating_count, ' +
  'created_at, updated_at';

export async function upsertProfile(
  userId: string,
  patch: ProfileUpdate
): Promise<ProfileRecord | null> {
  if (!userId) return null;
  try {
    const payload = { id: userId, ...patch };
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select(RETURN_COLUMNS)
      .maybeSingle();
    if (error) {
      console.warn('[profilesService] upsertProfile error', error.message);
      return null;
    }
    return (data as ProfileRecord | null) ?? null;
  } catch (err) {
    console.warn('[profilesService] upsertProfile threw', err);
    return null;
  }
}

export async function setInitialPhone(phone: string): Promise<boolean> {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  try {
    const { data, error } = await supabase.rpc('set_initial_phone', {
      p_phone: trimmed,
    });
    if (error) {
      console.warn('[profilesService] setInitialPhone error', error.message);
      return false;
    }
    return data === true;
  } catch (err) {
    console.warn('[profilesService] setInitialPhone threw', err);
    return false;
  }
}

export async function requestPhoneChange(
  phone: string,
  reason: string
): Promise<string | null> {
  const trimmedPhone = phone.trim();
  const trimmedReason = reason.trim();
  if (!trimmedPhone || trimmedReason.length < 3) return null;
  try {
    const { data, error } = await supabase.rpc('request_phone_change', {
      p_requested_phone: trimmedPhone,
      p_reason: trimmedReason,
    });
    if (error) {
      console.warn('[profilesService] requestPhoneChange error', error.message);
      return null;
    }
    return typeof data === 'string' ? data : null;
  } catch (err) {
    console.warn('[profilesService] requestPhoneChange threw', err);
    return null;
  }
}

export async function saveNickname(
  userId: string,
  nickname: string
): Promise<ProfileRecord | null> {
  const trimmed = nickname.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return null;
  return upsertProfile(userId, { nickname: trimmed });
}

export async function saveFeedLayout(
  userId: string,
  layout: 'list' | 'grid'
): Promise<ProfileRecord | null> {
  return upsertProfile(userId, { feed_layout: layout });
}

export async function saveBrowseMarket(
  userId: string,
  market: 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | null
): Promise<ProfileRecord | null> {
  return upsertProfile(userId, { browse_market: market });
}
