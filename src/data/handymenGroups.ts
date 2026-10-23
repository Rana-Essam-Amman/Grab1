import type { SubcategoryDef } from '@/types';

/**
 * Handymen subcategory grouping for the custom landing screen.
 *
 * Groups are declared here (not on SubcategoryDef) to keep the shared
 * type minimal. Any handymen subcategory that is not listed in one of
 * these groups is automatically shown in the "Other" fallback group at
 * runtime — so adding a new subcategory never requires touching this
 * file. Rule 4 compliant.
 */

export interface HandymenGroup {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}

export const HANDYMEN_GROUPS: readonly HandymenGroup[] = [
  {
    key: 'home-maintenance',
    labelAr: 'صيانة منزلية',
    labelEn: 'Home Maintenance',
    icon: '🔧',
    slugs: [
      'electrician',
      'plumber',
      'carpenter',
      'painter',
      'blacksmith',
      'aluminum',
      'glass',
      'locksmith',
      'furniture-assembly',
      'general',
    ],
  },
  {
    key: 'ac-appliances',
    labelAr: 'تكييف وأجهزة',
    labelEn: 'AC & Appliances',
    icon: '❄️',
    slugs: ['ac-technician', 'appliance-repair', 'generator-repair', 'solar-panels'],
  },
  {
    key: 'finishing-construction',
    labelAr: 'تشطيب وبناء',
    labelEn: 'Finishing & Construction',
    icon: '🏗️',
    slugs: ['gypsum', 'tiles-marble', 'waterproofing', 'mason', 'interior-designer', 'fire-safety'],
  },
  {
    key: 'cars-bikes',
    labelAr: 'سيارات ودراجات',
    labelEn: 'Cars & Bikes',
    icon: '🚗',
    slugs: ['car-mechanic', 'car-electrician', 'tire-repair', 'car-wash-detailing'],
  },
  {
    key: 'electronics-tech',
    labelAr: 'إلكترونيات وتقنية',
    labelEn: 'Electronics & Tech',
    icon: '📱',
    slugs: [
      'cctv-installation',
      'satellite-dish',
      'network-it',
      'elevator-maintenance',
      'phone-repair',
      'computer-repair',
      'bike-repair',
      'motorcycle-repair',
      'intercom',
    ],
  },
  {
    key: 'outdoor',
    labelAr: 'خارجي',
    labelEn: 'Outdoor',
    icon: '🌿',
    slugs: ['pest-control', 'pool-maintenance', 'gardening', 'wood-oven'],
  },
  {
    key: 'personal',
    labelAr: 'شخصي',
    labelEn: 'Personal',
    icon: '✨',
    slugs: [
      'curtains-blinds',
      'upholstery',
      'tailor',
      'shoe-repair',
      'watch-repair',
      'sign-maker',
    ],
  },
];

export const HANDYMEN_OTHER_GROUP: HandymenGroup = {
  key: 'other',
  labelAr: 'أخرى',
  labelEn: 'Other',
  icon: '📦',
  slugs: [],
};

export interface GroupedHandymen {
  readonly group: HandymenGroup;
  readonly subcategories: readonly SubcategoryDef[];
}

/**
 * Distributes the given handymen subcategories into groups.
 * Any subcategory whose slug is not declared in HANDYMEN_GROUPS ends up
 * in the "Other" fallback group — so future additions never get lost.
 */
export function groupHandymenSubcategories(
  allSubcategories: readonly SubcategoryDef[],
): GroupedHandymen[] {
  const grouped: GroupedHandymen[] = [];
  const covered = new Set<string>();

  for (const group of HANDYMEN_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }

  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) {
    grouped.push({ group: HANDYMEN_OTHER_GROUP, subcategories: orphans });
  }

  return grouped;
}
