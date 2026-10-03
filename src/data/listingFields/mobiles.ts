import type { CategoryFieldMap, ListingFieldOption } from './types';

const COLOR_OPTIONS: ListingFieldOption[] = [
  { value: 'white', labelAr: 'أبيض', labelEn: 'White' }, { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
  { value: 'silver', labelAr: 'فضي', labelEn: 'Silver' }, { value: 'grey', labelAr: 'رمادي', labelEn: 'Grey' },
  { value: 'red', labelAr: 'أحمر', labelEn: 'Red' }, { value: 'blue', labelAr: 'أزرق', labelEn: 'Blue' },
  { value: 'gold', labelAr: 'ذهبي', labelEn: 'Gold' },
];

const RAM_OPTIONS: ListingFieldOption[] = [
  { value: '2gb', labelAr: '2 جيجابايت', labelEn: '2 GB' }, { value: '3gb', labelAr: '3 جيجابايت', labelEn: '3 GB' },
  { value: '4gb', labelAr: '4 جيجابايت', labelEn: '4 GB' }, { value: '6gb', labelAr: '6 جيجابايت', labelEn: '6 GB' },
  { value: '8gb', labelAr: '8 جيجابايت', labelEn: '8 GB' }, { value: '12gb', labelAr: '12 جيجابايت', labelEn: '12 GB' },
  { value: '16gb', labelAr: '16 جيجابايت', labelEn: '16 GB' },
];

const STORAGE_OPTIONS: ListingFieldOption[] = [
  { value: '32gb', labelAr: '32 جيجابايت', labelEn: '32 GB' }, { value: '64gb', labelAr: '64 جيجابايت', labelEn: '64 GB' },
  { value: '128gb', labelAr: '128 جيجابايت', labelEn: '128 GB' }, { value: '256gb', labelAr: '256 جيجابايت', labelEn: '256 GB' },
  { value: '512gb', labelAr: '512 جيجابايت', labelEn: '512 GB' }, { value: '1tb', labelAr: '1 تيرابايت', labelEn: '1 TB' },
];

const BATTERY_HEALTH_OPTIONS: ListingFieldOption[] = [
  { value: 'excellent', labelAr: 'ممتازة', labelEn: 'Excellent' }, { value: 'good', labelAr: 'جيدة', labelEn: 'Good' },
  { value: 'fair', labelAr: 'متوسطة', labelEn: 'Fair' }, { value: 'needs_replacement', labelAr: 'تحتاج تغيير', labelEn: 'Needs Replacement' },
];

const TABLET_BRANDS: ListingFieldOption[] = [
  { value: 'apple', labelAr: 'أبل', labelEn: 'Apple' }, { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
  { value: 'huawei', labelAr: 'هواوي', labelEn: 'Huawei' }, { value: 'lenovo', labelAr: 'لينوفو', labelEn: 'Lenovo' },
  { value: 'xiaomi', labelAr: 'شاومي', labelEn: 'Xiaomi' }, { value: 'microsoft', labelAr: 'مايكروسوفت', labelEn: 'Microsoft' },
];

const WATCH_BRANDS: ListingFieldOption[] = [
  { value: 'apple', labelAr: 'أبل', labelEn: 'Apple' }, { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
  { value: 'huawei', labelAr: 'هواوي', labelEn: 'Huawei' }, { value: 'garmin', labelAr: 'جارمن', labelEn: 'Garmin' },
  { value: 'fitbit', labelAr: 'فيتبيت', labelEn: 'Fitbit' }, { value: 'amazfit', labelAr: 'أمازفيت', labelEn: 'Amazfit' },
];

const GENERAL_CONDITION: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'used', labelAr: 'مستعمل', labelEn: 'Used' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'excellent', labelAr: 'ممتاز', labelEn: 'Excellent' },
  { value: 'good', labelAr: 'جيد', labelEn: 'Good' }, { value: 'fair', labelAr: 'مقبول', labelEn: 'Fair' },
];

const REGIONAL_SPECS_OPTIONS: ListingFieldOption[] = [
  { value: 'gcc', labelAr: 'خليجي', labelEn: 'GCC' }, { value: 'global', labelAr: 'عالمي', labelEn: 'Global' }, { value: 'us', labelAr: 'أمريكي', labelEn: 'American' },
];

const ACCESSORY_TYPES: ListingFieldOption[] = [
  { value: 'case', labelAr: 'كفر / غطاء', labelEn: 'Case' }, { value: 'charger', labelAr: 'شاحن', labelEn: 'Charger' },
  { value: 'headphones', labelAr: 'سماعة', labelEn: 'Headphones' }, { value: 'screen_protector', labelAr: 'حماية شاشة', labelEn: 'Screen Protector' },
  { value: 'cable', labelAr: 'كابل', labelEn: 'Cable' }, { value: 'holder', labelAr: 'حامل / ستاند', labelEn: 'Holder' },
];

const NETWORK_OPTIONS: ListingFieldOption[] = [
  { value: 'zain', labelAr: 'زين', labelEn: 'Zain' }, { value: 'orange', labelAr: 'أورنج', labelEn: 'Orange' },
  { value: 'umniah', labelAr: 'أمنية', labelEn: 'Umniah' }, { value: 'stc', labelAr: 'STC', labelEn: 'STC' }, { value: 'mobily', labelAr: 'موبايلي', labelEn: 'Mobily' },
];

const PHONE_SCREEN_SIZES: ListingFieldOption[] = [
  { value: '5.x', labelAr: '5.x بوصة', labelEn: '5.x inch' }, { value: '6.x', labelAr: '6.x بوصة', labelEn: '6.x inch' }, { value: '7.x', labelAr: '7.x بوصة', labelEn: '7.x inch' },
];

const TABLET_SCREEN_SIZES: ListingFieldOption[] = [
  { value: '8.x', labelAr: '8.x بوصة', labelEn: '8.x inch' }, { value: '10.x', labelAr: '10.x بوصة', labelEn: '10.x inch' },
  { value: '11.x', labelAr: '11.x بوصة', labelEn: '11.x inch' }, { value: '12.x', labelAr: '12.x بوصة', labelEn: '12.x inch' },
];

const WATCH_SIZES: ListingFieldOption[] = [
  { value: '40mm', labelAr: '40 ملم', labelEn: '40mm' }, { value: '41mm', labelAr: '41 ملم', labelEn: '41mm' },
  { value: '42mm', labelAr: '42 ملم', labelEn: '42mm' }, { value: '44mm', labelAr: '44 ملم', labelEn: '44mm' },
  { value: '45mm', labelAr: '45 ملم', labelEn: '45mm' }, { value: '46mm', labelAr: '46 ملم', labelEn: '46mm' },
];

const STRAP_OPTIONS: ListingFieldOption[] = [
  { value: 'silicone', labelAr: 'سيليكون', labelEn: 'Silicone' }, { value: 'leather', labelAr: 'جلد', labelEn: 'Leather' },
  { value: 'metal', labelAr: 'معدن', labelEn: 'Metal' }, { value: 'nylon', labelAr: 'نايلون', labelEn: 'Nylon' },
];

const DIGITS_OPTIONS: ListingFieldOption[] = [
  { value: '4', labelAr: '4 أرقام', labelEn: '4 Digits' }, { value: '5', labelAr: '5 أرقام', labelEn: '5 Digits' }, { value: '6', labelAr: '6 أرقام', labelEn: '6 Digits' },
  { value: '7', labelAr: '7 أرقام', labelEn: '7 Digits' }, { value: '8', labelAr: '8 أرقام', labelEn: '8 Digits' },
  { value: '9', labelAr: '9 أرقام', labelEn: '9 Digits' }, { value: '10', labelAr: '10 أرقام', labelEn: '10 Digits' },
];

const ORIGIN_OPTIONS: ListingFieldOption[] = [
  { value: 'original', labelAr: 'أصلي', labelEn: 'Original' }, { value: 'aftermarket', labelAr: 'تجاري', labelEn: 'Aftermarket' },
];

export const MOBILES_FIELDS: CategoryFieldMap = {
  phones: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Apple, Samsung...' },
    { key: 'storage', labelAr: 'السعة التخزينية', labelEn: 'Storage', type: 'select', allowOther: true, required: true, options: STORAGE_OPTIONS },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'select', allowOther: true, required: false, options: RAM_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: GENERAL_CONDITION },
    { key: 'battery', labelAr: 'صحة البطارية', labelEn: 'Battery Health', type: 'select', allowOther: true, required: false, options: BATTERY_HEALTH_OPTIONS },
    { key: 'region', labelAr: 'المواصفات الإقليمية', labelEn: 'Regional Specs', type: 'select', allowOther: true, required: false, options: REGIONAL_SPECS_OPTIONS },
    { key: 'screenSize', labelAr: 'حجم الشاشة', labelEn: 'Screen Size', type: 'select', allowOther: true, required: false, options: PHONE_SCREEN_SIZES },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: [
      { value: 'local', labelAr: 'ضمان محلي', labelEn: 'Local Warranty' }, { value: 'intl', labelAr: 'ضمان دولي', labelEn: 'International' }, { value: 'none', labelAr: 'لا يوجد', labelEn: 'None' },
    ]},
    { key: 'boxIncluded', labelAr: 'الكرتونة متوفرة', labelEn: 'Box Included', type: 'boolean', required: false },
    { key: 'chargerIncluded', labelAr: 'الشاحن متوفر', labelEn: 'Charger Included', type: 'boolean', required: false },
  ],
  tablets: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: TABLET_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'iPad Pro, Tab S9...' },
    { key: 'storage', labelAr: 'السعة', labelEn: 'Storage', type: 'select', allowOther: true, required: true, options: STORAGE_OPTIONS },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'select', allowOther: true, required: false, options: RAM_OPTIONS },
    { key: 'screenSize', labelAr: 'حجم الشاشة', labelEn: 'Screen Size', type: 'select', allowOther: true, required: false, options: TABLET_SCREEN_SIZES },
    { key: 'connectivity', labelAr: 'الاتصال', labelEn: 'Connectivity', type: 'select', allowOther: true, required: false, options: [
      { value: 'wifi', labelAr: 'WiFi فقط', labelEn: 'WiFi Only' }, { value: 'cellular', labelAr: 'WiFi + شريحة', labelEn: 'WiFi + Cellular' },
    ]},
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
    { key: 'battery', labelAr: 'البطارية', labelEn: 'Battery', type: 'select', allowOther: true, required: false, options: BATTERY_HEALTH_OPTIONS },
    { key: 'boxIncluded', labelAr: 'الكرتونة متوفرة', labelEn: 'Box Included', type: 'boolean', required: false },
  ],
  'smart-watches': [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: WATCH_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'Apple Watch Ultra, Galaxy Watch...' },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', allowOther: true, required: false, options: WATCH_SIZES },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'strap', labelAr: 'نوع السوار', labelEn: 'Strap Material', type: 'select', allowOther: true, required: false, options: STRAP_OPTIONS },
    { key: 'connectivity', labelAr: 'الاتصال', labelEn: 'Connectivity', type: 'select', allowOther: true, required: false, options: [
      { value: 'bluetooth', labelAr: 'بلوتوث + WiFi', labelEn: 'Bluetooth + WiFi' }, { value: 'cellular', labelAr: 'تدعم شريحة (Cellular)', labelEn: 'Cellular' },
    ]},
    { key: 'battery', labelAr: 'صحة البطارية', labelEn: 'Battery Health', type: 'select', allowOther: true, required: false, options: BATTERY_HEALTH_OPTIONS },
    { key: 'waterResistance', labelAr: 'مقاومة الماء', labelEn: 'Water Resistance', type: 'select', allowOther: true, required: false, options: [
      { value: 'yes', labelAr: 'مقاومة للماء (50m+)', labelEn: 'Water Resistant (50m+)' }, { value: 'splash', labelAr: 'مقاومة للرذاذ فقط', labelEn: 'Splash Resistant' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
    { key: 'boxIncluded', labelAr: 'الكرتونة متوفرة', labelEn: 'Box Included', type: 'boolean', required: false },
  ],
  accessories: [
    { key: 'type', labelAr: 'نوع الإكسسوار', labelEn: 'Accessory Type', type: 'select', allowOther: true, required: true, options: ACCESSORY_TYPES },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: false, options: [
      { value: 'apple', labelAr: 'أبل', labelEn: 'Apple' }, { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
      { value: 'anker', labelAr: 'أنكر', labelEn: 'Anker' }, { value: 'baseus', labelAr: 'بيسوس', labelEn: 'Baseus' },
      { value: 'xiaomi', labelAr: 'شاومي', labelEn: 'Xiaomi' },
    ]},
    { key: 'compatibleModel', labelAr: 'الموديل المتوافق', labelEn: 'Compatible Model', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'original', labelAr: 'الأصالة', labelEn: 'Authenticity', type: 'select', allowOther: true, required: false, options: ORIGIN_OPTIONS },
  ],
  numbers: [
    { key: 'numberType', labelAr: 'نوع الرقم', labelEn: 'Number Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'vip', labelAr: 'مميز / VIP', labelEn: 'VIP / Special' }, { value: 'gold', labelAr: 'ذهبي', labelEn: 'Gold' }, { value: 'regular', labelAr: 'عادي', labelEn: 'Regular' },
    ]},
    { key: 'digits', labelAr: 'عدد الأرقام', labelEn: 'Number of Digits', type: 'select', allowOther: true, required: true, options: DIGITS_OPTIONS },
    { key: 'network', labelAr: 'الشبكة', labelEn: 'Network', type: 'select', allowOther: true, required: true, options: NETWORK_OPTIONS },
    { key: 'transferStatus', labelAr: 'حالة التنازل والتوثيق', labelEn: 'Transfer Status', type: 'select', allowOther: true, required: false, options: [
      { value: 'ready', labelAr: 'جاهز للتنازل الفوري', labelEn: 'Ready for Transfer' }, { value: 'needs_auth', labelAr: 'بحاجة توثيق', labelEn: 'Needs Auth' },
    ]},
    { key: 'price', labelAr: 'السعر المطلوب', labelEn: 'Requested Price', type: 'number', required: false },
  ],
};
