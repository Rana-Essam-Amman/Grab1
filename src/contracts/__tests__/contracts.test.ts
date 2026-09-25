import { describe, it, expect } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { useChatStore } from '@/features/chat/store/chat.slice';
import { useUIStore } from '@/store/ui.slice';
import { useDraftStore } from '@/features/post-wizard/store/draft.slice';
import { useMonetizationStore } from '@/features/listings/store/monetization.slice';

describe('Store Contracts — Public API Stability', () => {
  it('auth store matches AuthStoreContract', () => {
    const s = useAuthStore.getState();
    expect(s.authStatus).toBeDefined();
    expect(s.user).toBeDefined();
    expect(s.sessionToken).toBeDefined();
    expect(s.registeredUsers).toEqual(expect.any(Array));
    expect(s.loginDirectly).toEqual(expect.any(Function));
    expect(s.logout).toEqual(expect.any(Function));
    expect(s.beginRegistration).toEqual(expect.any(Function));
    expect(s.confirmRegistration).toEqual(expect.any(Function));
    expect(s.verifySession).toEqual(expect.any(Function));
    expect(s.registerNewUser).toEqual(expect.any(Function));
  });

  it('listings store matches ListingsStoreContract', () => {
    const s = useListingsStore.getState();
    expect(s.listings).toEqual(expect.any(Array));
    expect(s.wishlist).toEqual(expect.any(Array));
    expect(s.initialize).toEqual(expect.any(Function));
    expect(s.addListing).toEqual(expect.any(Function));
    expect(s.deleteListing).toEqual(expect.any(Function));
    expect(s.toggleWishlist).toEqual(expect.any(Function));
    expect(s.clearWishlist).toEqual(expect.any(Function));
    expect(s.setWishlistForCountry).toEqual(expect.any(Function));
    expect(s.refreshListings).toEqual(expect.any(Function));
    expect(s.validateAdQuotaAvailability).toEqual(expect.any(Function));
  });

  it('chat store matches ChatStoreContract', () => {
    const s = useChatStore.getState();
    expect(s.conversations).toEqual(expect.any(Array));
    expect(s.startOrOpenConversation).toEqual(expect.any(Function));
    expect(s.sendChatMessage).toEqual(expect.any(Function));
  });

  it('ui store matches UIStoreContract', () => {
    const s = useUIStore.getState();
    expect(s.locale).toBeDefined();
    expect(s.isArabic).toBeDefined();
    expect(s.browseCountryCode).toBeDefined();
    expect(s.activeCurrency).toBeDefined();
    expect(s.setLocale).toEqual(expect.any(Function));
    expect(s.navigateTo).toEqual(expect.any(Function));
    expect(s.goBack).toEqual(expect.any(Function));
    expect(s.setActiveTab).toEqual(expect.any(Function));
    expect(s.setBrowseLocation).toEqual(expect.any(Function));
    expect(s.setActiveCurrency).toEqual(expect.any(Function));
  });

  it('draft store matches DraftStoreContract', () => {
    const s = useDraftStore.getState();
    expect(s.postDraft).toBeDefined();
    expect(s.startPostFlow).toEqual(expect.any(Function));
    expect(s.updatePostDraft).toEqual(expect.any(Function));
    expect(s.resetPostDraft).toEqual(expect.any(Function));
  });

  it('monetization store matches MonetizationStoreContract', () => {
    const s = useMonetizationStore.getState();
    expect(s.isQuotaExhausted).toBeDefined();
    expect(s.validateAdQuotaAvailability).toEqual(expect.any(Function));
  });
});
