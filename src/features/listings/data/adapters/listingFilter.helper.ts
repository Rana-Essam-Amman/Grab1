import type { Listing } from '@/types';
import type { ListingFilters } from '../../domain';

/**
 * Pure function: filter listings by ListingFilters.
 * Works with UI Listing (from @/types).
 */
export function filterListings(
  listings: readonly Listing[],
  filters: ListingFilters,
): Listing[] {
  return listings.filter((l) => {
    // Market isolation (always enforced)
    if (l.countryCode !== filters.market) return false;

    // Category
    if (filters.categoryId && l.categorySlug !== filters.categoryId) return false;

    // Subcategory
    if (filters.subcategoryId && l.subcategorySlug !== filters.subcategoryId) {
      return false;
    }

    // Price range (parse string price to number)
    const priceNum = Number(String(l.price).replace(/[^0-9.]/g, '')) || 0;
    if (filters.priceMin !== undefined && priceNum < filters.priceMin) return false;
    if (filters.priceMax !== undefined && priceNum > filters.priceMax) return false;

    // Location
    if (filters.cityId && l.city !== filters.cityId) return false;

    // Premium
    if (filters.onlyFeatured && !l.isPremium) return false;

    // Active (status may be optional)
    if (filters.onlyActive && (l as { status?: string }).status && (l as { status?: string }).status !== 'active') return false;

    return true;
  });
}
