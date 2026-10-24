import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { Listing } from '@/types';

export function useFetchMissingListing(
  selectedListingId: string | null,
  localListing: Listing | null
) {
  const [fetchedListing, setFetchedListing] = useState<Listing | null>(null);

  useEffect(() => {
    setFetchedListing(null);
  }, [selectedListingId]);

  useEffect(() => {
    if (!selectedListingId || localListing || fetchedListing) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('listings').select('*').eq('id', selectedListingId).single();
      if (cancelled) return;
      if (error || !data) {
        setFetchedListing(null);
      } else {
        setFetchedListing(data as Listing);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedListingId, localListing, fetchedListing]);

  return fetchedListing;
}
