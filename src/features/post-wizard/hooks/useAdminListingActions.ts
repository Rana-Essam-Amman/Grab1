import { useState, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { updateListingStatus } from '@/features/listings/services/listingsService';

export function useAdminListingActions() {
  const [isProcessing, setIsProcessing] = useState(false);

  const featureFree = useCallback(async (listingId: string, days = 14) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('admin_set_featured_free', { p_listing_id: listingId, p_days: days });
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const unfeature = useCallback(async (listingId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('admin_unset_featured', { p_listing_id: listingId });
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const setStatus = useCallback(async (listingId: string, status: 'active' | 'sold' | 'archived') => {
    setIsProcessing(true);
    try {
      const { error } = await updateListingStatus(listingId, status);
      if (error) return { success: false, error };
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { isProcessing, featureFree, unfeature, setStatus };
}
