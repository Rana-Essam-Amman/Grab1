import type { SubcategoryDef } from '@/types';

export interface FurnitureGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const FURNITURE_GROUPS: readonly FurnitureGroup[] = [
  { key: 'living', labelAr: 'غرف جلوس', labelEn: 'Living Room', icon: '🛋️', slugs: ['living'] },
  { key: 'bedroom', labelAr: 'غرف نوم', labelEn: 'Bedroom', icon: '🛏️', slugs: ['bedroom'] },
  { key: 'tables', labelAr: 'طاولات وسفرة', labelEn: 'Tables & Dining', icon: '🪑', slugs: ['tables'] },
  { key: 'outdoor', labelAr: 'أثاث خارجي', labelEn: 'Outdoor Furniture', icon: '🌳', slugs: ['outdoor'] },
  { key: 'decor', labelAr: 'ديكور ومفروشات', labelEn: 'Decor', icon: '🖼️', slugs: ['decor'] },
  { key: 'office', labelAr: 'أثاث مكتبي', labelEn: 'Office Furniture', icon: '💼', slugs: ['office'] },
];

export const FURNITURE_OTHER_GROUP: FurnitureGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedFurniture {
  readonly group: FurnitureGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupFurnitureSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedFurniture[] {
  const grouped: GroupedFurniture[] = [];
  const covered = new Set<string>();

  for (const group of FURNITURE_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: FURNITURE_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
