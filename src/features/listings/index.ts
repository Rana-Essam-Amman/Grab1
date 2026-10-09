// Listings public API — store, services, helpers, types.
//
// IMPORTANT: Do NOT re-export screens from this barrel (Rule #18).
// Screens are lazy-loaded by exact path in App.tsx.
// Do NOT re-export useListings or the sync hooks here — they can cycle
// back through src/hooks/useListings (Rule #18b).

// Store
export { useListingsStore } from './store/listings.slice';
export type { ListingsState } from './store/listings.slice';

// Services
export {
  fetchListings,
  searchListings,
  LISTINGS_PAGE_SIZE,
  bumpListing,
} from './services/listingsService';
export type {
  FetchListingsParams,
  SearchListingsParams,
} from './services/listingsService';
export { submitListingReport } from './services/reportsService';

// Helpers
export { pickSpecs } from './helpers/pickSpecs';
export { labelToIconKey } from './helpers/labelToIconKey';
