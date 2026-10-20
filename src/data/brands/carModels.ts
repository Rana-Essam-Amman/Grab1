// ⚠️ RULE-14-EXCEPTION: Merger (config, capped at 500 lines)
// Aggregates car model data from regional sibling files.
// Adding a model = 1 line in the regional file. Automatic everywhere.

import type { CarModel } from './carModels.types';
import { ESTABLISHED_MODELS } from './carModelsEstablished';
import { CHINESE_MODELS } from './carModelsChinese';
import { NICHE_MODELS } from './carModelsNiche';

export type { CarModel };

export const CAR_MODELS: Record<string, readonly CarModel[]> = {
  ...ESTABLISHED_MODELS,
  ...CHINESE_MODELS,
  ...NICHE_MODELS,
};

export function getModelsForMake(makeSlug: string): readonly CarModel[] {
  return CAR_MODELS[makeSlug] ?? [];
}

/**
 * Look up a model by slug OR by its Arabic/English name.
 * Accepts "camry", "Camry", or "كامري" so callers don't break when
 * the wizard emits nameEn and the data stores slug.
 */
export function getModelBySlug(makeSlug: string, modelSlug: string): CarModel | undefined {
  const models = CAR_MODELS[makeSlug];
  if (!models || !modelSlug) return undefined;
  const lower = modelSlug.toLowerCase().trim();
  return models.find(
    (m) =>
      m.slug === modelSlug ||
      m.nameEn.toLowerCase() === lower ||
      m.nameAr === modelSlug
  );
}

export function hasCuratedModels(makeSlug: string): boolean {
  return (CAR_MODELS[makeSlug]?.length ?? 0) > 0;
}
