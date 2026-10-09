import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';
import { useListingsStore } from '@/features/listings';
import { migrateDraftsToMarket } from '@/shared/lib/migrations/draftsMigration';
import { migrateChatsToMarket } from '@/shared/lib/migrations/chatsMigration';
import { cleanupLegacyPendingFlags } from '@/shared/lib/migrations/pendingFlagsCleanup';
import { registerListingsGetter } from '@/features/chat';

/**
 * Boot-time one-shot migrations + store initialization.
 * Extracted from App.tsx to keep the composition root under Rule 14 limits.
 */
export function useBootMigrations(locale: string): void {
  useEffect(() => {
    const userMarket = useAuthStore.getState().user?.countryCode;
    const fallbackMarket = (useUIStore.getState() as { browseCountryCode?: string }).browseCountryCode;
    const marketForMigration = userMarket || fallbackMarket || 'JO';

    try {
      migrateDraftsToMarket(marketForMigration);
    } catch (err) {
      console.error('[Migration] Drafts migration failed:', err);
    }
    try {
      migrateChatsToMarket(marketForMigration);
    } catch (err) {
      console.error('[Migration] Chats migration failed:', err);
    }
    try {
      cleanupLegacyPendingFlags();
    } catch (err) {
      console.error('[Migration] Pending flags cleanup failed:', err);
    }

    try {
      registerListingsGetter(() => useListingsStore.getState().listings);
      useListingsStore.getState().initialize();
    } catch (error) {
      console.error('[App] Failed to initialize stores:', error);
    }

    if (locale) {
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
  }, [locale]);
}
