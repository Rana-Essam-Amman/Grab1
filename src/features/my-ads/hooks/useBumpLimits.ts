import { useState, useMemo, useCallback } from 'react';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { bumpListing } from '@/features/listings';
import { getBumpCount, canBump, BUMP_DAILY_LIMIT } from '../helpers/bumpLimit';

/**
 * Server-backed daily bump limits.
 *
 * Reads counts from the listings store (Supabase source of truth).
 * `bump(id)` calls the bump_listing RPC, then optimistically updates
 * the store on success. Returns false on any failure (unauth, not owned,
 * quota exhausted, network).
 */
export function useBumpLimits(listingIds: readonly string[]) {
  const { listings, updateListing } = useListings();
  const { authStatus } = useAuth();
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const id of listingIds) {
      const l = listings.find((x) => x.id === id);
      map[id] = l ? getBumpCount(l) : 0;
    }
    return map;
  }, [listingIds, listings]);

  const bump = useCallback(
    async (id: string): Promise<boolean> => {
      if (authStatus !== 'authenticated' || pending[id]) return false;
      const l = listings.find((x) => x.id === id);
      if (!l || !canBump(l)) return false;

      setPending((p) => ({ ...p, [id]: true }));
      try {
        const next = await bumpListing(id);
        if (next === null) return false;
        const nowIso = new Date().toISOString();
        updateListing(id, {
          bumpsToday: next,
          bumpsResetDate: nowIso.slice(0, 10),
          lastBumpedAt: nowIso,
        });
        return true;
      } finally {
        setPending((p) => ({ ...p, [id]: false }));
      }
    },
    [authStatus, pending, listings, updateListing]
  );

  return { counts, bump, BUMP_DAILY_LIMIT };
}
