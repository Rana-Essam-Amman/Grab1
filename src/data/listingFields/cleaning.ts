import type { CategoryFieldMap, ListingFieldOption } from './types';

const FREQUENCY_OPTIONS: ListingFieldOption[] = [
  { value: 'one_time', labelAr: 'زيارة لمرة واحدة (حسب الطلب)', labelEn: 'One-Time Visit' },
  { value: 'weekly', labelAr: 'اشتراك أسبوعي دوري', labelEn: 'Weekly Service' },
  { value: 'monthly', labelAr: 'اشتراك شهري', labelEn: 'Monthly Contract' },
  { value: 'daily', labelAr: 'يومي مستمر', labelEn: 'Daily Routine' },
];

const CLEANING_LANGUAGES: ListingFieldOption[] = [
  { value: 'arabic', labelAr: 'عربي', labelEn: 'Arabic' },
  { value: 'english', labelAr: 'إنجليزي (English)', labelEn: 'English' },
  { value: 'tagalog', labelAr: 'فلبيني (Tagalog)', labelEn: 'Tagalog' },
  { value: 'hindi_bengali', labelAr: 'هندي / بنغالي', labelEn: 'Hindi / Bengali' },
];

export const CLEANING_FIELDS: CategoryFieldMap = {
  homes: [
    { key: 'serviceType', labelAr: 'نوع تنظيف المنازل', labelEn: 'Cleaning Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'deep_cleaning', labelAr: 'تنظيف عميق وشامل لجميع الغرف والمطابخ', labelEn: 'Deep Cleaning' },
      { value: 'regular_hourly', labelAr: 'تنظيف دوري بالساعة وترتيب عام', labelEn: 'Regular Hourly Maid' },
      { value: 'move_in_out', labelAr: 'تنظيف قبل الانتقال أو بعد الرحيل', labelEn: 'Move In / Move Out' },
      { value: 'party_cleanup', labelAr: 'تنظيف بعد العزائم والحفلات', labelEn: 'Post-Party Cleanup' },
    ]},
    { key: 'area', labelAr: 'مساحة المنزل التقريبية (م²)', labelEn: 'Area (m²)', type: 'number', required: false, placeholder: '150', placeholderAr: '150' },
    { key: 'frequency', labelAr: 'تكرار الخدمة', labelEn: 'Frequency', type: 'select', allowOther: true, required: false, options: FREQUENCY_OPTIONS },
    { key: 'staff', labelAr: 'عدد العاملات / العمال المتاحين', labelEn: 'Staff Count', type: 'number', required: false, placeholder: '2', placeholderAr: '2' },
    { key: 'durationHours', labelAr: 'المدة المقدرة للعمل (ساعات)', labelEn: 'Duration (Hours)', type: 'number', required: false, placeholder: '4', placeholderAr: '4' },
    { key: 'rate', labelAr: 'الأجرة أو السعر', labelEn: 'Rate', type: 'number', required: false, placeholder: '25', placeholderAr: '25' },
    { key: 'rateUnit', labelAr: 'طريقة احتساب الأجرة', labelEn: 'Rate Unit', type: 'select', allowOther: true, required: false, options: [
      { value: 'per_hour', labelAr: 'بالساعة (للعاملة)', labelEn: 'Per Hour' },
      { value: 'fixed_total', labelAr: 'سعر مقطوع وشامل للشقة كاملة', labelEn: 'Fixed Total Price' },
      { value: 'per_sqm', labelAr: 'بالمتر المربع', labelEn: 'Per m²' },
    ]},
    { key: 'suppliesIncluded', labelAr: 'تشمل مواد ومنظفات وماكينات التنظيف', labelEn: 'Supplies & Equipment Included', type: 'boolean', required: false },
    { key: 'experience', labelAr: 'سنوات الخبرة في المجال', labelEn: 'Experience (Years)', type: 'number', required: false, placeholder: '4', placeholderAr: '4' },
    { key: 'languages', labelAr: 'اللغات المتاحة للتواصل مع الكادر', labelEn: 'Staff Languages', type: 'select', allowOther: true, multiSelect: true, required: false, options: CLEANING_LANGUAGES },
    { key: 'additionalServices', labelAr: 'خدمات إضافية متوفرة', labelEn: 'Additional Services', type: 'select', allowOther: true, multiSelect: true, required: false, options: [
      { value: 'ironing', labelAr: 'كوي ملابس وترتيب خزائن', labelEn: 'Ironing & Wardrobe' },
      { value: 'oven_degrease', labelAr: 'تنظيف عميق وإزالة دهون الأفران والشفاطات', labelEn: 'Oven & Range Degrease' },
      { value: 'fridge_sterilize', labelAr: 'تعقيم وتنظيف الثلاجات', labelEn: 'Fridge Sterilization' },
      { value: 'balcony_wash', labelAr: 'غسيل وتعقيم البلكونات والشبابيك', labelEn: 'Balcony & Windows Wash' },
    ]},
  ],
  offices: [
    { key: 'serviceType', labelAr: 'نوع تنظيف الشركات والمكاتب', labelEn: 'Office Cleaning Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'daily_janitorial', labelAr: 'خدمة نظافة مكتبية يومية وضيافة', labelEn: 'Daily Janitorial' },
      { value: 'deep_sanitization', labelAr: 'تنظيف وتعقيم دوري شامل للمكاتب والسجاد', labelEn: 'Deep Office Sanitization' },
      { value: 'post_event_meeting', labelAr: 'تنظيف قاعات اجتماعات ومؤتمرات', labelEn: 'Meeting Hall Cleanup' },
    ]},
    { key: 'area', labelAr: 'مساحة المقر أو المكتب (م²)', labelEn: 'Office Area (m²)', type: 'number', required: false, placeholder: '250', placeholderAr: '250' },
    { key: 'frequency', labelAr: 'طبيعة التعاقد والتكرار', labelEn: 'Contract Frequency', type: 'select', allowOther: true, required: false, options: FREQUENCY_OPTIONS },
    { key: 'afterHoursAvailable', labelAr: 'إمكانية العمل خارج أوقات الدوام الرسمي (ليلاً)', labelEn: 'After-Hours / Night Shift Available', type: 'boolean', required: false },
    { key: 'suppliesIncluded', labelAr: 'تشمل تأمين المنظفات والمعدات الصناعية', labelEn: 'Supplies Included', type: 'boolean', required: false },
    { key: 'contractAvailable', labelAr: 'إمكانية توقيع عقود سنوية وإصدار فواتير ضريبية', labelEn: 'Tax Invoices & Annual Contracts', type: 'boolean', required: false },
    { key: 'staff', labelAr: 'عدد الكادر المخصص', labelEn: 'Staff Assigned', type: 'number', required: false, placeholder: '3', placeholderAr: '3' },
    { key: 'rate', labelAr: 'السعر أو قيمة العقد الشهري', labelEn: 'Rate / Contract Price', type: 'number', required: false, placeholder: '300', placeholderAr: '300' },
  ],
  'sofas-carpets': [
    { key: 'serviceType', labelAr: 'نوع المفروشات المستهدفة', labelEn: 'Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'living_room_sofa', labelAr: 'غسيل وتنشيف طقم كنب وصالونات', labelEn: 'Sofa & Upholstery Wash' },
      { value: 'carpet_rug_steam', labelAr: 'غسيل سجاد وموكيت بالبخار في الموقع', labelEn: 'Carpet Steam Wash' },
      { value: 'mattress_sterilize', labelAr: 'تنظيف وتعقيم مراتب النوم والأسرة من العثة', labelEn: 'Mattress Sanitization' },
      { value: 'curtains_steam', labelAr: 'غسيل ستائر بالبخار وهي معلقة', labelEn: 'Hanging Curtains Steam' },
      { value: 'car_seats', labelAr: 'تنظيف وتلميع مقاعد وفرش السيارات', labelEn: 'Car Seats Upholstery' },
    ]},
    { key: 'cleaningMethod', labelAr: 'طريقة وتقنية التنظيف', labelEn: 'Cleaning Method', type: 'select', allowOther: true, required: true, options: [
      { value: 'steam_injection_extraction', labelAr: 'حقن واستخلاص مع بخار حراري وماكينات سحب', labelEn: 'Steam Injection / Extraction' },
      { value: 'dry_foam', labelAr: 'تنظيف بالرغوة الجافة (Dry Foam Fast Dry)', labelEn: 'Dry Foam (Fast Dry)' },
      { value: 'shampoo_deep_scrub', labelAr: 'فرك دوار بالماكينة وشامبو معطر', labelEn: 'Rotary Machine & Shampoo' },
    ]},
    { key: 'itemsCount', labelAr: 'عدد القطع أو المقاعد', labelEn: 'Items / Seats Count', type: 'number', required: false, placeholder: '7', placeholderAr: '7' },
    { key: 'dryingTimeHours', labelAr: 'وقت الجفاف المقدر (ساعات)', labelEn: 'Drying Time (Hours)', type: 'number', required: false, placeholder: '2', placeholderAr: '2' },
    { key: 'suppliesIncluded', labelAr: 'تشمل مواد التعقيم وإزالة البقع والروائح', labelEn: 'Stain & Odor Removal Included', type: 'boolean', required: false },
    { key: 'rate', labelAr: 'السعر الإجمالي أو بالقطعة', labelEn: 'Rate', type: 'number', required: false, placeholder: '35', placeholderAr: '35' },
  ],
  'water-tanks': [
    { key: 'tankType', labelAr: 'نوع وموقع الخزان', labelEn: 'Tank Type & Location', type: 'select', allowOther: true, required: true, options: [
      { value: 'roof_polyethylene', labelAr: 'خزان علوي بلاستيك / بولي إيثيلين', labelEn: 'Rooftop Plastic Tank' },
      { value: 'underground_concrete', labelAr: 'خزان أرضي خرساني / بئر ماء', labelEn: 'Underground Concrete Tank / Well' },
      { value: 'fiberglass', labelAr: 'خزان فايبر جلاس', labelEn: 'Fiberglass Tank' },
    ]},
    { key: 'serviceType', labelAr: 'نوع الصيانة والخدمة المطلوبة', labelEn: 'Service Needed', type: 'select', allowOther: true, required: true, options: [
      { value: 'wash_sterilize_chlorine', labelAr: 'غسيل وتعقيم بالكلور وإزالة الرواسب والطحالب', labelEn: 'Wash & Chlorine Sterilization' },
      { value: 'waterproofing_insulation', labelAr: 'عزل مائي وإيبوكسي لمنع التسريب', labelEn: 'Waterproofing & Epoxy' },
      { value: 'leak_repair_float', labelAr: 'صيانة وتغيير عوامة ومحابس ومضخات', labelEn: 'Leak Repair & Float Valve' },
    ]},
    { key: 'tankCapacityLiters', labelAr: 'سعة الخزان التقريبية (لتر أو متر مكعب)', labelEn: 'Capacity (Liters)', type: 'number', required: false, placeholder: '2000', placeholderAr: '2000' },
    { key: 'suppliesIncluded', labelAr: 'تشمل مضخة سحب ومواد التعقيم المصرح بها', labelEn: 'Pumps & Approved Disinfectants', type: 'boolean', required: false },
    { key: 'rate', labelAr: 'تكلفة تنظيف الخزان', labelEn: 'Cleaning Cost', type: 'number', required: false, placeholder: '20', placeholderAr: '20' },
  ],
  pools: [
    { key: 'poolType', labelAr: 'نوع المسبح', labelEn: 'Pool Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'villa_private', labelAr: 'مسبح فيلا / شاليه خاص', labelEn: 'Private Villa / Chalet Pool' },
      { value: 'commercial_resort', labelAr: 'مسبح فندق أو منتجع تجاري', labelEn: 'Commercial / Resort Pool' },
      { value: 'overflow_skimmer', labelAr: 'مسبح أوفر فلو أو سكيمر', labelEn: 'Overflow / Skimmer Pool' },
    ]},
    { key: 'serviceType', labelAr: 'الخدمة المطلوبة', labelEn: 'Service Required', type: 'select', allowOther: true, required: true, options: [
      { value: 'full_drain_acid_wash', labelAr: 'تفريغ كامل وغسيل بالأسيد وجلي البلاط', labelEn: 'Full Drain & Acid Wash' },
      { value: 'chemical_balance', labelAr: 'وزن كيماويات (كلور، PH، مانع طحالب)', labelEn: 'Chemical Balancing' },
      { value: 'filter_sand_pump', labelAr: 'صيانة وتغيير رمل الفلاتر والمضخات', labelEn: 'Filter Sand & Pump Service' },
      { value: 'routine_vacuum', labelAr: 'شفط أرضيات دوري وإزالة شوائب', labelEn: 'Routine Vacuuming & Cleaning' },
    ]},
    { key: 'frequency', labelAr: 'التكرار', labelEn: 'Frequency', type: 'select', allowOther: true, required: false, options: FREQUENCY_OPTIONS },
    { key: 'suppliesIncluded', labelAr: 'تشمل توريد مواد الكلور والكيماويات', labelEn: 'Chemicals & Supplies Included', type: 'boolean', required: false },
    { key: 'rate', labelAr: 'السعر للزيارة أو العقد', labelEn: 'Rate', type: 'number', required: false, placeholder: '50', placeholderAr: '50' },
  ],
  'post-construction': [
    { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'apartment', labelAr: 'شقة سكنية جديدة بعد التشطيب', labelEn: 'New Apartment' },
      { value: 'villa_standalone', labelAr: 'فيلا مستقلة / قصر', labelEn: 'Villa / Palace' },
      { value: 'commercial_building', labelAr: 'مبنى تجاري / مجمع مكاتب / معرض', labelEn: 'Commercial Building / Showroom' },
    ]},
    { key: 'area', labelAr: 'المساحة الإجمالية للمبنى (م²)', labelEn: 'Total Area (m²)', type: 'number', required: true, placeholder: '200', placeholderAr: '200' },
    { key: 'debrisRemoval', labelAr: 'تشمل إزالة مخلفات البناء والجبس والأتربة الخشنة', labelEn: 'Debris Removal Included', type: 'boolean', required: false },
    { key: 'polishingIncluded', labelAr: 'تشمل جلي وتلميع البلاط والرخام بالصاروخ وماكينات الجلي', labelEn: 'Floor Machine Polishing Included', type: 'boolean', required: false },
    { key: 'staff', labelAr: 'عدد عمال الورشة', labelEn: 'Staff Crew Size', type: 'number', required: false, placeholder: '5', placeholderAr: '5' },
    { key: 'durationDays', labelAr: 'المدة المقدرة للإنجاز (أيام)', labelEn: 'Estimated Days', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'rate', labelAr: 'السعر الإجمالي للورشة', labelEn: 'Total Job Price', type: 'number', required: false, placeholder: '150', placeholderAr: '150' },
  ],
  'windows-facades': [
    { key: 'facadeType', labelAr: 'نوع الواجهة الخارجية', labelEn: 'Facade Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'glass_curtain_wall', labelAr: 'واجهات زجاجية واستركشر (Glass Facade)', labelEn: 'Glass Facade' },
      { value: 'stone_facade', labelAr: 'حجر طبيعي / رملي مع قذف مائي أو رملي', labelEn: 'Stone Facade (Hydro / Sandblast)' },
      { value: 'composite_alucobond', labelAr: 'كلادينج وألكوبوند معالج', labelEn: 'Alucobond / Cladding' },
    ]},
    { key: 'buildingHeightFloors', labelAr: 'عدد طوابق المبنى / الارتفاع', labelEn: 'Floors Count / Height', type: 'number', required: false, placeholder: '4', placeholderAr: '4' },
    { key: 'craneSafetyEquipped', labelAr: 'مجهز بسقالات / ونش وسبايدر مع معدات سلامة معتمدة', labelEn: 'Equipped with Cranes / Spider / Scaffolds', type: 'boolean', required: false },
    { key: 'rate', labelAr: 'السعر المقدر للعمل', labelEn: 'Rate', type: 'number', required: false, placeholder: '100', placeholderAr: '100' },
    { key: 'rateUnit', labelAr: 'طريقة الحساب', labelEn: 'Rate Unit', type: 'select', allowOther: true, required: false, options: [
      { value: 'per_sqm', labelAr: 'بالمتر المربع للواجهة', labelEn: 'Per m²' },
      { value: 'per_floor', labelAr: 'لكل طابق', labelEn: 'Per Floor' },
      { value: 'fixed_total', labelAr: 'مقطوعية كاملة للمبنى', labelEn: 'Lump Sum Fixed' },
    ]},
  ],
};
