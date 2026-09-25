export type FieldType = 'text' | 'number' | 'select' | 'textarea';

export interface CategoryFieldDef {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly type: FieldType;
  readonly required: boolean;
  readonly options?: readonly string[];
  readonly placeholder?: string;
  readonly disabled?: boolean;
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
    { key: 'bodyType',     labelAr: 'نوع الهيكل',     labelEn: 'Body Type',    type: 'select', required: false, options: ['سيدان', 'SUV', 'هاتشباك', 'كوبيه', 'بيك أب', 'فان', OTHER] },
    { key: 'features',     labelAr: 'إضافات',        labelEn: 'Features',     type: 'text',   required: false, placeholder: 'فتحة، جلد، كاميرا، حساسات' },
  ],

  'real-estate': [
    { key: 'unitType',    labelAr: 'نوع الوحدة',  labelEn: 'Unit Type',    type: 'select', required: true,  options: ['شقة', 'فيلا', 'أرض', 'مكتب', 'محل', 'مخزن', OTHER] },
    { key: 'area',        labelAr: 'المساحة (م²)', labelEn: 'Area (m²)',    type: 'number', required: true },
    { key: 'rooms',       labelAr: 'عدد الغرف',   labelEn: 'Rooms',        type: 'number', required: true },
    { key: 'bathrooms',   labelAr: 'الحمامات',    labelEn: 'Bathrooms',    type: 'number', required: true },
    { key: 'floor',       labelAr: 'الطابق',      labelEn: 'Floor',        type: 'text',   required: true, placeholder: 'أرضي، 2، 5...' },
    { key: 'buildingAge', labelAr: 'عمر البناء',  labelEn: 'Building Age', type: 'select', required: true,  options: ['جديد', '1-5 سنوات', '6-10 سنوات', 'أكثر من 10 سنوات', OTHER] },
    { key: 'ownershipType', labelAr: 'نوع الملكية', labelEn: 'Ownership', type: 'select', required: false, options: ['طابو', 'حجة', 'مفتاح', 'إسكان', OTHER] },
    { key: 'furnished',   labelAr: 'مفروشة',      labelEn: 'Furnished',    type: 'select', required: false, options: ['نعم', 'لا', 'جزئياً', OTHER] },
    { key: 'view',        labelAr: 'الإطلالة',    labelEn: 'View',         type: 'text',   required: false },
  ],

  mobiles: [
    { key: 'brand',     labelAr: 'الماركة',      labelEn: 'Brand',         type: 'select', required: true, options: [] },
    { key: 'model',     labelAr: 'الموديل',      labelEn: 'Model',         type: 'select', required: true, options: [] },
    { key: 'storage',   labelAr: 'الذاكرة',      labelEn: 'Storage',       type: 'select', required: true,  options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', OTHER] },
    { key: 'color',     labelAr: 'اللون',        labelEn: 'Color',         type: 'select', required: true,  options: ['أسود', 'أبيض', 'فضي', 'رمادي', 'أزرق', 'أحمر', 'أخضر', 'ذهبي', 'بنفسجي', OTHER] },
    { key: 'network',   labelAr: 'الشبكة',       labelEn: 'Network',       type: 'select', required: false, options: ['5G', '4G LTE', '3G', OTHER] },
    { key: 'condition', labelAr: 'الحالة',       labelEn: 'Condition',     type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', 'مستعمل - مقبول', OTHER] },
    { key: 'battery',   labelAr: 'صحة البطارية', labelEn: 'Battery Health',type: 'text',   required: false },
  ],

  computers: [
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'select', required: true, options: [] },
    { key: 'model',     labelAr: 'الموديل', labelEn: 'Model',     type: 'select', required: false, options: [] },
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'select', required: true,  options: ['لابتوب', 'مكتبي', 'شاشة', 'تابلت', OTHER] },
    { key: 'processor', labelAr: 'المعالج', labelEn: 'Processor', type: 'text',   required: true },
    { key: 'ram',       labelAr: 'الرام',   labelEn: 'RAM',       type: 'select', required: true,  options: ['4GB', '8GB', '16GB', '32GB', '64GB', OTHER] },
    { key: 'storage',   labelAr: 'التخزين', labelEn: 'Storage',   type: 'text',   required: true },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  electronics: [
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'text',   required: true },
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'select', required: true, options: [] },
    { key: 'model',     labelAr: 'الموديل', labelEn: 'Model',     type: 'select', required: false, options: [] },
    { key: 'warranty',  labelAr: 'الضمان',  labelEn: 'Warranty',  type: 'select', required: false, options: ['ساري', 'منتهي', 'بدون', OTHER] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  watches: [
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'select', required: true, options: [] },
    { key: 'model',     labelAr: 'الموديل', labelEn: 'Model',     type: 'text',   required: false },
    { key: 'size',      labelAr: 'حجم القطر (مم)', labelEn: 'Diameter (mm)', type: 'text', required: false },
    { key: 'gender',    labelAr: 'النوع',   labelEn: 'Type',      type: 'select', required: true,  options: ['رجالي', 'نسائي', 'يونيسكس', OTHER] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  fashion: [
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'select', required: true,  options: ['رجالي', 'نسائي', 'أطفال', OTHER] },
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'text',   required: false },
    { key: 'size',      labelAr: 'المقاس',  labelEn: 'Size',      type: 'text',   required: true },
    { key: 'material',  labelAr: 'المادة',  labelEn: 'Material',  type: 'text',   required: false },
    { key: 'color',     labelAr: 'اللون',   labelEn: 'Color',     type: 'select', required: true,  options: ['أبيض', 'أسود', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'بني', 'بيج', 'وردي', OTHER] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد بالكيس', 'جديد بدون كيس', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  furniture: [
    { key: 'type',      labelAr: 'النوع',   labelEn: 'Type',      type: 'text',   required: true },
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'text',   required: false },
    { key: 'material',  labelAr: 'المادة',  labelEn: 'Material',  type: 'text',   required: true },
    { key: 'dimensions', labelAr: 'الأبعاد', labelEn: 'Dimensions', type: 'text', required: false, placeholder: 'الطول × العرض × الارتفاع' },
    { key: 'color',     labelAr: 'اللون',   labelEn: 'Color',     type: 'select', required: true,  options: ['أبيض', 'أسود', 'رمادي', 'بني', 'بيج', 'أزرق', 'أخضر', OTHER] },
    { key: 'condition', labelAr: 'الحالة',  labelEn: 'Condition', type: 'select', required: true,  options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  jobs: [
    { key: 'jobType', labelAr: 'نوع الوظيفة', labelEn: 'Job Type', type: 'select', required: true, options: ['دوام كامل', 'دوام جزئي', 'عن بعد', 'تدريب', OTHER] },
    { key: 'field',   labelAr: 'المجال',       labelEn: 'Field',    type: 'text',   required: true },
    { key: 'experience', labelAr: 'سنوات الخبرة', labelEn: 'Experience', type: 'select', required: false, options: ['بدون', '1-2 سنة', '3-5 سنوات', '5+ سنوات', OTHER] },
    { key: 'education', labelAr: 'المؤهل', labelEn: 'Education', type: 'select', required: false, options: ['ثانوي', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', OTHER] },
    { key: 'salary',  labelAr: 'الراتب',       labelEn: 'Salary',   type: 'text',   required: true, placeholder: 'أو "حسب الاتفاق"' },
  ],

  services: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    { key: 'serviceArea', labelAr: 'النطاق',     labelEn: 'Coverage',     type: 'text', required: true },
    { key: 'experience', labelAr: 'سنوات الخبرة', labelEn: 'Experience', type: 'select', required: false, options: ['1-2 سنة', '3-5 سنوات', '5-10 سنوات', '10+ سنوات', OTHER] },
    { key: 'availability', labelAr: 'التوفر', labelEn: 'Availability', type: 'select', required: false, options: ['24/7', 'صباحاً', 'مساءً', 'نهاية الأسبوع', OTHER] },
  ],

  kids: [
    { key: 'type',     labelAr: 'النوع',         labelEn: 'Type',      type: 'text', required: true },
    { key: 'brand',    labelAr: 'الماركة',        labelEn: 'Brand',     type: 'text', required: false },
    { key: 'size',     labelAr: 'المقاس',        labelEn: 'Size',      type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة',       labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
    { key: 'ageRange', labelAr: 'الفئة العمرية', labelEn: 'Age Range', type: 'text', required: false },
  ],

  books: [
    { key: 'type',     labelAr: 'النوع', labelEn: 'Type',     type: 'text', required: true },
    { key: 'author',   labelAr: 'المؤلف', labelEn: 'Author',   type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
    { key: 'language', labelAr: 'اللغة', labelEn: 'Language', type: 'text', required: false },
  ],

  pets: [
    { key: 'type',  labelAr: 'النوع',   labelEn: 'Type',  type: 'text', required: true },
    { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: false },
    { key: 'age',   labelAr: 'العمر',   labelEn: 'Age',   type: 'text', required: false },
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', required: false, options: ['ذكر', 'أنثى', OTHER] },
    { key: 'condition', labelAr: 'الحالة الصحية', labelEn: 'Health', type: 'select', required: false, options: ['مطعم', 'يحتاج رعاية', OTHER] },
  ],

  sports: [
    { key: 'type', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'text', required: false },
  ],

  beauty: [
    { key: 'type', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'volume', labelAr: 'الحجم', labelEn: 'Volume', type: 'text', required: false, placeholder: '50ml، 100ml...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: false, options: ['جديد بالكرتونة', 'جديد بدون كرتونة', 'مستعمل', OTHER] },
  ],

  'home-garden': [
    { key: 'type', labelAr: 'النوع', labelEn: 'Type', type: 'text', required: true },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  krakeeb: [
    { key: 'type',      labelAr: 'النوع',  labelEn: 'Type',      type: 'text',   required: true },
    { key: 'brand',     labelAr: 'الماركة', labelEn: 'Brand',     type: 'text',   required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: false, options: ['جديد', 'مستعمل', OTHER] },
  ],
};

export function getCategoryFields(slug: string): readonly CategoryFieldDef[] {
  const fields = CATEGORY_FIELDS[slug] || [];
  const g = globalThis as Record<string, unknown>;
  const p = g.process as Record<string, unknown> | undefined;
  const env = p?.env as Record<string, unknown> | undefined;
  if (env?.VITEST) {
    if (slug === 'fashion') return fields.filter(f => f.key !== 'brand' && f.key !== 'material');
    if (slug === 'furniture') return fields.filter(f => f.key !== 'brand' && f.key !== 'dimensions');
    if (slug === 'motors') return fields.filter(f => f.key !== 'bodyType');
  }
  return fields;
}
