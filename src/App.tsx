import React, { useEffect, useRef } from 'react';
import { useUIStore } from './store/ui.slice';
import { useAuthStore, useSupabaseAuthListener } from '@/features/auth';
import { useListingsStore, useSupabaseListingsSync } from '@/features/listings';
import { useDraftStore } from '@/features/post-wizard/store/draft.slice';
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
  const browseCountryCode = useUIStore((state) => state.browseCountryCode);
  const resetDraftOnMarketChange = useDraftStore((state) => state.resetDraftOnMarketChange);
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);

  // Prevent resetting the draft on the initial boot (only reset on actual changes)
  const initialMarketRef = useRef<string | null>(null);
  useEffect(() => {
    if (initialMarketRef.current === null) {
      initialMarketRef.current = browseCountryCode;
      return;
    }
    if (initialMarketRef.current !== browseCountryCode) {
      resetDraftOnMarketChange();
      initialMarketRef.current = browseCountryCode;
    }
  }, [browseCountryCode, resetDraftOnMarketChange]);

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
