import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const CONDITION_PHONE = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', 'مستعمل - مقبول', OTHER];

export const MOBILES_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  phones: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'select', required: true, options: [] },
    { key: 'storage', labelAr: 'الذاكرة', labelEn: 'Storage', type: 'select', required: true, options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', OTHER] },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'select', required: false, options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', OTHER] },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: true, options: ['أسود', 'أبيض', 'فضي', 'رمادي', 'أزرق', 'أحمر', 'أخضر', 'ذهبي', 'بنفسجي', OTHER] },
    { key: 'network', labelAr: 'الشبكة', labelEn: 'Network', type: 'select', required: false, options: ['5G', '4G LTE', '3G', OTHER] },
    { key: 'battery', labelAr: 'صحة البطارية (%)', labelEn: 'Battery Health (%)', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_PHONE },
  ],

  tablets: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'select', required: true, options: [] },
    { key: 'storage', labelAr: 'الذاكرة', labelEn: 'Storage', type: 'select', required: true, options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', OTHER] },
    { key: 'screenSize', labelAr: 'حجم الشاشة (بوصة)', labelEn: 'Screen Size (inch)', type: 'text', required: false, placeholder: 'مثال: 11' },
    { key: 'connectivity', labelAr: 'الاتصال', labelEn: 'Connectivity', type: 'select', required: false, options: ['Wi-Fi فقط', 'Wi-Fi + خلوي', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_PHONE },
  ],

  'smart-watches': [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true },
    { key: 'size', labelAr: 'حجم القطر (مم)', labelEn: 'Diameter (mm)', type: 'text', required: false },
    { key: 'connectivity', labelAr: 'الاتصال', labelEn: 'Connectivity', type: 'select', required: false, options: ['Wi-Fi + خلوي', 'Wi-Fi فقط', 'بلوتوث', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_PHONE },
  ],

  accessories: [
    { key: 'accessoryType', labelAr: 'نوع الإكسسوار', labelEn: 'Accessory Type', type: 'select', required: true, options: ['كفرات', 'شواحن', 'شواحن لاسلكية', 'سماعات', 'كابلات', 'شاشات حماية', 'حاملات', 'بطاريات متنقلة', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'compatibleWith', labelAr: 'متوافق مع', labelEn: 'Compatible With', type: 'text', required: false, placeholder: 'iPhone 15، Samsung S24...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  numbers: [
    { key: 'operator', labelAr: 'المشغل', labelEn: 'Operator', type: 'select', required: true, options: ['Zain', 'Orange', 'Umniah', 'STC', 'Mobily', 'Vodafone', OTHER] },
    { key: 'numberPattern', labelAr: 'نمط الرقم', labelEn: 'Number Pattern', type: 'text', required: true, placeholder: 'مثال: 0799999999' },
    { key: 'numberType', labelAr: 'نوع الرقم', labelEn: 'Number Type', type: 'select', required: true, options: ['عادي', 'فضي', 'ذهبي', 'بلاتيني', 'VIP', OTHER] },
    { key: 'contractStatus', labelAr: 'حالة العقد', labelEn: 'Contract Status', type: 'select', required: false, options: ['بدون عقد', 'مع عقد', OTHER] },
  ],
};
