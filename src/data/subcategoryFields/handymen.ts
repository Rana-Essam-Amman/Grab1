import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';

const COVERAGE: CategoryFieldDef = {
  key: 'coverageArea',
  labelAr: 'منطقة التغطية',
  labelEn: 'Coverage Area',
  type: 'text',
  required: true,
  placeholder: 'مثال: عمّان - عبدون، خلدا، تلاع العلي',
};

const AVAILABILITY: CategoryFieldDef = {
  key: 'availability',
  labelAr: 'التوفر',
  labelEn: 'Availability',
  type: 'select',
  required: true,
  options: ['فوري', 'خلال 24 ساعة', 'حسب الموعد', 'طوارئ 24/7', OTHER],
};

const EXPERIENCE: CategoryFieldDef = {
  key: 'experience',
  labelAr: 'سنوات الخبرة',
  labelEn: 'Experience',
  type: 'select',
  required: true,
  options: ['أقل من سنة', '1-3 سنوات', '3-5 سنوات', '5-10 سنوات', '10+ سنوات', OTHER],
};

const MATERIALS_OWNER: CategoryFieldDef = {
  key: 'materialsIncluded',
  labelAr: 'المواد',
  labelEn: 'Materials',
  type: 'select',
  required: true,
  options: ['الفني يوفر المواد', 'العميل يوفر المواد', 'حسب الاتفاق', OTHER],
};

const WARRANTY: CategoryFieldDef = {
  key: 'warranty',
  labelAr: 'الضمان',
  labelEn: 'Warranty',
  type: 'select',
  required: false,
  options: ['لا يوجد', 'أسبوع', 'شهر', '3 أشهر', '6 أشهر', 'سنة', OTHER],
};

const baseJob = (extra: readonly CategoryFieldDef[]): readonly CategoryFieldDef[] => [
  ...extra,
  COVERAGE,
  AVAILABILITY,
  EXPERIENCE,
  MATERIALS_OWNER,
  WARRANTY,
];

export const HANDYMEN_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {
  electrician: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['تركيب وتوصيلات', 'إصلاح أعطال', 'لوحات كهرباء', 'إنارة ديكورية', 'كهرباء صناعية', 'تأسيس كامل', OTHER] },
    { key: 'emergency', labelAr: 'خدمة طوارئ', labelEn: 'Emergency Service', type: 'select', required: false, options: ['نعم 24/7', 'نعم، خلال النهار', 'لا', OTHER] },
  ]),
  plumber: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['تسليك مجاري', 'تركيب أدوات صحية', 'كشف تسريبات', 'تأسيس حمامات', 'تمديد مواسير', 'سخانات', OTHER] },
    { key: 'emergency', labelAr: 'خدمة طوارئ', labelEn: 'Emergency Service', type: 'select', required: false, options: ['نعم 24/7', 'نعم، خلال النهار', 'لا', OTHER] },
    { key: 'detectionEquipment', labelAr: 'جهاز كشف التسريبات', labelEn: 'Leak Detection Equipment', type: 'select', required: false, options: ['متوفر', 'غير متوفر', OTHER] },
  ]),
  carpenter: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['مطابخ', 'خزائن وأبواب', 'غرف نوم', 'أثاث مكتبي', 'ديكور خشبي', 'ترميم', OTHER] },
    { key: 'workshop', labelAr: 'مكان العمل', labelEn: 'Workshop Location', type: 'select', required: false, options: ['في موقع العميل', 'في الورشة', 'الاثنين', OTHER] },
  ]),
  painter: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['دهان داخلي', 'دهان خارجي', 'ديكورات جبسية', 'ورق جدران', 'دهان صناعي', OTHER] },
    { key: 'paintType', labelAr: 'نوع الدهان', labelEn: 'Paint Type', type: 'select', required: false, options: ['بلاستيك', 'زيتي', 'مائي', 'ديكوري', OTHER] },
  ]),
  blacksmith: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['أبواب وشبابيك', 'دربزين وحمايات', 'ستائر حديد', 'هياكل', 'لحام', 'حدادة فنية', OTHER] },
    { key: 'weldingType', labelAr: 'نوع اللحام', labelEn: 'Welding Type', type: 'select', required: false, options: ['كهرباء', 'أوكسي أسيتيلين', 'MIG', 'TIG', OTHER] },
  ]),
  'ac-technician': baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['تركيب مكيفات', 'صيانة وتنظيف', 'تعبئة فريون', 'فك ونقل', 'تمديد نحاس', 'مكيفات مركزية', OTHER] },
    { key: 'acTypes', labelAr: 'أنواع المكيفات', labelEn: 'AC Types', type: 'text', required: false, placeholder: 'مثال: سبليت، مركزي، شباك' },
    { key: 'emergency', labelAr: 'خدمة طوارئ', labelEn: 'Emergency Service', type: 'select', required: false, options: ['نعم 24/7', 'نعم، خلال النهار', 'لا', OTHER] },
  ]),
  aluminum: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['شبابيك', 'أبواب', 'مطابخ', 'واجهات زجاج', 'كابينة شور', 'درابزين', OTHER] },
    { key: 'glassIncluded', labelAr: 'شامل الزجاج', labelEn: 'Includes Glass', type: 'select', required: false, options: ['نعم', 'لا', 'حسب الطلب', OTHER] },
  ]),
  gypsum: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['أسقف جبس', 'ديكورات جدارية', 'قواطع', 'إضاءة مخفية', 'جبس بورد', OTHER] },
    { key: 'designIncluded', labelAr: 'التصميم', labelEn: 'Design', type: 'select', required: false, options: ['مشترك', 'حسب العميل', 'بدون تصميم', OTHER] },
  ]),
  'tiles-marble': baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['تركيب بلاط', 'تركيب رخام', 'جلي وتلميع', 'سيراميك', 'حمامات ومطابخ', OTHER] },
    { key: 'polishing', labelAr: 'خدمة الجلي', labelEn: 'Polishing Service', type: 'select', required: false, options: ['نعم متوفر', 'لا', OTHER] },
  ]),
  'appliance-repair': baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['غسالات', 'ثلاجات', 'فريزرات', 'ميكروويف', 'أفران', 'غسالات صحون', 'أجهزة مطبخ صغيرة', OTHER] },
    { key: 'brands', labelAr: 'الماركات', labelEn: 'Brands', type: 'text', required: false, placeholder: 'مثال: LG، Samsung، Bosch' },
    { key: 'homeService', labelAr: 'خدمة منزلية', labelEn: 'Home Service', type: 'select', required: false, options: ['نعم', 'بالورشة فقط', OTHER] },
  ]),
  locksmith: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['فتح أبواب', 'تركيب أقفال', 'تغيير مفاتيح', 'خزائن', 'سيارات', 'أبواب مصفحة', OTHER] },
    { key: 'emergency', labelAr: 'طوارئ', labelEn: 'Emergency', type: 'select', required: true, options: ['نعم 24/7', 'نعم، خلال النهار', 'لا', OTHER] },
  ]),
  glass: baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['زجاج شبابيك', 'أبواب زجاج', 'مرايا', 'كابينة شور', 'واجهات', 'زجاج سيكوريت', OTHER] },
    { key: 'measurement', labelAr: 'القيايس', labelEn: 'Measurement', type: 'select', required: false, options: ['نعم، مجاناً', 'بأجرة', 'العميل يوفر', OTHER] },
  ]),
  'furniture-assembly': baseJob([
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'select', required: true, options: ['فك وتركيب أثاث', 'تركيب مطابخ', 'تركيب خزائن', 'تركيب غرف نوم', 'نقل أثاث', OTHER] },
    { key: 'disassemblyIncluded', labelAr: 'الفك مشمول', labelEn: 'Disassembly Included', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
  ]),
  general: baseJob([
    { key: 'taskType', labelAr: 'نوع المهمة', labelEn: 'Task Type', type: 'text', required: true, placeholder: 'اكتب وصف مختصر' },
    { key: 'toolsOwned', labelAr: 'الأدوات', labelEn: 'Tools', type: 'select', required: false, options: ['الفني يوفر', 'العميل يوفر', OTHER] },
  ]),
};
