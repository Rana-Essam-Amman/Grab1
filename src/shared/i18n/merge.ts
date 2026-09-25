import type { Translations, FeatureLocaleModule } from './types';

/**
 * Merge multiple feature locale modules into one flat dictionary.
 * Namespaces are prefixed with the feature name: `wishlist.title`, `auth.login`, etc.
 */
export function mergeLocales(
  modules: Array<{ feature: string; locale: FeatureLocaleModule }>,
  locale: 'ar' | 'en'
): Translations {
  const merged: Translations = {};
  for (const { feature, locale: data } of modules) {
    const featureTranslations = data[locale] || {};
    for (const [key, value] of Object.entries(featureTranslations)) {
      merged[`${feature}.${key}`] = value;
    }
  }
  return merged;
}
