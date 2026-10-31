import { Listing } from '@/types';
import { saveListingsToStorage } from '@/services/listing.service';
import { sanitizeListingData } from './listings.slice.helpers';
import type { PublishResult, ListingsState } from './listings.slice.types';
import { performSupabasePublish } from './listings.slice.supabase';

function generateTempListingId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `temp-${crypto.randomUUID()}`;
    }
  } catch {
    /* fall through */
  }
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

type Set = (fn: (state: ListingsState) => void) => void;

export const createPublishAction = (set: Set) => ({
  publishListing: async (listing: Listing, activeCountry: string, isArabic = true): Promise<PublishResult> => {
    const tempId = generateTempListingId();
    const now = new Date().toISOString();
    const optimisticListing: Listing = {
      ...listing,
      id: tempId,
      createdAt: listing.createdAt || now,
      views: listing.views ?? 0,
    };

    set((state) => {
      state.listings = [optimisticListing, ...state.listings];
      saveListingsToStorage(state.listings);
    });

    try {
      const { remoteListing, error, fallbackToLocal } = await performSupabasePublish(
        listing,
        activeCountry,
        isArabic
      );

      if (fallbackToLocal) {
        const sanitized = sanitizeListingData(listing, activeCountry, isArabic);
        set((state) => {
          state.listings = state.listings.map((item) =>
            item.id === tempId ? sanitized : item
          );
          saveListingsToStorage(state.listings);
        });
        return { success: true, remoteId: sanitized.id, error: null };
      }

      if (error || !remoteListing) {
        set((state) => {
          state.listings = state.listings.filter((item) => item.id !== tempId);
          saveListingsToStorage(state.listings);
        });
        return { success: false, remoteId: null, error: error || 'فشل النشر' };
      }

      set((state) => {
        state.listings = state.listings.map((item) =>
          item.id === tempId ? remoteListing : item
        );
        saveListingsToStorage(state.listings);
      });
      return { success: true, remoteId: remoteListing.id, error: null };
    } catch (err) {
      set((state) => {
        state.listings = state.listings.filter((item) => item.id !== tempId);
        saveListingsToStorage(state.listings);
      });
      return {
        success: false,
        remoteId: null,
        error: err instanceof Error ? err.message : 'خطأ غير معروف',
      };
    }
  },
});
