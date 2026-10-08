import type { ListingsState } from './listings.slice.types';
import { LISTINGS_PAGE_SIZE } from '../services/listingsService';
import { performSupabaseSync, performSupabaseSearch } from './listings.slice.supabase';
import { saveListingsToStorage } from '@/services/listing.service';
import { seedListings } from '@/data/seedListings';

type SetFn = (fn: (state: ListingsState) => void) => void;
type GetFn = () => ListingsState;

const initialSearchQuery: string | null = null;

export const createPaginationActions = (set: SetFn, get: GetFn) => ({
  activeSearchQuery: initialSearchQuery,
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
          s.listings = [...result.listings, ...seedListings];
          s.activeMarket = targetMarket ?? null;
          s.activeSearchQuery = null;
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
      const result = state.activeSearchQuery
        ? await performSupabaseSearch({
            query: state.activeSearchQuery,
            market: state.activeMarket ?? undefined,
            offset: nextOffset,
            limit: LISTINGS_PAGE_SIZE,
          })
        : await performSupabaseSync({
            market: state.activeMarket ?? undefined,
            offset: nextOffset,
            limit: LISTINGS_PAGE_SIZE,
          });
      set((s) => {
        if (result.listings && result.listings.length > 0) {
          const existingIds = new Set(s.listings.map((l) => l.id));
          const fresh = result.listings.filter((l) => !existingIds.has(l.id));
          s.listings = [...s.listings, ...fresh];
          s.page = s.page + 1;
          s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
          // Persist only non-search results (search is transient).
          if (!s.activeSearchQuery) saveListingsToStorage(s.listings);
        } else {
          s.hasMore = false;
        }
      });
    } finally {
      set((s) => { s.isLoadingMore = false; });
    }
  },
  searchFromSupabase: async (query: string, market?: string) => {
    const trimmed = query.trim();
    set((s) => { s.isSyncing = true; });
    try {
      if (trimmed.length === 0) {
        // Empty query → fall back to normal market sync.
        const targetMarket = market ?? get().activeMarket ?? undefined;
        const result = await performSupabaseSync({ market: targetMarket, offset: 0, limit: LISTINGS_PAGE_SIZE });
        set((s) => {
          if (result.listings) {
            s.listings = [...result.listings, ...seedListings];
            s.activeMarket = targetMarket ?? null;
            s.activeSearchQuery = null;
            s.page = 0;
            s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
            saveListingsToStorage(s.listings);
          }
        });
        return;
      }
      const targetMarket = market ?? get().activeMarket ?? undefined;
      const result = await performSupabaseSearch({ query: trimmed, market: targetMarket, offset: 0, limit: LISTINGS_PAGE_SIZE });
      set((s) => {
        if (result.listings) {
          s.listings = result.listings; // search results — no seed merge
          s.activeMarket = targetMarket ?? null;
          s.activeSearchQuery = trimmed;
          s.page = 0;
          s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
          // Do NOT persist search results to localStorage.
        }
      });
    } finally {
      set((s) => { s.isSyncing = false; });
    }
  },
});
