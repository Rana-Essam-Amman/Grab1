import { isValidMarketCode } from '@/data/markets/config';
import { scopedKey } from '@/data/markets/storage';
import type { MarketCode } from '@/data/markets/types';

/**
 * One-shot migration: legacy global chat key → market-scoped key.
 *
 * Legacy key:  'catch_chat_conversations_v1'
 * Scoped key:  'catch_<MARKET>_chat_conversations_v1'
 *
 * Same safety properties as drafts migration: idempotent, fail-safe,
 * deterministic from user account, logged in dev.
 */

const LEGACY_KEY = 'catch_chat_conversations_v1';
const SCOPED_SUFFIX = 'chat_conversations_v1';
const MIGRATION_FLAG_PREFIX = 'catch_migration_chats_done';

export interface ChatsMigrationResult {
  readonly migrated: boolean;
  readonly market: MarketCode | null;
  readonly reason?: string;
}

export function migrateChatsToMarket(market: string | undefined | null): ChatsMigrationResult {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { migrated: false, market: null, reason: 'no-storage' };
  }
  if (!isValidMarketCode(market)) {
    return { migrated: false, market: null, reason: 'invalid-market' };
  }

  const flagKey = `${MIGRATION_FLAG_PREFIX}_${market}`;
  if (localStorage.getItem(flagKey)) {
    return { migrated: false, market, reason: 'already-migrated' };
  }

  const legacyValue = localStorage.getItem(LEGACY_KEY);
  if (legacyValue === null) {
    localStorage.setItem(flagKey, '1');
    return { migrated: false, market, reason: 'no-legacy-data' };
  }

  const targetKey = scopedKey(market, SCOPED_SUFFIX);
  try {
    localStorage.setItem(targetKey, legacyValue);
    if (localStorage.getItem(targetKey) !== legacyValue) {
      return { migrated: false, market, reason: 'write-verification-failed' };
    }
    localStorage.removeItem(LEGACY_KEY);
    localStorage.setItem(flagKey, '1');
    if (import.meta.env.DEV) {
      console.info(`[Migration] Chats migrated: ${LEGACY_KEY} → ${targetKey}`);
    }
    return { migrated: true, market };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[Migration] Chats migration failed:', err);
    }
    return { migrated: false, market, reason: 'exception' };
  }
}
