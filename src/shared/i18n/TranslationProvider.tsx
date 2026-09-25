import React, { createContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useRegistry } from '@/shared/registry';
import type { Locale, Translations, FeatureLocaleModule } from './types';
import { mergeLocales } from './merge';

interface TranslationContextValue {
  t: (key: string) => string;
  locale: Locale;
  isLoaded: boolean;
}

export const TranslationContext = createContext<TranslationContextValue | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode; locale: Locale }> = ({ 
  children, 
  locale 
}) => {
  const { manifests, isLoading: isRegistryLoading } = useRegistry();
  const [dictionary, setDictionary] = useState<Translations>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isRegistryLoading) return;

    let cancelled = false;
    (async () => {
      const modules: Array<{ feature: string; locale: FeatureLocaleModule }> = [];

      for (const manifest of manifests) {
        if (!manifest.locales) continue;

        const featureLocales: FeatureLocaleModule = {};
        
        // Load current locale if available
        if (manifest.locales[locale]) {
          try {
            const mod = await manifest.locales[locale]!();
            featureLocales[locale] = mod.default;
          } catch (err) {
            console.error(`Failed to load locale ${locale} for feature ${manifest.name}`, err);
          }
        }

        modules.push({ feature: manifest.name, locale: featureLocales });
      }

      if (!cancelled) {
        const merged = mergeLocales(modules, locale);
        setDictionary(merged);
        setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [manifests, isRegistryLoading, locale]);

  const t = useCallback((key: string) => {
    return dictionary[key] || key;
  }, [dictionary]);

  const value = useMemo(() => ({ t, locale, isLoaded }), [t, locale, isLoaded]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
