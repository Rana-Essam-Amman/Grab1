/**
 * Profile persistence service.
 *
 * Wraps Supabase queries for the public.profiles table.
 * No UI, no React — pure async functions.
 *
 * Callers: useAuth (fetch on session), useAuth (upsert on phone capture),
 * EditProfileScreen (update name/avatar/phone).
 */

import { supabase } from './supabase';

export interface ProfileRecord {
  readonly id: string;
  readonly first_name: string | null;
  readonly last_name: string | null;
  readonly nickname: string | null;
  readonly phone: string | null;
  readonly phone_locked?: boolean | null;
  readonly avatar_url: string | null;
  readonly country_code: string | null;
  readonly feed_layout?: 'list' | 'grid' | null;
  readonly rating_avg?: number | null;
  readonly rating_count?: number | null;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface ProfileUpdate {
  readonly first_name?: string;
  readonly last_name?: string;
  readonly nickname?: string;
  readonly phone?: string;
  readonly phone_locked?: boolean;
  readonly avatar_url?: string;
  readonly country_code?: string;
  readonly feed_layout?: 'list' | 'grid';
}

/**
 * Fetch a profile by user id.
 * Returns null if no row exists yet (older users before trigger).
 * Never throws — logs and returns null on error.
 */
export async function fetchProfile(userId: string): Promise<ProfileRecord | null> {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, nickname, phone, phone_locked, avatar_url, country_code, feed_layout, rating_avg, rating_count, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.warn('[profilesService] fetchProfile error', error.message);
      return null;
    }
    return (data as ProfileRecord | null) ?? null;
  } catch (err) {
    console.warn('[profilesService] fetchProfile threw', err);
    return null;
  }
}

/**
 * Upsert profile fields for a user.
 * Creates the row if it does not exist.
 * Never throws — returns null on error.
 */
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
      .select('id, first_name, last_name, nickname, phone, phone_locked, avatar_url, country_code, feed_layout, rating_avg, rating_count, created_at, updated_at')
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

/**
 * Convenience: save just the phone.
 */
export async function savePhone(userId: string, phone: string): Promise<ProfileRecord | null> {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  return upsertProfile(userId, { phone: trimmed, phone_locked: true });
}

/**
 * Convenience: save the user's nickname.
 * Trims and validates client-side (2–50 chars).
 */
export async function saveNickname(
  userId: string,
  nickname: string
): Promise<ProfileRecord | null> {
  const trimmed = nickname.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return null;
  return upsertProfile(userId, { nickname: trimmed });
}

/**
 * Convenience: save the user's feed layout preference.
 * Persisted to Supabase → available across devices.
 */
export async function saveFeedLayout(
  userId: string,
  layout: 'list' | 'grid'
): Promise<ProfileRecord | null> {
  return upsertProfile(userId, { feed_layout: layout });
}
