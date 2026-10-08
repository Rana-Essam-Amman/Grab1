import { describe, it, expect } from 'vitest';
import { canViewListing } from '../rules/canViewListing';
import type { Listing } from '@/types';

describe('Cross-market policy', () => {
  const baseListing: Listing = {
    id: '1',
    title: 'Test',
    description: 'Desc',
    price: '100',
    currency: 'JOD',
    countryCode: 'JO',
    city: 'Amman',
    neighborhood: '',
    categorySlug: 'cars',
    subcategorySlug: '',
    imageUrl: '',
    images: [],
    sellerName: '',
    sellerPhone: '',
    views: 0,
    attributes: [],
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  it('same-market listing is viewable', () => {
    const r = canViewListing(baseListing, 'JO');
    expect(r.allowed).toBe(true);
    expect(r.isCrossMarket).toBe(false);
  });

  it('cross-market listing is viewable but flagged', () => {
    const r = canViewListing(baseListing, 'SA');
    expect(r.allowed).toBe(true);
    expect(r.isCrossMarket).toBe(true);
  });

  it('every market pair is viewable (MENA mobility)', () => {
    const markets = ['JO', 'SA', 'LB', 'PS', 'SY'] as const;
    for (const m1 of markets) {
      for (const m2 of markets) {
        const listing: Listing = { ...baseListing, countryCode: m1 };
        const r = canViewListing(listing, m2);
        expect(r.allowed).toBe(true);
        if (m1 !== m2) {
          expect(r.isCrossMarket).toBe(true);
        } else {
          expect(r.isCrossMarket).toBe(false);
        }
      }
    }
  });
});
