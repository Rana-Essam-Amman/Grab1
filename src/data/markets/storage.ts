// RULE-14-EXCEPTION: Market-scoped storage keys
import type { MarketCode } from './types';
import { isValidMarketCode } from './config';

/**
 * Storage keys MUST be namespaced per market. A draft in JO must NEVER
 * be readable from LB, even if the raw key name collides.
 *
 * Every call to storage (localStorage, sessionStorage) that holds
 * market-specific data MUST go through this helper.
 */

// MUST match marketStorage's PREFIX and separator format exactly.
// marketStorage.resolveKey('post_draft_v1', 'JO') === 'catch_JO_post_draft_v1'
const PREFIX = 'catch';
const SEPARATOR = '_';

/**
 * Build a market-scoped storage key in the SAME format marketStorage uses.
 *   scopedKey('JO', 'post_draft_v1') → 'catch_JO_post_draft_v1'
 */
export function scopedKey(market: string | undefined | null, key: string): string {
  const m = isValidMarketCode(market) ? market : 'JO';
  return `${PREFIX}${SEPARATOR}${m}${SEPARATOR}${key}`;
}

/**
 * Extract the market code from a scoped key. Returns null if not scoped.
 */
export function marketFromKey(key: string): MarketCode | null {
  const parts = key.split(SEPARATOR);
  if (parts.length < 3 || parts[0] !== PREFIX) return null;
  const candidate = parts[1];
  return isValidMarketCode(candidate) ? candidate : null;
}

/**
 * Return true if the key is properly market-scoped.
 * Use in tests to enforce that no unscoped keys leak into storage.
 */
export function isScopedKey(key: string): boolean {
  return marketFromKey(key) !== null;
}
