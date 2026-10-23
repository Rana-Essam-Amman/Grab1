import type { Listing } from '@/types';

export type MarketCode = 'JO' | 'LB' | 'PS' | 'SY' | 'SA';

export const ALL_MARKETS: MarketCode[] = ['JO', 'LB', 'PS', 'SY', 'SA'];

export function isValidMarket(code: string): code is MarketCode {
  return ALL_MARKETS.includes(code as MarketCode);
}

export function filterListingsByMarket(
  listings: Listing[],
  activeMarket: MarketCode
): Listing[] {
  if (!activeMarket) return [];
  return listings.filter((l) => l.countryCode === activeMarket);
}

export function canAccessListing(listing: Listing, activeMarket: MarketCode): boolean {
  if (!listing || !activeMarket) return false;
  return listing.countryCode === activeMarket;
}

export function canStartChat(
  listing: Listing,
  activeMarket: MarketCode,
  userCountryCode?: MarketCode
): boolean {
  if (!listing) return false;
  const effectiveMarket = userCountryCode || activeMarket;
  return listing.countryCode === effectiveMarket;
}

export function canPostIn(
  targetMarket: MarketCode,
  activeMarket: MarketCode,
  userCountryCode?: MarketCode
): boolean {
  if (!targetMarket) return false;
  if (userCountryCode) return targetMarket === userCountryCode;
  return targetMarket === activeMarket;
}

export function getEffectiveMarket(
  activeMarket: MarketCode,
  userCountryCode?: MarketCode
): MarketCode {
  return userCountryCode || activeMarket;
}
