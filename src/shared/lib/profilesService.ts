/**
 * Profile persistence service.
 *
 * Wraps Supabase writes for the public.profiles table.
 * Reads live in profilesFetchService (fetchPublicProfile / fetchOwnProfile).
 *
 * Note: `phone` and `phone_locked` are intentionally NOT in the write
 * surface here. Phone changes flow through the request/approval path.
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
