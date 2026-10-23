import type { SubcategoryDef } from '@/types';
export interface ElectronicsGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const ELECTRONICS_GROUPS: readonly ElectronicsGroup[] = [
  { key: 'tv-audio', labelAr: 'شاشات وصوت', labelEn: 'TV & Audio', icon: '📺', slugs: ['tv', 'audio'] },
  { key: 'gaming', labelAr: 'ألعاب', labelEn: 'Gaming', icon: '🎮', slugs: ['gaming'] },
  { key: 'cameras', labelAr: 'كاميرات', labelEn: 'Cameras', icon: '📷', slugs: ['cameras'] },
  { key: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances', icon: '🏠', slugs: ['home-appliances'] },
  { key: 'solar-industrial', labelAr: 'طاقة شمسية وصناعي', labelEn: 'Solar & Industrial', icon: '☀️', slugs: ['solar', 'industrial'] },
];
export const ELECTRONICS_OTHER_GROUP: ElectronicsGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedElectronics { readonly group: ElectronicsGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupElectronicsSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedElectronics[] {
  const grouped: GroupedElectronics[] = []; const covered = new Set<string>();
  for (const group of ELECTRONICS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: ELECTRONICS_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
