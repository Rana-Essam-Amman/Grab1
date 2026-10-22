import { useCallback, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { useAuth } from '@/hooks/useAuth';
import { marketStorage } from '@/shared/lib/marketStorage';
import { isValidMarketCode } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';
import { useListings } from '@/hooks/useListings';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/shared/lib/supabase';

export interface UsePostAdEntryReturn {
  readonly isArabic: boolean;
  readonly handleBack: () => void;
  readonly startPostFlow: () => void;
  readonly canPostInMarket: boolean;
  readonly myMarket: MarketCode | null;
  readonly freeLimit: number;
  readonly freeRemaining: number;
  readonly updateUserMarket: (market: MarketCode) => Promise<void>;
}

export const usePostAdEntry = (): UsePostAdEntryReturn => {
  const { isArabic, goBack, navigateTo, setActiveTab, setAiFlowPending, browseCountryCode, setBrowseMarketOverrideLocal } = useUI();
  const { startPostFlow: draftStartPostFlow } = useDraft();
  const { authStatus, isAnonymous, user } = useAuth();
  const { userListings } = useListings();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (authStatus !== 'authenticated' || isAnonymous) {
      if (isValidMarketCode(browseCountryCode)) marketStorage(browseCountryCode as MarketCode).set('pending_post_entry', 'true');
      navigateTo('login');
    }
  }, [authStatus, isAnonymous, navigateTo, browseCountryCode]);

  const myMarket = user && typeof user.countryCode === 'string' && isValidMarketCode(user.countryCode) ? (user.countryCode as MarketCode) : null;
  const currentBrowseMarket = isValidMarketCode(browseCountryCode) ? (browseCountryCode as MarketCode) : null;
  const canPostInMarket = isAdmin || (authStatus === 'authenticated' && !isAnonymous && myMarket !== null && currentBrowseMarket !== null && myMarket === currentBrowseMarket);

  const freeLimit = MONETIZATION_MATRIX.freeLimits.generalCategoryLimit;
  const freeRemaining = isAdmin ? freeLimit : Math.max(0, freeLimit - userListings.filter((l) => l.status !== 'sold').length);

  const updateUserMarket = async (market: MarketCode) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ country_code: market }).eq('id', user.id);
    if (error) {
      console.error('Failed to update market', error);
      return;
    }
    setBrowseMarketOverrideLocal(market);
  };

  const handleBack = useCallback(() => { setActiveTab('explore'); goBack(); }, [setActiveTab, goBack]);

  const startPostFlow = useCallback(() => {
    if (!canPostInMarket) return;
    draftStartPostFlow(); setAiFlowPending(true); navigateTo('post-category');
  }, [canPostInMarket, draftStartPostFlow, setAiFlowPending, navigateTo]);

  return { isArabic, handleBack, startPostFlow, canPostInMarket, myMarket, freeLimit, freeRemaining, updateUserMarket };
};
