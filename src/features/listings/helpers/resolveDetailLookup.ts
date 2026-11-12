import type { Listing } from '@/types';

export type MissingListingStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

export interface MissingListingResult {
  listing: Listing | null;
  status: MissingListingStatus;
}

export function resolveDetailLookup(
  localListing: Listing | null,
  remote: MissingListingResult,
): { listing: Listing | null; lookupStatus: MissingListingStatus } {
  if (localListing) return { listing: localListing, lookupStatus: 'found' };
  return { listing: remote.listing, lookupStatus: remote.status };
}
