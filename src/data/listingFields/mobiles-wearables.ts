import type { ListingField } from './types';
import { WATCH_BRANDS, CONDITION_OPTIONS, BATTERY_HEALTH_OPTIONS, COLOR_OPTIONS, STRAP_OPTIONS, WATCH_SIZES, MOBILE_SELLER_TYPE, ACCESSORY_TYPES, ORIGIN_OPTIONS, ACCESSORY_BRANDS } from './mobiles-options';

export const MOBILES_WATCHES_FIELDS: ListingField[] = [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: WATCH_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'Apple Watch Ultra, Galaxy Watch...' },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', allowOther: true, required: false, options: WATCH_SIZES },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'strap', labelAr: 'نوع السوار', labelEn: 'Strap Material', type: 'select', allowOther: true, required: false, options: STRAP_OPTIONS },
    { key: 'connectivity', labelAr: 'الاتصال', labelEn: 'Connectivity', type: 'select', allowOther: true, required: false, options: [
      { value: 'bluetooth', labelAr: 'بلوتوث + WiFi', labelEn: 'Bluetooth + WiFi' }, { value: 'cellular', labelAr: 'تدعم شريحة (Cellular)', labelEn: 'Cellular' },
    ]},
    { key: 'battery', labelAr: 'صحة البطارية', labelEn: 'Battery Health', type: 'select', allowOther: false, required: false, options: BATTERY_HEALTH_OPTIONS },
    { key: 'waterResistance', labelAr: 'مقاومة الماء', labelEn: 'Water Resistance', type: 'select', allowOther: true, required: false, options: [
      { value: 'yes', labelAr: 'مقاومة للماء (50m+)', labelEn: 'Water Resistant (50m+)' }, { value: 'splash', labelAr: 'مقاومة للرذاذ فقط', labelEn: 'Splash Resistant' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: false, required: false, options: CONDITION_OPTIONS },
    { key: 'boxIncluded', labelAr: 'الكرتونة متوفرة', labelEn: 'Box Included', type: 'boolean', required: false },
    { key: 'healthFeatures', labelAr: 'مميزات صحية', labelEn: 'Health Features', type: 'select', multiSelect: true, allowOther: true, required: false, options: [
      { value: 'heart_rate', labelAr: 'قياس النبض', labelEn: 'Heart Rate' },
      { value: 'ecg', labelAr: 'تخطيط القلب', labelEn: 'ECG' },
      { value: 'spo2', labelAr: 'قياس الأكسجين', labelEn: 'SpO2' },
      { value: 'sleep_tracking', labelAr: 'تتبع النوم', labelEn: 'Sleep Tracking' },
      { value: 'gps', labelAr: 'GPS', labelEn: 'GPS' },
      { value: 'blood_pressure', labelAr: 'قياس ضغط الدم', labelEn: 'Blood Pressure' },
      { value: 'temperature', labelAr: 'قياس الحرارة', labelEn: 'Temperature' },
    ]},
    { key: 'compatibleOS', labelAr: 'التوافق', labelEn: 'Compatible OS', type: 'select', allowOther: true, required: false, options: [
      { value: 'ios_only', labelAr: 'iOS فقط', labelEn: 'iOS Only' },
      { value: 'android_only', labelAr: 'أندرويد فقط', labelEn: 'Android Only' },
      { value: 'both', labelAr: 'iOS + أندرويد', labelEn: 'iOS & Android' },
    ]},
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: MOBILE_SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ];

export const MOBILES_ACCESSORIES_FIELDS: ListingField[] = [
    { key: 'type', labelAr: 'نوع الإكسسوار', labelEn: 'Accessory Type', type: 'select', allowOther: true, required: true, options: ACCESSORY_TYPES },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: false, options: ACCESSORY_BRANDS},
    { key: 'compatibleModel', labelAr: 'الموديل المتوافق', labelEn: 'Compatible Model', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: false, required: false, options: CONDITION_OPTIONS },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'original', labelAr: 'الأصالة', labelEn: 'Authenticity', type: 'select', allowOther: true, required: false, options: ORIGIN_OPTIONS },
    { key: 'compatibleBrand', labelAr: 'متوافق مع ماركة', labelEn: 'Compatible Brand', type: 'select', allowOther: true, required: false, options: [
      { value: 'apple', labelAr: 'أبل', labelEn: 'Apple' },
      { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
      { value: 'huawei', labelAr: 'هواوي', labelEn: 'Huawei' },
      { value: 'xiaomi', labelAr: 'شاومي', labelEn: 'Xiaomi' },
      { value: 'universal', labelAr: 'عام لكل الأجهزة', labelEn: 'Universal' },
    ]},
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: false, required: false, options: [
      { value: 'local', labelAr: 'ضمان محلي', labelEn: 'Local Warranty' },
      { value: 'international', labelAr: 'ضمان دولي', labelEn: 'International Warranty' },
      { value: 'none', labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
    ]},
    { key: 'quantity', labelAr: 'الكمية المتوفرة', labelEn: 'Quantity', type: 'number', required: false },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: MOBILE_SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ];
