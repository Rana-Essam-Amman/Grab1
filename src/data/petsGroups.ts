import type { SubcategoryDef } from '@/types';
export interface PetsGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const PETS_GROUPS: readonly PetsGroup[] = [
  { key: 'dogs', labelAr: 'كلاب', labelEn: 'Dogs', icon: '🐕', slugs: ['dogs'] },
  { key: 'cats', labelAr: 'قطط', labelEn: 'Cats', icon: '🐈', slugs: ['cats'] },
  { key: 'birds', labelAr: 'طيور', labelEn: 'Birds', icon: '🦜', slugs: ['birds'] },
  { key: 'fish', labelAr: 'أسماك', labelEn: 'Fish', icon: '🐟', slugs: ['fish'] },
  { key: 'pet-supplies', labelAr: 'مستلزمات حيوانات', labelEn: 'Pet Supplies', icon: '🦴', slugs: ['pet-supplies'] },
];
export const PETS_OTHER_GROUP: PetsGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedPets { readonly group: PetsGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupPetsSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedPets[] {
  const grouped: GroupedPets[] = []; const covered = new Set<string>();
  for (const group of PETS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: PETS_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
