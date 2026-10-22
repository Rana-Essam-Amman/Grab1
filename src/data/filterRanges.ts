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
  {
    categorySlug: 'electronics',
    subcategorySlugs: ['tv'],
    attrKey: 'screenSize',
    filterKey: 'screen_size_tv',
    labelAr: 'حجم الشاشة',
    labelEn: 'Screen Size',
    steps: [
      { value: '0-32', min: 0, max: 32, isFirst: true, labelAr: 'أقل من 32 بوصة', labelEn: 'Under 32"' },
      { value: '32-43', min: 32, max: 43, labelAr: '32 - 43 بوصة', labelEn: '32" - 43"' },
      { value: '43-55', min: 43, max: 55, labelAr: '43 - 55 بوصة', labelEn: '43" - 55"' },
      { value: '55-65', min: 55, max: 65, labelAr: '55 - 65 بوصة', labelEn: '55" - 65"' },
      { value: '65-75', min: 65, max: 75, labelAr: '65 - 75 بوصة', labelEn: '65" - 75"' },
      { value: '75-plus', min: 75, max: null, labelAr: '75+ بوصة', labelEn: '75"+' },
    ],
  },
  {
    categorySlug: 'computers',
    subcategorySlugs: ['laptops', 'screens'],
    attrKey: 'screenSize',
    filterKey: 'screen_size_computers',
    labelAr: 'حجم الشاشة',
    labelEn: 'Screen Size',
    steps: [
      { value: '0-13', min: 0, max: 13, isFirst: true, labelAr: 'أقل من 13 بوصة', labelEn: 'Under 13"' },
      { value: '13-14', min: 13, max: 14, labelAr: '13 - 14 بوصة', labelEn: '13" - 14"' },
      { value: '14-15', min: 14, max: 15, labelAr: '14 - 15 بوصة', labelEn: '14" - 15"' },
      { value: '15-17', min: 15, max: 17, labelAr: '15 - 17 بوصة', labelEn: '15" - 17"' },
      { value: '17-plus', min: 17, max: null, labelAr: '17+ بوصة', labelEn: '17"+' },
    ],
  },
  {
    categorySlug: 'motors',
    subcategorySlugs: ['motorbikes'],
    attrKey: 'engineSize',
    filterKey: 'engine_size_range',
    labelAr: 'سعة المحرك (سي سي)',
    labelEn: 'Engine Size (CC)',
    steps: [
      { value: '0-150', min: 0, max: 150, isFirst: true, labelAr: 'حتى 150 سي سي', labelEn: 'Under 150 CC' },
      { value: '150-300', min: 150, max: 300, labelAr: '150 - 300 سي سي', labelEn: '150 - 300 CC' },
      { value: '300-500', min: 300, max: 500, labelAr: '300 - 500 سي سي', labelEn: '300 - 500 CC' },
      { value: '500-1000', min: 500, max: 1000, labelAr: '500 - 1000 سي سي', labelEn: '500 - 1000 CC' },
      { value: '1000-plus', min: 1000, max: null, labelAr: '1000+ سي سي', labelEn: '1000+ CC' },
    ],
  },
  {
    categorySlug: 'electronics',
    subcategorySlugs: ['audio'],
    attrKey: 'driverSize',
    filterKey: 'driver_size_range',
    labelAr: 'حجم الـ Driver (ملم)',
    labelEn: 'Driver Size (mm)',
    steps: [
      { value: '0-40', min: 0, max: 40, isFirst: true, labelAr: 'حتى 40 ملم', labelEn: 'Under 40mm' },
      { value: '40-50', min: 40, max: 50, labelAr: '40 - 50 ملم', labelEn: '40 - 50mm' },
      { value: '50-70', min: 50, max: 70, labelAr: '50 - 70 ملم', labelEn: '50 - 70mm' },
      { value: '70-plus', min: 70, max: null, labelAr: '70+ ملم', labelEn: '70mm+' },
    ],
  },
  {
    categorySlug: 'electronics',
    subcategorySlugs: ['cameras'],
    attrKey: 'megapixels',
    filterKey: 'megapixels_range',
    labelAr: 'دقة الكاميرا (ميجابكسل)',
    labelEn: 'Megapixels',
    steps: [
      { value: '0-12', min: 0, max: 12, isFirst: true, labelAr: 'حتى 12 MP', labelEn: 'Under 12 MP' },
      { value: '12-24', min: 12, max: 24, labelAr: '12 - 24 MP', labelEn: '12 - 24 MP' },
      { value: '24-45', min: 24, max: 45, labelAr: '24 - 45 MP', labelEn: '24 - 45 MP' },
      { value: '45-plus', min: 45, max: null, labelAr: '45+ MP', labelEn: '45+ MP' },
    ],
  },
  {
    categorySlug: 'motors',
    subcategorySlugs: ['cars', 'classic_cars', 'damaged_cars', 'lease_transfer'],
    attrKey: 'year',
    filterKey: 'year_range',
    labelAr: 'سنة الصنع',
    labelEn: 'Year',
    steps: [
      { value: '2024-plus', min: 2024, max: null, isFirst: true, labelAr: '2024+', labelEn: '2024+' },
      { value: '2020-2023', min: 2020, max: 2023, labelAr: '2020 - 2023', labelEn: '2020 - 2023' },
      { value: '2015-2019', min: 2015, max: 2019, labelAr: '2015 - 2019', labelEn: '2015 - 2019' },
      { value: '2010-2014', min: 2010, max: 2014, labelAr: '2010 - 2014', labelEn: '2010 - 2014' },
      { value: '0-2009', min: 0, max: 2009, labelAr: 'قبل 2010', labelEn: 'Before 2010' },
    ],
  },
  {
    categorySlug: 'mobiles',
    subcategorySlugs: ['phones'],
    attrKey: 'storage',
    filterKey: 'storage_range',
    labelAr: 'سعة التخزين',
    labelEn: 'Storage',
    steps: [
      { value: '0-64', min: 0, max: 64, isFirst: true, labelAr: 'حتى 64 GB', labelEn: 'Under 64 GB' },
      { value: '64-128', min: 64, max: 128, labelAr: '64 - 128 GB', labelEn: '64 - 128 GB' },
      { value: '128-256', min: 128, max: 256, labelAr: '128 - 256 GB', labelEn: '128 - 256 GB' },
      { value: '256-512', min: 256, max: 512, labelAr: '256 - 512 GB', labelEn: '256 - 512 GB' },
      { value: '512-plus', min: 512, max: null, labelAr: '512+ GB', labelEn: '512+ GB' },
    ],
  },
  {
    categorySlug: 'computers',
    subcategorySlugs: ['laptops', 'desktops'],
    attrKey: 'ram',
    filterKey: 'ram_range',
    labelAr: 'الرام (GB)',
    labelEn: 'RAM (GB)',
    steps: [
      { value: '0-8', min: 0, max: 8, isFirst: true, labelAr: 'حتى 8 GB', labelEn: 'Under 8 GB' },
      { value: '8-16', min: 8, max: 16, labelAr: '8 - 16 GB', labelEn: '8 - 16 GB' },
      { value: '16-32', min: 16, max: 32, labelAr: '16 - 32 GB', labelEn: '16 - 32 GB' },
      { value: '32-plus', min: 32, max: null, labelAr: '32+ GB', labelEn: '32+ GB' },
    ],
  },
  {
    categorySlug: 'fashion',
    subcategorySlugs: ['watches-jewelry'],
    attrKey: 'weightGrams',
    filterKey: 'weight_range',
    labelAr: 'الوزن (جرام)',
    labelEn: 'Weight (g)',
    steps: [
      { value: '0-5', min: 0, max: 5, isFirst: true, labelAr: 'حتى 5 جرام', labelEn: 'Under 5g' },
      { value: '5-20', min: 5, max: 20, labelAr: '5 - 20 جرام', labelEn: '5 - 20g' },
      { value: '20-50', min: 20, max: 50, labelAr: '20 - 50 جرام', labelEn: '20 - 50g' },
      { value: '50-plus', min: 50, max: null, labelAr: '50+ جرام', labelEn: '50g+' },
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
