// RULE-14-EXCEPTION: Static taxonomy
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
  {
    categorySlug: 'real-estate',
    subcategorySlugs: [
      'apartments-for-sale', 'apartments-for-rent',
      'villas-for-sale', 'villas-for-rent',
      'houses-for-sale', 'houses-for-rent',
      'commercial', 'commercial-for-sale', 'commercial-for-rent',
      'commercial-complexes-for-sale', 'commercial-complexes-for-rent',
      'whole-buildings', 'lands', 'lands-for-rent',
      'chalets', 'chalets-for-sale', 'chalets-for-rent',
      'foreign', 'shared-rooms', 'hotel-apartments', 'staff-housing', 'construction',
    ],
    attrKey: 'area',
    filterKey: 'area_range',
    labelAr: 'المساحة (م²)',
    labelEn: 'Area (m²)',
    steps: [
      { value: '0-100', min: 0, max: 100, isFirst: true, labelAr: 'حتى 100 م²', labelEn: 'Under 100 m²' },
      { value: '100-150', min: 100, max: 150, labelAr: '100 - 150 م²', labelEn: '100 - 150 m²' },
      { value: '150-200', min: 150, max: 200, labelAr: '150 - 200 م²', labelEn: '150 - 200 m²' },
      { value: '200-300', min: 200, max: 300, labelAr: '200 - 300 م²', labelEn: '200 - 300 m²' },
      { value: '300-500', min: 300, max: 500, labelAr: '300 - 500 م²', labelEn: '300 - 500 m²' },
      { value: '500-plus', min: 500, max: null, labelAr: '500+ م²', labelEn: '500+ m²' },
    ],
  },
  {
    categorySlug: 'real-estate',
    subcategorySlugs: [
      'apartments-for-sale', 'apartments-for-rent',
      'villas-for-sale', 'villas-for-rent',
      'houses-for-sale', 'houses-for-rent',
      'chalets', 'chalets-for-sale', 'chalets-for-rent',
      'foreign', 'shared-rooms', 'hotel-apartments', 'staff-housing',
    ],
    attrKey: 'bedrooms',
    filterKey: 'bedrooms_range',
    labelAr: 'غرف النوم',
    labelEn: 'Bedrooms',
    steps: [
      { value: '1', min: 0, max: 1, isFirst: true, labelAr: 'غرفة واحدة', labelEn: '1 Bedroom' },
      { value: '2', min: 1, max: 2, labelAr: 'غرفتان', labelEn: '2 Bedrooms' },
      { value: '3', min: 2, max: 3, labelAr: '3 غرف', labelEn: '3 Bedrooms' },
      { value: '4', min: 3, max: 4, labelAr: '4 غرف', labelEn: '4 Bedrooms' },
      { value: '5-plus', min: 4, max: null, labelAr: '5+ غرف', labelEn: '5+ Bedrooms' },
    ],
  },
  {
    categorySlug: 'real-estate',
    subcategorySlugs: [
      'apartments-for-sale', 'apartments-for-rent',
      'villas-for-sale', 'villas-for-rent',
      'houses-for-sale', 'houses-for-rent',
      'chalets', 'chalets-for-sale', 'chalets-for-rent',
      'foreign', 'shared-rooms', 'hotel-apartments', 'staff-housing',
    ],
    attrKey: 'bathrooms',
    filterKey: 'bathrooms_range',
    labelAr: 'الحمامات',
    labelEn: 'Bathrooms',
    steps: [
      { value: '1', min: 0, max: 1, isFirst: true, labelAr: 'حمام واحد', labelEn: '1 Bathroom' },
      { value: '2', min: 1, max: 2, labelAr: 'حمامان', labelEn: '2 Bathrooms' },
      { value: '3', min: 2, max: 3, labelAr: '3 حمامات', labelEn: '3 Bathrooms' },
      { value: '4-plus', min: 3, max: null, labelAr: '4+ حمامات', labelEn: '4+ Bathrooms' },
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
