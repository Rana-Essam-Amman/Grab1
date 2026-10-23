import type { SubcategoryDef } from '@/types';
export interface BooksGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const BOOKS_GROUPS: readonly BooksGroup[] = [
  { key: 'books-magazines', labelAr: 'كتب ومجلات', labelEn: 'Books & Magazines', icon: '📖', slugs: ['books-magazines'] },
  { key: 'instruments', labelAr: 'آلات موسيقية', labelEn: 'Instruments', icon: '🎸', slugs: ['instruments'] },
  { key: 'antiques', labelAr: 'تحف ومقتنيات', labelEn: 'Antiques', icon: '🏺', slugs: ['antiques'] },
  { key: 'crafts', labelAr: 'أعمال يدوية', labelEn: 'Handicrafts', icon: '🧶', slugs: ['crafts'] },
];
export const BOOKS_OTHER_GROUP: BooksGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedBooks { readonly group: BooksGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupBooksSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedBooks[] {
  const grouped: GroupedBooks[] = []; const covered = new Set<string>();
  for (const group of BOOKS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: BOOKS_OTHER_GROUP, subcategories: orphans });
  return grouped;
}
