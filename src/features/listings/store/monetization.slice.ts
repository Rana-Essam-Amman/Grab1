import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { validateAdQuotaAvailability as validateHelper } from '@/data/monetization';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { getCurrentUser } from '@/shared/store-getters/auth.getter';
import { getBrowseCountryCode } from '@/shared/store-getters/ui.getter';
import type { MonetizationRepository } from '@/features/monetization/data/repositories/MonetizationRepository';
import { LocalStorageMonetizationAdapter } from '@/features/monetization/data/adapters/LocalStorageMonetizationAdapter';

const monetizationRepository: MonetizationRepository = new LocalStorageMonetizationAdapter();

export interface MonetizationState {
  isQuotaExhausted: boolean;
  setIsQuotaExhausted: (exhausted: boolean) => void;
  validateAdQuotaAvailability: (categorySlug: string) => boolean;
}

export const useMonetizationStore = create<MonetizationState>()(
  immer((set) => ({
    isQuotaExhausted: false,
    setIsQuotaExhausted: (exhausted) => {
      set((state) => {
        state.isQuotaExhausted = exhausted;
      });
    },
    validateAdQuotaAvailability: (categorySlug) => {
      const { listings } = useListingsStore.getState();
      const user = getCurrentUser();
      const browseCountryCode = getBrowseCountryCode();
      
      const userId = user?.phone || user?.email || 'guest';
      const isVip = Boolean(user?.isVipShop);
      
      const result = validateHelper(listings, userId, browseCountryCode, categorySlug, isVip);
      
      set((state) => {
        state.isQuotaExhausted = !result.allowed;
      });
      
      monetizationRepository.getAiQuota().catch(console.error);

      return result.allowed;
    }
  }))
);

monetizationRepository.getAiQuota().catch(console.error);

