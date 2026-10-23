import type { SubcategoryDef } from '@/types';

export interface ProjectsGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const PROJECTS_GROUPS: readonly ProjectsGroup[] = [
  {
    key: 'food-beverage',
    labelAr: 'مطاعم وكافيهات',
    labelEn: 'Food & Beverage',
    icon: '🍽️',
    slugs: ['restaurant'],
  },
  {
    key: 'retail',
    labelAr: 'تجزئة ومحلات',
    labelEn: 'Retail & Shops',
    icon: '🏪',
    slugs: ['shop'],
  },
  {
    key: 'industrial',
    labelAr: 'صناعة وإنتاج',
    labelEn: 'Industrial & Production',
    icon: '🏭',
    slugs: ['factory', 'agri'],
  },
  {
    key: 'digital',
    labelAr: 'مشاريع رقمية',
    labelEn: 'Digital Projects',
    icon: '💻',
    slugs: ['online-store', 'software'],
  },
  {
    key: 'investment',
    labelAr: 'شراكات واستثمار',
    labelEn: 'Partnerships & Investment',
    icon: '🤝',
    slugs: ['partnership', 'franchise'],
  },
  {
    key: 'assets',
    labelAr: 'أصول وتراخيص',
    labelEn: 'Assets & Licenses',
    icon: '📄',
    slugs: ['licenses', 'equipment'],
  },
];

export const PROJECTS_OTHER_GROUP: ProjectsGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedProjects {
  readonly group: ProjectsGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupProjectsSubcategories(
  allSubcategories: readonly SubcategoryDef[],
): GroupedProjects[] {
  const grouped: GroupedProjects[] = [];
  const covered = new Set<string>();

  for (const group of PROJECTS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: PROJECTS_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
