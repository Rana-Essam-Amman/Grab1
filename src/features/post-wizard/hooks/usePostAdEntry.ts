import { useCallback, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { useAuth } from '@/hooks/useAuth';
import { marketStorage } from '@/shared/lib/marketStorage';
import { isValidMarketCode } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';

export interface UsePostAdEntryReturn {
  isArabic: boolean;
  handleBack: () => void;
  startPostFlow: () => void;
}

export const usePostAdEntry = (): UsePostAdEntryReturn => {
  const {
    isArabic,
    goBack,
    navigateTo,
    setActiveTab,
    setAiFlowPending,
    browseCountryCode,
  } = useUI();
  const { startPostFlow: draftStartPostFlow } = useDraft();
  const { authStatus, isAnonymous } = useAuth();

  useEffect(() => {
    if (authStatus !== 'authenticated' || isAnonymous) {
      if (isValidMarketCode(browseCountryCode)) {
        marketStorage(browseCountryCode as MarketCode).set(
          'pending_post_entry',
          'true'
        );
      }
      navigateTo('login');
    }
  }, [authStatus, isAnonymous, navigateTo, browseCountryCode]);

  const handleBack = useCallback(() => {
    setActiveTab('explore');
    goBack();
  }, [setActiveTab, goBack]);

  const startPostFlow = useCallback(() => {
    draftStartPostFlow();
    setAiFlowPending(true);
    navigateTo('post-category');
  }, [draftStartPostFlow, setAiFlowPending, navigateTo]);

  return { isArabic, handleBack, startPostFlow };
};
