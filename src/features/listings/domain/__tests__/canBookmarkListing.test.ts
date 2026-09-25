import { describe, it, expect } from 'vitest';
import { canBookmarkListing } from '../rules/canBookmarkListing';
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

describe('canBookmarkListing', () => {
  it('allows bookmarking same-market active listing not yet bookmarked', () => {
    const r = canBookmarkListing(baseListing, 'JO', []);
    expect(r.allowed).toBe(true);
  });

  it('blocks bookmarking cross-market listing', () => {
    const r = canBookmarkListing(baseListing, 'SA', []);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('cross-market');
  });

  it('blocks bookmarking archived listing', () => {
    const archived: Listing = { ...baseListing, status: 'archived' };
    const r = canBookmarkListing(archived, 'JO', []);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('listing-archived');
  });

  it('blocks re-bookmarking an already bookmarked listing', () => {
    const r = canBookmarkListing(baseListing, 'JO', ['l1']);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('already-bookmarked');
  });

  it('allows bookmarking when another listing is already bookmarked', () => {
    const r = canBookmarkListing(baseListing, 'JO', ['other-id']);
    expect(r.allowed).toBe(true);
  });
});
