import type { ListingFieldOption } from '@/data/listingFields/types';

export interface GenericBrand {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
}

export interface GenericModel {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly releaseYear?: number;
}

export interface ModelHelpers {
  getLocalModelOptions(brandSlug: string): ListingFieldOption[];
  normalizeToSlug(brandSlug: string, currentValue: string): string;
  getBrandLabel(brandSlug: string, isArabic: boolean): string;
  isCustomMake(makeValue: string): boolean;
}

export function makeModelHelpers(
  brands: readonly GenericBrand[],
  models: Record<string, readonly GenericModel[]>,
): ModelHelpers {
  return {
    getLocalModelOptions(brandSlug: string): ListingFieldOption[] {
      const list = models[brandSlug] ?? [];
      return list.map((m) => ({ value: m.slug, labelAr: m.nameAr, labelEn: m.nameEn }));
    },
    normalizeToSlug(brandSlug: string, currentValue: string): string {
      if (!currentValue) return '';
      const options = this.getLocalModelOptions(brandSlug);
      if (options.length === 0) return currentValue;
      const lower = currentValue.toLowerCase().trim();
      const match = options.find(
        (o) => o.value === currentValue || o.labelEn.toLowerCase() === lower || o.labelAr === currentValue.trim(),
      );
      return match ? match.value : currentValue;
    },
    getBrandLabel(brandSlug: string, isArabic: boolean): string {
      const brand = brands.find((b) => b.slug === brandSlug);
      return brand ? (isArabic ? brand.nameAr : brand.nameEn) : brandSlug;
    },
    isCustomMake(makeValue: string): boolean {
      return Boolean(makeValue && !brands.some((b) => b.slug === makeValue));
    },
  };
}
