/**
 * USER DATA REGISTRY — Single Source of Truth
 * Any user-scoped storage key MUST be declared here.
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

export function getAllUserKeysEverywhere(): string[] {
  const all: string[] = [...USER_GLOBAL_KEYS, ...USER_LEGACY_KEYS];
  for (const m of ALL_MARKETS) {
    for (const k of USER_MARKET_KEYS) {
      all.push(scopedKey(m, k));
    }
  }
  return Array.from(new Set(all));
}
