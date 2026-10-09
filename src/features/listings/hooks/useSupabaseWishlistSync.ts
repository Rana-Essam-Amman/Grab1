import { useEffect, useRef } from 'react';
import { useListingsStore } from '../store/listings.slice';
import { useAuthStore } from '@/features/auth';
import { useUIStore } from '@/store/ui.slice';

/**
 * Mounts once at app level. On sign-in (and on market change while
 * signed in):
 *   1. Runs legacy localStorage → Supabase migration ONCE per session.
 *   2. Loads the current market's wishlist from Supabase into the store.
 *
 * Real-time sync across devices is a follow-up commit.
 */
export function useSupabaseWishlistSync(): void {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const isInitialized = useListingsStore((s) => s.isInitialized);
  const marketCode = useUIStore((s) => s.browseCountryCode);

  const loadWishlistFromSupabase = useListingsStore((s) => s.loadWishlistFromSupabase);
  const migrateLegacyWishlistIfNeeded = useListingsStore((s) => s.migrateLegacyWishlistIfNeeded);

  const migratedForUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isInitialized || !userId) return;

    let cancelled = false;

    void (async () => {
      if (migratedForUserRef.current !== userId) {
        await migrateLegacyWishlistIfNeeded(userId);
        if (cancelled) return;
        migratedForUserRef.current = userId;
      }
      if (cancelled) return;
      await loadWishlistFromSupabase(userId, marketCode);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isInitialized,
    userId,
    marketCode,
    migrateLegacyWishlistIfNeeded,
    loadWishlistFromSupabase,
  ]);
}
