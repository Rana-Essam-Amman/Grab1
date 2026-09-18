import type { Listing, ListingFilters } from '../../domain';

/**
 * Pure function: filter listings by ListingFilters.
 * No side effects, no external dependencies.
 */
export function filterListings(
  listings: readonly Listing[],
  filters: ListingFilters,
): Listing[] {
  return listings.filter((l) => {
    // Market isolation (always enforced)
    if (l.countryCode !== filters.market) return false;

    // Category
    if (filters.categoryId && l.categoryId !== filters.categoryId) return false;

    // Subcategory
    if (filters.subcategoryId && l.subcategoryId !== filters.subcategoryId) {
      return false;
    }

    // Price range
    if (filters.priceMin !== undefined && l.price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax !== undefined && l.price > filters.priceMax) {
      return false;
    }

    // Location
    if (filters.cityId && l.cityId !== filters.cityId) return false;

    // Featured
    if (filters.onlyFeatured && !l.isFeatured) return false;

    // Active
    if (filters.onlyActive && l.status !== 'active') return false;

    return true;
  });
}
