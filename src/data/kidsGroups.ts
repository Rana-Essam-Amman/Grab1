import type { SubcategoryDef } from '@/types';
export interface KidsGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const KIDS_GROUPS: readonly KidsGroup[] = [
  { key: 'clothes', labelAr: 'ملابس أطفال', labelEn: 'Clothes', icon: '👶', slugs: ['clothes'] },
  { key: 'toys', labelAr: 'ألعاب أطفال', labelEn: 'Toys', icon: '🧸', slugs: ['toys'] },
  { key: 'strollers', labelAr: 'عربات ومقاعد', labelEn: 'Strollers', icon: '🛒', slugs: ['strollers'] },
  { key: 'feeding', labelAr: 'مستلزمات رضاعة', labelEn: 'Feeding', icon: '🍼', slugs: ['feeding'] },
];
export const KIDS_OTHER_GROUP: KidsGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedKids { readonly group: KidsGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupKidsSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedKids[] {
  const grouped: GroupedKids[] = []; const covered = new Set<string>();
  for (const group of KIDS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: KIDS_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
