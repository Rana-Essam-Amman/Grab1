import { useCallback, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { useAuth } from '@/hooks/useAuth';
import { marketStorage } from '@/shared/lib/marketStorage';
import { isValidMarketCode } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';
import { useListings } from '@/hooks/useListings';
import { MONETIZATION_MATRIX } from '@/data/monetization';

export interface UsePostAdEntryReturn {
  readonly isArabic: boolean;
  readonly handleBack: () => void;
  readonly startPostFlow: () => void;
  readonly canPostInMarket: boolean;
  readonly myMarket: MarketCode | null;
  readonly freeLimit: number;
  readonly freeRemaining: number;
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
  const { authStatus, isAnonymous, user } = useAuth();
  const { userListings } = useListings();

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

  const myMarket: MarketCode | null =
    user && typeof user.countryCode === 'string' && isValidMarketCode(user.countryCode)
      ? (user.countryCode as MarketCode)
      : null;

  const currentBrowseMarket: MarketCode | null = isValidMarketCode(browseCountryCode)
    ? (browseCountryCode as MarketCode)
    : null;

  const canPostInMarket =
    authStatus === 'authenticated' &&
    !isAnonymous &&
    myMarket !== null &&
    currentBrowseMarket !== null &&
    myMarket === currentBrowseMarket;

  const freeLimit = MONETIZATION_MATRIX.freeLimits.generalCategoryLimit;
  const activeCount = userListings.filter(
    (l) => l.status !== 'sold'
  ).length;
  const freeRemaining = Math.max(0, freeLimit - activeCount);

  const handleBack = useCallback(() => {
    setActiveTab('explore');
    goBack();
  }, [setActiveTab, goBack]);

  const startPostFlow = useCallback(() => {
    if (!canPostInMarket) return;
    draftStartPostFlow();
    setAiFlowPending(true);
    navigateTo('post-category');
  }, [canPostInMarket, draftStartPostFlow, setAiFlowPending, navigateTo]);

  return {
    isArabic,
    handleBack,
    startPostFlow,
    canPostInMarket,
    myMarket,
    freeLimit,
    freeRemaining,
  };
};
