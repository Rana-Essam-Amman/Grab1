import { useState, useEffect, useCallback } from 'react';
import { getBumpCount, canBump, recordBump } from '../helpers/bumpLimit';

export function useBumpLimits(listingIds: readonly string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const next: Record<string, number> = {};
    for (const id of listingIds) next[id] = getBumpCount(id);
    setCounts(next);
  }, [listingIds]);

  const bump = useCallback((id: string) => {
    if (!canBump(id)) return false;
    recordBump(id);
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    return true;
  }, []);

  return { counts, bump };
}
