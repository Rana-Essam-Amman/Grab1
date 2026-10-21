import React from 'react';
import { useUIStore } from './store/ui.slice';
import { useAuthStore, useSupabaseAuthListener } from '@/features/auth';
import { useListingsStore, useSupabaseListingsSync } from '@/features/listings';
import { registerListingsGetterForMonetization } from '@/features/monetization/store/deps';
import { registerUIGetter } from '@/shared/store-getters/ui.getter';
import { registerAuthGetter } from '@/shared/store-getters/auth.getter';
import { ErrorBoundary } from '@/shared/components';
import { ErrorBoundaryWithLogging } from '@/shared/components/ErrorBoundaryWithLogging';
import { UpdateBanner } from '@/shared/components/UpdateBanner';
import { useVersionCheck } from '@/shared/hooks/useVersionCheck';
import { TranslationProvider } from '@/shared/i18n';
import { RegistryProvider } from '@/shared/registry';
import { CatalogScreen } from '@/features/dev/screens/CatalogScreen';
import { Toaster } from 'sonner';
import { OfflineBanner } from '@/shared/ui/OfflineBanner';
import { GlobalPhoneCaptureMount } from '@/shared/components/GlobalPhoneCaptureMount';
import { BuildBadge } from '@/shared/components/BuildBadge';
import { useBootMigrations } from '@/shared/hooks/useBootMigrations';
import { useSupabaseWishlistSync } from '@/features/listings/hooks/useSupabaseWishlistSync';
import { useSupabaseChatSync, useOnlinePresence } from '@/features/chat';
import { useSupabaseNotificationsSync } from '@/features/notifications';
import { useMarketSync } from '@/features/markets/hooks/useMarketSync';
import { useGeoLocation } from '@/features/markets/hooks/useGeoLocation';
import { RouterProvider } from '@/shared/router/RouterProvider';
import { MainNavigator } from '@/shared/router/MainNavigator';

registerUIGetter(() => useUIStore.getState());
registerAuthGetter(() => useAuthStore.getState().user);
registerListingsGetterForMonetization(() => useListingsStore.getState().listings);

export default function App() {
  const locale = useUIStore((state) => state.locale);
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);

  useSupabaseAuthListener();
  useSupabaseListingsSync();
  useSupabaseWishlistSync();
  useSupabaseChatSync();
  useSupabaseNotificationsSync();
  useMarketSync();
  useGeoLocation();
  useOnlinePresence(currentUserId);
  useBootMigrations(locale);
  const newVersion = useVersionCheck();

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
              <UpdateBanner show={newVersion} />
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
