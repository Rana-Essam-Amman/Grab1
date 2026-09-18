import { describe, it, expect } from 'vitest';
import { canBookmarkListing } from '../rules/canBookmarkListing';
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
