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
  readonly phone: string | null;
  readonly avatar_url: string | null;
  readonly country_code: string | null;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface ProfileUpdate {
  readonly first_name?: string;
  readonly last_name?: string;
  readonly phone?: string;
  readonly avatar_url?: string;
  readonly country_code?: string;
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
      .select('id, first_name, last_name, phone, avatar_url, country_code, created_at, updated_at')
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
      .select('id, first_name, last_name, phone, avatar_url, country_code, created_at, updated_at')
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
  return upsertProfile(userId, { phone: trimmed });
}
