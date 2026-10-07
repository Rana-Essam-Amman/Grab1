import { useUI } from './hooks/useUI';
import React, { lazy, Suspense, useMemo } from 'react';
import { useUIStore } from './store/ui.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useListingsStore } from './features/listings/store/listings.slice';
import { registerListingsGetterForMonetization } from '@/features/monetization/store/deps';
import { registerUIGetter } from '@/shared/store-getters/ui.getter';
import { registerAuthGetter } from '@/shared/store-getters/auth.getter';

registerUIGetter(() => useUIStore.getState());
registerAuthGetter(() => useAuthStore.getState().user);
registerListingsGetterForMonetization(() => useListingsStore.getState().listings);

import { Header, BottomNav, ErrorBoundary } from '@/shared/components';
import { ErrorBoundaryWithLogging } from '@/shared/components/ErrorBoundaryWithLogging';
import { TranslationProvider } from '@/shared/i18n';
import { CountrySheet } from '@/features/markets/components/CountrySheet';
import { ExploreScreen } from '@/features/explore/screens/ExploreScreen';
import { Spinner } from '@/shared/ui/Spinner';
import { RegistryProvider, useRegistry } from '@/shared/registry';
import { CatalogScreen } from '@/features/dev/screens/CatalogScreen';
import { Toaster } from 'sonner';
import { OfflineBanner } from '@/shared/ui/OfflineBanner';
import { GlobalPhoneCaptureMount } from '@/shared/components/GlobalPhoneCaptureMount';
import { BuildBadge } from '@/shared/components/BuildBadge';
import { useSupabaseAuthListener } from '@/features/auth/hooks/useSupabaseAuthListener';
import { useBootMigrations } from '@/shared/hooks/useBootMigrations';
import { useSupabaseListingsSync } from '@/features/listings/hooks/useSupabaseListingsSync';
import { useSupabaseWishlistSync } from '@/features/listings/hooks/useSupabaseWishlistSync';
import { useSupabaseChatSync } from '@/features/chat/hooks/useSupabaseChatSync';
import { useMarketSync } from '@/features/markets/hooks/useMarketSync';
import { MarketContextBanner } from '@/features/markets/components/MarketContextBanner';
import { MARKETS, isValidMarketCode } from '@/data/markets/config';
import { useOnlinePresence } from '@/features/chat/hooks/useOnlinePresence';
import { RouterProvider } from '@/shared/router/RouterProvider';
import { useScrollToTop } from '@/shared/router/useScrollToTop';
import { useUrlSync } from '@/shared/router/useUrlSync';
import { globalStorage } from '@/shared/lib/marketStorage';

const CategoriesScreen = lazy(() => import('@/features/categories/screens/CategoriesScreen').then((m) => ({ default: m.CategoriesScreen })));
const MyAdsScreen = lazy(() => import('@/features/my-ads/screens/MyAdsScreen').then((m) => ({ default: m.MyAdsScreen })));
const MessagesScreen = lazy(() => import('@/features/chat/screens/MessagesScreen').then((m) => ({ default: m.MessagesScreen })));
const ThreadScreen = lazy(() => import('@/features/chat/screens/ThreadScreen').then((m) => ({ default: m.ThreadScreen })));
const ListingDetailScreen = lazy(() => import('@/features/listings/screens/ListingDetailScreen').then((m) => ({ default: m.ListingDetailScreen })));
const SellerProfileScreen = lazy(() => import('@/features/listings/screens/SellerProfileScreen').then((m) => ({ default: m.SellerProfileScreen })));
const SearchResultsScreen = lazy(() => import('@/features/listings/screens/SearchResultsScreen').then((m) => ({ default: m.SearchResultsScreen })));
const SettingsScreen = lazy(() => import('@/features/profile/screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));
const RegisterScreen = lazy(() => import('@/features/auth/screens/RegisterScreen').then((m) => ({ default: m.RegisterScreen })));
const ConfirmScreen = lazy(() => import('@/features/auth/screens/ConfirmScreen').then((m) => ({ default: m.ConfirmScreen })));
const TermsScreen = lazy(() => import('@/features/auth/screens/TermsScreen').then((m) => ({ default: m.TermsScreen })));
const ChooseCategoryScreen = lazy(() => import('@/features/post-wizard/screens/ChooseCategoryScreen').then((m) => ({ default: m.ChooseCategoryScreen })));
const ChooseSubcategoryScreen = lazy(() => import('@/features/post-wizard/screens/ChooseSubcategoryScreen').then((m) => ({ default: m.ChooseSubcategoryScreen })));
const PhotoUploadScreen = lazy(() => import('@/features/post-wizard/screens/PhotoUploadScreen').then((m) => ({ default: m.PhotoUploadScreen })));
const LocationPickScreen = lazy(() => import('@/features/post-wizard/screens/LocationPickScreen').then((m) => ({ default: m.LocationPickScreen })));
const PostDetailsScreen = lazy(() => import('@/features/post-wizard/screens/PostDetailsScreen').then((m) => ({ default: m.PostDetailsScreen })));
const PublishSuccessScreen = lazy(() => import('@/features/post-wizard/screens/PublishSuccessScreen').then((m) => ({ default: m.PublishSuccessScreen })));
const AiDraftScreen = lazy(() => import('@/features/post-wizard/screens/AiDraftScreen').then((m) => ({ default: m.AiDraftScreen })));
const AiReviewScreen = lazy(() => import('@/features/post-wizard/screens/AiReviewScreen').then((m) => ({ default: m.AiReviewScreen })));
const PostAdEntryScreen = lazy(() => import('@/features/post-wizard/screens/PostAdEntryScreen').then((m) => ({ default: m.PostAdEntryScreen })));
const CategoryPickScreen = lazy(() => import('@/features/post-wizard/screens/CategoryPickScreen').then((m) => ({ default: m.CategoryPickScreen })));
const AiCaptureScreen = lazy(() => import('@/features/post-wizard/screens/AiCaptureScreen').then((m) => ({ default: m.AiCaptureScreen })));
const WishlistScreen = lazy(() => import('@/features/wishlist/screens/WishlistScreen').then((m) => ({ default: m.WishlistScreen })));
const NotificationsScreen = lazy(() => import('@/features/profile/screens/NotificationsScreen').then((m) => ({ default: m.NotificationsScreen })));
const LoginScreen = lazy(() => import('@/features/auth/screens/LoginScreen').then((m) => ({ default: m.LoginScreen })));
const SubCategoriesScreen = lazy(() => import('@/features/categories/screens/SubCategoriesScreen').then((m) => ({ default: m.SubCategoriesScreen })));
const EditProfileScreen = lazy(() => import('@/features/profile/screens/EditProfileScreen').then((m) => ({ default: m.EditProfileScreen })));
const ProfileScreen = lazy(() => import('@/features/profile/screens/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));

const ScreenLoader: React.FC = () => (
  <div className="flex-1 w-full min-h-[60vh] flex items-center justify-center bg-background">
    <Spinner size="lg" />
  </div>
);

const MainNavigator: React.FC = () => {
  const { currentScreen, activeTab, isArabic } = useUI();
  useUrlSync();
  useScrollToTop();
  const { screens: registryScreens } = useRegistry();

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

  const registryLazyComponents = useMemo(() => {
    const cache = new Map<string, React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>>();
    registryScreens.forEach((def, name) => {
      cache.set(name, React.lazy(def.component as () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>));
    });
    return cache;
  }, [registryScreens]);

  const renderRegistryScreen = (screenName: string) => {
    const LazyComponent = registryLazyComponents.get(screenName);
    return LazyComponent ? <LazyComponent /> : null;
  };

  const r = (name: string, Component: React.ComponentType) => renderRegistryScreen(name) ?? <Component />;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return r('login', LoginScreen);
      case 'notifications': return r('notifications', NotificationsScreen);
      case 'wishlist': return r('wishlist', WishlistScreen);
      case 'listing-detail': return r('listing-detail', ListingDetailScreen);
      case 'seller-profile': return r('seller-profile', SellerProfileScreen);
      case 'search-results': return r('search-results', SearchResultsScreen);
      case 'settings': return r('settings', SettingsScreen);
      case 'register': return r('register', RegisterScreen);
      case 'confirm': return r('confirm', ConfirmScreen);
      case 'terms': return r('terms', TermsScreen);
      case 'thread': return r('thread', ThreadScreen);
      case 'post-category': return r('post-category', ChooseCategoryScreen);
      case 'post-subcategory': return r('post-subcategory', ChooseSubcategoryScreen);
      case 'post-photos': return r('post-photos', PhotoUploadScreen);
      case 'post-location': return r('post-location', LocationPickScreen);
      case 'post-details': return r('post-details', PostDetailsScreen);
      case 'post-publish-success': return r('post-publish-success', PublishSuccessScreen);
      case 'post-ai-draft': return r('post-ai-draft', AiDraftScreen);
      case 'post-ai-review': return r('post-ai-review', AiReviewScreen);
      case 'post-ai-capture': return r('post-ai-capture', AiCaptureScreen);
      case 'post-category-pick': return r('post-category-pick', CategoryPickScreen);
      case 'sub-categories': return r('sub-categories', SubCategoriesScreen);
      case 'edit-profile': return r('edit-profile', EditProfileScreen);
      case 'profile': return r('profile', ProfileScreen);
      case 'main':
        switch (activeTab) {
          case 'categories': return <CategoriesScreen />;
          case 'messages': return <MessagesScreen />;
          case 'my-ads': return <MyAdsScreen />;
          case 'explore':
          default: return <ExploreScreen />;
        }
      default: return renderRegistryScreen(currentScreen);
    }
  };

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
              {renderScreen()}
            </div>
          </Suspense>
        </main>
        {currentScreen === 'main' && <BottomNav />}
        <CountrySheet />
      </div>
    </div>
  );
};

export default function App() {
  const locale = useUIStore((state) => state.locale);
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  useSupabaseAuthListener();
  useSupabaseListingsSync();
  useSupabaseWishlistSync();
  useSupabaseChatSync();
  useMarketSync();
  useOnlinePresence(currentUserId);
  useBootMigrations(locale);

  if (new URLSearchParams(window.location.search).has('catalog')) {
    return <CatalogScreen />;
  }

  return (
    <RouterProvider>
      <ErrorBoundaryWithLogging>
        <ErrorBoundary>
          <RegistryProvider>
            <TranslationProvider locale={locale}>
              <OfflineBanner />
              <GlobalPhoneCaptureMount />
              <MainNavigator />
              <Toaster position="top-center" theme="light" richColors closeButton duration={2500} toastOptions={{ className: 'font-bold text-sm' }} />
              <BuildBadge />
            </TranslationProvider>
          </RegistryProvider>
        </ErrorBoundary>
      </ErrorBoundaryWithLogging>
    </RouterProvider>
  );
  }
