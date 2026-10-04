import { describe, it, expect } from 'vitest';
import { screenToPath, pathToScreen, resolvePath } from '../paths';
import type { ScreenType } from '@/store/ui.slice.types';

const ALL_SCREENS: ScreenType[] = [
  'main', 'listing-detail', 'seller-profile', 'search-results',
  'messages', 'thread', 'my-listings', 'wishlist', 'notifications',
  'profile', 'edit-profile', 'settings', 'sub-categories',
  'post-ad-entry', 'post-category', 'post-category-pick',
  'post-subcategory', 'post-photos', 'post-location', 'post-details',
  'post-ai-draft', 'post-ai-review', 'post-ai-capture',
  'post-publish-success', 'edit-post',
  'login', 'register', 'confirm',
  'terms', 'privacy', 'support', 'safety', 'about',
];

describe('paths — static round-trip', () => {
  it('every screen without params round-trips', () => {
    for (const screen of ALL_SCREENS) {
      const path = screenToPath(screen);
      const back = pathToScreen(path);
      expect(back, `round-trip failed for '${screen}' via '${path}'`).toBe(screen);
    }
  });
});

describe('paths — dynamic /listing/:id', () => {
  it('screenToPath includes encoded id', () => {
    expect(screenToPath('listing-detail', { listingId: 'abc-123' }))
      .toBe('/listing/abc-123');
  });

  it('screenToPath without id falls back to legacy /listing', () => {
    expect(screenToPath('listing-detail')).toBe('/listing');
    expect(screenToPath('listing-detail', { listingId: null })).toBe('/listing');
  });

  it('resolvePath extracts id', () => {
    const match = resolvePath('/listing/abc-123');
    expect(match?.screen).toBe('listing-detail');
    expect(match?.params.listingId).toBe('abc-123');
  });

  it('resolvePath handles encoded characters', () => {
    const match = resolvePath('/listing/a%20b');
    expect(match?.params.listingId).toBe('a b');
  });
});

describe('paths — dynamic /seller/:phone', () => {
  it('screenToPath includes encoded phone', () => {
    // '+' encodes to %2B
    expect(screenToPath('seller-profile', { sellerPhone: '+962791234567' }))
      .toBe('/seller/%2B962791234567');
  });

  it('resolvePath extracts phone', () => {
    const match = resolvePath('/seller/%2B962791234567');
    expect(match?.screen).toBe('seller-profile');
    expect(match?.params.sellerPhone).toBe('+962791234567');
  });

  it('screenToPath without phone falls back to legacy /seller', () => {
    expect(screenToPath('seller-profile')).toBe('/seller');
  });
});

describe('paths — edge cases', () => {
  it('returns null for unknown paths', () => {
    expect(resolvePath('/this-does-not-exist')).toBeNull();
    expect(resolvePath('/post-ad/unknown-step')).toBeNull();
    expect(pathToScreen('/post-ad/unknown-step')).toBeNull();
  });

  it('tolerates trailing slashes', () => {
    expect(resolvePath('/messages/')?.screen).toBe('messages');
    expect(resolvePath('/post-ad/photos/')?.screen).toBe('post-photos');
    expect(resolvePath('/listing/abc/')?.params.listingId).toBe('abc');
  });

  it('rejects multi-segment id segments (no ambiguity)', () => {
    // /listing/a/b should NOT match — id has no slash
    expect(resolvePath('/listing/a/b')).toBeNull();
  });
});
