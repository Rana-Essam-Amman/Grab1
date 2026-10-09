import type { Listing } from '@/types';
import type { MarketCountry } from '@/shared/domain/market';

export type CanBookmarkReason = 'cross-market' | 'listing-archived' | 'already-bookmarked';

export interface CanBookmarkResult {
  allowed: boolean;
  reason?: CanBookmarkReason;
}

/**
 * Buyer can bookmark a listing only if:
 * - It belongs to their active market (isolation)
 * - It is not archived
 * - It is not already bookmarked
 */
export function canBookmarkListing(
  listing: Listing,
  activeMarket: MarketCountry,
  bookmarkedIds: readonly string[],
): CanBookmarkResult {
  if (listing.countryCode !== activeMarket) {
    return { allowed: false, reason: 'cross-market' };
  }
  if (listing.status === 'archived') {
    return { allowed: false, reason: 'listing-archived' };
  }
  if (bookmarkedIds.includes(listing.id)) {
    return { allowed: false, reason: 'already-bookmarked' };
  }
  return { allowed: true };
}
