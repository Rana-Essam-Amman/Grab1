import React from 'react';
import { useUI } from '@/hooks/useUI';
import { useListingsStore } from '@/features/listings/store/listings.slice';

export const SyncStatusBanner: React.FC = () => {
  const { isArabic } = useUI();
  const isSyncing = useListingsStore((s) => s.isSyncing);
  const lastSyncFailed = useListingsStore((s) => s.lastSyncFailed);
  const cachedCount = useListingsStore((s) => s.listings.length);

  // Never show during first load — skeleton handles that case.
  if (cachedCount === 0) return null;

  if (lastSyncFailed) {
    return (
      <div
        role="alert"
        className="bg-warning/10 border border-border text-ink text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-2"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <span className="shrink-0">
          {isArabic ? '⚠️ تعذّر تحديث البيانات — أنت ترى نسخة محفوظة' : '⚠️ Could not refresh — showing cached data'}
        </span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-surface border border-border text-ink text-xs py-1.5 px-3 rounded-lg flex items-center gap-2"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
        <span>{isArabic ? 'جاري التحديث...' : 'Refreshing...'}</span>
      </div>
    );
  }

  return null;
};
