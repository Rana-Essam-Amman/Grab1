import { useEffect } from 'react';
import { useListingsStore } from '../store/listings.slice';
import { useUIStore } from '@/store/ui.slice';

export function useSupabaseListingsSync(): void {
  const isInitialized = useListingsStore((s) => s.isInitialized);
  const syncFromSupabase = useListingsStore((s) => s.syncFromSupabase);
  const browseCountryCode = useUIStore((s) => s.browseCountryCode);

  useEffect(() => {
    if (!isInitialized) return;
    void syncFromSupabase(browseCountryCode);
  }, [isInitialized, browseCountryCode, syncFromSupabase]);
}
