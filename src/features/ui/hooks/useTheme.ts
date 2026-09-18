import { useEffect, useCallback } from 'react';
import { useUIStore as useUI } from '@/store/ui.slice';
import type { AppTheme } from '../domain';
import { globalStorage } from '@/shared/lib/marketStorage';

const STORAGE_KEY = 'grab_theme_v1';
const SYSTEM_DARK = '(prefers-color-scheme: dark)';

function getSystemTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(SYSTEM_DARK).matches ? 'dark' : 'light';
}

function applyTheme(theme: AppTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme() {
  const theme = useUI((s) => s.theme);
  const setTheme = useUI((s) => s.setTheme);

  useEffect(() => {
    applyTheme(theme);

    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(SYSTEM_DARK);
    const handler = () => {
      applyTheme(theme);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const toggle = useCallback(() => {
    const next: AppTheme = (theme === 'dark') ? 'light' : 'dark';
    setTheme(next);
    globalStorage().set(STORAGE_KEY, next);
  }, [theme, setTheme]);

  return {
    theme,
    toggle,
    setTheme: (t: AppTheme) => {
      setTheme(t);
      globalStorage().set(STORAGE_KEY, t);
    },
  };
}
