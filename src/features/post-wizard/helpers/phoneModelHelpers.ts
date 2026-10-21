import { PHONE_BRANDS_REGISTRY } from '@/data/brands/phoneBrands';
import { PHONE_MODELS } from '@/data/brands/phoneModels';

export interface ModelOption {
  readonly value: string;
  readonly labelAr: string;
  readonly labelEn: string;
}

export function getLocalModelOptions(brandSlug: string): ModelOption[] {
  const models = PHONE_MODELS[brandSlug] ?? [];
  return models.map((m) => ({
    value: m.slug,
    labelAr: m.nameAr,
    labelEn: m.nameEn,
  }));
}

export function normalizeToSlug(brandSlug: string, currentValue: string): string {
  if (!currentValue) return '';
  const options = getLocalModelOptions(brandSlug);
  if (options.length === 0) return currentValue;
  const lower = currentValue.toLowerCase().trim();
  const match = options.find(
    (o) => o.value === currentValue || o.labelEn.toLowerCase() === lower || o.labelAr === currentValue.trim(),
  );
  return match ? match.value : currentValue;
}

export function getBrandLabel(makeSlug: string, isArabic: boolean): string {
  const brand = PHONE_BRANDS_REGISTRY.find((b) => b.slug === makeSlug);
  return brand ? (isArabic ? brand.nameAr : brand.nameEn) : makeSlug;
}

export function isCustomMake(makeValue: string): boolean {
  return Boolean(makeValue && !PHONE_BRANDS_REGISTRY.some((b) => b.slug === makeValue));
}
