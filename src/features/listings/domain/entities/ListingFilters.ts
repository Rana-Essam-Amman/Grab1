import type { MarketCountry } from '@/shared/domain/market';

export interface ListingFilters {
  readonly market: MarketCountry;
  readonly categoryId?: string;
  readonly subcategoryId?: string;
  readonly priceMin?: number;
  readonly priceMax?: number;
  readonly cityId?: string;
  readonly onlyFeatured?: boolean;
  readonly onlyActive?: boolean;
}
