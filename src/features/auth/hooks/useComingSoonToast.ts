import { useState, useRef, useEffect, useCallback } from 'react';

export function useComingSoonToast(isArabic: boolean) {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback(() => {
    setToast(isArabic ? 'هذه الميزة ستكون متاحة قريباً' : 'This feature is coming soon');
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, [isArabic]);

  return { toast, showToast };
}
