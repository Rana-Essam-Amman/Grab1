import { describe, it, expect, beforeEach } from 'vitest';
import { globalStorage } from '@/shared/lib/marketStorage';
import { scopedKey } from '@/data/markets/storage';
import {
  ALL_MARKETS,
  USER_GLOBAL_KEYS,
  USER_LEGACY_KEYS,
  getAllUserKeysForMarket,
} from '@/shared/lib/userDataRegistry';

function simulateAccountDeletion(): void {
  for (const key of USER_GLOBAL_KEYS) {
    localStorage.removeItem(key);
  }
  for (const market of ALL_MARKETS) {
    for (const key of getAllUserKeysForMarket(market)) {
      localStorage.removeItem(key);
    }
  }
  for (const key of USER_LEGACY_KEYS) {
    localStorage.removeItem(key);
  }
}

describe('GDPR: Account Deletion Completeness', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deletes wishlist written via canonical scopedKey', () => {
    for (const m of ALL_MARKETS) {
      globalStorage().set('__noop', true);
      localStorage.setItem(scopedKey(m, 'wishlist'), JSON.stringify(['x']));
    }

    simulateAccountDeletion();

    for (const m of ALL_MARKETS) {
      expect(localStorage.getItem(scopedKey(m, 'wishlist'))).toBeNull();
    }
  });

  it('deletes legacy wishlist key catch_wishlist_<MARKET>', () => {
    for (const m of ALL_MARKETS) {
      localStorage.setItem(`catch_wishlist_${m}`, JSON.stringify(['x']));
    }

    simulateAccountDeletion();

    for (const m of ALL_MARKETS) {
      expect(localStorage.getItem(`catch_wishlist_${m}`)).toBeNull();
    }
  });

  it('deletes global favorites, wishlist, listings, conversations', () => {
    const globals = [
      'catch_listings',
      'catch_wishlist',
      'catch_favorites',
      'catch_conversations',
      'catch_ai_last_error',
    ];
    for (const k of globals) {
      localStorage.setItem(k, JSON.stringify({ dummy: true }));
    }

    simulateAccountDeletion();

    for (const k of globals) {
      expect(localStorage.getItem(k)).toBeNull();
    }
  });

  it('deletes market-scoped drafts and chats', () => {
    for (const m of ALL_MARKETS) {
      localStorage.setItem(scopedKey(m, 'post_draft_v1'), '{}');
      localStorage.setItem(scopedKey(m, 'chat_conversations_v1'), '[]');
    }

    simulateAccountDeletion();

    for (const m of ALL_MARKETS) {
      expect(localStorage.getItem(scopedKey(m, 'post_draft_v1'))).toBeNull();
      expect(localStorage.getItem(scopedKey(m, 'chat_conversations_v1'))).toBeNull();
    }
  });

  it('does NOT touch unrelated keys (locale is global but excluded)', () => {
    localStorage.setItem('catch_locale', 'en');

    simulateAccountDeletion();

    expect(localStorage.getItem('catch_locale')).toBe('en');
  });
});
