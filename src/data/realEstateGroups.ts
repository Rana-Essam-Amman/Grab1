import type { SubcategoryDef } from '@/types';

export interface RealEstateGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const REAL_ESTATE_GROUPS: readonly RealEstateGroup[] = [
  {
    key: 'residential',
    labelAr: 'سكني',
    labelEn: 'Residential',
    icon: '🏠',
    slugs: [
      'apartments-for-sale',
      'apartments-for-rent',
      'villas-for-sale',
      'villas-for-rent',
      'houses-for-sale',
      'houses-for-rent',
      'whole-buildings',
      'shared-rooms',
      'staff-housing',
      'hotel-apartments',
      'foreign',
    ],
  },
  {
    key: 'commercial',
    labelAr: 'تجاري وإداري',
    labelEn: 'Commercial',
    icon: '🏢',
    slugs: [
      'commercial-for-sale',
      'commercial-for-rent',
      'commercial-complexes-for-sale',
      'commercial-complexes-for-rent',
      'construction',
    ],
  },
  {
    key: 'lands',
    labelAr: 'أراضي',
    labelEn: 'Lands',
    icon: '🌍',
    slugs: ['lands', 'lands-for-rent'],
  },
  {
    key: 'chalets',
    labelAr: 'شاليهات ومزارع',
    labelEn: 'Chalets & Farms',
    icon: '🌴',
    slugs: ['chalets-for-sale', 'chalets-for-rent'],
  },
];

export const REAL_ESTATE_OTHER_GROUP: RealEstateGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedRealEstate {
  readonly group: RealEstateGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupRealEstateSubcategories(
  allSubcategories: readonly SubcategoryDef[],
): GroupedRealEstate[] {
  const grouped: GroupedRealEstate[] = [];
  const covered = new Set<string>();

  for (const group of REAL_ESTATE_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: REAL_ESTATE_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
