import { MOTOR_BRANDS, type BrandDef } from './motors';
import { MOBILE_BRANDS, COMPUTER_BRANDS, WATCH_BRANDS, ELECTRONICS_BRANDS } from './tech';
import { CAR_BRANDS, getBrandBySlug } from './carBrands';
import { getModelBySlug, getModelsForMake } from './carModels';

export type { BrandDef };

export const BRANDS_BY_CATEGORY: Record<string, readonly BrandDef[]> = {
  motors: MOTOR_BRANDS,
  mobiles: MOBILE_BRANDS,
  computers: COMPUTER_BRANDS,
  watches: WATCH_BRANDS,
  electronics: ELECTRONICS_BRANDS,
};

export function getBrandsForCategory(categorySlug: string): readonly BrandDef[] {
  return BRANDS_BY_CATEGORY[categorySlug] || [];
}

export function getBrandOptions(categorySlug: string, isArabic: boolean): string[] {
  return getBrandsForCategory(categorySlug).map((b) => (isArabic ? b.ar : b.en));
}

export function getModelOptions(
  categorySlug: string,
  brandLabel: string,
  isArabic: boolean
): string[] {
  // Prefer CAR_MODELS for motors (structured Arabic names + trims)
  if (categorySlug === 'motors') {
    const brand = CAR_BRANDS.find((b) => b.nameAr === brandLabel || b.nameEn === brandLabel);
    if (brand) {
      const models = getModelsForMake(brand.slug);
      if (models.length > 0) return models.map((m) => (isArabic ? m.nameAr : m.nameEn));
    }
  }
  // Fallback to legacy MOTOR_BRANDS structure
  const brand = getBrandsForCategory(categorySlug).find(
    (b) => b.ar === brandLabel || b.en === brandLabel
  );
  if (!brand) return [];
  return brand.models.map(([ar, en]) => (isArabic ? ar : en));
}

/**
 * Get trim options for a specific make+model combination.
 * Returns empty array if make/model has no curated trims.
 */
export function getTrimOptions(
  makeSlug: string,
  modelSlug: string,
  _isArabic: boolean
): string[] {
  const model = getModelBySlug(makeSlug, modelSlug);
  if (!model) return [];
  return [...model.trims];
}

/**
 * Get localized make label (Arabic or English) from slug.
 * Falls back to slug if not found.
 */
export function getMakeLabel(slug: string, isArabic: boolean): string {
  const brand = getBrandBySlug(slug);
  if (!brand) return slug;
  return isArabic ? brand.nameAr : brand.nameEn;
}

/**
 * Get localized model label from make+model slugs.
 * Falls back to model slug if not found.
 */
export function getModelLabel(makeSlug: string, modelSlug: string, isArabic: boolean): string {
  const model = getModelBySlug(makeSlug, modelSlug);
  if (!model) return modelSlug;
  return isArabic ? model.nameAr : model.nameEn;
}

/**
 * Check if a make has curated models (used for cascade UI decisions).
 */
export function hasCuratedModels(makeSlug: string): boolean {
  return getModelsForMake(makeSlug).length > 0;
}
