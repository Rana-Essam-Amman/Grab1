import type { Listing, ListingFilters } from '../../domain';

export interface ListingsRepository {
  getAll(): Promise<Listing[]>;
  getById(id: string): Promise<Listing | null>;
  filter(filters: ListingFilters): Promise<Listing[]>;
  getBookmarked(): Promise<Listing[]>;
  saveBookmarkedIds(ids: string[]): Promise<void>;
  create(listing: Listing): Promise<void>;
  update(id: string, updates: Partial<Listing>): Promise<void>;
  delete(id: string): Promise<void>;
}
