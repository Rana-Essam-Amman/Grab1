import { useUI } from './hooks/useUI';
import React, { useEffect, lazy, Suspense, useMemo } from 'react';
import { useUIStore } from './store/ui.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useListingsStore } from './features/listings/store/listings.slice';
import { registerListingsGetter } from '@/features/chat/store/chat.slice.deps';
import { registerUIGetter } from '@/shared/store-getters/ui.getter';
import { registerAuthGetter } from '@/shared/store-getters/auth.getter';

// Register cross-store getters ONCE at module load
registerUIGetter(() => useUIStore.getState());
registerAuthGetter(() => useAuthStore.getState().user);

import { Header, BottomNav, ErrorBoundary } from '@/shared/components';
import { TranslationProvider } from '@/shared/i18n';
import { CountrySheet } from '@/features/markets/components/CountrySheet';
import { ExploreScreen } from '@/features/explore/screens/ExploreScreen';
import { Spinner } from '@/shared/ui/Spinner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { RegistryProvider, useRegistry } from '@/shared/registry';
import { CatalogScreen } from '@/features/dev/screens/CatalogScreen';
import { Toaster } from 'sonner';

// Lazy-loaded Screens
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
const AiDraftScreen = lazy(() => import('@/features/post-wizard/screens/AiDraftScreen').then((m) => ({ default: m.AiDraftScreen })));
const AiReviewScreen = lazy(() => import('@/features/post-wizard/screens/AiReviewScreen').then((m) => ({ default: m.AiReviewScreen })));
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
  const { currentScreen, activeTab } = useUI();
  const { screens: registryScreens } = useRegistry();

  const registryLazyComponents = useMemo(() => {
    const cache = new Map<string, React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>>();
    registryScreens.forEach((def, name) => {
      cache.set(name, React.lazy(def.component as () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>));
    });
    return cache;
  }, [registryScreens]);

  const renderRegistryScreen = (screenName: string) => {
    const LazyComponent = registryLazyComponents.get(screenName);
    if (!LazyComponent) return null;
    return <LazyComponent />;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': {
        const fromRegistry = renderRegistryScreen('login');
        return fromRegistry ?? <LoginScreen />;
      }
      case 'notifications': {
        const fromRegistry = renderRegistryScreen('notifications');
        return fromRegistry ?? <NotificationsScreen />;
      }
      case 'wishlist': {
        const fromRegistry = renderRegistryScreen('wishlist');
        return fromRegistry ?? <WishlistScreen />;
      }
      case 'listing-detail': {
        const fromRegistry = renderRegistryScreen('listing-detail');
        return fromRegistry ?? <ListingDetailScreen />;
      }
      case 'seller-profile': {
        const fromRegistry = renderRegistryScreen('seller-profile');
        return fromRegistry ?? <SellerProfileScreen />;
      }
      case 'search-results': {
        const fromRegistry = renderRegistryScreen('search-results');
        return fromRegistry ?? <SearchResultsScreen />;
      }
      case 'settings': {
        const fromRegistry = renderRegistryScreen('settings');
        return fromRegistry ?? <SettingsScreen />;
      }
      case 'register': {
        const fromRegistry = renderRegistryScreen('register');
        return fromRegistry ?? <RegisterScreen />;
      }
      case 'confirm': {
        const fromRegistry = renderRegistryScreen('confirm');
        return fromRegistry ?? <ConfirmScreen />;
      }
      case 'terms': {
        const fromRegistry = renderRegistryScreen('terms');
        return fromRegistry ?? <TermsScreen />;
      }
      case 'thread': {
        const fromRegistry = renderRegistryScreen('thread');
        return fromRegistry ?? <ThreadScreen />;
      }
      case 'post-category': {
        const fromRegistry = renderRegistryScreen('post-category');
        return fromRegistry ?? <ChooseCategoryScreen />;
      }
      case 'post-subcategory': {
        const fromRegistry = renderRegistryScreen('post-subcategory');
        return fromRegistry ?? <ChooseSubcategoryScreen />;
      }
      case 'post-photos': {
        const fromRegistry = renderRegistryScreen('post-photos');
        return fromRegistry ?? <PhotoUploadScreen />;
      }
      case 'post-location': {
        const fromRegistry = renderRegistryScreen('post-location');
        return fromRegistry ?? <LocationPickScreen />;
      }
      case 'post-ai-draft': {
        const fromRegistry = renderRegistryScreen('post-ai-draft');
        return fromRegistry ?? <AiDraftScreen />;
      }
      case 'post-ai-review': {
        const fromRegistry = renderRegistryScreen('post-ai-review');
        return fromRegistry ?? <AiReviewScreen />;
      }
      case 'sub-categories': {
        const fromRegistry = renderRegistryScreen('sub-categories');
        return fromRegistry ?? <SubCategoriesScreen />;
      }
      case 'edit-profile': {
        const fromRegistry = renderRegistryScreen('edit-profile');
        return fromRegistry ?? <EditProfileScreen />;
      }
      case 'profile': {
        const fromRegistry = renderRegistryScreen('profile');
        return fromRegistry ?? <ProfileScreen />;
      }
      case 'main':
      default:
        switch (activeTab) {
          case 'categories':
            return <CategoriesScreen />;
          case 'messages':
            return <MessagesScreen />;
          case 'my-ads':
            return <MyAdsScreen />;
          case 'explore':
          default:
            return <ExploreScreen />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex justify-center selection:bg-brand selection:text-white">
      <div className="w-full max-w-[440px] min-h-screen bg-canvas flex flex-col shadow-2xl relative">
        {currentScreen === 'main' && <Header />}
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<ScreenLoader />}>
            {renderScreen()}
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

  useEffect(() => {
    try {
      registerListingsGetter(() => useListingsStore.getState().listings);
      useListingsStore.getState().initialize();
    } catch (error) {
      console.error('[App] Failed to initialize stores:', error);
    }

    // Belt-and-suspenders: ensure direction matches persisted state on initial client mount
    if (locale) {
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
  }, [locale]);

  if (new URLSearchParams(window.location.search).has('catalog')) {
    return <CatalogScreen />;
  }

  return (
    <ErrorBoundary>
      <RegistryProvider>
        <QueryClientProvider client={queryClient}>
          <TranslationProvider locale={locale}>
            <MainNavigator />
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-ink)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--radius-lg)',
                },
              }}
            />

          </TranslationProvider>
        </QueryClientProvider>
      </RegistryProvider>
    </ErrorBoundary>
  );
}
