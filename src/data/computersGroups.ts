import type { SubcategoryDef } from '@/types';
export interface ComputersGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const COMPUTERS_GROUPS: readonly ComputersGroup[] = [
  { key: 'laptops', labelAr: 'لابتوب', labelEn: 'Laptops', icon: '💻', slugs: ['laptops'] },
  { key: 'desktops', labelAr: 'ديسكتوب', labelEn: 'Desktops', icon: '🖥️', slugs: ['desktops'] },
  { key: 'screens', labelAr: 'شاشات', labelEn: 'Screens', icon: '🖥️', slugs: ['screens'] },
  { key: 'pc-parts', labelAr: 'قطع كمبيوتر', labelEn: 'PC Parts', icon: '🔧', slugs: ['parts-pc'] },
  { key: 'accessories', labelAr: 'إكسسوارات', labelEn: 'Accessories', icon: '🖱️', slugs: ['accessories-pc'] },
];
export const COMPUTERS_OTHER_GROUP: ComputersGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedComputers { readonly group: ComputersGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupComputersSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedComputers[] {
  const grouped: GroupedComputers[] = []; const covered = new Set<string>();
  for (const group of COMPUTERS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: COMPUTERS_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
