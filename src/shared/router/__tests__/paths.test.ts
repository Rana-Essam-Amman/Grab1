import { describe, it, expect } from 'vitest';
import { screenToPath, pathToScreen } from '../paths';
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

describe('paths', () => {
  it('every screen round-trips through screenToPath → pathToScreen', () => {
    for (const screen of ALL_SCREENS) {
      const path = screenToPath(screen);
      const back = pathToScreen(path);
      expect(back, `round-trip failed for '${screen}' via '${path}'`).toBe(screen);
    }
  });

  it('pathToScreen returns null for unknown paths', () => {
    expect(pathToScreen('/this-does-not-exist')).toBeNull();
    expect(pathToScreen('/post-ad/unknown-step')).toBeNull();
  });

  it('pathToScreen tolerates trailing slashes', () => {
    expect(pathToScreen('/messages/')).toBe('messages');
    expect(pathToScreen('/post-ad/photos/')).toBe('post-photos');
  });
});
