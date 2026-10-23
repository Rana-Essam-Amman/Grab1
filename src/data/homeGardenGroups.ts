import type { SubcategoryDef } from '@/types';

export interface HomeGardenGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const HOME_GARDEN_GROUPS: readonly HomeGardenGroup[] = [
  { key: 'garden-furniture', labelAr: 'أثاث حدائق', labelEn: 'Garden Furniture', icon: '🪑', slugs: ['garden-furniture'] },
  { key: 'plants', labelAr: 'نباتات', labelEn: 'Plants', icon: '🪴', slugs: ['plants'] },
  { key: 'bbq', labelAr: 'شوايات', labelEn: 'BBQ', icon: '🔥', slugs: ['bbq'] },
  { key: 'tools', labelAr: 'أدوات حدائق', labelEn: 'Garden Tools', icon: '🛠️', slugs: ['tools'] },
];

export const HOME_GARDEN_OTHER_GROUP: HomeGardenGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedHomeGarden {
  readonly group: HomeGardenGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupHomeGardenSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedHomeGarden[] {
  const grouped: GroupedHomeGarden[] = [];
  const covered = new Set<string>();

  for (const group of HOME_GARDEN_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: HOME_GARDEN_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
