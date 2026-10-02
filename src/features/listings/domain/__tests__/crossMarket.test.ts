import { describe, it, expect } from 'vitest';
import { canViewListing } from '../rules/canViewListing';
import { canBookmarkListing } from '../rules/canBookmarkListing';
import type { Listing } from '../entities/Listing';
import type { MarketCode } from '@/data/markets/types';

function makeListing(countryCode: MarketCode): Listing {
  return {
    id: 'l1',
    title: 'Test',
    description: 'Test',
    price: '100',
    currency: 'JOD',
    countryCode,
    city: 'Amman',
    neighborhood: 'Khalda',
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    images: [],
    attributes: {},
    sellerName: 'Tester',
    sellerPhone: '0799999999',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    status: 'active',
  } as unknown as Listing;
}

describe('Cross-market isolation — RED LINE', () => {
  const markets: MarketCode[] = ['JO', 'LB', 'PS', 'SY', 'SA'];

  it('same-market listing is viewable', () => {
    for (const m of markets) {
      const listing = makeListing(m);
      const result = canViewListing(listing as never, m as never);
      expect(result.allowed, `expected ${m} → ${m} allowed`).toBe(true);
    }
  });

  it('cross-market listing is NEVER viewable', () => {
    for (const from of markets) {
      for (const to of markets) {
        if (from === to) continue;
        const listing = makeListing(to);
        const result = canViewListing(listing as never, from as never);
        expect(result.allowed, `leak: ${from} sees ${to}`).toBe(false);
      }
    }
  });

  it('cross-market listing is NEVER bookmarkable', () => {
    for (const from of markets) {
      for (const to of markets) {
        if (from === to) continue;
        const listing = makeListing(to);
        const result = canBookmarkListing(listing as never, from as never, []);
        expect(result.allowed, `leak: ${from} bookmarks ${to}`).toBe(false);
      }
    }
  });

  it('every market pair is mutually exclusive', () => {
    // 5 markets × 4 others = 20 cross-market combinations must ALL fail.
    let leaks = 0;
    for (const from of markets) {
      for (const to of markets) {
        if (from === to) continue;
        const listing = makeListing(to);
        const viewResult = canViewListing(listing as never, from as never);
        const bookmarkResult = canBookmarkListing(listing as never, from as never, []);
        if (viewResult.allowed || bookmarkResult.allowed) leaks++;
      }
    }
    expect(leaks).toBe(0);
  });
});
