import { describe, it, expect } from 'vitest';
import { canViewListing } from '../rules/canViewListing';
import type { Listing } from '@/types';

const baseListing: Listing = {
  id: 'l1',
  title: 'Toyota Camry',
  description: 'Clean',
  price: '12000',
  currency: 'JOD',
  countryCode: 'JO',
  city: 'Amman',
  neighborhood: 'Khalda',
  categorySlug: 'motors',
  subcategorySlug: 'cars',
  imageUrl: '/img.jpg',
  images: ['/img.jpg'],
  sellerPhone: '0791234567',
  sellerName: 'Ahmad',
  createdAt: '2026-09-18',
  views: 10,
  attributes: [],
  isPremium: false,
  status: 'active',
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
