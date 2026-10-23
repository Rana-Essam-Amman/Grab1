import type { SubcategoryDef } from '@/types';

export interface FashionGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const FASHION_GROUPS: readonly FashionGroup[] = [
  { key: 'women', labelAr: 'أزياء نسائية', labelEn: 'Women', icon: '👗', slugs: ['women'] },
  { key: 'men', labelAr: 'أزياء رجالية', labelEn: 'Men', icon: '👔', slugs: ['men'] },
  { key: 'watches-jewelry', labelAr: 'مجوهرات وإكسسوارات', labelEn: 'Jewelry', icon: '💍', slugs: ['watches-jewelry'] },
  { key: 'bags', labelAr: 'حقائب وشنط', labelEn: 'Bags', icon: '👜', slugs: ['bags'] },
  { key: 'shoes', labelAr: 'أحذية', labelEn: 'Shoes', icon: '👟', slugs: ['shoes'] },
  { key: 'perfumes', labelAr: 'عطور', labelEn: 'Perfumes', icon: '🧴', slugs: ['perfumes'] },
];

export const FASHION_OTHER_GROUP: FashionGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedFashion {
  readonly group: FashionGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupFashionSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedFashion[] {
  const grouped: GroupedFashion[] = [];
  const covered = new Set<string>();

  for (const group of FASHION_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: FASHION_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
