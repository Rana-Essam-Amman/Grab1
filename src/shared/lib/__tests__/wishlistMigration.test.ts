import { describe, it, expect, beforeEach } from 'vitest';
import { getWishlistForMarket, saveWishlistForMarket } from '@/services/listing.service';

describe('Wishlist Migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should migrate from legacy underscore suffix format to canonical market-prefixed format', () => {
    // 1. Setup: write legacy key (the old format used in listing.service.ts before fix)
    const market = 'JO';
    const legacyKey = `catch_wishlist_${market}`;
    const data = ['item-legacy-1', 'item-legacy-2'];
    localStorage.setItem(legacyKey, JSON.stringify(data));

    // 2. Act: read via service (should pick up legacy data)
    const retrieved = getWishlistForMarket(market);
    expect(retrieved).toEqual(data);

    // 3. Act: save (should trigger write to new key and cleanup of legacy)
    saveWishlistForMarket(market, [...data, 'new-item']);

    // 4. Assertions
    const canonicalKey = `catch_${market}_wishlist`;
    expect(localStorage.getItem(canonicalKey), 'New canonical key should exist').not.toBeNull();
    expect(localStorage.getItem(legacyKey), 'Legacy key should have been removed').toBeNull();
    
    const finalData = JSON.parse(localStorage.getItem(canonicalKey)!);
    expect(finalData).toContain('new-item');
    expect(finalData).toContain('item-legacy-1');
  });

  it('should migrate from deep legacy "catch_favorites" for JO', () => {
    // 1. Setup
    const data = ['fav-1', 'fav-2'];
    localStorage.setItem('catch_favorites', JSON.stringify(data));

    // 2. Act: read for JO
    const retrieved = getWishlistForMarket('JO');
    expect(retrieved).toEqual(data);

    // 3. Act: save for JO
    saveWishlistForMarket('JO', data);

    // 4. Assert
    expect(localStorage.getItem('catch_JO_wishlist'), 'Canonical key should exist').not.toBeNull();
    expect(localStorage.getItem('catch_favorites'), 'Deep legacy key should be gone').toBeNull();
  });

  it('should not lose data if both keys exist (prefer canonical)', () => {
    const market = 'SA';
    const canonicalKey = `catch_${market}_wishlist`;
    const legacyKey = `catch_wishlist_${market}`;
    
    localStorage.setItem(canonicalKey, JSON.stringify(['new']));
    localStorage.setItem(legacyKey, JSON.stringify(['old']));

    const retrieved = getWishlistForMarket(market);
    expect(retrieved).toEqual(['new']);
  });
});
