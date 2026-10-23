import type { SubcategoryDef } from '@/types';
export interface MobilesGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const MOBILES_GROUPS: readonly MobilesGroup[] = [
  { key: 'phones', labelAr: 'هواتف', labelEn: 'Phones', icon: '📱', slugs: ['phones'] },
  { key: 'tablets', labelAr: 'تابلت', labelEn: 'Tablets', icon: '📟', slugs: ['tablets'] },
  { key: 'smart-watches', labelAr: 'ساعات ذكية', labelEn: 'Smart Watches', icon: '⌚', slugs: ['smart-watches'] },
  { key: 'accessories', labelAr: 'إكسسوارات', labelEn: 'Accessories', icon: '🎧', slugs: ['accessories'] },
  { key: 'numbers', labelAr: 'أرقام', labelEn: 'Numbers', icon: '🔢', slugs: ['numbers'] },
];
export const MOBILES_OTHER_GROUP: MobilesGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedMobiles { readonly group: MobilesGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupMobilesSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedMobiles[] {
  const grouped: GroupedMobiles[] = []; const covered = new Set<string>();
  for (const group of MOBILES_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: MOBILES_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
