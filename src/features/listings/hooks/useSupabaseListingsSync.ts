import { useEffect } from 'react';
import { useListingsStore } from '../store/listings.slice';
import { useUIStore } from '@/store/ui.slice';

/**
 * Keeps listings in sync with the UI state:
 *   - browseCountryCode change → market sync (list RPC).
 *   - searchQuery change (non-empty) → FTS search (search RPC).
 *   - searchQuery cleared → fall back to market sync.
 *
 * The searchQuery from the UI store is already debounced at the screen
 * level (ExploreScreen, 300ms), so this hook reacts to final values only.
 */
export function useSupabaseListingsSync(): void {
  const isInitialized = useListingsStore((s) => s.isInitialized);
  const syncFromSupabase = useListingsStore((s) => s.syncFromSupabase);
  const searchFromSupabase = useListingsStore((s) => s.searchFromSupabase);
  const browseCountryCode = useUIStore((s) => s.browseCountryCode);
  const searchQuery = useUIStore((s) => s.searchQuery);

  useEffect(() => {
    if (!isInitialized) return;
    const trimmed = (searchQuery ?? '').trim();
    if (trimmed.length > 0) {
      void searchFromSupabase(trimmed, browseCountryCode);
    } else {
      void syncFromSupabase(browseCountryCode);
    }
  }, [
    isInitialized,
    browseCountryCode,
    searchQuery,
    syncFromSupabase,
    searchFromSupabase,
  ]);
}
