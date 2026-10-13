import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';

const SELLER_PAGE_SIZE = 50;

export interface SellerListingsResult {
  readonly data: Listing[] | null;
  readonly error: string | null;
}

/**
 * Fetches all active listings for a seller from the DB via the
 * listings_by_seller RPC. The store only carries the home feed's last
 * page, so relying on it would show at most one listing per seller.
 *
 * sellerKey: user_id when UUID-shaped, seller_phone for legacy rows.
 * The RPC decides which column to match on.
 */
export async function fetchListingsBySeller(
  sellerKey: string,
  market: string | null,
): Promise<SellerListingsResult> {
  const trimmed = sellerKey.trim();
  if (!trimmed) return { data: [], error: null };

  try {
    const { data, error } = await supabase.rpc('listings_by_seller', {
      p_seller_key: trimmed,
      p_market: market ?? null,
      p_limit: SELLER_PAGE_SIZE,
      p_offset: 0,
    });

    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(rowToListing), error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
