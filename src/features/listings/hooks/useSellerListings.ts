import { useEffect, useState } from 'react';
import type { Listing } from '@/types';
import { fetchListingsBySeller } from '../services/sellerListingsService';

export interface UseSellerListingsReturn {
  readonly listings: Listing[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Fetches all active listings for a seller from the DB.
 *
 * Why this exists: SellerProfileScreen used to filter the in-memory
 * listings store, which only carries the home feed's last page. That
 * showed at most one listing per seller. The store cannot be trusted
 * for a seller's full catalogue.
 *
 * @param sellerKey - user_id (UUID) or seller_phone (legacy). Empty/null
 *   returns [] without calling the RPC.
 * @param market - country_code (JO/SA/...). Null loads across markets.
 */
export function useSellerListings(
  sellerKey: string | null,
  market: string | null,
): UseSellerListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerKey) {
      setListings([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    void (async () => {
      const result = await fetchListingsBySeller(sellerKey, market);
      if (cancelled) return;

      if (result.error) {
        setError(result.error);
        setListings([]);
      } else {
        setListings(result.data ?? []);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [sellerKey, market]);

  return { listings, isLoading, error };
}
