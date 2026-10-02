import { describe, it, expect } from 'vitest';
import {
  ALL_MARKETS,
  USER_GLOBAL_KEYS,
  USER_MARKET_KEYS,
  USER_LEGACY_KEYS,
  INTENTIONAL_GLOBAL_KEYS,
  getAllUserKeysForMarket,
  isBumpKey,
} from '../userDataRegistry';
import { scopedKey } from '@/data/markets/storage';

/**
 * FINAL RE-AUDIT: prove market isolation is complete and non-leaky.
 * This is the closing test for the Market Isolation Phase.
 */
describe('MARKET ISOLATION — FINAL RE-AUDIT', () => {
  it('all 5 markets are declared', () => {
    expect([...ALL_MARKETS].sort()).toEqual(['JO', 'LB', 'PS', 'SA', 'SY']);
  });

  it('every market-scoped key produces catch_<MARKET>_<key>', () => {
    for (const market of ALL_MARKETS) {
      for (const key of USER_MARKET_KEYS) {
        const scoped = scopedKey(market, key);
        expect(scoped).toMatch(/^catch_[A-Z]{2}_/);
        expect(scoped).toBe(`catch_${market}_${key}`);
      }
    }
  });

  it('no market-scoped key collides between markets', () => {
    const seen = new Map<string, string>();
    for (const market of ALL_MARKETS) {
      for (const key of USER_MARKET_KEYS) {
        const scoped = scopedKey(market, key);
        expect(seen.has(scoped), `duplicate: ${scoped}`).toBe(false);
        seen.set(scoped, market);
      }
    }
  });

  it('getAllUserKeysForMarket returns no duplicates', () => {
    for (const market of ALL_MARKETS) {
      const keys = getAllUserKeysForMarket(market);
      const unique = new Set(keys);
      expect(unique.size).toBe(keys.length);
    }
  });

  it('global keys never accidentally match market-scope pattern', () => {
    for (const k of USER_GLOBAL_KEYS) {
      expect(k).not.toMatch(/^catch_[A-Z]{2}_/);
    }
  });

  it('INTENTIONAL_GLOBAL_KEYS is disjoint from USER_GLOBAL_KEYS', () => {
    const g = new Set(USER_GLOBAL_KEYS);
    for (const k of INTENTIONAL_GLOBAL_KEYS) {
      expect(g.has(k), `overlap on ${k}`).toBe(false);
    }
  });

  it('USER_LEGACY_KEYS contains the three historical spellings', () => {
    expect(USER_LEGACY_KEYS).toContain('catch_post_draft_v1');
    expect(USER_LEGACY_KEYS).toContain('catch_chat_conversations_v1');
    for (const m of ALL_MARKETS) {
      expect(USER_LEGACY_KEYS).toContain(`catch_wishlist_${m}`);
    }
  });

  it('isBumpKey correctly identifies bump counters', () => {
    expect(isBumpKey('catch_JO_bump_abc_2026-10-02')).toBe(true);
    expect(isBumpKey('catch_SA_bump_xyz_2026-12-31')).toBe(true);
    expect(isBumpKey('catch_JO_wishlist')).toBe(false);
    expect(isBumpKey('bump_abc_2026-10-02')).toBe(false);
    expect(isBumpKey('catch_locale')).toBe(false);
  });
});
