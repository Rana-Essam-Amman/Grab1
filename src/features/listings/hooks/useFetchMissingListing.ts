import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { Listing } from '@/types';
import type { MissingListingResult, MissingListingStatus } from '../helpers/resolveDetailLookup';
import { rowToListing } from '../services/listingsMapper';

export type { MissingListingResult, MissingListingStatus };

interface FetchState {
  forId: string | null;
  listing: Listing | null;
  status: MissingListingStatus;
}

const IDLE: FetchState = { forId: null, listing: null, status: 'idle' };

// Explicit safe columns only. seller_phone is never selected; reveal via get_listing_phone.
const SAFE_LISTING_COLUMNS =
  'id,user_id,is_demo,title,description,price,currency,country_code,city,neighborhood,city_slug,district_slug,neighborhood_slug,category_slug,subcategory_slug,images,image_width,image_height,attributes,status,views,seller_name,created_at,updated_at,bumps_today,bumps_reset_date,is_premium,premium_expires_at,auto_bump_active,auto_bump_expires_at';

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
          .select(SAFE_LISTING_COLUMNS)
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
        setState({ forId: selectedListingId, listing: rowToListing(data as never), status: 'found' });
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
