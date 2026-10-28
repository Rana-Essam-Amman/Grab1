import { globalStorage } from '@/shared/lib/marketStorage';
import type { MarketCode } from '@/shared/lib/marketGate';
import { useAuthStore } from '@/features/auth';
import { getWishlistForMarket, saveWishlistForMarket } from '@/services/listing.service';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlistForMarket as clearWishlistService,
} from '@/features/listings/services/wishlistService';
import type { ListingsState } from './listings.slice.types';

type SetFn = (fn: (state: ListingsState) => void) => void;
type GetFn = () => ListingsState;

export const createWishlistActions = (set: SetFn, get: GetFn) => ({
  toggleWishlist: (id: string, countryCode?: string) => {
    const activeCountry =
      countryCode ||
      get().activeWishlistCountry ||
      globalStorage().get<string>('catch_browse_country') ||
      'JO';
    const userId = useAuthStore.getState().user?.id ?? null;

    set((state) => {
      if (activeCountry !== state.activeWishlistCountry) {
        state.activeWishlistCountry = activeCountry;
        state.wishlist = getWishlistForMarket(activeCountry);
      }
      const next = state.wishlist.includes(id)
        ? state.wishlist.filter((x) => x !== id)
        : [...state.wishlist, id];
      state.wishlist = next;
      saveWishlistForMarket(activeCountry, next);
    });

    if (!userId) return;

    const isNowIn = get().wishlist.includes(id);
    const promise = isNowIn
      ? addToWishlist(userId, id, activeCountry as MarketCode)
      : removeFromWishlist(userId, id);

    promise
      .then(({ error }) => {
        if (!error) return;
        set((state) => {
          const next = state.wishlist.includes(id)
            ? state.wishlist.filter((x) => x !== id)
            : [...state.wishlist, id];
          state.wishlist = next;
          saveWishlistForMarket(state.activeWishlistCountry, next);
        });
      })
      .catch(() => {});
  },

  clearWishlist: () => {
    const country = get().activeWishlistCountry;
    const userId = useAuthStore.getState().user?.id ?? null;

    set((state) => {
      state.wishlist = [];
      saveWishlistForMarket(state.activeWishlistCountry, []);
    });

    if (!userId) return;
    void clearWishlistService(userId, country as MarketCode);
  },

  setWishlistForCountry: (country: string) => {
    set((state) => {
      state.activeWishlistCountry = country;
      state.wishlist = getWishlistForMarket(country);
    });

    const userId = useAuthStore.getState().user?.id ?? null;
    if (!userId) return;
    void get().loadWishlistFromSupabase(userId, country);
  },

  loadWishlistFromSupabase: async (userId: string, marketCode: string) => {
    if (!userId || !marketCode) return;
    const { data, error } = await fetchWishlist(userId, marketCode as MarketCode);
    if (error || !data) return;
    set((state) => {
      if (state.activeWishlistCountry !== marketCode) return;
      state.wishlist = data.map((e) => e.listingId);
    });
  },

  migrateLegacyWishlistIfNeeded: async (userId: string) => {
    if (!userId) return;
    const markets: MarketCode[] = ['JO', 'SA', 'LB', 'PS', 'SY', 'KW'];
    for (const mc of markets) {
      const local = getWishlistForMarket(mc);
      if (!local || local.length === 0) continue;

      const { data } = await fetchWishlist(userId, mc);
      const serverIds = new Set(data?.map((d) => d.listingId) || []);

      for (const listingId of local) {
        if (!serverIds.has(listingId)) {
          await addToWishlist(userId, listingId, mc);
        }
      }
    }
  },
});
