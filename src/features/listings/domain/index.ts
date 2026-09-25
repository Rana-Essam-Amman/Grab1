// Listings domain — pure business logic
export type { Listing, ListingStatus } from './entities/Listing';
export type { ListingFilters } from './entities/ListingFilters';

export { canViewListing } from './rules/canViewListing';
export type { CanViewResult, CanViewReason } from './rules/canViewListing';

export { canBookmarkListing } from './rules/canBookmarkListing';
export type { CanBookmarkResult, CanBookmarkReason } from './rules/canBookmarkListing';
