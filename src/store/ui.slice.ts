import { globalStorage } from '@/shared/lib/marketStorage';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AppTheme } from '@/features/ui/domain';
import { UIState, ScreenType, TabType } from './ui.slice.types';
import { getInitialState, hydrateCountryFromGeo } from './ui.slice.helpers';
import { createUIActions } from './ui.slice.actions';

export type { ScreenType, TabType };

/**
 * Custom storage adapter for Zustand persistence
 * Handles legacy plain string values ('en'/'ar') for 'catch_locale' and structured state
 */
const uiStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const raw = globalStorage().get<unknown>(name);
    if (raw === null || raw === undefined) return null;
    if (name === 'catch_locale') {
      if (raw === 'en' || raw === 'ar') {
        return JSON.stringify({ state: { locale: raw }, version: 0 });
      }
    }
    if (raw && typeof raw === 'object') {
      return JSON.stringify(raw);
    }
    if (typeof raw === 'string') {
      try {
        JSON.parse(raw);
        return raw;
      } catch {
        return null;
      }
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (name === 'catch_locale') {
      try {
        const parsed = JSON.parse(value);
        if (parsed?.state?.locale) {
          globalStorage().set(name, parsed.state.locale);
          return;
        }
      } catch {
        // ignore
      }
    }
    globalStorage().set(name, value);
  },
  removeItem: (name: string): void => {
    globalStorage().remove(name);
  },
};

// -------------------------------------------------------------------
// Theme — resolve + apply
// -------------------------------------------------------------------

/** Resolve 'auto' against the OS preference. Returns 'light' or 'dark'. */
function resolveTheme(theme: AppTheme): 'light' | 'dark' {
  if (theme === 'auto') {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return theme;
}

/** Apply a theme choice to <html data-theme="...">. */
function applyTheme(theme: AppTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = resolveTheme(theme);
}

/** Read the persisted theme choice from localStorage. Default: 'light'. */
function getStoredTheme(): AppTheme {
  try {
    const raw = globalStorage().get<string>('grab_theme_v1');
    if (raw === 'light' || raw === 'dark' || raw === 'auto') return raw;
  } catch {
    // fall through
  }
  return 'light';
}

// UI Store state slice definition
export const useUIStore = create<UIState>()(
  persist(
    immer((set, get) => ({
      ...getInitialState(),
      ...createUIActions(set, get),
      theme: getStoredTheme(),
      setTheme: (theme: AppTheme) => {
        globalStorage().set('grab_theme_v1', theme);
        applyTheme(theme);
        set((state) => {
          state.theme = theme;
        });
      },
    })),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => uiStorage),
      partialize: (state) => ({
        locale: state.locale,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          const locale = state.locale || 'ar';
          document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = locale;
          applyTheme(state.theme);
        }
        // Hydrate URL-dependent state AFTER persist rehydration.
        // Zustand persist restores state on an async microtask AFTER module
        // scope — so hydrateStoreFromUrl() (called at module scope in
        // useUrlSync.ts) had its `currentScreen` overwritten by the default
        // 'main'. That erased 'sub-categories' on refresh.
        // We re-run hydration here (async import avoids the ui.slice ←
        // hydrateStoreFromUrl cycle) once persist has settled.
        if (typeof window !== 'undefined') {
          void import('@/shared/router/hydrateStoreFromUrl').then(
            ({ hydrateStoreFromUrl }) => hydrateStoreFromUrl(window.location.pathname)
          );
        }
      },
    }
  )
);

// Apply theme on store creation (before any React render).
applyTheme(useUIStore.getState().theme);

// Re-apply when the OS theme changes — only matters when the user picked 'auto'.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (useUIStore.getState().theme === 'auto') {
        applyTheme('auto');
      }
    });
  } catch {
    // older Safari or unsupported — no-op
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    void hydrateCountryFromGeo();
  }, 0);
      }
