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
import { capture } from '@/shared/analytics/posthog';
import { EVENTS } from '@/shared/analytics/events';
import { toast } from 'sonner';

export interface UsePostAdEntryReturn {
  readonly isArabic: boolean;
  readonly handleBack: () => void;
  readonly startPostFlow: () => void;
  readonly canPostInMarket: boolean;
  readonly myMarket: MarketCode | null;
  readonly freeLimit: number;
  readonly freeRemaining: number;
  readonly updateUserMarket: (market: MarketCode) => Promise<boolean>;
}

export const usePostAdEntry = (): UsePostAdEntryReturn => {
  const { isArabic, goBack, navigateTo, setActiveTab, setAiFlowPending, browseCountryCode, setBrowseMarketOverrideLocal } = useUI();
  const { startPostFlow: draftStartPostFlow } = useDraft();
  const { authStatus, isAnonymous, user, updateUser } = useAuth();
  const { userListings } = useListings();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  useEffect(() => {
    if (authStatus !== 'authenticated' || isAnonymous) {
      if (isValidMarketCode(browseCountryCode)) marketStorage(browseCountryCode as MarketCode).set('pending_post_entry', 'true');
      navigateTo('login');
    }
  }, [authStatus, isAnonymous, navigateTo, browseCountryCode]);

  const myMarket = user && typeof user.countryCode === 'string' && isValidMarketCode(user.countryCode) ? (user.countryCode as MarketCode) : null;
  const currentBrowseMarket = isValidMarketCode(browseCountryCode) ? (browseCountryCode as MarketCode) : null;
  const canPostInMarket = !isAdminLoading && (isAdmin || (authStatus === 'authenticated' && !isAnonymous && myMarket !== null && currentBrowseMarket !== null && myMarket === currentBrowseMarket));

  const freeLimit = MONETIZATION_MATRIX.freeLimits.generalCategoryLimit;
  const freeRemaining = isAdmin ? freeLimit : Math.max(0, freeLimit - userListings.filter((l) => l.status !== 'sold').length);

  const updateUserMarket = async (market: MarketCode): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase.from('profiles').update({ country_code: market }).eq('id', user.id);
      if (error) {
        console.error('Failed to update market', error);
        return false;
      }
      setBrowseMarketOverrideLocal(market);
      if (updateUser) {
        updateUser({ countryCode: market });
      }
      return true;
    } catch (err) {
      console.error('Unexpected error updating market', err);
      return false;
    }
  };

  const handleBack = useCallback(() => { setActiveTab('explore'); goBack(); }, [setActiveTab, goBack]);

  const draftMarket = myMarket ?? currentBrowseMarket;

  const startPostFlow = useCallback(() => {
    if (isAdminLoading) return;
    if (freeRemaining <= 0) {
      toast.error(isArabic ? 'لقد استهلكت إعلاناتك المجانية. يرجى ترقية حسابك أو حذف إعلان قديم.' : 'You have used your free ads. Please upgrade or delete an old ad.');
      navigateTo('pricing');
      return;
    }
    if (!canPostInMarket) return;
    draftStartPostFlow(); setAiFlowPending(true);
    capture(EVENTS.LISTING_STARTED, { market: draftMarket ?? 'unknown' });
    navigateTo('post-category');
  }, [canPostInMarket, freeRemaining, draftStartPostFlow, setAiFlowPending, navigateTo, draftMarket, isAdminLoading, isArabic]);

  return { isArabic, handleBack, startPostFlow, canPostInMarket, myMarket, freeLimit, freeRemaining, updateUserMarket };
};
