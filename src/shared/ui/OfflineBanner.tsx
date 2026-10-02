import React from 'react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useUI } from '@/hooks/useUI';

/**
 * Slim banner shown at the top of the app when the browser is offline.
 * Auto-hides the moment connectivity returns.
 * Renders nothing when online to avoid layout shift.
 */
export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { isArabic } = useUI();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white text-center text-xs font-bold py-1.5 px-3 shadow-md"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {isArabic
        ? 'لا يوجد اتصال بالإنترنت — التغييرات ستُحفظ محلياً'
        : 'No internet connection — changes will be saved locally'}
    </div>
  );
};
