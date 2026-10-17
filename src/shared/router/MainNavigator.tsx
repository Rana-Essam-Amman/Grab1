import React, { Suspense } from 'react';
import { useUI } from '@/hooks/useUI';
import { useUIStore } from '@/store/ui.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { Header, BottomNav } from '@/shared/components';
import { CountrySheet } from '@/features/markets/components/CountrySheet';
import { Spinner } from '@/shared/ui/Spinner';
import { MarketContextBanner } from '@/features/markets/components/MarketContextBanner';
import { MARKETS, isValidMarketCode } from '@/data/markets/config';
import { useScrollToTop } from './useScrollToTop';
import { useUrlSync } from './useUrlSync';
import { useSearchResultsUrlSync } from './useSearchResultsUrlSync';
import { useScreenFromUrl } from './useScreenFromUrl';
import { globalStorage } from '@/shared/lib/marketStorage';
import { ScreenRouter } from './ScreenRouter';

const ScreenLoader: React.FC = () => (
  <div className="flex-1 w-full min-h-[60vh] flex items-center justify-center bg-background">
    <Spinner size="lg" />
  </div>
);

export const MainNavigator: React.FC = () => {
  const { isArabic } = useUI();
  const { currentScreen } = useScreenFromUrl();
  
  useUrlSync();
  useSearchResultsUrlSync();
  useScrollToTop();

  const authStatus = useAuthStore((s) => s.authStatus);
  const userCountry = useAuthStore((s) => s.user?.countryCode ?? null);
  const storedBrowseMarket = useUIStore((s) => s.browseMarketOverride);
  const geoCountryCode = useUIStore((s) => s.geoCountryCode);

  const [bannerDismissed, setBannerDismissed] = React.useState(false);

  const showMarketBanner = authStatus === 'authenticated' &&
    Boolean(userCountry && geoCountryCode && userCountry !== geoCountryCode && !storedBrowseMarket);

  const dismissKey = `catch_market_banner_dismissed_${geoCountryCode ?? ''}`;

  React.useEffect(() => {
    if (geoCountryCode) setBannerDismissed(globalStorage().get<string>(dismissKey) === '1');
  }, [dismissKey, geoCountryCode]);

  const handleExploreMarket = () => {
    if (geoCountryCode && isValidMarketCode(geoCountryCode)) {
      void useUIStore.getState().setBrowseMarketOverride(geoCountryCode);
    }
    if (geoCountryCode) globalStorage().set(dismissKey, '1');
    setBannerDismissed(true);
  };

  const handleDismissMarket = () => {
    if (geoCountryCode) globalStorage().set(dismissKey, '1');
    setBannerDismissed(true);
  };

  const awayMarketConfig = geoCountryCode && isValidMarketCode(geoCountryCode) ? MARKETS[geoCountryCode] : null;

  return (
    <div className="min-h-screen bg-canvas flex justify-center selection:bg-brand selection:text-white">
      <div className="w-full max-w-[440px] min-h-screen bg-canvas flex flex-col shadow-2xl relative">
        {currentScreen === 'main' && <Header />}
        {currentScreen === 'main' && showMarketBanner && !bannerDismissed && awayMarketConfig && (
          <MarketContextBanner
            isArabic={isArabic}
            awayCountryLabelAr={awayMarketConfig.nameAr}
            awayCountryLabelEn={awayMarketConfig.nameEn}
            onExplore={handleExploreMarket}
            onDismiss={handleDismissMarket}
          />
        )}
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<ScreenLoader />}>
            <div key={currentScreen} className="screen-enter">
              <ScreenRouter />
            </div>
          </Suspense>
        </main>
        {currentScreen === 'main' && <BottomNav />}
        <CountrySheet />
      </div>
    </div>
  );
};
