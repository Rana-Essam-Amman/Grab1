import type { MarketCountry } from '@/shared/domain/market';

export type ListingStatus = 'active' | 'pending' | 'sold' | 'archived';

export interface Listing {
  readonly id: string;
  readonly title: string;
  readonly price: number;
  readonly currency: string;
  readonly countryCode: MarketCountry;
  readonly cityId: string;
  readonly categoryId: string;
  readonly subcategoryId: string;
  readonly sellerId: string;
  readonly status: ListingStatus;
  readonly isFeatured: boolean;
  readonly viewsCount: number;
}
