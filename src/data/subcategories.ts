import type { SubcategoryDef } from '@/types';

export const subcategories: Record<string, SubcategoryDef[]> = {
  motors: [
    { slug: 'cars', nameEn: 'Cars for Sale', nameAr: 'سيارات للبيع' },
    { slug: 'classic_cars', nameEn: 'Classic Cars', nameAr: 'سيارات تراثية' },
    { slug: 'damaged_cars', nameEn: 'Damaged Cars', nameAr: 'سيارات مصدومة' },
    { slug: 'lease_transfer', nameEn: 'Lease Transfer', nameAr: 'سيارات للتنازل' },
    { slug: 'motorbikes', nameEn: 'Motorcycles & Scooters', nameAr: 'دراجات وسكوتر' },
    { slug: 'heavy', nameEn: 'Heavy Vehicles & Trucks', nameAr: 'شاحنات وآليات ثقيلة' },
    { slug: 'plates', nameEn: 'Car Plates', nameAr: 'لوحات سيارات' },
    { slug: 'parts', nameEn: 'Auto Spare Parts', nameAr: 'قطع غيار سيارات' },
    { slug: 'boats', nameEn: 'Boats & Watercraft', nameAr: 'قوارب وجت سكي' },
    { slug: 'accessories', nameEn: 'Car Accessories', nameAr: 'إكسسوارات سيارات' },
  ],
  // باقي الفئات زي ما هي...
};

export function subcategoriesByCategory(categorySlug: string): SubcategoryDef[] {
  return subcategories[categorySlug] ?? [];
}

export function findSubcategoryBySlug(slug: string): SubcategoryDef | undefined {
  for (const list of Object.values(subcategories)) {
    const found = list.find((sub) => sub.slug === slug);
    if (found) return found;
  }
  return undefined;
}

export function subsFor(categorySlug: string): SubcategoryDef[] {
  return subcategoriesByCategory(categorySlug);
}
