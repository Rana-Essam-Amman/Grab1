import type { ListingFieldOption } from './types';

export const COLOR_OPTIONS: ListingFieldOption[] = [
  { value: 'white', labelAr: 'أبيض', labelEn: 'White' }, { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
  { value: 'silver', labelAr: 'فضي', labelEn: 'Silver' }, { value: 'grey', labelAr: 'رمادي', labelEn: 'Grey' },
  { value: 'red', labelAr: 'أحمر', labelEn: 'Red' }, { value: 'blue', labelAr: 'أزرق', labelEn: 'Blue' },
  { value: 'gold', labelAr: 'ذهبي', labelEn: 'Gold' },
];

export const RAM_OPTIONS: ListingFieldOption[] = [
  { value: '2gb', labelAr: '2 جيجابايت', labelEn: '2 GB' }, { value: '3gb', labelAr: '3 جيجابايت', labelEn: '3 GB' },
  { value: '4gb', labelAr: '4 جيجابايت', labelEn: '4 GB' }, { value: '6gb', labelAr: '6 جيجابايت', labelEn: '6 GB' },
  { value: '8gb', labelAr: '8 جيجابايت', labelEn: '8 GB' }, { value: '12gb', labelAr: '12 جيجابايت', labelEn: '12 GB' },
  { value: '16gb', labelAr: '16 جيجابايت', labelEn: '16 GB' },
];

export const STORAGE_OPTIONS: ListingFieldOption[] = [
  { value: '32gb', labelAr: '32 جيجابايت', labelEn: '32 GB' }, { value: '64gb', labelAr: '64 جيجابايت', labelEn: '64 GB' },
  { value: '128gb', labelAr: '128 جيجابايت', labelEn: '128 GB' }, { value: '256gb', labelAr: '256 جيجابايت', labelEn: '256 GB' },
  { value: '512gb', labelAr: '512 جيجابايت', labelEn: '512 GB' }, { value: '1tb', labelAr: '1 تيرابايت', labelEn: '1 TB' },
];

export const BATTERY_HEALTH_OPTIONS: ListingFieldOption[] = [
  { value: 'excellent', labelAr: 'ممتازة', labelEn: 'Excellent' }, { value: 'good', labelAr: 'جيدة', labelEn: 'Good' },
  { value: 'fair', labelAr: 'متوسطة', labelEn: 'Fair' }, { value: 'needs_replacement', labelAr: 'تحتاج تغيير', labelEn: 'Needs Replacement' },
];

export const PHONE_BRANDS: ListingFieldOption[] = [
  { value: 'apple', labelAr: 'أبل', labelEn: 'Apple' },
  { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
  { value: 'huawei', labelAr: 'هواوي', labelEn: 'Huawei' },
  { value: 'xiaomi', labelAr: 'شاومي', labelEn: 'Xiaomi' },
  { value: 'oppo', labelAr: 'أوبو', labelEn: 'Oppo' },
  { value: 'vivo', labelAr: 'فيفو', labelEn: 'Vivo' },
  { value: 'realme', labelAr: 'ريلمي', labelEn: 'Realme' },
  { value: 'google', labelAr: 'جوجل', labelEn: 'Google' },
  { value: 'sony', labelAr: 'سوني', labelEn: 'Sony' },
  { value: 'nokia', labelAr: 'نوكيا', labelEn: 'Nokia' },
  { value: 'oneplus', labelAr: 'ون بلس', labelEn: 'OnePlus' },
  { value: 'motorola', labelAr: 'موتورولا', labelEn: 'Motorola' },
  { value: 'honor', labelAr: 'هونر', labelEn: 'Honor' },
  { value: 'infinix', labelAr: 'إنفينكس', labelEn: 'Infinix' },
  { value: 'tecno', labelAr: 'تكنو', labelEn: 'Tecno' },
  { value: 'tcl', labelAr: 'TCL', labelEn: 'TCL' },
  { value: 'zte', labelAr: 'ZTE', labelEn: 'ZTE' },
  { value: 'nothing', labelAr: 'ناثينغ', labelEn: 'Nothing' },
  { value: 'asus', labelAr: 'أسوس', labelEn: 'Asus' },
  { value: 'lenovo', labelAr: 'لينوفو', labelEn: 'Lenovo' },
];

export const TABLET_BRANDS: ListingFieldOption[] = [
  { value: 'apple', labelAr: 'أبل', labelEn: 'Apple' }, { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
  { value: 'huawei', labelAr: 'هواوي', labelEn: 'Huawei' }, { value: 'lenovo', labelAr: 'لينوفو', labelEn: 'Lenovo' },
  { value: 'xiaomi', labelAr: 'شاومي', labelEn: 'Xiaomi' }, { value: 'microsoft', labelAr: 'مايكروسوفت', labelEn: 'Microsoft' },
];

export const WATCH_BRANDS: ListingFieldOption[] = [
  { value: 'apple', labelAr: 'أبل', labelEn: 'Apple' }, { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
  { value: 'huawei', labelAr: 'هواوي', labelEn: 'Huawei' }, { value: 'garmin', labelAr: 'جارمن', labelEn: 'Garmin' },
  { value: 'fitbit', labelAr: 'فيتبيت', labelEn: 'Fitbit' }, { value: 'amazfit', labelAr: 'أمازفيت', labelEn: 'Amazfit' },
];

export const GENERAL_CONDITION: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'used', labelAr: 'مستعمل', labelEn: 'Used' },
];

export const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'excellent', labelAr: 'ممتاز', labelEn: 'Excellent' },
  { value: 'good', labelAr: 'جيد', labelEn: 'Good' }, { value: 'fair', labelAr: 'مقبول', labelEn: 'Fair' },
];

export const REGIONAL_SPECS_OPTIONS: ListingFieldOption[] = [
  { value: 'gcc', labelAr: 'خليجي', labelEn: 'GCC' }, { value: 'global', labelAr: 'عالمي', labelEn: 'Global' }, { value: 'us', labelAr: 'أمريكي', labelEn: 'American' },
];

export const ACCESSORY_TYPES: ListingFieldOption[] = [
  { value: 'case', labelAr: 'كفر / غطاء', labelEn: 'Case' }, { value: 'charger', labelAr: 'شاحن', labelEn: 'Charger' },
  { value: 'headphones', labelAr: 'سماعة', labelEn: 'Headphones' }, { value: 'screen_protector', labelAr: 'حماية شاشة', labelEn: 'Screen Protector' },
  { value: 'cable', labelAr: 'كابل', labelEn: 'Cable' }, { value: 'holder', labelAr: 'حامل / ستاند', labelEn: 'Holder' },
];

export const NETWORK_OPTIONS: ListingFieldOption[] = [
  { value: 'zain', labelAr: 'زين', labelEn: 'Zain' }, { value: 'orange', labelAr: 'أورنج', labelEn: 'Orange' },
  { value: 'umniah', labelAr: 'أمنية', labelEn: 'Umniah' }, { value: 'stc', labelAr: 'STC', labelEn: 'STC' }, { value: 'mobily', labelAr: 'موبايلي', labelEn: 'Mobily' },
];

export const PHONE_SCREEN_SIZES: ListingFieldOption[] = [
  { value: '5.x', labelAr: '5.x بوصة', labelEn: '5.x inch' }, { value: '6.x', labelAr: '6.x بوصة', labelEn: '6.x inch' }, { value: '7.x', labelAr: '7.x بوصة', labelEn: '7.x inch' },
];

export const TABLET_SCREEN_SIZES: ListingFieldOption[] = [
  { value: '8.x', labelAr: '8.x بوصة', labelEn: '8.x inch' }, { value: '10.x', labelAr: '10.x بوصة', labelEn: '10.x inch' },
  { value: '11.x', labelAr: '11.x بوصة', labelEn: '11.x inch' }, { value: '12.x', labelAr: '12.x بوصة', labelEn: '12.x inch' },
];

export const WATCH_SIZES: ListingFieldOption[] = [
  { value: '40mm', labelAr: '40 ملم', labelEn: '40mm' }, { value: '41mm', labelAr: '41 ملم', labelEn: '41mm' },
  { value: '42mm', labelAr: '42 ملم', labelEn: '42mm' }, { value: '44mm', labelAr: '44 ملم', labelEn: '44mm' },
  { value: '45mm', labelAr: '45 ملم', labelEn: '45mm' }, { value: '46mm', labelAr: '46 ملم', labelEn: '46mm' },
];

export const STRAP_OPTIONS: ListingFieldOption[] = [
  { value: 'silicone', labelAr: 'سيليكون', labelEn: 'Silicone' }, { value: 'leather', labelAr: 'جلد', labelEn: 'Leather' },
  { value: 'metal', labelAr: 'معدن', labelEn: 'Metal' }, { value: 'nylon', labelAr: 'نايلون', labelEn: 'Nylon' },
];

export const DIGITS_OPTIONS: ListingFieldOption[] = [
  { value: '4', labelAr: '4 أرقام', labelEn: '4 Digits' }, { value: '5', labelAr: '5 أرقام', labelEn: '5 Digits' }, { value: '6', labelAr: '6 أرقام', labelEn: '6 Digits' },
  { value: '7', labelAr: '7 أرقام', labelEn: '7 Digits' }, { value: '8', labelAr: '8 أرقام', labelEn: '8 Digits' },
  { value: '9', labelAr: '9 أرقام', labelEn: '9 Digits' }, { value: '10', labelAr: '10 أرقام', labelEn: '10 Digits' },
];

export const ORIGIN_OPTIONS: ListingFieldOption[] = [
  { value: 'original', labelAr: 'أصلي', labelEn: 'Original' }, { value: 'aftermarket', labelAr: 'تجاري', labelEn: 'Aftermarket' },
];

export const NETWORK_TECH: readonly ListingFieldOption[] = [
  { value: '2g', labelAr: '2G', labelEn: '2G' },
  { value: '3g', labelAr: '3G', labelEn: '3G' },
  { value: '4g_lte', labelAr: '4G LTE', labelEn: '4G LTE' },
  { value: '5g', labelAr: '5G', labelEn: '5G' },
];

export const SMARTPHONE_FEATURES: readonly ListingFieldOption[] = [
  { value: 'dual_sim', labelAr: 'شريحتان', labelEn: 'Dual SIM' },
  { value: 'nfc', labelAr: 'NFC للدفع', labelEn: 'NFC' },
  { value: 'wireless_charging', labelAr: 'شحن لاسلكي', labelEn: 'Wireless Charging' },
  { value: 'face_unlock', labelAr: 'بصمة الوجه', labelEn: 'Face Unlock' },
  { value: 'fingerprint', labelAr: 'بصمة الإصبع', labelEn: 'Fingerprint' },
  { value: 'water_resistant', labelAr: 'مقاوم للماء', labelEn: 'Water Resistant' },
  { value: 'esim', labelAr: 'eSIM', labelEn: 'eSIM' },
  { value: 'ir_blaster', labelAr: 'ريموت IR', labelEn: 'IR Blaster' },
];

export const MOBILE_SELLER_TYPE: readonly ListingFieldOption[] = [
  { value: 'owner', labelAr: 'مالك', labelEn: 'Owner' },
  { value: 'shop', labelAr: 'محل', labelEn: 'Shop' },
  { value: 'reseller', labelAr: 'بائع متجول', labelEn: 'Reseller' },
];

