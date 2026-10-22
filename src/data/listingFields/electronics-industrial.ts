import type { ListingField, ListingFieldOption } from './types';

const INDUSTRIAL_TYPES: ListingFieldOption[] = [
  { value: 'production_line', labelAr: 'خط إنتاج', labelEn: 'Production Line' },
  { value: 'food_processing', labelAr: 'تصنيع غذائي', labelEn: 'Food Processing' },
  { value: 'packaging', labelAr: 'تعبئة وتغليف', labelEn: 'Packaging' },
  { value: 'agricultural', labelAr: 'معدات زراعية', labelEn: 'Agricultural Equipment' },
  { value: 'metal_working', labelAr: 'تشكيل معادن', labelEn: 'Metal Working' },
  { value: 'textile', labelAr: 'معدات نسيج', labelEn: 'Textile Machinery' },
  { value: 'construction', labelAr: 'معدات إنشاءات', labelEn: 'Construction Equipment' },
  { value: 'generator', labelAr: 'مولدات', labelEn: 'Generators' },
  { value: 'compressor', labelAr: 'ضواغط هواء', labelEn: 'Compressors' },
  { value: 'other', labelAr: 'أخرى', labelEn: 'Other' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' },
  { value: 'used', labelAr: 'مستعمل', labelEn: 'Used' },
  { value: 'refurbished', labelAr: 'مُجدّد', labelEn: 'Refurbished' },
];

const POWER_SOURCE_OPTIONS: ListingFieldOption[] = [
  { value: 'electric', labelAr: 'كهرباء', labelEn: 'Electric' },
  { value: 'diesel', labelAr: 'ديزل', labelEn: 'Diesel' },
  { value: 'gas', labelAr: 'غاز', labelEn: 'Gas' },
  { value: 'manual', labelAr: 'يدوي', labelEn: 'Manual' },
  { value: 'hybrid', labelAr: 'هايبرد', labelEn: 'Hybrid' },
];

const WARRANTY_OPTIONS: ListingFieldOption[] = [
  { value: 'none', labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
  { value: '6m', labelAr: '6 أشهر', labelEn: '6 Months' },
  { value: '1y', labelAr: 'سنة', labelEn: '1 Year' },
  { value: '2y', labelAr: 'سنتان', labelEn: '2 Years' },
];

export const ELECTRONICS_INDUSTRIAL_FIELDS: readonly ListingField[] = [
  { key: 'equipmentType', labelAr: 'نوع المعدات', labelEn: 'Equipment Type', type: 'select', allowOther: true, required: true, options: INDUSTRIAL_TYPES },
  { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Growatt, Siemens, ABB...' },
  { key: 'capacity', labelAr: 'القدرة / الطاقة الإنتاجية', labelEn: 'Capacity / Output', type: 'text', required: false, placeholder: '2 tons/hour' },
  { key: 'powerSource', labelAr: 'مصدر الطاقة', labelEn: 'Power Source', type: 'select', allowOther: true, required: false, options: POWER_SOURCE_OPTIONS },
  { key: 'powerKw', labelAr: 'القدرة الكهربائية (kW)', labelEn: 'Power (kW)', type: 'number', required: false },
  { key: 'year', labelAr: 'سنة الصنع', labelEn: 'Year', type: 'number', required: false },
  { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
  { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
  { key: 'installationIncluded', labelAr: 'يشمل التركيب', labelEn: 'Installation Included', type: 'boolean', required: false },
  { key: 'trainingIncluded', labelAr: 'يشمل تدريب', labelEn: 'Training Included', type: 'boolean', required: false },
];
