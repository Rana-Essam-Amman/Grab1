import { useState, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { updateListingStatus } from '@/features/listings/services/listingsService';
import { useListingsStore } from '@/features/listings/store/listings.slice';

export function useAdminListingActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  // 🎯 Fix STORE_SYNC_GAP: Get update action from Zustand store
  const updateListing = useListingsStore((s) => s.updateListing);

  const featureFree = useCallback(async (listingId: string, days = 14) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.rpc('admin_set_featured_free', { p_listing_id: listingId, p_days: days });
      if (error) return { success: false, error: error.message };
      
      // Update global store
      if (data && data.success && data.expires_at) {
        updateListing(listingId, { isPremium: true, premiumExpiresAt: data.expires_at });
      }
      
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setIsProcessing(false);
    }
  }, [updateListing]);

  const unfeature = useCallback(async (listingId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('admin_unset_featured', { p_listing_id: listingId });
      if (error) return { success: false, error: error.message };
      
      // Update global store
      updateListing(listingId, { isPremium: false, premiumExpiresAt: undefined });
      
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setIsProcessing(false);
    }
  }, [updateListing]);

  const setStatus = useCallback(async (listingId: string, status: 'active' | 'sold' | 'archived') => {
    setIsProcessing(true);
    try {
      const { error } = await updateListingStatus(listingId, status);
      if (error) return { success: false, error };
      
      // Update global store
      updateListing(listingId, { status });
      
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setIsProcessing(false);
    }
  }, [updateListing]);

  return { isProcessing, featureFree, unfeature, setStatus };
}
