import type { SubcategoryDef } from '@/types';

export interface MotorsGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const MOTORS_GROUPS: readonly MotorsGroup[] = [
  {
    key: 'cars',
    labelAr: 'سيارات',
    labelEn: 'Cars',
    icon: '🚗',
    slugs: [
      'cars',
      'cars_for_rent',
      'classic_cars',
      'damaged_cars',
      'lease_transfer',
    ],
  },
  {
    key: 'bikes',
    labelAr: 'دراجات ومركبات',
    labelEn: 'Bikes & ATVs',
    icon: '🏍️',
    slugs: [
      'motorbikes',
      'bikes_for_rent',
      'atv_buggies',
      'motorcycle-gear',
    ],
  },
  {
    key: 'heavy',
    labelAr: 'شاحنات وآليات ثقيلة',
    labelEn: 'Trucks & Heavy Equipment',
    icon: '🚛',
    slugs: [
      'heavy',
      'heavy-equipment',
      'heavy_for_rent',
    ],
  },
  {
    key: 'buses-boats',
    labelAr: 'باصات وقوارب',
    labelEn: 'Buses & Boats',
    icon: '🚌',
    slugs: [
      'buses',
      'buses_for_rent',
      'boats',
      'boats_for_rent',
    ],
  },
  {
    key: 'parts',
    labelAr: 'قطع وإكسسوارات',
    labelEn: 'Parts & Accessories',
    icon: '🔧',
    slugs: [
      'parts',
      'accessories',
      'plates',
    ],
  },
];

export const MOTORS_OTHER_GROUP: MotorsGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedMotors {
  readonly group: MotorsGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

export function groupMotorsSubcategories(
  allSubcategories: readonly SubcategoryDef[],
): GroupedMotors[] {
  const grouped: GroupedMotors[] = [];
  const covered = new Set<string>();

  for (const group of MOTORS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: MOTORS_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
