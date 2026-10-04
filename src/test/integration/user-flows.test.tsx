import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { useChatStore } from '@/features/chat/store/chat.slice';
import { openConversation } from '@/features/chat/store/chat.slice.actions.mutate';
import { useDraftStore } from '@/features/post-wizard/store/draft.slice';
import { createMockListing, createMockDraft, createMockUser } from '@/test/helpers';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations';

vi.mock('@/features/listings/services/listingsService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/listings/services/listingsService')>();
  return {
    ...actual,
    deleteListing: vi.fn().mockResolvedValue({ error: null }),
  };
});

describe('Real User Flow Integration Test Suite (Sprint T3 Ultra)', () => {
  beforeEach(() => {
    localStorage.clear();

    // Reset Auth
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
      registrationPendingUser: null,
      registeredUsers: [],
    });

    // Reset UI
    useUIStore.setState({
      locale: 'ar',
      isArabic: true,
      currentScreen: 'main',
      activeTab: 'explore',
      screenHistory: ['main'],
      selectedListingId: null,
      selectedThreadId: null,
      selectedSellerPhone: null,
      searchQuery: '',
      categoryFilter: null,
      selectedParentCategory: null,
      maxPriceFilter: null,
      neighborhoodFilter: null,
      browseCountryCode: 'JO',
      browseCityEn: 'Amman',
      browseCityAr: 'عمّان',
      activeCurrency: 'JOD',
      isAiFocused: false,
      isCountrySheetOpen: false,
    });

    // Reset Listings
    useListingsStore.setState({
      listings: [],
      wishlist: [],
      activeWishlistCountry: 'JO',
      isInitialized: true,
      isQuotaExhausted: false,
    });

    // Reset Chat
    useChatStore.setState({
      conversations: [],
    });

    // Reset Draft
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors',
        subcategorySlug: 'cars',
        photos: [],
        city: 'عمّان',
        neighborhood: 'خلدا',
        site: '',
        noteText: '',
      },
    });
  });

  it('Flow 1: Guest browses and cannot publish without authenticating', () => {
    const authState = useAuthStore.getState();
    expect(authState.authStatus).toBe('unauthenticated');
    expect(authState.user).toBeNull();

    // Guest tries to navigate to post screen
    useUIStore.getState().navigateTo('post-category');
    expect(useUIStore.getState().currentScreen).toBe('post-category');

    // Trying to save a listing with missing activeCountry or unverified session throws
    expect(() => {
      // Intentional invalid input — empty countryCode + empty activeCountry 
      // must throw "Market Isolation Violation". Cast to never for this test.
      useListingsStore.getState().addListing(createMockListing({ countryCode: '' as never }), '');
    }).toThrow(/Market Isolation Violation/i);
  });

  it('Flow 2: Guest user switches regional marketplace freely', () => {
    const uiStore = useUIStore.getState();
    expect(uiStore.browseCountryCode).toBe('JO');

    uiStore.setBrowseLocation('SA', 'Riyadh', 'الرياض');
    expect(useUIStore.getState().browseCountryCode).toBe('SA');
    expect(useUIStore.getState().activeCurrency).toBe('SAR');

    uiStore.setBrowseLocation('SY', 'Damascus', 'دمشق');
    expect(useUIStore.getState().browseCountryCode).toBe('SY');
    expect(useUIStore.getState().activeCurrency).toBe('SYP');
  });

  it('Flow 3: Authenticated user is strictly locked to their home country market', () => {
    useAuthStore.setState({
      authStatus: 'authenticated',
      user: createMockUser({ countryCode: 'JO' }),
      sessionToken: 'valid-session-jwt',
    });

    // Try switching to Saudi Arabia
    useUIStore.getState().setBrowseLocation('SA', 'Riyadh', 'الرياض');

    // Must be locked to Jordan
    const uiState = useUIStore.getState();
    expect(uiState.browseCountryCode).toBe('JO');
    expect(uiState.activeCurrency).toBe('JOD');
  });

  it('Flow 4: Publish listing flow adds verified listing to home market', () => {
    useAuthStore.setState({
      authStatus: 'authenticated',
      user: createMockUser({ countryCode: 'JO', phone: '+962791112233' }),
      sessionToken: 'valid-token',
    });

    const mockDraft = createMockDraft({
      categorySlug: 'motors',
      city: 'Amman',
      neighborhood: 'Abdoun',
    });
    useDraftStore.getState().updatePostDraft(mockDraft);

    const generated = mockDraft.generated!;
    const newListing = createMockListing({
      title: generated.title,
      description: generated.description,
      price: generated.price,
      countryCode: 'JO',
      city: 'Amman',
      neighborhood: 'Abdoun',
      sellerPhone: '+962791112233',
    });

    useListingsStore.getState().addListing(newListing, 'JO', false);

    const listings = useListingsStore.getState().listings;
    expect(listings).toHaveLength(1);
    expect(listings[0].title).toBe('Mercedes Benz C200 2022');
    expect(listings[0].countryCode).toBe('JO');
    expect(listings[0].city).toBe('Amman');
  });

  it('Flow 5: Cross-market chat communication is strictly blocked with error', async () => {
    await expect(
      openConversation(
        { listingId: 'sy-item', buyerId: 'b1', sellerId: 's1', marketCode: 'SY' },
        'JO'
      )
    ).rejects.toThrow(/forbidden/i);
  });

  it('Flow 6: Wishlist isolation persists separately per regional country market', () => {
    const { toggleWishlist, setWishlistForCountry } = useListingsStore.getState();

    // Add item to JO wishlist
    toggleWishlist('jo-item-1', 'JO');
    expect(useListingsStore.getState().wishlist).toContain('jo-item-1');

    // Switch to SA wishlist
    setWishlistForCountry('SA');
    expect(useListingsStore.getState().activeWishlistCountry).toBe('SA');

    // Add item to SA wishlist
    toggleWishlist('sa-item-1', 'SA');
    expect(useListingsStore.getState().wishlist).toContain('sa-item-1');

    // Switch back to JO
    setWishlistForCountry('JO');
    expect(useListingsStore.getState().wishlist).toContain('jo-item-1');
    expect(useListingsStore.getState().wishlist).not.toContain('sa-item-1');
  });

  it('Flow 7: Logging out preserves created marketplace listings in persistence layer', () => {
    useAuthStore.setState({
      authStatus: 'authenticated',
      user: createMockUser({ countryCode: 'JO' }),
      sessionToken: 'token-active',
    });

    useListingsStore.getState().addListing(createMockListing({ id: 'persisted-1' }), 'JO');
    expect(useListingsStore.getState().listings).toHaveLength(1);

    // Logout
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().authStatus).toBe('unauthenticated');
    expect(useAuthStore.getState().user).toBeNull();

    // Listings still exist
    expect(useListingsStore.getState().listings).toHaveLength(1);
    expect(useListingsStore.getState().listings[0].id).toBe('persisted-1');
  });

  it('Flow 8: Locale switch does not alter active marketplace country or currency', () => {
    useUIStore.getState().setBrowseLocation('SA', 'Riyadh', 'الرياض');
    expect(useUIStore.getState().browseCountryCode).toBe('SA');
    expect(useUIStore.getState().activeCurrency).toBe('SAR');

    // Switch locale to English
    useUIStore.getState().setLocale('en');
    expect(useUIStore.getState().locale).toBe('en');
    expect(useUIStore.getState().browseCountryCode).toBe('SA');
    expect(useUIStore.getState().activeCurrency).toBe('SAR');

    // Switch back to Arabic
    useUIStore.getState().setLocale('ar');
    expect(useUIStore.getState().locale).toBe('ar');
    expect(useUIStore.getState().browseCountryCode).toBe('SA');
  });

  it('Flow 9: Deleting a listing automatically removes it from active wishlist', async () => {
    const listing = createMockListing({ id: 'target-listing' });
    useListingsStore.getState().addListing(listing, 'JO');
    useListingsStore.getState().toggleWishlist('target-listing', 'JO');

    expect(useListingsStore.getState().wishlist).toContain('target-listing');

    // Delete listing
    await useListingsStore.getState().deleteListing('target-listing');

    expect(useListingsStore.getState().listings.find((l) => l.id === 'target-listing')).toBeUndefined();
    expect(useListingsStore.getState().wishlist).not.toContain('target-listing');
  });

  it('Flow 10: Quota limits are enforced based on category and country matrix', () => {
    const userId = 'quota-tester';

    // Add 2 motors listings (the free limit for motors is 2)
    useListingsStore.getState().addListing(
      createMockListing({ id: 'm1', sellerPhone: userId, countryCode: 'JO', categorySlug: 'motors' }),
      'JO'
    );
    useListingsStore.getState().addListing(
      createMockListing({ id: 'm2', sellerPhone: userId, countryCode: 'JO', categorySlug: 'motors' }),
      'JO'
    );

    const isAvailable = useListingsStore.getState().validateAdQuotaAvailability('motors', userId, 'JO', false);
    expect(isAvailable).toBe(false);
    expect(useListingsStore.getState().isQuotaExhausted).toBe(true);

    // Electronics category has limit of 5 -> still available
    const isElecAvailable = useListingsStore.getState().validateAdQuotaAvailability('electronics', userId, 'JO', false);
    expect(isElecAvailable).toBe(true);
  });

  it('Flow 11: Post draft state persists across screen navigations', () => {
    useDraftStore.getState().updatePostDraft({
      noteText: 'Special car in pristine condition',
      city: 'Amman',
      neighborhood: 'Dabouq',
    });

    // Navigate to multiple screens
    useUIStore.getState().navigateTo('settings');
    useUIStore.getState().navigateTo('wishlist');
    useUIStore.getState().navigateTo('main');

    const draft = useDraftStore.getState().postDraft;
    expect(draft.noteText).toBe('Special car in pristine condition');
    expect(draft.city).toBe('Amman');
    expect(draft.neighborhood).toBe('Dabouq');
  });

  it('Flow 12: Resetting post draft synchronizes location with current browse market', () => {
    useUIStore.getState().setBrowseLocation('SA', 'Riyadh', 'الرياض');
    useDraftStore.getState().resetPostDraft();

    const draft = useDraftStore.getState().postDraft;
    expect(draft.city).toBe('الرياض');
    expect(draft.neighborhood).toBe(DEFAULT_REGIONAL_CAPITALS.SA.neighborhoodAr);
  });
});
