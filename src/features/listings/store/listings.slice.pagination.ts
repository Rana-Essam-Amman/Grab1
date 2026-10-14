import type { Listing } from '@/types';
import type { ListingsState } from './listings.slice.types';
import type { SearchListingsParams } from '../services/searchListings.types';
import { LISTINGS_PAGE_SIZE } from '../services/listingsService';
import { performSupabaseSync } from './listings.slice.supabase';
import { searchListingsHybrid } from '../services/searchListingsHybrid';
import { saveListingsToStorage } from '@/services/listing.service';

type SetFn = (fn: (state: ListingsState) => void) => void;
type GetFn = () => ListingsState;

const initialSearchQuery: string | null = null;
const initialFilterArgs: SearchListingsParams | null = null;

export const createPaginationActions = (set: SetFn, get: GetFn) => ({
  activeSearchQuery: initialSearchQuery,
  activeFilterArgs: initialFilterArgs,

  syncFromSupabase: async (market?: string) => {
    const targetMarket = market ?? get().activeMarket ?? undefined;
    set((s) => { s.isSyncing = true; });
    try {
      const result = await performSupabaseSync({
        market: targetMarket,
        offset: 0,
        limit: LISTINGS_PAGE_SIZE,
      });
      set((s) => {
        if (result.listings) {
          s.listings = result.listings;
          s.activeMarket = targetMarket ?? null;
          s.activeSearchQuery = null;
          s.activeFilterArgs = null;
          s.page = 0;
          s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
          saveListingsToStorage(s.listings);
        }
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
        const res = await searchListingsHybrid({
          ...state.activeFilterArgs,
          offset: nextOffset,
          limit: LISTINGS_PAGE_SIZE,
        });
        rows = res.data;
      } else {
        const res = await performSupabaseSync({
          market: state.activeMarket ?? undefined,
          offset: nextOffset,
          limit: LISTINGS_PAGE_SIZE,
        });
        rows = res.listings;
      }
      set((s) => {
        if (rows && rows.length > 0) {
          const existingIds = new Set(s.listings.map((l) => l.id));
          const fresh = rows!.filter((l) => !existingIds.has(l.id));
          s.listings = [...s.listings, ...fresh];
          s.page = s.page + 1;
          s.hasMore = rows!.length === LISTINGS_PAGE_SIZE;
          if (!s.activeSearchQuery) saveListingsToStorage(s.listings);
        } else {
          s.hasMore = false;
        }
      });
    } finally {
      set((s) => { s.isLoadingMore = false; });
    }
  },

  searchFromSupabase: async (params: SearchListingsParams) => {
    const trimmed = params.query.trim();
    set((s) => { s.isSyncing = true; });
    try {
      if (trimmed.length === 0) {
        const targetMarket = params.market ?? get().activeMarket ?? undefined;
        const result = await performSupabaseSync({
          market: targetMarket,
          offset: 0,
          limit: LISTINGS_PAGE_SIZE,
        });
        set((s) => {
          if (result.listings) {
            s.listings = result.listings;
            s.activeMarket = targetMarket ?? null;
            s.activeSearchQuery = null;
            s.activeFilterArgs = null;
            s.page = 0;
            s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
            saveListingsToStorage(s.listings);
          }
        });
        return;
      }

      const targetMarket = params.market ?? get().activeMarket ?? undefined;
      const callParams: SearchListingsParams = {
        ...params,
        query: trimmed,
        market: targetMarket,
        offset: 0,
        limit: LISTINGS_PAGE_SIZE,
      };
      const hybrid = await searchListingsHybrid(callParams);
      set((s) => {
        s.listings = hybrid.data ?? [];
        s.activeMarket = targetMarket ?? null;
        s.activeSearchQuery = trimmed;
        s.activeFilterArgs = callParams;
        s.page = 0;
        s.hasMore = (hybrid.data?.length ?? 0) === LISTINGS_PAGE_SIZE;
      });
    } finally {
      set((s) => { s.isSyncing = false; });
    }
  },
});
