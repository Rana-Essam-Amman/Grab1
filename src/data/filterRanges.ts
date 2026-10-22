/**
 * Generic range filter registry.
 * Each entry defines a range filter for a specific category/subcategory.
 * The UI renders it via CategoryAttrsSection (generic loop).
 * The client-side filter applies it via filterListings (generic loop).
 *
 * Adding a new range filter = adding one entry here.
 * No code changes needed in UI or filter logic.
 */

export interface RangeStep {
  readonly value: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly min: number;
  readonly max: number | null;
  readonly isFirst?: boolean;
}

export interface RangeFilterDef {
  readonly categorySlug: string;
  readonly subcategorySlugs?: readonly string[];
  readonly attrKey: string;
  readonly filterKey: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly steps: readonly RangeStep[];
}

export const RANGE_FILTERS: readonly RangeFilterDef[] = [
  {
    categorySlug: 'motors',
    subcategorySlugs: ['cars', 'classic_cars', 'damaged_cars', 'lease_transfer', 'motorbikes', 'heavy'],
    attrKey: 'km',
    filterKey: 'km_range',
    labelAr: 'نطاق المسافة المقطوعة',
    labelEn: 'Mileage Range',
    steps: [
      { value: '0-50000', min: 0, max: 50000, isFirst: true, labelAr: '0 - 50,000 كم', labelEn: '0 - 50,000 KM' },
      { value: '50000-100000', min: 50000, max: 100000, labelAr: '50,000 - 100,000 كم', labelEn: '50,000 - 100,000 KM' },
      { value: '100000-150000', min: 100000, max: 150000, labelAr: '100,000 - 150,000 كم', labelEn: '100,000 - 150,000 KM' },
      { value: '150000-plus', min: 150000, max: null, labelAr: '150,000+ كم', labelEn: '150,000+ KM' },
    ],
  },
];

export function getRangeFiltersFor(
  categorySlug: string | null,
  subcategorySlug: string | null,
): readonly RangeFilterDef[] {
  if (!categorySlug) return [];
  return RANGE_FILTERS.filter(
    (rf) =>
      rf.categorySlug === categorySlug &&
      (!rf.subcategorySlugs || rf.subcategorySlugs.includes(subcategorySlug ?? '')),
  );
}
