import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';

const COVERAGE = (isAr: boolean, ph: string): CategoryFieldDef => ({
  key: 'coverageArea',
  labelAr: 'منطقة التغطية',
  labelEn: 'Coverage Area',
  type: 'text',
  required: true,
  placeholder: ph,
});

const AVAILABILITY: CategoryFieldDef = {
  key: 'availability',
  labelAr: 'التوفر',
  labelEn: 'Availability',
  type: 'select',
  required: true,
  options: ['فوري', 'خلال 24 ساعة', 'خلال 3 أيام', 'حسب الاتفاق', OTHER],
};

const MATERIALS: CategoryFieldDef = {
  key: 'materialsIncluded',
  labelAr: 'المواد مشمولة',
  labelEn: 'Materials Included',
  type: 'select',
  required: true,
  options: ['نعم، كاملة', 'لا، على العميل', 'حسب الاتفاق', OTHER],
};

const EXPERIENCE: CategoryFieldDef = {
  key: 'experience',
  labelAr: 'سنوات الخبرة',
  labelEn: 'Experience',
  type: 'select',
  required: false,
  options: ['أقل من سنة', '1-3 سنوات', '3-5 سنوات', '5-10 سنوات', '10+ سنوات', OTHER],
};

export const CLEANING_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {
  homes: [
    { key: 'homeType', labelAr: 'نوع المسكن', labelEn: 'Home Type', type: 'select', required: true, options: ['شقة', 'فيلا', 'استوديو', 'دوبلكس', OTHER] },
    { key: 'roomsCount', labelAr: 'عدد الغرف', labelEn: 'Rooms', type: 'number', required: true },
    { key: 'serviceScope', labelAr: 'نطاق الخدمة', labelEn: 'Service Scope', type: 'select', required: true, options: ['تنظيف كامل', 'تنظيف دوري (أسبوعي)', 'تنظيف دوري (شهري)', 'تنظيف عام قبل الانتقال', OTHER] },
    MATERIALS,
    COVERAGE(false, 'مثال: عمّان - عبدون، خلدا'),
    AVAILABILITY,
    EXPERIENCE,
  ],
  offices: [
    { key: 'officeType', labelAr: 'نوع المكان', labelEn: 'Place Type', type: 'select', required: true, options: ['مكتب إداري', 'عيادة', 'مطعم/كافيه', 'محل تجاري', 'مستودع', 'مدرسة/حضانة', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'frequency', labelAr: 'التكرار', labelEn: 'Frequency', type: 'select', required: true, options: ['يومي', 'أسبوعي', 'شهري', 'لمرة واحدة', OTHER] },
    MATERIALS,
    COVERAGE(false, 'مثال: عمّان - العبدلي، الشميساني'),
    AVAILABILITY,
  ],
  'sofas-carpets': [
    { key: 'itemTypes', labelAr: 'القطع', labelEn: 'Items', type: 'text', required: true, placeholder: 'مثال: كنبة 3 مقاعد، سجاد 4×3' },
    { key: 'quantity', labelAr: 'العدد', labelEn: 'Quantity', type: 'number', required: true },
    { key: 'method', labelAr: 'طريقة التنظيف', labelEn: 'Method', type: 'select', required: true, options: ['بخار', 'ماء ورغوة', 'تنظيف جاف', 'حسب النوع', OTHER] },
    { key: 'onSite', labelAr: 'الموقع', labelEn: 'On Site', type: 'select', required: true, options: ['في الموقع', 'يؤخذ ويُرجع', 'الاثنين', OTHER] },
    { key: 'pickupFee', labelAr: 'أجرة النقل', labelEn: 'Pickup Fee', type: 'select', required: false, options: ['مشمولة', 'منفصلة', 'حسب المنطقة', OTHER] },
    COVERAGE(false, 'مثال: عمّان - كامل العاصمة'),
    AVAILABILITY,
  ],
  'water-tanks': [
    { key: 'tankType', labelAr: 'نوع الخزان', labelEn: 'Tank Type', type: 'select', required: true, options: ['خزان أرضي', 'خزان علوي', 'خزان بلاستيك', 'خزان حجر', OTHER] },
    { key: 'capacity', labelAr: 'السعة (م³)', labelEn: 'Capacity (m³)', type: 'number', required: true },
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'select', required: true, options: ['تنظيف فقط', 'تنظيف وتعقيم', 'تعقيم فقط', OTHER] },
    { key: 'pumpIncluded', labelAr: 'شامل المضخات', labelEn: 'Includes Pumps', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
    COVERAGE(false, 'مثال: عمّان، إربد، الزرقاء'),
    AVAILABILITY,
  ],
  pools: [
    { key: 'poolType', labelAr: 'نوع المسبح', labelEn: 'Pool Type', type: 'select', required: true, options: ['خاص', 'تجاري', 'نادي', 'فندق', OTHER] },
    { key: 'size', labelAr: 'الحجم التقريبي (م³)', labelEn: 'Approx Size (m³)', type: 'number', required: true },
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'select', required: true, options: ['تنظيف شامل', 'صيانة دورية', 'تنظيف + معالجة كيميائية', 'تفريغ وإعادة تعبئة', OTHER] },
    { key: 'frequency', labelAr: 'التكرار', labelEn: 'Frequency', type: 'select', required: true, options: ['لمرة واحدة', 'أسبوعي', 'شهري', 'موسمي', OTHER] },
    MATERIALS,
    COVERAGE(false, 'مثال: عمّان والمناطق القريبة'),
    AVAILABILITY,
  ],
  'post-construction': [
    { key: 'spaceType', labelAr: 'نوع المكان', labelEn: 'Space Type', type: 'select', required: true, options: ['شقة جديدة', 'فيلا', 'مكتب', 'محل تجاري', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'debrisRemoval', labelAr: 'إزالة المخلفات', labelEn: 'Debris Removal', type: 'select', required: true, options: ['نعم، مشمول', 'لا، منفصل', OTHER] },
    { key: 'durationDays', labelAr: 'المدة المتوقعة (أيام)', labelEn: 'Expected Duration (days)', type: 'number', required: false },
    MATERIALS,
    COVERAGE(false, 'مثال: عمّان - كامل العاصمة'),
    AVAILABILITY,
  ],
  'windows-facades': [
    { key: 'facadeType', labelAr: 'نوع الواجهة', labelEn: 'Facade Type', type: 'select', required: true, options: ['زجاج', 'ألمنيوم', 'حجر', 'رخام', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'floorsCount', labelAr: 'عدد الطوابق', labelEn: 'Floors Count', type: 'number', required: true },
    { key: 'safetyGear', labelAr: 'معدات السلامة', labelEn: 'Safety Gear', type: 'select', required: true, options: ['متوفرة', 'غير متوفرة', OTHER] },
    MATERIALS,
    COVERAGE(false, 'مثال: عمّان والمناطق المجاورة'),
    AVAILABILITY,
  ],
};
