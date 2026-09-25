import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COND_B = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER];

export const BOOKS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  'books-magazines': [
    { key: 'bookType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['رواية', 'كتاب ديني', 'كتاب أكاديمي', 'مرجع', 'مجلة', 'قصص أطفال', 'كتاب تطوير', OTHER] },
    { key: 'language', labelAr: 'اللغة', labelEn: 'Language', type: 'select', required: false, options: ['عربي', 'إنجليزي', 'فرنسي', OTHER] },
    { key: 'author', labelAr: 'المؤلف', labelEn: 'Author', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_B },
  ],

  instruments: [
    { key: 'instrumentType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['جيتار', 'بيانو', 'كيبورد', 'كمان', 'طبلة', 'عود', 'ناي', 'أدوات إيقاع', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'level', labelAr: 'المستوى', labelEn: 'Level', type: 'select', required: false, options: ['مبتدئ', 'متوسط', 'احترافي', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_B },
  ],

  antiques: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true, placeholder: 'ساعة قديمة، عملة، تحفة...' },
    { key: 'era', labelAr: 'الحقبة', labelEn: 'Era', type: 'text', required: false, placeholder: 'القرن 19، 1950s...' },
    { key: 'origin', labelAr: 'المنشأ', labelEn: 'Origin', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['ممتازة', 'جيدة', 'تحتاج ترميم', OTHER] },
  ],

  crafts: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true, placeholder: 'تطريز، خزف، رسم...' },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    { key: 'dimensions', labelAr: 'الأبعاد', labelEn: 'Dimensions', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل - ممتاز', OTHER] },
  ],
};
