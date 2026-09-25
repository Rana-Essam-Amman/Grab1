import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COND_H = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER];

export const HOME_GARDEN_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  'garden-furniture': [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['طقم جلوس', 'كرسي', 'طاولة', 'أرجوحة', 'مظلة', 'كنبة', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: true, options: ['راتان', 'خشب', 'معدن', 'بلاستيك', 'مختلط', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_H },
  ],

  plants: [
    { key: 'plantType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['نبات داخلي', 'نبات خارجي', 'شجرة', 'شجيرة', 'زهور', 'عصاريات', 'نباتات عطرية', OTHER] },
    { key: 'size', labelAr: 'الحجم', labelEn: 'Size', type: 'select', required: false, options: ['صغير', 'متوسط', 'كبير', OTHER] },
    { key: 'potIncluded', labelAr: 'مع الأصيص', labelEn: 'Pot Included', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
  ],

  bbq: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['شواية غاز', 'شواية فحم', 'شواية كهربائية', 'طاولة شوي', 'أدوات شوي', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_H },
  ],

  tools: [
    { key: 'toolType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['عدة يدوية', 'معدات كهربائية', 'أدوات قص', 'مستلزمات ريّ', 'خراطيم', 'مضخات', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_H },
  ],
};
