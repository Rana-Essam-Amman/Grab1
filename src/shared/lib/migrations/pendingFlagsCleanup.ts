/**
 * One-shot cleanup: remove legacy GLOBAL pending-flow flags.
 *
 * Pending flags are EPHEMERAL — they only matter between auth-redirect and
 * resume within the same boot cycle. They are NOT migrated. Legacy global
 * keys are deleted to prevent cross-market resumption leaks.
 *
 * New writes go through marketStorage() in the writer hooks.
 */

const LEGACY_KEYS = [
  'catch_pending_post_entry',
  'catch_pending_publish',
  'catch_pending_publish_screen',
];

const CLEANUP_FLAG = 'catch_migration_pending_flags_done';

export interface CleanupResult {
  readonly cleaned: boolean;
  readonly removedKeys: readonly string[];
}

export function cleanupLegacyPendingFlags(): CleanupResult {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { cleaned: false, removedKeys: [] };
  }
  if (localStorage.getItem(CLEANUP_FLAG)) {
    return { cleaned: false, removedKeys: [] };
  }
  const removed: string[] = [];
  try {
    for (const key of LEGACY_KEYS) {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        removed.push(key);
      }
    }
    localStorage.setItem(CLEANUP_FLAG, '1');
    if (import.meta.env.DEV && removed.length > 0) {
      console.info('[Migration] Legacy pending flags removed:', removed.join(', '));
    }
    return { cleaned: true, removedKeys: removed };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[Migration] Pending flags cleanup failed:', err);
    }
    return { cleaned: false, removedKeys: removed };
  }
}
