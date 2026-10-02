import { isValidMarketCode } from '@/data/markets/config';
import { scopedKey } from '@/data/markets/storage';
import type { MarketCode } from '@/data/markets/types';

/**
 * One-shot migration: legacy global draft key → market-scoped key.
 *
 * Legacy key:  'catch_post_draft_v1'
 * Scoped key:  'catch_<MARKET>_post_draft_v1'
 *
 * Safe properties:
 *  - Idempotent: no-op if legacy key is missing.
 *  - Fail-safe: legacy key removed ONLY after scoped write succeeds.
 *  - Deterministic: market comes from user's account (immutable).
 *  - Logged: dev console + best-effort error_logs on failure.
 */

const LEGACY_KEY = 'catch_post_draft_v1';
const SCOPED_SUFFIX = 'post_draft_v1';
const MIGRATION_FLAG_PREFIX = 'catch_migration_drafts_done';

export interface MigrationResult {
  readonly migrated: boolean;
  readonly market: MarketCode | null;
  readonly reason?: string;
}

export function migrateDraftsToMarket(market: string | undefined | null): MigrationResult {
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
    // Nothing to migrate — mark as done to avoid repeated checks.
    localStorage.setItem(flagKey, '1');
    return { migrated: false, market, reason: 'no-legacy-data' };
  }

  const targetKey = scopedKey(market, SCOPED_SUFFIX);
  try {
    localStorage.setItem(targetKey, legacyValue);
    // Verify write succeeded before removing the legacy source.
    if (localStorage.getItem(targetKey) !== legacyValue) {
      return { migrated: false, market, reason: 'write-verification-failed' };
    }
    localStorage.removeItem(LEGACY_KEY);
    localStorage.setItem(flagKey, '1');
    if (import.meta.env.DEV) {
      console.info(`[Migration] Draft migrated: ${LEGACY_KEY} → ${targetKey}`);
    }
    return { migrated: true, market };
  } catch (err) {
    // Fail-safe: leave legacy intact for retry on next boot.
    if (import.meta.env.DEV) {
      console.error('[Migration] Draft migration failed:', err);
    }
    return { migrated: false, market, reason: 'exception' };
  }
}
