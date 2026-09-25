import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COND_S = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER];

export const SPORTS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  fitness: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['مشاية كهربائية', 'دراجة ثابتة', 'أثقال', 'دمبل', 'بار', 'كيتل بيل', 'جهاز متعدد', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'weightKg', labelAr: 'الوزن (كغم)', labelEn: 'Weight (kg)', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_S },
  ],

  bicycles: [
    { key: 'bikeType', labelAr: 'النوع', labelEn: 'Bike Type', type: 'select', required: true, options: ['جبلية', 'طريق', 'هجينة', 'BMX', 'أطفال', 'كهربائية', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'text', required: false, placeholder: 'S، M، L أو بالبوصة' },
    { key: 'gears', labelAr: 'التروس', labelEn: 'Gears', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_S },
  ],

  camping: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['خيمة', 'كيس نوم', 'فرشة', 'كرسي تخييم', 'طاولة تخييم', 'إضاءة', 'طبخ تخييم', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'capacityPersons', labelAr: 'السعة (أشخاص)', labelEn: 'Capacity (persons)', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_S },
  ],

  'water-sports': [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['جت سكي', 'قارب مطاطي', 'لوح تجديف', 'بدلة سباحة', 'سنوركل', 'زعانف', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_S },
  ],
};
