import type { Listing } from '@/types';
import type { MarketCountry } from '@/shared/domain/market';

export type CanViewReason =
  | 'cross-market'
  | 'listing-archived'
  | 'listing-pending';

export interface CanViewResult {
  readonly allowed: boolean;
  readonly reason?: CanViewReason;
  readonly isCrossMarket: boolean;
}

/**
 * Market policy for viewing a listing.
 *
 * Real policy (matching PR #80/#87 — free browse + contact always enabled):
 *   - Any market: readable by anyone.
 *   - Cross-market: allowed, but flagged (banner + no in-app chat).
 *   - Archived: not shown (should not appear in feeds or direct links).
 *   - Pending: not shown publicly (moderation in progress).
 *
 * Note: in-app chat is market-scoped separately (chat.slice.mutate.ts).
 * WhatsApp/Call are intentionally open cross-market.
 *
 * Currency is derived from listing.countryCode in listingDerivedData.ts,
 * so a cross-market listing always shows its own market's currency.
 */
export function canViewListing(
  listing: Listing,
  activeMarket: MarketCountry,
): CanViewResult {
  const isCrossMarket = listing.countryCode !== activeMarket;

  if (listing.status === 'archived') {
    return { allowed: false, reason: 'listing-archived', isCrossMarket };
  }

  if (listing.status === 'pending') {
    return { allowed: false, reason: 'listing-pending', isCrossMarket };
  }

  return { allowed: true, isCrossMarket };
}
