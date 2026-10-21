import type { PhoneModel } from './phoneModels.types';
import { APPLE_MODELS } from './phoneModelsApple';
import { SAMSUNG_MODELS } from './phoneModelsSamsung';
import { XIAOMI_MODELS, REDMI_MODELS, POCO_MODELS } from './phoneModelsXiaomi';
import { OTHER_BRANDS_MODELS } from './phoneModelsOther';

export type { PhoneModel };

export const PHONE_MODELS: Record<string, readonly PhoneModel[]> = {
  apple: APPLE_MODELS,
  samsung: SAMSUNG_MODELS,
  xiaomi: XIAOMI_MODELS,
  redmi: REDMI_MODELS,
  poco: POCO_MODELS,
  ...OTHER_BRANDS_MODELS,
};

export function getPhoneModelsForBrand(brandSlug: string): readonly PhoneModel[] {
  return PHONE_MODELS[brandSlug] ?? [];
}

export function getPhoneModelBySlug(brandSlug: string, modelSlug: string): PhoneModel | undefined {
  const models = PHONE_MODELS[brandSlug];
  if (!models || !modelSlug) return undefined;
  const lower = modelSlug.toLowerCase().trim();
  return models.find(
    (m) =>
      m.slug === modelSlug ||
      m.nameEn.toLowerCase() === lower ||
      m.nameAr === modelSlug
  );
}

export function hasCuratedPhoneModels(brandSlug: string): boolean {
  return (PHONE_MODELS[brandSlug]?.length ?? 0) > 0;
}
