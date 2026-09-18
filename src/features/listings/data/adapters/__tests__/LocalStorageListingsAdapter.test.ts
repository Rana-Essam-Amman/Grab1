import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageListingsAdapter } from '../LocalStorageListingsAdapter';
import type { Listing } from '../../../domain';

describe('LocalStorageListingsAdapter', () => {
  let adapter: LocalStorageListingsAdapter;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => storage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => { storage[key] = value; },
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => { delete storage[key]; },
    );
    adapter = new LocalStorageListingsAdapter();
  });

  const baseListing: Listing = {
    id: 'l1',
    title: 'Toyota Camry',
    price: 12000,
    currency: 'JOD',
    countryCode: 'JO',
    cityId: 'amman',
    categoryId: 'motors',
    subcategoryId: 'cars',
    sellerId: 'u1',
    status: 'active',
    isFeatured: false,
    viewsCount: 10,
  };

  it('returns empty array when no data', async () => {
    expect(await adapter.getAll()).toEqual([]);
  });

  it('creates and retrieves a listing', async () => {
    await adapter.create(baseListing);
    const found = await adapter.getById('l1');
    expect(found?.title).toBe('Toyota Camry');
  });

  it('does not duplicate listings on create', async () => {
    await adapter.create(baseListing);
    await adapter.create(baseListing);
    expect((await adapter.getAll()).length).toBe(1);
  });

  it('filters by market correctly', async () => {
    await adapter.create(baseListing);
    await adapter.create({ ...baseListing, id: 'l2', countryCode: 'SA' });
    const jo = await adapter.filter({ market: 'JO' });
    expect(jo.length).toBe(1);
  });

  it('filters by price range', async () => {
    await adapter.create(baseListing);
    await adapter.create({ ...baseListing, id: 'l2', price: 5000 });
    const cheap = await adapter.filter({ market: 'JO', priceMax: 8000 });
    expect(cheap.length).toBe(1);
    expect(cheap[0].id).toBe('l2');
  });

  it('updates a listing', async () => {
    await adapter.create(baseListing);
    await adapter.update('l1', { price: 10000 });
    const found = await adapter.getById('l1');
    expect(found?.price).toBe(10000);
  });

  it('deletes a listing', async () => {
    await adapter.create(baseListing);
    await adapter.delete('l1');
    expect(await adapter.getAll()).toEqual([]);
  });

  it('saves and retrieves bookmarked ids', async () => {
    await adapter.create(baseListing);
    await adapter.saveBookmarkedIds(['l1']);
    const bookmarked = await adapter.getBookmarked();
    expect(bookmarked.length).toBe(1);
    expect(bookmarked[0].id).toBe('l1');
  });

  it('handles corrupt storage gracefully', async () => {
    storage['listings_v1'] = 'invalid {';
    expect(await adapter.getAll()).toEqual([]);
  });
});
