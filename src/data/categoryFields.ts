export type FieldType = 'text' | 'number' | 'select' | 'textarea';

export interface CategoryFieldDef {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly type: FieldType;
  readonly required: boolean;
  readonly options?: readonly string[];
  readonly placeholder?: string;
}

const OTHER = 'أخرى';

export const CATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {
  motors: [
    { key: 'make',         labelAr: 'الماركة',       labelEn: 'Make',         type: 'select', required: true, options: [] },
    { key: 'model',        labelAr: 'الموديل',       labelEn: 'Model',        type: 'select', required: true, options: [] },
    { key: 'year',         labelAr: 'السنة',         labelEn: 'Year',         type: 'number', required: true },
    { key: 'km',           labelAr: 'العداد (كم)',    labelEn: 'Mileage (km)', type: 'number', required: true },
    { key: 'color',        labelAr: 'اللون',         labelEn: 'Color',        type: 'select', required: true,  options: ['أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 'بني', 'بيج', 'أخضر', 'أصفر', 'برتقالي', 'ذهبي', OTHER] },
    { key: 'transmission', labelAr: 'ناقل الحركة',   labelEn: 'Transmission', type: 'select', required: true,  options: ['أوتوماتيك', 'عادي', OTHER] },
    { key: 'fuel',         labelAr: 'الوقود',         labelEn: 'Fuel',         type: 'select', required: true,  options: ['بنزين', 'ديزل', 'هايبرد', 'كهرباء', OTHER] },
    { key: 'inspection',   labelAr: 'الفحص',         labelEn: 'Inspection',   type: 'select', required: true,  options: ['فحص كامل', 'فحص 4 جيد', 'فحص 3 جيد', 'فحص نخب', 'بدون فحص', OTHER] },
    { key: 'origin',       labelAr: 'الوارد',         labelEn: 'Origin',       type: 'select', required: true,  options: ['وارد وكالة', 'وارد خليجي', 'وارد أوروبي', 'محلي', OTHER] },
    { key: 'features',     labelAr: 'إضافات',        labelEn: 'Features',     type: 'text',   required: false, placeholder: 'فتحة، جلد، كاميرا، حساسات' },
  ],

  'real-estate': [
    { key: 'unitType',    labelAr: 'نوع الوحدة',  labelEn: 'Unit Type',    type: 'select', required: true,  options: ['شقة', 'فيلا', 'أرض', 'مكتب', 'محل', 'مخزن', OTHER] },
    { key: 'area',        labelAr: 'المساحة (م²)', labelEn: 'Area (m²)',    type: 'number', required: true },
    { key: 'rooms',       labelAr: 'عدد الغرف',   labelEn: 'Rooms',        type: 'number', required: true },
    { key: 'bathrooms',   labelAr: 'الحمامات',    labelEn: 'Bathrooms',    type: 'number', required: true },
    { key: 'floor',       labelAr: 'الطابق',      labelEn: 'Floor',        type: 'text',   required: true, placeholder: 'أرضي، 2، 5...' },
    { key: 'buildingAge', labelAr: 'عمر البناء',  labelEn: 'Building Age', type: 'select', required: true,  options: ['جديد', '1-5 سنوات', '6-10 سنوات', 'أكثر من 10 سنوات', OTHER] },
    { key: 'furnished',   labelAr: 'مفروشة',      labelEn: 'Furnished',    type: 'select', required: false, options: ['نعم', 'لا', 'جزئياً', OTHER] },
    { key: 'view',        labelAr: 'الإطلالة',    labelEn: 'View',         type: 'text',   required: false },
  ],

  mobiles: [
    { key: 'brand',     labelAr: 'الماركة',      labelEn: 'Brand',         type: 'select', required: true, options: [] },
    { key: 'model',     labelAr: 'الموديل',      labelEn: 'Model',         type: 'select', required: true, options: [] },
    { key: 'storage',   labelAr: 'الذاكرة',      labelEn: 'Storage',       type: 'select', required: true,  options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', OTHER] },
    { key: 'color',     labelAr: 'اللون',        labelEn: 'Color',         type: 'select', required: true,  options: ['أسود', 'أبيض', 'فضي', 'رمادي', 'أزرق', 'أحمر', 'أخضر', 'ذهبي', 'بنفسجي', OTHER] },
    { key: 'condition', labelAr: 'الحالة',       labelEn: 'Condition',     type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', 'مستعمل - مقبول', OTHER] },
    { key: 'battery',   labelAr: 'صحة البطارية', labelEn: 'Battery Health',type: 'text',   required: false },
  ],

  computers: [
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'select', required: true, options: [] },
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'select', required: true,  options: ['لابتوب', 'مكتبي', 'شاشة', 'تابلت', OTHER] },
    { key: 'processor', labelAr: 'المعالج', labelEn: 'Processor', type: 'text',   required: true },
    { key: 'ram',       labelAr: 'الرام',   labelEn: 'RAM',       type: 'select', required: true,  options: ['4GB', '8GB', '16GB', '32GB', '64GB', OTHER] },
    { key: 'storage',   labelAr: 'التخزين', labelEn: 'Storage',   type: 'text',   required: true },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  electronics: [
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'text',   required: true },
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'select', required: true, options: [] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  watches: [
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'select', required: true, options: [] },
    { key: 'gender',    labelAr: 'النوع',   labelEn: 'Type',      type: 'select', required: true,  options: ['رجالي', 'نسائي', 'يونيسكس', OTHER] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  fashion: [
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'select', required: true,  options: ['رجالي', 'نسائي', 'أطفال', OTHER] },
    { key: 'size',      labelAr: 'المقاس',  labelEn: 'Size',      type: 'text',   required: true },
    { key: 'color',     labelAr: 'اللون',   labelEn: 'Color',     type: 'select', required: true,  options: ['أبيض', 'أسود', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'بني', 'بيج', 'وردي', OTHER] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد بالكيس', 'جديد بدون كيس', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  furniture: [
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'text',   required: true },
    { key: 'material',  labelAr: 'المادة',  labelEn: 'Material',  type: 'text',   required: true },
    { key: 'color',     labelAr: 'اللون',   labelEn: 'Color',     type: 'select', required: true,  options: ['أبيض', 'أسود', 'رمادي', 'بني', 'بيج', 'أزرق', 'أخضر', OTHER] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  jobs: [
    { key: 'jobType', labelAr: 'نوع الوظيفة', labelEn: 'Job Type', type: 'select', required: true, options: ['دوام كامل', 'دوام جزئي', 'عن بعد', 'تدريب', OTHER] },
    { key: 'field',   labelAr: 'المجال',       labelEn: 'Field',    type: 'text',   required: true },
    { key: 'salary',  labelAr: 'الراتب',       labelEn: 'Salary',   type: 'text',   required: true, placeholder: 'أو "حسب الاتفاق"' },
  ],

  services: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    { key: 'serviceArea', labelAr: 'النطاق',     labelEn: 'Coverage',     type: 'text', required: true },
  ],

  kids: [
    { key: 'type',     labelAr: 'النوع',         labelEn: 'Type',      type: 'text', required: true },
    { key: 'ageRange', labelAr: 'الفئة العمرية', labelEn: 'Age Range', type: 'text', required: false },
  ],

  books: [
    { key: 'type',     labelAr: 'النوع', labelEn: 'Type',     type: 'text', required: true },
    { key: 'language', labelAr: 'اللغة', labelEn: 'Language', type: 'text', required: false },
  ],

  pets: [
    { key: 'type',  labelAr: 'النوع',   labelEn: 'Type',  type: 'text', required: true },
    { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: false },
  ],

  sports:       [{ key: 'type', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true }],
  beauty:       [{ key: 'type', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true }],
  'home-garden':[{ key: 'type', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true }],

  krakeeb: [
    { key: 'type',      labelAr: 'النوع',  labelEn: 'Type',      type: 'text',   required: true },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل', OTHER] },
  ],
};

export function getCategoryFields(slug: string): readonly CategoryFieldDef[] {
  return CATEGORY_FIELDS[slug] || [];
}
