import type { Listing } from '@/types';
import type { ListingsState } from './listings.slice.types';
import type { SearchListingsParams } from '../services/searchListings.types';
import { LISTINGS_PAGE_SIZE } from '../services/listingsService';
import { performSupabaseSync } from './listings.slice.supabase';
import { searchListingsHybrid } from '../services/searchListingsHybrid';
import { saveListingsToStorage } from '@/services/listing.service';
import { withDemoSeeds } from '@/shared/lib/demoMode';

type SetFn = (fn: (state: ListingsState) => void) => void;
type GetFn = () => ListingsState;

// SAFETY: only replace listings when market changed, API returned data, or local is empty.
// Prevents wipe from transient empty API responses.
function shouldApplyApiListings(activeMarket: string | null, targetMarket: string | undefined, localCount: number, apiCount: number): boolean {
  return activeMarket !== (targetMarket ?? null) || apiCount > 0 || localCount === 0;
}

export const createPaginationActions = (set: SetFn, get: GetFn) => ({
  activeSearchQuery: null as string | null,
  searchBanner: null,
  searchRelatedHeader: null,
  activeFilterArgs: null as SearchListingsParams | null,
  tier2Listings: [],

  syncFromSupabase: async (market?: string) => {
    const targetMarket = market ?? get().activeMarket ?? undefined;
    set((s) => { s.isSyncing = true; });
    try {
      const result = await performSupabaseSync({ market: targetMarket, offset: 0, limit: LISTINGS_PAGE_SIZE });
      set((s) => {
        if (!result.listings) return;
        if (shouldApplyApiListings(s.activeMarket, targetMarket, s.listings.length, result.listings.length)) {
          s.listings = withDemoSeeds(result.listings);
          saveListingsToStorage(s.listings);
        }
        s.activeMarket = targetMarket ?? null;
        s.activeSearchQuery = null;
        s.searchBanner = null;
        s.searchRelatedHeader = null;
        s.activeFilterArgs = null;
        s.tier2Listings = [];
        s.page = 0;
        s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
      });
    } finally {
      set((s) => { s.isSyncing = false; });
    }
  },

  loadMore: async () => {
    const state = get();
    if (state.isLoadingMore || !state.hasMore) return;
    const nextOffset = (state.page + 1) * LISTINGS_PAGE_SIZE;
    set((s) => { s.isLoadingMore = true; });
    try {
      let rows: Listing[] | null = null;
      if (state.activeSearchQuery && state.activeFilterArgs) {
        const res = await searchListingsHybrid({ ...state.activeFilterArgs, offset: nextOffset, limit: LISTINGS_PAGE_SIZE });
        rows = res.data;
      } else {
        const res = await performSupabaseSync({ market: state.activeMarket ?? undefined, offset: nextOffset, limit: LISTINGS_PAGE_SIZE });
        rows = res.listings;
      }
      set((s) => {
        if (!rows || rows.length === 0) { s.hasMore = false; return; }
        const existingIds = new Set(s.listings.map((l) => l.id));
        const fresh = rows.filter((l) => !existingIds.has(l.id));
        s.listings = [...s.listings, ...fresh];
        s.page = s.page + 1;
        s.hasMore = rows.length === LISTINGS_PAGE_SIZE;
        if (!s.activeSearchQuery) saveListingsToStorage(s.listings);
      });
    } finally {
      set((s) => { s.isLoadingMore = false; });
    }
  },

  searchFromSupabase: async (params: SearchListingsParams) => {
    const trimmed = params.query.trim();
    set((s) => { s.isSyncing = true; s.tier2Listings = []; });
    try {
      if (trimmed.length === 0) {
        const targetMarket = params.market ?? get().activeMarket ?? undefined;
        const result = await performSupabaseSync({ market: targetMarket, offset: 0, limit: LISTINGS_PAGE_SIZE });
        set((s) => {
          if (!result.listings) return;
          if (shouldApplyApiListings(s.activeMarket, targetMarket, s.listings.length, result.listings.length)) {
            s.listings = withDemoSeeds(result.listings);
            saveListingsToStorage(s.listings);
          }
          s.activeMarket = targetMarket ?? null;
          s.activeSearchQuery = null;
          s.searchBanner = null;
          s.searchRelatedHeader = null;
          s.activeFilterArgs = null;
          s.tier2Listings = [];
          s.page = 0;
          s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
        });
        return;
      }
      const targetMarket = params.market ?? get().activeMarket ?? undefined;
      const callParams: SearchListingsParams = { ...params, query: trimmed, market: targetMarket, offset: 0, limit: LISTINGS_PAGE_SIZE };
      const hybrid = await searchListingsHybrid(callParams);
      set((s) => {
        // SAFETY: null = error → keep state; [] = real empty result → apply it.
        if (hybrid.data !== null) {
          s.listings = hybrid.data;
          s.hasMore = hybrid.data.length === LISTINGS_PAGE_SIZE;
        }
        s.tier2Listings = hybrid.tier2Data ?? [];
        s.activeMarket = targetMarket ?? null;
        s.activeSearchQuery = trimmed;
        s.searchBanner = hybrid.banner ?? null;
        s.searchRelatedHeader = hybrid.relatedHeader ?? null;
        s.activeFilterArgs = callParams;
        s.page = 0;
      });
    } finally {
      set((s) => { s.isSyncing = false; });
    }
  },
});
