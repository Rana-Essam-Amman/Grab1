import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COND_K = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER];

export const KIDS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  clothes: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['بدلة', 'تي شيرت', 'بنطال', 'فستان', 'بيجاما', 'طقم', OTHER] },
    { key: 'ageRange', labelAr: 'العمر', labelEn: 'Age Range', type: 'select', required: true, options: ['0-6 أشهر', '6-12 شهر', '1-2 سنوات', '2-5 سنوات', '5-10 سنوات', OTHER] },
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', required: true, options: ['ولد', 'بنت', 'مشترك', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_K },
  ],

  toys: [
    { key: 'toyType', labelAr: 'نوع اللعبة', labelEn: 'Toy Type', type: 'select', required: true, options: ['سيارات', 'عرائس', 'مكعبات', 'ألعاب تعليمية', 'ألعاب خارجية', 'ألعاب ذكاء', OTHER] },
    { key: 'ageRange', labelAr: 'العمر', labelEn: 'Age Range', type: 'select', required: true, options: ['0-2 سنوات', '2-5 سنوات', '5-8 سنوات', '8+ سنوات', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_K },
  ],

  strollers: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['عربة أطفال', 'كرسي سيارة', 'مقعد ارتفاع', 'حاملة أطفال', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'ageRange', labelAr: 'العمر', labelEn: 'Age Range', type: 'select', required: false, options: ['0-6 أشهر', '6-18 شهر', '1.5-3 سنوات', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_K },
  ],

  feeding: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['زجاجات حليب', 'مضخة حليب', 'معقم', 'مستلزمات طعام', 'حفاضات', 'مناديل', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد بالعلبة', 'جديد بدون علبة', 'مستعمل - ممتاز', OTHER] },
  ],
};
