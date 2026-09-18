import { describe, it, expect } from 'vitest';
import { canViewListing } from '../rules/canViewListing';
import type { Listing } from '../entities/Listing';

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

describe('canViewListing', () => {
  it('allows viewing active listing in same market', () => {
    const r = canViewListing(baseListing, 'JO');
    expect(r.allowed).toBe(true);
  });

  it('blocks viewing cross-market listing', () => {
    const r = canViewListing(baseListing, 'SA');
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('cross-market');
  });

  it('blocks viewing archived listing', () => {
    const archived: Listing = { ...baseListing, status: 'archived' };
    const r = canViewListing(archived, 'JO');
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('listing-archived');
  });

  it('allows viewing pending listing', () => {
    const pending: Listing = { ...baseListing, status: 'pending' };
    const r = canViewListing(pending, 'JO');
    expect(r.allowed).toBe(true);
  });

  it('allows viewing sold listing', () => {
    const sold: Listing = { ...baseListing, status: 'sold' };
    const r = canViewListing(sold, 'JO');
    expect(r.allowed).toBe(true);
  });
});
