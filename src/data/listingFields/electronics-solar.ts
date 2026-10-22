import type { ListingField, ListingFieldOption } from './types';

const SOLAR_BRANDS: ListingFieldOption[] = [
  { value: 'growatt', labelAr: 'جروات', labelEn: 'Growatt' },
  { value: 'huawei', labelAr: 'هواوي', labelEn: 'Huawei' },
  { value: 'deye', labelAr: 'ديي', labelEn: 'Deye' },
  { value: 'solis', labelAr: 'سوليس', labelEn: 'Solis' },
  { value: 'sungrow', labelAr: 'سنغرو', labelEn: 'Sungrow' },
  { value: 'victron', labelAr: 'فيكترون', labelEn: 'Victron' },
  { value: 'longi', labelAr: 'لونجي', labelEn: 'Longi' },
  { value: 'jinko', labelAr: 'جينكو', labelEn: 'Jinko' },
  { value: 'canadian_solar', labelAr: 'كنديان سولار', labelEn: 'Canadian Solar' },
  { value: 'trina', labelAr: 'ترينا', labelEn: 'Trina' },
  { value: 'other', labelAr: 'أخرى', labelEn: 'Other' },
];

const SYSTEM_TYPES: ListingFieldOption[] = [
  { value: 'on_grid', labelAr: 'متصل بالشبكة (On-Grid)', labelEn: 'On-Grid' },
  { value: 'off_grid', labelAr: 'منفصل عن الشبكة (Off-Grid)', labelEn: 'Off-Grid' },
  { value: 'hybrid', labelAr: 'هايبرد', labelEn: 'Hybrid' },
  { value: 'water_pump', labelAr: 'مضخة مياه شمسية', labelEn: 'Solar Water Pump' },
];

const CAPACITY_OPTIONS: ListingFieldOption[] = [
  { value: '1_3_kw', labelAr: '1-3 كيلو واط', labelEn: '1-3 kW' },
  { value: '3_5_kw', labelAr: '3-5 كيلو واط', labelEn: '3-5 kW' },
  { value: '5_10_kw', labelAr: '5-10 كيلو واط', labelEn: '5-10 kW' },
  { value: '10_20_kw', labelAr: '10-20 كيلو واط', labelEn: '10-20 kW' },
  { value: '20_kw_plus', labelAr: 'أكثر من 20 كيلو واط', labelEn: '20+ kW' },
];

const BATTERY_TYPES: ListingFieldOption[] = [
  { value: 'lithium', labelAr: 'ليثيوم', labelEn: 'Lithium' },
  { value: 'lead_acid', labelAr: 'رصاص حمضي', labelEn: 'Lead Acid' },
  { value: 'gel', labelAr: 'جل', labelEn: 'Gel' },
  { value: 'none', labelAr: 'بدون بطارية', labelEn: 'No Battery' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' },
  { value: 'used', labelAr: 'مستعمل', labelEn: 'Used' },
];

const WARRANTY_OPTIONS: ListingFieldOption[] = [
  { value: 'none', labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
  { value: '1y', labelAr: 'سنة', labelEn: '1 Year' },
  { value: '2y', labelAr: 'سنتان', labelEn: '2 Years' },
  { value: '5y', labelAr: '5 سنوات', labelEn: '5 Years' },
  { value: '10y', labelAr: '10 سنوات', labelEn: '10 Years' },
];

export const ELECTRONICS_SOLAR_FIELDS: readonly ListingField[] = [
  { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: false, options: SOLAR_BRANDS },
  { key: 'systemType', labelAr: 'نوع النظام', labelEn: 'System Type', type: 'select', allowOther: true, required: true, options: SYSTEM_TYPES },
  { key: 'capacity', labelAr: 'القدرة', labelEn: 'Capacity', type: 'select', allowOther: true, required: false, options: CAPACITY_OPTIONS },
  { key: 'batteryType', labelAr: 'نوع البطارية', labelEn: 'Battery Type', type: 'select', allowOther: true, required: false, options: BATTERY_TYPES },
  { key: 'batteryCapacityAh', labelAr: 'سعة البطارية (أمبير ساعة)', labelEn: 'Battery Capacity (Ah)', type: 'number', required: false },
  { key: 'panelCount', labelAr: 'عدد الألواح', labelEn: 'Panel Count', type: 'number', required: false },
  { key: 'panelWatt', labelAr: 'قدرة اللوح (واط)', labelEn: 'Panel Watt', type: 'number', required: false },
  { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
  { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
  { key: 'includesInverter', labelAr: 'يشمل إنفرتر', labelEn: 'Includes Inverter', type: 'boolean', required: false },
  { key: 'includesBattery', labelAr: 'يشمل بطارية', labelEn: 'Includes Battery', type: 'boolean', required: false },
  { key: 'includesPanels', labelAr: 'يشمل ألواح', labelEn: 'Includes Panels', type: 'boolean', required: false },
  { key: 'installationIncluded', labelAr: 'يشمل التركيب', labelEn: 'Installation Included', type: 'boolean', required: false },
];
