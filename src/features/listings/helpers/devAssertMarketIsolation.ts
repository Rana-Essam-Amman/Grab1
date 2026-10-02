import { assertSameMarket, isSameMarket } from '@/data/markets/guards';
import type { Listing } from '@/types';

/**
 * Dev-only guard: fails LOUDLY (in console) if a cross-market listing
 * reaches the detail screen. In production this is a no-op.
 */
export function devAssertMarketIsolation(
  listing: Listing | null | undefined,
  activeCountry: string | undefined
): void {
  if (!import.meta.env.DEV) return;
  if (!listing) return;
  if (isSameMarket(listing.countryCode, activeCountry)) return;
  try {
    assertSameMarket(activeCountry as never, listing.countryCode, 'useListingDetail');
  } catch (err) {
    console.error('[MarketIsolation] Cross-market listing reached the detail screen:', err);
  }
}
