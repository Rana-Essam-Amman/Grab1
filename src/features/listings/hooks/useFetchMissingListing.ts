import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { Listing } from '@/types';
import type { MissingListingResult, MissingListingStatus } from '../helpers/resolveDetailLookup';

export type { MissingListingResult, MissingListingStatus };

interface FetchState {
  forId: string | null;
  listing: Listing | null;
  status: MissingListingStatus;
}

const IDLE: FetchState = { forId: null, listing: null, status: 'idle' };

function isNotFoundError(error: { code?: string; message?: string }): boolean {
  return error.code === 'PGRST116' || /0 rows|not found/i.test(error.message || '');
}

export function useFetchMissingListing(
  selectedListingId: string | null,
  localListing: Listing | null,
): MissingListingResult {
  const [state, setState] = useState<FetchState>(IDLE);

  useEffect(() => {
    if (!selectedListingId || localListing) {
      setState(IDLE);
      return;
    }
    let cancelled = false;
    setState({ forId: selectedListingId, listing: null, status: 'loading' });
    (async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', selectedListingId)
          .single();
        if (cancelled) return;
        if (error) {
          setState({
            forId: selectedListingId,
            listing: null,
            status: isNotFoundError(error) ? 'not_found' : 'error',
          });
          return;
        }
        if (!data) {
          setState({ forId: selectedListingId, listing: null, status: 'not_found' });
          return;
        }
        setState({ forId: selectedListingId, listing: data as Listing, status: 'found' });
      } catch {
        if (cancelled) return;
        setState({ forId: selectedListingId, listing: null, status: 'error' });
      }
    })();
    return () => { cancelled = true; };
  }, [selectedListingId, localListing]);

  if (!selectedListingId || localListing) return { listing: null, status: 'idle' };
  if (state.forId !== selectedListingId) return { listing: null, status: 'loading' };
  return { listing: state.listing, status: state.status };
}
