import type { SubcategoryDef } from '@/types';

export interface CleaningGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const CLEANING_GROUPS: readonly CleaningGroup[] = [
  { key: 'homes-offices', labelAr: 'منازل ومكاتب', labelEn: 'Homes & Offices', icon: '🏠', slugs: ['homes', 'offices'] },
  { key: 'sofas-carpets', labelAr: 'كنب وسجاد', labelEn: 'Sofas & Carpets', icon: '🧹', slugs: ['sofas-carpets'] },
  { key: 'tanks-pools', labelAr: 'خزانات ومسابح', labelEn: 'Tanks & Pools', icon: '💧', slugs: ['water-tanks', 'pools'] },
  { key: 'post-construction', labelAr: 'تنظيف واجهات وتشطيب', labelEn: 'Post-Construction & Windows', icon: '🧼', slugs: ['post-construction', 'windows-facades'] },
];

export const CLEANING_OTHER_GROUP: CleaningGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedCleaning {
  readonly group: CleaningGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupCleaningSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedCleaning[] {
  const grouped: GroupedCleaning[] = [];
  const covered = new Set<string>();

  for (const group of CLEANING_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: CLEANING_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
