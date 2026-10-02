/**
 * USER DATA REGISTRY — Single Source of Truth for user-scoped storage.
 *
 * ═══════════════════════════════════════════════════════════════════
 * HOW TO ADD A NEW USER-SCOPED KEY
 * ═══════════════════════════════════════════════════════════════════
 *
 * 1. Decide the scope:
 *    - If data belongs to a specific market (JO/LB/PS/SY/SA) → USER_MARKET_KEYS
 *    - If data is device-level and shared across markets (auth, locale,
 *      theme) → USER_GLOBAL_KEYS or INTENTIONAL_GLOBAL_KEYS
 *    - If data is legacy but must still be cleaned on account deletion
 *      → USER_LEGACY_KEYS
 *
 * 2. Add the RAW key name (without the `catch_` prefix) to the right array.
 *    Example: for `catch_JO_wishlist`, add `wishlist` to USER_MARKET_KEYS.
 *
 * 3. Read/write the key ONLY via `marketStorage(market).get(key)` for
 *    market-scoped keys, or `globalStorage().get(key)` for global keys.
 *    NEVER call `localStorage.setItem` directly outside `storage/`.
 *
 * 4. The enforcement test at `__tests__/storage-enforcement.test.ts`
 *    will FAIL CI if you add a raw storage call without registering the
 *    key here. That is intentional.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

import type { MarketCode } from '@/data/markets/types';
import { scopedKey } from '@/data/markets/storage';

export const ALL_MARKETS: readonly MarketCode[] = ['JO', 'LB', 'PS', 'SY', 'SA'] as const;

export const USER_GLOBAL_KEYS: readonly string[] = [
  'catch_user',
  'catch_token',
  'catch_auth',
  'catch_registered_users',
  'catch_browse_country',
  'catch_pending_publish',
  'catch_crash_last',
  'catch_ai_last_error',
  'catch_listings',
  'catch_wishlist',
  'catch_favorites',
  'catch_conversations',
] as const;

/**
 * Keys that are INTENTIONALLY global (never deleted on account deletion,
 * never market-scoped). These hold device-level preferences, not user data.
 * Listed here for auditability so future engineers see the complete picture.
 */
export const INTENTIONAL_GLOBAL_KEYS: readonly string[] = [
  'catch_locale',
  'grab_theme_v1',
  'catch_migration_drafts_done',
  'catch_migration_chats_done',
  'catch_migration_pending_flags_done',
] as const;

export const USER_MARKET_KEYS: readonly string[] = [
  'post_draft_v1',
  'chat_conversations_v1',
  'wishlist',
  'pending_post_entry',
  'pending_publish',
  'pending_publish_screen',
  'ai_quota_v1',
  'monetization_ai_quota_v1',
  'monetization_promotions_v1',
  'daily_ai_credits',
  'daily_ai_date',
] as const;

export const USER_LEGACY_KEYS: readonly string[] = [
  'catch_post_draft_v1',
  'catch_chat_conversations_v1',
  ...ALL_MARKETS.map((m) => `catch_wishlist_${m}`),
] as const;

export function getAllUserKeysForMarket(market: MarketCode): string[] {
  const scoped = USER_MARKET_KEYS.map((k) => scopedKey(market, k));
  return [...USER_GLOBAL_KEYS, ...scoped, ...USER_LEGACY_KEYS];
}

/**
 * Any key that starts with the bump prefix is user-scoped and must be
 * removed on account deletion. Bump keys have the shape:
 *   catch_<MARKET>_bump_<listingId>_<YYYY-MM-DD>
 */
export function isBumpKey(key: string): boolean {
  return /^catch_[A-Z]{2}_bump_/.test(key);
}

export function getAllUserKeysEverywhere(): string[] {
  const all: string[] = [...USER_GLOBAL_KEYS, ...USER_LEGACY_KEYS];
  for (const m of ALL_MARKETS) {
    for (const k of USER_MARKET_KEYS) {
      all.push(scopedKey(m, k));
    }
  }
  return Array.from(new Set(all));
}
