import { describe, it, expect } from 'vitest';
import { canViewListing } from '../rules/canViewListing';
import type { Listing } from '@/types';

describe('canViewListing', () => {
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

  it('allows viewing active listing in same market', () => {
    const r = canViewListing(baseListing, 'JO');
    expect(r.allowed).toBe(true);
    expect(r.isCrossMarket).toBe(false);
  });

  it('allows viewing cross-market listing but flags it', () => {
    const r = canViewListing(baseListing, 'SA');
    expect(r.allowed).toBe(true);
    expect(r.isCrossMarket).toBe(true);
  });

  it('blocks viewing archived listing', () => {
    const archived: Listing = { ...baseListing, status: 'archived' };
    const r = canViewListing(archived, 'JO');
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('listing-archived');
  });

  it('blocks viewing pending listing', () => {
    const pending: Listing = { ...baseListing, status: 'pending' };
    const r = canViewListing(pending, 'JO');
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('listing-pending');
  });

  it('allows viewing sold listing', () => {
    const sold: Listing = { ...baseListing, status: 'sold' };
    const r = canViewListing(sold, 'JO');
    expect(r.allowed).toBe(true);
  });
});
