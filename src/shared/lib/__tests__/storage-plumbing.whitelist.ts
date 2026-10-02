/**
 * Files that are ALLOWED to call localStorage/sessionStorage directly.
 * These are the storage plumbing layer — they MUST be the only place
 * where raw storage APIs are called.
 *
 * Any new file added here MUST have its writes routed through either
 * marketStorage() or scopedKey() internally.
 */
export const STORAGE_PLUMBING_FILES: readonly string[] = [
  'src/shared/lib/marketStorage.ts',
  'src/shared/lib/safeStorage.ts',
  'src/shared/lib/migrations/draftsMigration.ts',
  'src/shared/lib/migrations/chatsMigration.ts',
  'src/shared/lib/migrations/pendingFlagsCleanup.ts',
];
