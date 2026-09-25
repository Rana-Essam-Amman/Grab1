import { MOTOR_BRANDS, type BrandDef } from './motors';
import { MOBILE_BRANDS, COMPUTER_BRANDS, WATCH_BRANDS, ELECTRONICS_BRANDS } from './tech';

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
  const brand = getBrandsForCategory(categorySlug).find(
    (b) => b.ar === brandLabel || b.en === brandLabel
  );
  if (!brand) return [];
  return brand.models.map(([ar, en]) => (isArabic ? ar : en));
}
