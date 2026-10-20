import { CAR_BRANDS } from '@/data/brands/carBrands';
import { getModelsForMake } from '@/data/brands/carModels';

export interface ModelOption {
  readonly value: string;
  readonly labelAr: string;
  readonly labelEn: string;
}

export function getLocalModelOptions(brandSlug: string): ModelOption[] {
  return getModelsForMake(brandSlug).map((m) => ({
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
  const brand = CAR_BRANDS.find((b) => b.slug === makeSlug);
  return brand ? (isArabic ? brand.nameAr : brand.nameEn) : makeSlug;
}

export function isCustomMake(makeValue: string): boolean {
  return Boolean(makeValue && !CAR_BRANDS.some((b) => b.slug === makeValue));
}
