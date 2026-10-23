import type { SubcategoryDef } from '@/types';
export interface ServicesGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const SERVICES_GROUPS: readonly ServicesGroup[] = [
  { key: 'delivery', labelAr: 'توصيل ونقل', labelEn: 'Delivery & Transport', icon: '🚚', slugs: ['delivery'] },
  { key: 'events', labelAr: 'مناسبات وضيافة', labelEn: 'Events & Catering', icon: '🎉', slugs: ['events'] },
  { key: 'design', labelAr: 'تصميم وتسويق', labelEn: 'Design & Marketing', icon: '🎨', slugs: ['design'] },
  { key: 'tutor', labelAr: 'دروس خصوصية', labelEn: 'Tutoring', icon: '📚', slugs: ['tutor'] },
];
export const SERVICES_OTHER_GROUP: ServicesGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedServices { readonly group: ServicesGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupServicesSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedServices[] {
  const grouped: GroupedServices[] = []; const covered = new Set<string>();
  for (const group of SERVICES_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: SERVICES_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
