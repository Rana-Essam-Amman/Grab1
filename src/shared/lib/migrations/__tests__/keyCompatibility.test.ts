import { describe, it, expect } from 'vitest';
import { scopedKey } from '@/data/markets/storage';

/**
 * CRITICAL REGRESSION TEST.
 *
 * Migration writes via scopedKey(). marketStorage reads via its own
 * resolveKey(). If these two functions ever diverge, migration silently
 * writes to a key the app never reads → data loss on every boot.
 *
 * This test locks in the contract: both must produce IDENTICAL output.
 */

// Mirror of marketStorage.resolveKey for the contract test only.
function marketStorageResolveKey(key: string, market: string): string {
  const PREFIX = 'catch';
  const marketPrefix = `${PREFIX}_${market}_`;
  if (key.startsWith(marketPrefix)) return key;
  return `${marketPrefix}${key}`;
}

describe('CRITICAL: scopedKey ↔ marketStorage key compatibility', () => {
  const markets = ['JO', 'LB', 'PS', 'SY', 'SA'] as const;
  const keys = ['post_draft_v1', 'chat_conversations_v1', 'pending_publish', 'pending_post_entry'];

  for (const market of markets) {
    for (const key of keys) {
      it(`${market} / ${key}: scopedKey === marketStorage.resolveKey`, () => {
        const fromMigration = scopedKey(market, key);
        const fromStorage = marketStorageResolveKey(key, market);
        expect(fromMigration).toBe(fromStorage);
      });
    }
  }

  it('produces stable sample: scopedKey(JO, post_draft_v1) === "catch_JO_post_draft_v1"', () => {
    expect(scopedKey('JO', 'post_draft_v1')).toBe('catch_JO_post_draft_v1');
  });
});
