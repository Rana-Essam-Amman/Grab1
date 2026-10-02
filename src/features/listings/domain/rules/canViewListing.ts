import type { Listing } from '@/types';
import type { MarketCountry } from '@/features/auth/domain';

export type CanViewReason = 'cross-market' | 'listing-archived';

export interface CanViewResult {
  allowed: boolean;
  reason?: CanViewReason;
}

/**
 * Market isolation: buyer can only view listings from their active market.
 * Pure function — no side effects.
 */
export function canViewListing(
  listing: Listing,
  activeMarket: MarketCountry,
): CanViewResult {
  // MARKET ISOLATION RED LINE — a listing is visible ONLY to users
  // in the same market. This is intentional and enforced.
  if (listing.countryCode !== activeMarket) {
    return { allowed: false, reason: 'cross-market' };
  }
  if (listing.status === 'archived') {
    return { allowed: false, reason: 'listing-archived' };
  }
  return { allowed: true };
}
