import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COND_W = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER];

export const WATCHES_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  luxury: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'Submariner، Speedmaster...' },
    { key: 'reference', labelAr: 'المرجع', labelEn: 'Reference', type: 'text', required: false, placeholder: '126610LN...' },
    { key: 'year', labelAr: 'سنة الصنع', labelEn: 'Year', type: 'number', required: false },
    { key: 'gender', labelAr: 'النوع', labelEn: 'Gender', type: 'select', required: true, options: ['رجالي', 'نسائي', 'يونيسكس', OTHER] },
    { key: 'boxAndPapers', labelAr: 'العلبة والأوراق', labelEn: 'Box & Papers', type: 'select', required: true, options: ['كامل', 'بدون علبة', 'بدون أوراق', 'بدون كليهما', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_W },
  ],

  everyday: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true },
    { key: 'gender', labelAr: 'النوع', labelEn: 'Gender', type: 'select', required: true, options: ['رجالي', 'نسائي', 'يونيسكس', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_W },
  ],

  'vintage-watch': [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true },
    { key: 'year', labelAr: 'سنة الصنع', labelEn: 'Year', type: 'number', required: true },
    { key: 'gender', labelAr: 'النوع', labelEn: 'Gender', type: 'select', required: false, options: ['رجالي', 'نسائي', 'يونيسكس', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_W },
    { key: 'notes', labelAr: 'ملاحظات', labelEn: 'Notes', type: 'text', required: false, placeholder: 'حالة الميكانيزم، قطع أصلية...' },
  ],

  straps: [
    { key: 'strapType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['سوار جلد', 'سوار معدن', 'سوار نايلون', 'صندوق ساعة', 'أدوات صيانة', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],
};
