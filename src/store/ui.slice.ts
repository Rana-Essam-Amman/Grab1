import { globalStorage } from '@/shared/lib/marketStorage';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AppTheme } from '@/features/ui/domain';
import { UIState, ScreenType, TabType } from './ui.slice.types';
import { getInitialState } from './ui.slice.helpers';
import { createUIActions } from './ui.slice.actions';

export type { ScreenType, TabType };

/**
 * Custom storage adapter for Zustand persistence
 * Handles legacy plain string values ('en'/'ar') for 'catch_locale' and structured state
 */
const uiStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const raw = globalStorage().get<any>(name);
    if (raw === null || raw === undefined) return null;
    if (name === 'catch_locale') {
      if (raw === 'en' || raw === 'ar') {
        return JSON.stringify({ state: { locale: raw }, version: 0 });
      }
    }
    if (typeof raw === 'object') {
      return JSON.stringify(raw);
    }
    try {
      JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw));
      return typeof raw === 'string' ? raw : JSON.stringify(raw);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (name === 'catch_locale') {
      try {
        const parsed = JSON.parse(value);
        if (parsed?.state?.locale) {
          globalStorage().set(name, parsed.state.locale);
          return;
        }
      } catch (e) {}
    }
    globalStorage().set(name, value);
  },
  removeItem: (name: string): void => {
    globalStorage().remove(name);
  },
};

export const useUIStore = create<UIState>()(
  persist(
    immer((set, get) => ({
      ...getInitialState(),
      ...createUIActions(set, get),
      theme: (globalStorage().get<AppTheme>('grab_theme_v1') as AppTheme) || 'light',
      setTheme: (theme: AppTheme) => {
        globalStorage().set('grab_theme_v1', theme);
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
        }
      },
    }
  )
);
