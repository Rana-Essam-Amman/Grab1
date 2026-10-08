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
    expect(screenToPath('seller-profile', { sellerPhone: '+962791234567' })).toBe('/seller/%2B962791234567');
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

describe('paths — dynamic /post-ad/edit/:id', () => {
  it('screenToPath with listingId produces /post-ad/edit/{id}', () => {
    expect(screenToPath('edit-post', { listingId: 'abc-123' }))
      .toBe('/post-ad/edit/abc-123');
  });

  it('screenToPath without listingId falls back to legacy /post-ad/edit', () => {
    expect(screenToPath('edit-post')).toBe('/post-ad/edit');
  });

  it('resolvePath parses /post-ad/edit/:id', () => {
    const match = resolvePath('/post-ad/edit/abc-123');
    expect(match?.screen).toBe('edit-post');
    expect(match?.params.listingId).toBe('abc-123');
  });

  it('resolvePath still matches legacy /post-ad/edit (no id)', () => {
    const match = resolvePath('/post-ad/edit');
    expect(match?.screen).toBe('edit-post');
    expect(match?.params.listingId).toBeUndefined();
  });

  it('encodes uuid-like listingId correctly (round-trip)', () => {
    const id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    const path = screenToPath('edit-post', { listingId: id });
    expect(path).toBe(`/post-ad/edit/${id}`);
    const roundTrip = resolvePath(path);
    expect(roundTrip?.params.listingId).toBe(id);
  });
});

describe('paths — dynamic /messages/:id', () => {
  it('screenToPath includes encoded id', () => { expect(screenToPath('thread', { threadId: 'conv-1' })).toBe('/messages/conv-1'); });

  it('screenToPath without id falls back to legacy /messages/thread', () => {
    expect(screenToPath('thread')).toBe('/messages/thread');
    expect(screenToPath('thread', { threadId: null })).toBe('/messages/thread');
  });

  it('resolvePath extracts threadId', () => {
    const match = resolvePath('/messages/conv-abc-123');
    expect(match?.screen).toBe('thread');
    expect(match?.params.threadId).toBe('conv-abc-123');
  });

  it('legacy /messages/thread does NOT match as an id', () => {
    const match = resolvePath('/messages/thread');
    expect(match?.screen).toBe('thread');
    expect(match?.params.threadId).toBeUndefined();
  });

  it('/messages alone is the messages list, not a thread', () => {
    const match = resolvePath('/messages');
    expect(match?.screen).toBe('messages');
    expect(match?.params.threadId).toBeUndefined();
  });

  it('rejects multi-segment ids', () => {
    expect(resolvePath('/messages/a/b')).toBeNull();
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
    expect(resolvePath('/listing/a/b')).toBeNull();
  });
});
