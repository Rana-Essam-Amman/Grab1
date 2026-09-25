import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const CONDITION_PC = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', 'مستعمل - مقبول', OTHER];

export const COMPUTERS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  laptops: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'select', required: false, options: [] },
    { key: 'processor', labelAr: 'المعالج', labelEn: 'Processor', type: 'text', required: true, placeholder: 'Intel i7 12th Gen، M3 Pro...' },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'select', required: true, options: ['4GB', '8GB', '16GB', '32GB', '64GB', OTHER] },
    { key: 'storage', labelAr: 'التخزين', labelEn: 'Storage', type: 'text', required: true, placeholder: '512GB SSD، 1TB HDD...' },
    { key: 'screenSize', labelAr: 'حجم الشاشة (بوصة)', labelEn: 'Screen Size (inch)', type: 'text', required: false, placeholder: 'مثال: 15.6' },
    { key: 'gpu', labelAr: 'كرت الشاشة', labelEn: 'GPU', type: 'text', required: false, placeholder: 'RTX 4060، Intel Iris...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_PC },
  ],

  desktops: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'processor', labelAr: 'المعالج', labelEn: 'Processor', type: 'text', required: true },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'select', required: true, options: ['8GB', '16GB', '32GB', '64GB', '128GB', OTHER] },
    { key: 'storage', labelAr: 'التخزين', labelEn: 'Storage', type: 'text', required: true },
    { key: 'gpu', labelAr: 'كرت الشاشة', labelEn: 'GPU', type: 'text', required: false },
    { key: 'caseType', labelAr: 'نوع الكيس', labelEn: 'Case Type', type: 'select', required: false, options: ['كامل', 'بدون كرت شاشة', 'بدون شاشة', 'مخصص للألعاب', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_PC },
  ],

  monitors: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'size', labelAr: 'الحجم (بوصة)', labelEn: 'Size (inch)', type: 'text', required: true, placeholder: 'مثال: 24، 27، 32' },
    { key: 'resolution', labelAr: 'الدقة', labelEn: 'Resolution', type: 'select', required: true, options: ['HD', 'Full HD', '2K', '4K', '8K', OTHER] },
    { key: 'refreshRate', labelAr: 'معدل التحديث (Hz)', labelEn: 'Refresh Rate (Hz)', type: 'select', required: false, options: ['60Hz', '75Hz', '120Hz', '144Hz', '165Hz', '240Hz', OTHER] },
    { key: 'panelType', labelAr: 'نوع الشاشة', labelEn: 'Panel Type', type: 'select', required: false, options: ['IPS', 'VA', 'TN', 'OLED', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_PC },
  ],

  parts: [
    { key: 'componentType', labelAr: 'نوع القطعة', labelEn: 'Component Type', type: 'select', required: true, options: ['كرت شاشة', 'معالج', 'لوحة أم', 'رام', 'هارد', 'SSD', 'مزود طاقة', 'كيس', 'مروحة', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_PC },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', required: false, options: ['ساري', 'منتهي', 'بدون', OTHER] },
  ],

  'accessories-pc': [
    { key: 'accessoryType', labelAr: 'نوع الملحق', labelEn: 'Accessory Type', type: 'select', required: true, options: ['لوحة مفاتيح', 'ماوس', 'سماعات', 'ويب كام', 'ميكروفون', 'حافظة', 'قاعدة تبريد', 'كيبلات', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],
};
