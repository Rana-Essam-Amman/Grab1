import type { CategoryFieldMap, ListingField } from './types';
import { PHONE_BRANDS, TABLET_BRANDS, STORAGE_OPTIONS, RAM_OPTIONS, GENERAL_CONDITION, CONDITION_OPTIONS, BATTERY_HEALTH_OPTIONS, REGIONAL_SPECS_OPTIONS, PHONE_SCREEN_SIZES, TABLET_SCREEN_SIZES, NETWORK_TECH, SMARTPHONE_FEATURES, MOBILE_SELLER_TYPE, COLOR_OPTIONS, CARRIER_LOCK_OPTIONS } from './mobiles-options';

export const PHONES_FIELDS: ListingField[] = [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: PHONE_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'cascading-model', dependsOn: 'brand', cascadeSource: 'phones', required: true, placeholder: 'iPhone 15 Pro, Galaxy S24...' },
    { key: 'storage', labelAr: 'السعة التخزينية', labelEn: 'Storage', type: 'select', allowOther: false, required: true, options: STORAGE_OPTIONS },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'select', allowOther: false, required: false, options: RAM_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: false, required: true, options: GENERAL_CONDITION },
    { key: 'battery', labelAr: 'صحة البطارية', labelEn: 'Battery Health', type: 'select', allowOther: false, required: false, options: BATTERY_HEALTH_OPTIONS },
    { key: 'carrierLock', labelAr: 'قفل الشبكة', labelEn: 'Carrier Lock', type: 'select', allowOther: false, required: false, options: CARRIER_LOCK_OPTIONS },
    { key: 'imeiVerified', labelAr: 'IMEI موثق', labelEn: 'IMEI Verified', type: 'boolean', required: false },
    { key: 'region', labelAr: 'المواصفات الإقليمية', labelEn: 'Regional Specs', type: 'select', allowOther: false, required: false, options: REGIONAL_SPECS_OPTIONS },
    { key: 'screenSize', labelAr: 'حجم الشاشة', labelEn: 'Screen Size', type: 'select', allowOther: true, required: false, options: PHONE_SCREEN_SIZES },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: false, required: false, options: [
      { value: 'local', labelAr: 'ضمان محلي', labelEn: 'Local Warranty' }, { value: 'intl', labelAr: 'ضمان دولي', labelEn: 'International' }, { value: 'none', labelAr: 'لا يوجد', labelEn: 'None' },
    ]},
    { key: 'boxIncluded', labelAr: 'الكرتونة متوفرة', labelEn: 'Box Included', type: 'boolean', required: false },
    { key: 'chargerIncluded', labelAr: 'الشاحن متوفر', labelEn: 'Charger Included', type: 'boolean', required: false },
    { key: 'networkTech', labelAr: 'تقنية الشبكة', labelEn: 'Network Tech', type: 'select', allowOther: false, required: false, options: NETWORK_TECH },
    { key: 'phoneFeatures', labelAr: 'مميزات الجهاز', labelEn: 'Features', type: 'select', multiSelect: true, allowOther: true, required: false, options: SMARTPHONE_FEATURES },
    { key: 'repairHistory', labelAr: 'تاريخ الصيانة', labelEn: 'Repair History', type: 'select', allowOther: false, required: false, options: [
      { value: 'never_opened', labelAr: 'لم يُفتح أبداً', labelEn: 'Never Opened' },
      { value: 'battery_only', labelAr: 'بطارية فقط', labelEn: 'Battery Only' },
      { value: 'screen_only', labelAr: 'شاشة فقط', labelEn: 'Screen Only' },
      { value: 'multiple_parts', labelAr: 'عدة قطع', labelEn: 'Multiple Parts' },
    ]},
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: MOBILE_SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ];

export const TABLETS_FIELDS: ListingField[] = [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: false, required: true, options: TABLET_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'iPad Pro, Tab S9...' },
    { key: 'storage', labelAr: 'السعة', labelEn: 'Storage', type: 'select', allowOther: false, required: true, options: STORAGE_OPTIONS },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'select', allowOther: false, required: false, options: RAM_OPTIONS },
    { key: 'screenSize', labelAr: 'حجم الشاشة', labelEn: 'Screen Size', type: 'select', allowOther: true, required: false, options: TABLET_SCREEN_SIZES },
    { key: 'connectivity', labelAr: 'الاتصال', labelEn: 'Connectivity', type: 'select', allowOther: true, required: false, options: [
      { value: 'wifi', labelAr: 'WiFi فقط', labelEn: 'WiFi Only' }, { value: 'cellular', labelAr: 'WiFi + شريحة', labelEn: 'WiFi + Cellular' },
    ]},
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: false, required: false, options: CONDITION_OPTIONS },
    { key: 'battery', labelAr: 'البطارية', labelEn: 'Battery', type: 'select', allowOther: false, required: false, options: BATTERY_HEALTH_OPTIONS },
    { key: 'imeiVerified', labelAr: 'IMEI موثق', labelEn: 'IMEI Verified', type: 'boolean', required: false },
    { key: 'boxIncluded', labelAr: 'الكرتونة متوفرة', labelEn: 'Box Included', type: 'boolean', required: false },
    { key: 'stylusIncluded', labelAr: 'القلم مشمول', labelEn: 'Stylus Included', type: 'boolean', required: false },
    { key: 'keyboardIncluded', labelAr: 'لوحة المفاتيح مشمولة', labelEn: 'Keyboard Included', type: 'boolean', required: false },
    { key: 'networkTech', labelAr: 'تقنية الشبكة', labelEn: 'Network Tech', type: 'select', allowOther: false, required: false, options: NETWORK_TECH },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: MOBILE_SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ];
