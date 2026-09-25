import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';

export const PETS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  dogs: [
    { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: true, placeholder: 'شيرازي، هاسكي، جيرمن شيبرد...' },
    { key: 'age', labelAr: 'العمر', labelEn: 'Age', type: 'text', required: true, placeholder: 'مثال: 6 أشهر، سنتان' },
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', required: true, options: ['ذكر', 'أنثى', OTHER] },
    { key: 'vaccinated', labelAr: 'مطعم', labelEn: 'Vaccinated', type: 'select', required: true, options: ['نعم', 'لا', OTHER] },
    { key: 'condition', labelAr: 'الحالة الصحية', labelEn: 'Health', type: 'select', required: false, options: ['ممتازة', 'جيدة', 'يحتاج رعاية', OTHER] },
  ],

  cats: [
    { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: true, placeholder: 'شيرازي، سايميز، هملايا...' },
    { key: 'age', labelAr: 'العمر', labelEn: 'Age', type: 'text', required: true },
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', required: true, options: ['ذكر', 'أنثى', OTHER] },
    { key: 'vaccinated', labelAr: 'مطعم', labelEn: 'Vaccinated', type: 'select', required: true, options: ['نعم', 'لا', OTHER] },
    { key: 'condition', labelAr: 'الحالة الصحية', labelEn: 'Health', type: 'select', required: false, options: ['ممتازة', 'جيدة', 'يحتاج رعاية', OTHER] },
  ],

  birds: [
    { key: 'species', labelAr: 'النوع', labelEn: 'Species', type: 'text', required: true, placeholder: 'ببغاء، كناري، حمام...' },
    { key: 'age', labelAr: 'العمر', labelEn: 'Age', type: 'text', required: false },
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', required: false, options: ['ذكر', 'أنثى', OTHER] },
    { key: 'trained', labelAr: 'مدرب', labelEn: 'Trained', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
  ],

  fish: [
    { key: 'species', labelAr: 'النوع', labelEn: 'Species', type: 'text', required: true, placeholder: 'جوبي، مولّي، أسماك زينة...' },
    { key: 'tankSize', labelAr: 'حجم الحوض (لتر)', labelEn: 'Tank Size (L)', type: 'number', required: false },
    { key: 'includesTank', labelAr: 'مع الحوض', labelEn: 'Includes Tank', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
  ],

  'pet-supplies': [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['طعام', 'ألعاب', 'فرش', 'أقفاص', 'ملابس', 'مستلزمات صحية', OTHER] },
    { key: 'petType', labelAr: 'لأي حيوان', labelEn: 'For Pet', type: 'select', required: true, options: ['كلاب', 'قطط', 'طيور', 'أسماك', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد بالعلبة', 'جديد بدون علبة', 'مستعمل - ممتاز', OTHER] },
  ],
};
