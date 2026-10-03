import type { CategoryFieldMap, ListingFieldOption, ListingField } from './types';

const HANDYMAN_AVAILABILITY: ListingFieldOption[] = [
  { value: '24_7', labelAr: '24 ساعة طوال أيام الأسبوع (طوارئ فوري)', labelEn: '24/7 Emergency' },
  { value: 'daytime', labelAr: 'أوقات الدوام النهاري المعتاد', labelEn: 'Daytime Business Hours' },
  { value: 'evenings_weekends', labelAr: 'مسائي وعطل نهاية الأسبوع', labelEn: 'Evenings & Weekends' },
  { value: 'by_appointment', labelAr: 'حسب الحجز والموعد المسبق', labelEn: 'By Appointment' },
];

const HANDYMAN_RATE_UNITS: ListingFieldOption[] = [
  { value: 'per_visit', labelAr: 'كشفية زيارة فحص', labelEn: 'Per Visit / Inspection' },
  { value: 'per_hour', labelAr: 'أجرة بالساعة', labelEn: 'Hourly' },
  { value: 'fixed_job', labelAr: 'مقطوعية حسب العمل', labelEn: 'Fixed Job Rate' },
  { value: 'per_meter', labelAr: 'بالمتر المربع / الطولي', labelEn: 'Per Meter' },
];

const HANDYMAN_WARRANTY: ListingFieldOption[] = [
  { value: '30_days', labelAr: 'ضمان شهر على العمل', labelEn: '30 Days Warranty' },
  { value: '3_months', labelAr: 'ضمان 3 أشهر', labelEn: '3 Months Warranty' },
  { value: '6_months_plus', labelAr: 'ضمان 6 أشهر إلى سنة', labelEn: '6 Months - 1 Year' },
  { value: 'no_warranty', labelAr: 'بدون ضمان إضافي', labelEn: 'No Warranty' },
];

const HANDYMAN_LANGUAGES: ListingFieldOption[] = [
  { value: 'arabic', labelAr: 'اللغة العربية', labelEn: 'Arabic' },
  { value: 'english', labelAr: 'اللغة الإنجليزية', labelEn: 'English' },
  { value: 'urdu_hindi', labelAr: 'أوردو / هندي', labelEn: 'Urdu / Hindi' },
];

const HANDYMAN_TOOLS: ListingFieldOption[] = [
  { value: 'complete_pro_kit', labelAr: 'حقيبة عدة يدوية وكهربائية احترافية كاملة', labelEn: 'Complete Pro Tool Kit' },
  { value: 'heavy_machinery', labelAr: 'ماكينات ومعدات ثقيلة وهيلتي وقصاصات', labelEn: 'Heavy Machinery / Rotary' },
  { value: 'diagnostic_testers', labelAr: 'أجهزة فحص وكشف إلكترونية وليزر', labelEn: 'Laser & Electronic Testers' },
  { value: 'ladders_scaffolding', labelAr: 'سلالم وسقالات عمل بارتفاعات عالية', labelEn: 'Ladders & Scaffolding' },
];

function createHandymanFields(
  specialtyKey: string,
  specialtyLabelAr: string,
  specialtyLabelEn: string,
  serviceOptions: ListingFieldOption[]
): readonly ListingField[] {
  return [
    { key: specialtyKey, labelAr: specialtyLabelAr, labelEn: specialtyLabelEn, type: 'select', allowOther: true, multiSelect: true, required: true, options: serviceOptions },
    { key: 'yearsExperience', labelAr: 'سنوات الخبرة العملية', labelEn: 'Years of Experience', type: 'number', required: true, placeholder: '5', placeholderAr: '5' },
    { key: 'serviceRadius', labelAr: 'نطاق التغطية الجغرافية (كم)', labelEn: 'Service Radius (km)', type: 'number', required: false, placeholder: '20', placeholderAr: '20' },
    { key: 'availability', labelAr: 'أوقات العمل وجاهزية الزيارة', labelEn: 'Availability', type: 'select', allowOther: true, required: true, options: HANDYMAN_AVAILABILITY },
    { key: 'emergency', labelAr: 'استجابة سريعة لحالات الطوارئ (خلال ساعة)', labelEn: 'Emergency Fast Response', type: 'boolean', required: false },
    { key: 'rate', labelAr: 'سعر الكشفية أو الأجرة المبدئية', labelEn: 'Inspection / Base Rate', type: 'number', required: false, placeholder: '15', placeholderAr: '15' },
    { key: 'rateUnit', labelAr: 'طريقة الحساب', labelEn: 'Rate Unit', type: 'select', allowOther: true, required: false, options: HANDYMAN_RATE_UNITS },
    { key: 'suppliesIncluded', labelAr: 'إمكانية تأمين القطع والمواد اللازمة للعمل', labelEn: 'Can Supply Parts & Materials', type: 'boolean', required: false },
    { key: 'warranty', labelAr: 'ضمان جودة العمل', labelEn: 'Workmanship Warranty', type: 'select', allowOther: true, required: false, options: HANDYMAN_WARRANTY },
    { key: 'licensed', labelAr: 'فني معتمد أو مؤسسة رسمية مرخصة', labelEn: 'Licensed / Certified Professional', type: 'boolean', required: false },
    { key: 'insured', labelAr: 'تأمين مسؤولية مهنية متوفر', labelEn: 'Insured', type: 'boolean', required: false },
    { key: 'toolsOwned', labelAr: 'المعدات والأجهزة المتوفرة لدى الفني', labelEn: 'Equipment & Tools Available', type: 'select', allowOther: true, multiSelect: true, required: false, options: HANDYMAN_TOOLS },
    { key: 'languages', labelAr: 'اللغات', labelEn: 'Languages', type: 'select', allowOther: true, multiSelect: true, required: false, options: HANDYMAN_LANGUAGES },
    { key: 'minBooking', labelAr: 'الحد الأدنى لقيمة الطلب', labelEn: 'Minimum Job Value', type: 'number', required: false, placeholder: '10', placeholderAr: '10' },
    { key: 'previousProjects', labelAr: 'أبرز الأعمال السابقة والمشاريع', labelEn: 'Past Projects & Experience', type: 'text', required: false, placeholder: 'Villas, Commercial buildings, Maintenance...', placeholderAr: 'مثال: فلل سكنية، مجمعات تجارية، صيانة دورية...' },
    { key: 'certifications', labelAr: 'الشهادات والدورات المهنية', labelEn: 'Certifications & Diplomas', type: 'text', required: false, placeholder: 'Technical diploma, Safety certs...', placeholderAr: 'شهادات مزاولة المهنة والتدريب...' },
    { key: 'acceptsRemote', labelAr: 'تقديم استشارات فنية هاتفية قبل الزيارة', labelEn: 'Phone / Remote Consultation', type: 'boolean', required: false },
  ];
}

export const HANDYMEN_FIELDS: CategoryFieldMap = {
  electrician: createHandymanFields('serviceType', 'نوع الأعمال الكهربائية', 'Electrical Service', [
    { value: 'wiring_circuits', labelAr: 'تمديدات كهربائية وتأسيس منازل بالكامل', labelEn: 'Full Wiring & Sockets' },
    { value: 'breaker_panels', labelAr: 'صيانة وتغيير لوحات وقواطع الكهرباء والفيوزات', labelEn: 'Circuit Breakers & Panels' },
    { value: 'lighting_chandeliers', labelAr: 'تركيب ثريات وإضاءة مخفية ولدات وسبوت لايت', labelEn: 'Chandeliers & LED Lighting' },
    { value: 'short_circuit_repair', labelAr: 'كشف وإصلاح الشورت والتماس الكهربائي', labelEn: 'Short Circuit Diagnostics' },
    { value: 'generator_solar', labelAr: 'أنظمة طاقة شمسية ومولدات كهرباء وUPS', labelEn: 'Solar & Generator Systems' },
    { value: 'intercom_cctv', labelAr: 'تركيب إنتركام وكاميرات مراقبة وأقفال ذكية', labelEn: 'Intercom & Smart Locks' },
  ]),
  plumber: createHandymanFields('serviceType', 'نوع الأعمال الصحية والسباكة', 'Plumbing Service', [
    { value: 'leak_detection_repair', labelAr: 'كشف تسربات المياه وإصلاح المواسير بالجهاز', labelEn: 'Leak Detection & Pipe Repair' },
    { value: 'sanitary_installation', labelAr: 'تركيب وصيانة أطقم حمامات ومغاسل وشاورات', labelEn: 'Sanitary & Faucets Install' },
    { value: 'water_heaters_boilers', labelAr: 'تركيب وصيانة سخانات شمسية وكهربائية وبويلرات', labelEn: 'Water Heaters & Solar Boilers' },
    { value: 'pumps_tanks', labelAr: 'تركيب وتصليح مضخات مياه ودينامو وفلاتر', labelEn: 'Water Pumps & Filtration' },
    { value: 'drain_unclogging', labelAr: 'تسليك مجاري وبالوعات بأحدث الماكينات', labelEn: 'Drain Unclogging' },
    { value: 'underfloor_heating', labelAr: 'تمديد وصيانة تدفئة مركزية وتحت البلاط', labelEn: 'Underfloor & Central Heating' },
  ]),
  carpenter: createHandymanFields('serviceType', 'نوع أعمال النجارة والأخشاب', 'Carpentry Service', [
    { value: 'doors_locks_repair', labelAr: 'صيانة وتركيب أبواب خشب وأقفال وكوالين', labelEn: 'Doors & Locks Repair' },
    { value: 'kitchen_cabinets', labelAr: 'تفصيل وصيانة وتعديل مطابخ خشب ولامينيت', labelEn: 'Kitchen Cabinets Fitting' },
    { value: 'custom_furniture', labelAr: 'تفصيل غرف نوم وخزائن حائط ودواليب ملابس', labelEn: 'Custom Closets & Bedroom' },
    { value: 'wood_polishing', labelAr: 'دهان وصنفرة وتلميع وتجديد الأخشاب والأثاث', labelEn: 'Wood Polishing & Refinishing' },
    { value: 'flooring_parquet', labelAr: 'تركيب وصيانة أرضيات باركيه وخشبية', labelEn: 'Parquet Flooring' },
    { value: 'pergolas_decor', labelAr: 'برجولات وديكورات خشبية جدارية وحدائق', labelEn: 'Pergolas & Wood Decor' },
  ]),
  painter: createHandymanFields('serviceType', 'نوع أعمال الدهان والديكور', 'Painting Service', [
    { value: 'interior_painting', labelAr: 'دهان جدران وأسقف داخلية (إملشن / زياتي / جوتن)', labelEn: 'Interior Wall Painting' },
    { value: 'exterior_facades', labelAr: 'دهانات واجهات خارجية وربر مقاوم للعوامل الجوية', labelEn: 'Exterior Facade Painting' },
    { value: 'damp_moisture_treatment', labelAr: 'معالجة الرطوبة والنش والتقشير والشروخ', labelEn: 'Dampness & Crack Treatment' },
    { value: 'wallpaper_installation', labelAr: 'تركيب ورق جدران وبديل رخام وبديل خشب', labelEn: 'Wallpaper & Fluted Panels' },
    { value: 'decorative_effects', labelAr: 'دهانات ديكورية خاصة (مخملي / ستوكو / فيلفت)', labelEn: 'Decorative Stucco & Velvet' },
    { value: 'epoxy_flooring', labelAr: 'دهان أرضيات إيبوكسي للمستودعات والكراجات', labelEn: 'Epoxy Floor Coating' },
  ]),
  blacksmith: createHandymanFields('serviceType', 'نوع أعمال الحدادة واللحام', 'Blacksmith Service', [
    { value: 'security_doors_gates', labelAr: 'تصنيع وصيانة أبواب حديد رئيسية وحمايات شبابيك', labelEn: 'Security Doors & Window Grills' },
    { value: 'railings_stairs', labelAr: 'درابزين حديد للدرج والبلكونات والأسوار', labelEn: 'Stair Railings & Fences' },
    { value: 'shading_canopies', labelAr: 'مظلات مواقف سيارات وهياكل حديد كيربي وقرميد', labelEn: 'Car Shades & Metal Canopies' },
    { value: 'welding_repair_onsite', labelAr: 'لحام فوري بالموقع وصيانة مفصلات ومزالج', labelEn: 'Mobile Onsite Welding' },
  ]),
  'ac-technician': createHandymanFields('acType', 'خدمات التكييف والتبريد', 'HVAC Service', [
    { value: 'split_ac_install', labelAr: 'فك ونقل وتركيب مكيفات سبليت', labelEn: 'Split AC Installation' },
    { value: 'gas_recharge_freon', labelAr: 'تعبئة غاز فريون وكشف التسريب بالأجهزة', labelEn: 'Freon Gas Recharge & Leak Test' },
    { value: 'maintenance_cleaning', labelAr: 'غسيل وتنظيف الفلاتر والوحدات الداخلية والخارجية', labelEn: 'Deep Unit Wash & Sanitizing' },
    { value: 'compressor_board_repair', labelAr: 'إصلاح الكمبروسر والكارتة الإلكترونية والإنفرتر', labelEn: 'Compressor & Inverter Board' },
    { value: 'central_ac_duct', labelAr: 'صيانة تكييف مركزي ومجاري هواء (Duct)', labelEn: 'Central HVAC & Duct' },
  ]),
  aluminum: createHandymanFields('workType', 'أعمال الألمنيوم والواجهات', 'Aluminum Work', [
    { value: 'windows_doors_aluminum', labelAr: 'تفصيل وصيانة شبابيك وأبواب ألمنيوم ودبل جلاس', labelEn: 'Double Glazed Windows & Doors' },
    { value: 'shutter_roller_repair', labelAr: 'صيانة وتركيب أباجورات وشتر يدوي وكهربائي بمحرك', labelEn: 'Roller Shutters & Motors' },
    { value: 'aluminum_kitchens', labelAr: 'تفصيل وتصليح مطابخ ألمنيوم وكلادينج', labelEn: 'Aluminum Kitchens' },
    { value: 'fly_screens_net', labelAr: 'تفصيل منخل حشرات سحاب وثابت وشبك شبابيك', labelEn: 'Insect Fly Screens' },
  ]),
  gypsum: createHandymanFields('workType', 'أعمال الجبس بورد والديكور', 'Gypsum Work', [
    { value: 'false_ceilings', labelAr: 'أسقف معلقة وجبس بورد وإضاءة مخفية (Cove)', labelEn: 'Suspended Ceilings' },
    { value: 'tv_units_gypsum', labelAr: 'ديكورات وتصميم شاشات وجداريات جبسية حديثة', labelEn: 'TV Gypsum Wall Units' },
    { value: 'partitions_walls', labelAr: 'قواطع جدارية عازلة للصوت والحرارة للمكاتب والمنازل', labelEn: 'Drywall Partitions' },
    { value: 'cornices_molding', labelAr: 'كرانيش وفومات وبانوهات جدارية وبديل جبس', labelEn: 'Cornices & Wall Moldings' },
  ]),
  'tiles-marble': createHandymanFields('workType', 'أعمال البلاط والرخام والسيراميك', 'Tiles & Marble', [
    { value: 'ceramic_porcelain_tiling', labelAr: 'تركيب سيراميك وبورسلان أرضيات وحوائط', labelEn: 'Porcelain & Ceramic Tiling' },
    { value: 'marble_installation', labelAr: 'تركيب رخام طبيعي وجرانيت للمطابخ والدرج', labelEn: 'Marble & Granite Install' },
    { value: 'grouting_repair', labelAr: 'صيانة وترويب وفواصل تمدد للبلاط والتطبيل', labelEn: 'Grouting & Tile Repairs' },
    { value: 'marble_diamond_polishing', labelAr: 'جلي وتلميع ومعالجة رخام بالماس والكريستال', labelEn: 'Diamond Marble Polishing' },
  ]),
  'appliance-repair': createHandymanFields('applianceType', 'الأجهزة المنزلية التي يتم صيانتها', 'Appliances Repaired', [
    { value: 'washing_machines_dryers', labelAr: 'غسالات ونشافات ملابس أتوماتيك', labelEn: 'Washing Machines & Dryers' },
    { value: 'refrigerators_freezers', labelAr: 'ثلاجات وفريزرات وتبريد منزلي', labelEn: 'Refrigerators & Freezers' },
    { value: 'dishwashers', labelAr: 'جلايات صحون', labelEn: 'Dishwashers' },
    { value: 'ovens_gas_hobs', labelAr: 'أفران غاز وكهرباء ومايكرويف وشفاطات', labelEn: 'Ovens & Stoves' },
  ]),
  locksmith: createHandymanFields('serviceType', 'خدمات الأقفال والمفاتيح', 'Locksmith Service', [
    { value: 'emergency_door_unlock', labelAr: 'فتح أبواب منازل وشقق مغلقة بدون كسر', labelEn: 'Emergency Door Opening' },
    { value: 'car_unlock_key_program', labelAr: 'فتح سيارات وبرمجة مفاتيح وريموتات مشفرة', labelEn: 'Car Lockout & Key Programming' },
    { value: 'lock_replacement_cylinder', labelAr: 'تغيير كوالين وقلوب أقفال وأقفال أمان إيطالية', labelEn: 'High Security Cylinder Replacement' },
    { value: 'smart_digital_locks', labelAr: 'تركيب وبرمجة كوالين إلكترونية وبصمة ورمز سري', labelEn: 'Digital Smart Locks' },
    { value: 'safe_opening', labelAr: 'فتح وصيانة خزائن حديدية وتجورية', labelEn: 'Safe & Vault Opening' },
  ]),
  glass: createHandymanFields('glassType', 'أعمال الزجاج والمرايا', 'Glass & Mirror Work', [
    { value: 'shower_cabin_tempered', labelAr: 'كبائن شاور زجاج سيكوريت ومفصلات ستانلس', labelEn: 'Tempered Glass Shower Cabins' },
    { value: 'mirrors_led_bevelled', labelAr: 'تفصيل مرايا ديكور وليد وشطف ليزر', labelEn: 'LED & Decorative Mirrors' },
    { value: 'glass_railings_facades', labelAr: 'درابزين زجاج وبلكونات وواجهات محلات سيكوريت', labelEn: 'Glass Railings & Shopfronts' },
    { value: 'broken_glass_replacement', labelAr: 'تبديل وتصليح زجاج مكسور وسحب دبل جلاس', labelEn: 'Broken Glass Replacement' },
  ]),
  'furniture-assembly': createHandymanFields('assemblyType', 'خدمات تركيب وفك الأثاث', 'Assembly Service', [
    { value: 'ikea_flatpack_assembly', labelAr: 'تركيب أثاث ايكيا ومشتريات الإنترنت (Flatpack)', labelEn: 'IKEA & Flatpack Assembly' },
    { value: 'bedroom_wardrobe_disassembly', labelAr: 'فك ونقل وتركيب غرف نوم وخزائن سحاب', labelEn: 'Bedroom & Closet Disassembly' },
    { value: 'curtain_rods_blinds', labelAr: 'تركيب وتثبيت برادي وستائر وشاشات جدارية', labelEn: 'Curtain Rods & TV Wall Mounting' },
    { value: 'gym_sports_assembly', labelAr: 'تجميع أجهزة رياضية وألعاب أطفال معقدة', labelEn: 'Gym & Trampoline Setup' },
  ]),
  general: createHandymanFields('taskScope', 'مجالات الصيانة العامة', 'General Maintenance Scope', [
    { value: 'handyman_odd_jobs', labelAr: 'إصلاحات منزلية شاملة وتثبيت إكسسوارات ورفوف', labelEn: 'Comprehensive Home Repairs' },
    { value: 'full_apartment_turnover', labelAr: 'تجديد وصيانة شقق للإيجار وتسليم المفتاح', labelEn: 'Apartment Turnover & Refresh' },
    { value: 'waterproofing_insulation', labelAr: 'عزل أسطح وحمامات لمنع الدلف والخرير', labelEn: 'Roof & Bathroom Insulation' },
    { value: 'drainage_plumbing_electric', labelAr: 'صيانة طارئة سريعة سباكة وكهرباء معاً', labelEn: 'Combined Quick Electric & Plumbing' },
  ]),
};
