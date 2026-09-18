import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { useChatStore } from '@/features/chat/store/chat.slice';
import { useUIStore } from '@/store/ui.slice';
import { useDraftStore } from '@/features/post-wizard/store/draft.slice';
import { createMockListing } from '@/test/helpers/mockListing';
import { globalStorage } from '@/shared/lib/marketStorage';

describe('Slices Interaction Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset all stores without wiping actions
    useAuthStore.setState({ authStatus: 'unauthenticated', user: null, sessionToken: null });
    useListingsStore.setState({ listings: [], wishlist: [], activeWishlistCountry: 'JO', isInitialized: true });
    useChatStore.setState({ conversations: [] });
    useUIStore.setState({ browseCountryCode: 'JO', activeCurrency: 'JOD', locale: 'ar', screenHistory: ['main'] });
    useDraftStore.setState({ postDraft: { categorySlug: 'motors', subcategorySlug: 'cars', photos: [], city: 'عمّان', neighborhood: 'خلدا', site: '', noteText: '' } });
  });

  it('Scenario 1: Demo Auth Flow - Market Lock Verification', () => {
    // 1. Guest browsing SY
    useUIStore.getState().setBrowseLocation('SY', 'Damascus', 'دمشق');
    expect(useUIStore.getState().browseCountryCode).toBe('SY');

    // 2. Login as JO user
    useAuthStore.getState().loginDirectly('jo@user.com', '791', 'JO');
    
    // 3. Attempt to switch back to SY
    useUIStore.getState().setBrowseLocation('SY', 'Damascus', 'دمشق');
    
    // 4. Assert Lock
    expect(useUIStore.getState().browseCountryCode).toBe('JO');
    expect(useUIStore.getState().activeCurrency).toBe('JOD');
  });

  it('Scenario 2: Market Lock Enforcement on Login', () => {
    useAuthStore.getState().loginDirectly('jo@user.com', '791', 'JO');
    
    // Attempt to set browse location to SA
    useUIStore.getState().setBrowseLocation('SA', 'Riyadh', 'الرياض');
    
    expect(useUIStore.getState().browseCountryCode).toBe('JO');
    expect(useUIStore.getState().activeCurrency).toBe('JOD');
  });

  it('Scenario 3: Publish Listing Flow Persistence', () => {
    useAuthStore.getState().loginDirectly('seller@jo.com', '791', 'JO');
    const newListing = createMockListing({ id: 'user-pub-1', title: 'My Car' });
    
    useListingsStore.getState().addListing(newListing, 'JO');
    
    expect(useListingsStore.getState().listings[0].id).toBe('user-pub-1');
    expect(useListingsStore.getState().listings[0].countryCode).toBe('JO');
    const stored = globalStorage().get<any[]>('listings');
    expect(stored?.some((l) => l.id === 'user-pub-1')).toBe(true);
  });

  it('Scenario 4: Cross-Market Chat Blocked', () => {
    useAuthStore.getState().loginDirectly('jo@user.com', '791', 'JO');
    const listingSY = createMockListing({ id: 'sy-item', countryCode: 'SY' });
    
    expect(() => useChatStore.getState().startOrOpenConversation(listingSY, 'JO')).toThrow(/forbidden/);
  });

  it('Scenario 5: Guest Can Publish to Different Market', () => {
    // Guest browsing SY
    useUIStore.getState().setBrowseLocation('SY', 'Damascus', 'دمشق');
    
    const listingSY = createMockListing({ id: 'guest-sy-1' });
    useListingsStore.getState().addListing(listingSY, 'SY');
    
    expect(useListingsStore.getState().listings[0].countryCode).toBe('SY');
  });

  it('Scenario 6: Wishlist Isolation Across Markets', () => {
    // Add to JO wishlist
    useListingsStore.getState().setWishlistForCountry('JO');
    useListingsStore.getState().toggleWishlist('item-jo', 'JO');
    
    // Switch to SY
    useListingsStore.getState().setWishlistForCountry('SY');
    useListingsStore.getState().toggleWishlist('item-sy', 'SY');
    
    // SY has a fallback item 'sy-1' from listing.service.ts
    expect(useListingsStore.getState().wishlist).toContain('item-sy');
    expect(useListingsStore.getState().wishlist).toContain('sy-1');
    
    // Back to JO
    useListingsStore.getState().setWishlistForCountry('JO');
    // JO also has fallback 'jo-1'
    expect(useListingsStore.getState().wishlist).toContain('item-jo');
    expect(useListingsStore.getState().wishlist).toContain('jo-1');
  });

  it('Scenario 7: Delete Listing Cleans Up', () => {
    const id = 'cleanup-1';
    useListingsStore.getState().addListing(createMockListing({ id }), 'JO');
    useListingsStore.getState().toggleWishlist(id, 'JO');
    
    useListingsStore.getState().deleteListing(id);
    
    expect(useListingsStore.getState().listings.find(l => l.id === id)).toBeUndefined();
    expect(useListingsStore.getState().wishlist).not.toContain(id);
  });

  it('Scenario 8: Logout Preserves Listings and Wishlist', () => {
    useAuthStore.getState().loginDirectly('a@a.com', '1', 'JO');
    useListingsStore.getState().addListing(createMockListing({ id: 'persistent-1' }), 'JO');
    useListingsStore.getState().toggleWishlist('fav-1', 'JO');
    
    useAuthStore.getState().logout();
    
    expect(useListingsStore.getState().listings.some(l => l.id === 'persistent-1')).toBe(true);
    expect(useListingsStore.getState().wishlist).toContain('fav-1');
  });

  it('Scenario 9: Draft Survives Market Switch (guest)', () => {
    useUIStore.getState().setBrowseLocation('JO', 'Amman', 'عمان');
    useDraftStore.getState().updatePostDraft({ noteText: 'Guest Draft' });
    
    // Switch market
    useUIStore.getState().setBrowseLocation('SY', 'Damascus', 'دمشق');
    
    expect(useDraftStore.getState().postDraft.noteText).toBe('Guest Draft');
  });

  it('Scenario 10: Locale Switch Does Not Affect Market', () => {
    useUIStore.getState().setBrowseLocation('JO', 'Amman', 'عمان');
    useUIStore.getState().setLocale('en');
    
    expect(useUIStore.getState().browseCountryCode).toBe('JO');
    expect(useUIStore.getState().locale).toBe('en');
  });
});
