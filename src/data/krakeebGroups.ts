import type { SubcategoryDef } from '@/types';
export interface KrakeebGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const KRAKEEB_GROUPS: readonly KrakeebGroup[] = [
  { key: 'general', labelAr: 'مستعمل عام', labelEn: 'General Used', icon: '📦', slugs: ['general'] },
  { key: 'vintage', labelAr: 'قديم وأنتيك', labelEn: 'Vintage', icon: '🕰️', slugs: ['vintage'] },
  { key: 'clearances', labelAr: 'تصفيات', labelEn: 'Clearances', icon: '🏷️', slugs: ['clearances'] },
];
export const KRAKEEB_OTHER_GROUP: KrakeebGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedKrakeeb { readonly group: KrakeebGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupKrakeebSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedKrakeeb[] {
  const grouped: GroupedKrakeeb[] = []; const covered = new Set<string>();
  for (const group of KRAKEEB_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: KRAKEEB_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
