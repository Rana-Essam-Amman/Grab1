import { useEffect } from 'react';
import { useListingsStore } from '../store/listings.slice';

export function useSupabaseListingsSync(): void {
  const isInitialized = useListingsStore((s) => s.isInitialized);
  const syncFromSupabase = useListingsStore((s) => s.syncFromSupabase);

  useEffect(() => {
    if (!isInitialized) return;
    void syncFromSupabase();
  }, [isInitialized, syncFromSupabase]);
}
