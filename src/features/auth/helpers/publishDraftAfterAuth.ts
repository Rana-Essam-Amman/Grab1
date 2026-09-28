import { useUIStore } from '@/store/ui.slice';
import { getSanitizedCurrency } from '@/data/countries';
import { globalStorage } from '@/shared/lib/marketStorage';
import type { Listing } from '@/types';
import {
  getDraftSnapshot,
  resetDraftFromHelper,
  addListingFromHelper,
} from '@/shared/store-getters/postWizard.getter';

export function publishDraftAfterAuth(phoneNum: string, fName: string, market: string): void {
  try {
    const draft = getDraftSnapshot();
    
    // 1. If there's a completed draft, publish it
    if (draft?.generated) {
      const gen = draft.generated;
      const currency = getSanitizedCurrency(market);
      
      const newListing: Listing = {
        id: `listing-${crypto.randomUUID()}`,
        title: gen.title,
        description: gen.description,
        price: gen.price || '0',
        currency: currency as Listing['currency'],
        countryCode: market as Listing['countryCode'],
        city: draft.city || '',
        neighborhood: draft.neighborhood || '',
        categorySlug: gen.categorySlug || draft.categorySlug,
        subcategorySlug: gen.subcategorySlug || draft.subcategorySlug,
        imageUrl: draft.photos[0] || '',
        images: (draft.photos.length > 0 ? draft.photos : []).slice(0, 3),
        sellerPhone: phoneNum,
        sellerName: fName || 'Seller',
        createdAt: new Date().toISOString().split('T')[0],
        views: 1,
        status: 'active',
        attributes: [
          { label: 'Category', value: gen.categorySlug || draft.categorySlug },
          { label: 'City', value: draft.city || '' },
        ],
      };
      
      addListingFromHelper(newListing, market, true);
      resetDraftFromHelper();
      useUIStore.getState().setActiveTab('my-ads');
      useUIStore.getState().navigateTo('main');
    } else {
      // No draft — just go home
      useUIStore.getState().setActiveTab('explore');
      useUIStore.getState().navigateTo('main');
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    const errorData = {
      message: error.message,
      stack: error.stack?.slice(0, 2000) || '',
      timestamp: new Date().toISOString(),
      location: 'publishDraftAfterAuth/helper',
    };
    try {
      globalStorage().set('catch_crash_last', errorData);
    } catch {}
    alert('AUTO-PUBLISH ERROR: ' + errorData.message);
    console.error('AUTO-PUBLISH CRASH:', errorData);
  }
}
