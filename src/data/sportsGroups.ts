import type { SubcategoryDef } from '@/types';
export interface SportsGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const SPORTS_GROUPS: readonly SportsGroup[] = [
  { key: 'fitness', labelAr: 'لياقة', labelEn: 'Fitness', icon: '💪', slugs: ['fitness'] },
  { key: 'bicycles', labelAr: 'دراجات', labelEn: 'Bicycles', icon: '🚲', slugs: ['bicycles'] },
  { key: 'camping', labelAr: 'تخييم', labelEn: 'Camping', icon: '⛺', slugs: ['camping'] },
  { key: 'water-sports', labelAr: 'رياضات مائية', labelEn: 'Water Sports', icon: '🏊', slugs: ['water-sports'] },
];
export const SPORTS_OTHER_GROUP: SportsGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedSports { readonly group: SportsGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupSportsSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedSports[] {
  const grouped: GroupedSports[] = []; const covered = new Set<string>();
  for (const group of SPORTS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: SPORTS_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
