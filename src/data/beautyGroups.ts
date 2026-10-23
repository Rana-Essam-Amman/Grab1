import type { SubcategoryDef } from '@/types';

export interface BeautyGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const BEAUTY_GROUPS: readonly BeautyGroup[] = [
  { key: 'perfumes-cosmetics', labelAr: 'عطور ومكياج', labelEn: 'Perfumes & Cosmetics', icon: '💄', slugs: ['perfumes-cosmetics'] },
  { key: 'hair', labelAr: 'عناية بالشعر', labelEn: 'Hair Care', icon: '💇', slugs: ['hair'] },
  { key: 'skin', labelAr: 'عناية بالبشرة', labelEn: 'Skin Care', icon: '🧴', slugs: ['skin'] },
  { key: 'care', labelAr: 'أجهزة عناية', labelEn: 'Personal Care', icon: '⚡', slugs: ['care'] },
];

export const BEAUTY_OTHER_GROUP: BeautyGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedBeauty {
  readonly group: BeautyGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupBeautySubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedBeauty[] {
  const grouped: GroupedBeauty[] = [];
  const covered = new Set<string>();

  for (const group of BEAUTY_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: BEAUTY_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
