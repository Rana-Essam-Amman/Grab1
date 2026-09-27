import type { Listing } from '@/types';
import type { ListingFilters } from '../../domain';
import type { ListingsRepository } from '../repositories/ListingsRepository';
import { filterListings } from './listingFilter.helper';
import { globalStorage } from '@/shared/lib/marketStorage';
import { z } from 'zod';

const STORAGE_KEY = 'listings_v1';
const BOOKMARKS_KEY = 'listings_bookmarks_v1';

const ATTRIBUTE_SCHEMA = z.object({
  key: z.string().optional(),
  label: z.string().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
}).passthrough();

const LISTING_SCHEMA = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  currency: z.string().optional(),
  countryCode: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  sellerPhone: z.string().optional(),
  sellerName: z.string().optional(),
  createdAt: z.string().optional(),
  views: z.number().optional(),
  attributes: z.array(ATTRIBUTE_SCHEMA).optional(),
  isPremium: z.boolean().optional(),
  status: z.string().optional(),
}).passthrough();

const LISTINGS_ARRAY_SCHEMA = z.array(LISTING_SCHEMA);
const BOOKMARKS_SCHEMA = z.array(z.string());

/**
 * LocalStorage implementation of ListingsRepository.
 * Swappable with FirestoreListingsAdapter in the future.
 */
export class LocalStorageListingsAdapter implements ListingsRepository {
  async getAll(): Promise<Listing[]> {
    return this._readListings();
  }

  async getById(id: string): Promise<Listing | null> {
    const all = await this._readListings();
    return all.find((l) => l.id === id) ?? null;
  }

  async filter(filters: ListingFilters): Promise<Listing[]> {
    const all = await this._readListings();
    return filterListings(all, filters);
  }

  async getBookmarked(): Promise<Listing[]> {
    const ids = this._readBookmarks();
    if (ids.length === 0) return [];
    const all = await this._readListings();
    return all.filter((l) => ids.includes(l.id));
  }

  async saveBookmarkedIds(ids: string[]): Promise<void> {
    this._writeBookmarks(ids);
  }

  async create(listing: Listing): Promise<void> {
    const all = await this._readListings();
    if (all.some((l) => l.id === listing.id)) return;
    this._writeListings([listing, ...all]);
  }

  async update(id: string, updates: Partial<Listing>): Promise<void> {
    const all = await this._readListings();
    const updated = all.map((l) =>
      l.id === id ? ({ ...l, ...updates } as Listing) : l,
    );
    this._writeListings(updated);
  }

  async delete(id: string): Promise<void> {
    const all = await this._readListings();
    this._writeListings(all.filter((l) => l.id !== id));
  }

  private async _readListings(): Promise<Listing[]> {
    try {
      const parsed = globalStorage().get<unknown>(STORAGE_KEY);
      const result = LISTINGS_ARRAY_SCHEMA.safeParse(parsed);
      return result.success ? (result.data as unknown as Listing[]) : [];
    } catch {
      return [];
    }
  }

  private _writeListings(listings: Listing[]): void {
    globalStorage().set(STORAGE_KEY, listings);
  }

  private _readBookmarks(): string[] {
    try {
      const parsed = globalStorage().get<unknown>(BOOKMARKS_KEY);
      const result = BOOKMARKS_SCHEMA.safeParse(parsed);
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  }

  private _writeBookmarks(ids: string[]): void {
    globalStorage().set(BOOKMARKS_KEY, ids);
  }
}
