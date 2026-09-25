import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';

export const BEAUTY_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  'perfumes-cosmetics': [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['عطر', 'مكياج', 'أحمر شفاه', 'كريم أساس', 'ماسكرا', 'ظلال', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    { key: 'gender', labelAr: 'الفئة', labelEn: 'For', type: 'select', required: false, options: ['رجالي', 'نسائي', 'مشترك', OTHER] },
    { key: 'volume', labelAr: 'الحجم', labelEn: 'Volume', type: 'text', required: false, placeholder: '50ml، 100ml...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد بالكرتونة', 'جديد بدون كرتونة', 'مستعمل جزئياً', OTHER] },
  ],

  hair: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['شامبو', 'بلسم', 'ماسك شعر', 'زيت', 'سيروم', 'صبغة', 'أدوات تصفيف', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    { key: 'volume', labelAr: 'الحجم', labelEn: 'Volume', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد بالكرتونة', 'جديد بدون كرتونة', 'مستعمل جزئياً', OTHER] },
  ],

  skin: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['كريم مرطب', 'واقي شمس', 'غسول', 'تونر', 'سيروم', 'ماسك', 'مقشر', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    { key: 'skinType', labelAr: 'نوع البشرة', labelEn: 'Skin Type', type: 'select', required: false, options: ['دهنية', 'جافة', 'مختلطة', 'حساسة', 'عادية', OTHER] },
    { key: 'volume', labelAr: 'الحجم', labelEn: 'Volume', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد بالكرتونة', 'جديد بدون كرتونة', 'مستعمل جزئياً', OTHER] },
  ],

  care: [
    { key: 'deviceType', labelAr: 'نوع الجهاز', labelEn: 'Device Type', type: 'select', required: true, options: ['مجفف شعر', 'مكواة شعر', 'جهاز إزالة شعر', 'جهاز عناية بالبشرة', 'فرشاة تنظيف', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],
};
