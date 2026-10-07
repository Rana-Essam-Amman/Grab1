import { useMemo } from 'react';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { getWishlistForMarket } from '@/services/listing.service';
import { ALL_MARKET_CODES } from '@/data/markets/config';
import type { MarketCode } from '@/shared/lib/marketGate';

/**
 * Returns the wishlist count for every market.
 * Recomputed whenever the active wishlist changes (toggle / clear / load).
 * Reads directly from per-market localStorage — cheap.
 */
export function useWishlistCounts(): Record<MarketCode, number> {
  const wishlist = useListingsStore((s) => s.wishlist);
  const activeCountry = useListingsStore((s) => s.activeWishlistCountry);

  return useMemo(() => {
    const out = {} as Record<MarketCode, number>;
    for (const code of ALL_MARKET_CODES) {
      out[code] = getWishlistForMarket(code).length;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist, activeCountry]);
}
