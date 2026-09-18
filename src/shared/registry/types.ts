import type { ComponentType } from 'react';
import type { Translations } from '@/shared/i18n/types';

export type ScreenGuard = 'public' | 'authenticated' | 'guest';

export interface ScreenDefinition {
  name: string;
  component: () => Promise<{ default: ComponentType<any> } | Record<string, any>>;
  tab?: 'explore' | 'categories' | 'messages' | 'my-ads';
  guard?: ScreenGuard;
}

export interface MenuEntry {
  icon: string;
  label: { ar: string; en: string };
  order: number;
  onClick?: 'navigate' | 'custom';
  target?: string;
}

export interface FeatureManifest {
  name: string;
  screens?: Record<string, ScreenDefinition>;
  store?: () => Promise<any>;
  locales?: {
    ar?: () => Promise<{ default: Translations }>;
    en?: () => Promise<{ default: Translations }>;
  };
  menuEntry?: MenuEntry;
  exports?: Record<string, () => Promise<any>>;
}

export interface RegistryState {
  manifests: FeatureManifest[];
  screens: Map<string, ScreenDefinition>;
  isLoading: boolean;
  error: string | null;
}
