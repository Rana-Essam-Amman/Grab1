import type { SubcategoryDef } from '@/types';
export interface WatchesGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const WATCHES_GROUPS: readonly WatchesGroup[] = [
  { key: 'luxury', labelAr: 'فاخرة', labelEn: 'Luxury', icon: '💎', slugs: ['luxury'] },
  { key: 'everyday', labelAr: 'يومية', labelEn: 'Everyday', icon: '⌚', slugs: ['everyday'] },
  { key: 'vintage', labelAr: 'كلاسيكية', labelEn: 'Vintage', icon: '🕰️', slugs: ['vintage-watch'] },
  { key: 'straps', labelAr: 'سيور', labelEn: 'Straps', icon: '🔗', slugs: ['straps'] },
];
export const WATCHES_OTHER_GROUP: WatchesGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedWatches { readonly group: WatchesGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupWatchesSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedWatches[] {
  const grouped: GroupedWatches[] = []; const covered = new Set<string>();
  for (const group of WATCHES_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: WATCHES_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
