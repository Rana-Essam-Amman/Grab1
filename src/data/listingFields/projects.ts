import type { CategoryFieldMap, ListingFieldOption, ListingField } from './types';

const PROJECT_STAGES: ListingFieldOption[] = [
  { value: 'established_profitable', labelAr: 'مشروع قائم ويعمل ويحقق أرباحاً منتظمة', labelEn: 'Operating & Profitable' },
  { value: 'operating_break_even', labelAr: 'قائم وقيد التشغيل (جاهز بالكامل)', labelEn: 'Operating / Turnkey' },
  { value: 'under_setup', labelAr: 'قيد التجهيز والتأسيس والترخيص', labelEn: 'Under Setup / Fit-Out' },
  { value: 'idea_study', labelAr: 'فكرة ودراسة جدوى تبحث عن تمويل وشريك', labelEn: 'Feasibility Study & Idea' },
  { value: 'liquidation_closure', labelAr: 'تصفية وتقبيل لعدم التفرغ', labelEn: 'Relinquishment / Liquidation' },
];

const SALE_REASONS: ListingFieldOption[] = [
  { value: 'no_time_travel', labelAr: 'عدم التفرغ أو السفر للخارج', labelEn: 'Relocation / Lack of Time' },
  { value: 'expansion_capital', labelAr: 'توسيع النشاط وفتح فروع جديدة', labelEn: 'Business Expansion' },
  { value: 'retirement', labelAr: 'التقاعد', labelEn: 'Retirement' },
  { value: 'partnership_split', labelAr: 'فض شراكة وتصفية حسابات', labelEn: 'Partnership Dissolution' },
  { value: 'investment_exit', labelAr: 'خروج استثماري وتحقيق أرباح', labelEn: 'Investment Exit' },
];

const CONTRACT_DURATIONS: ListingFieldOption[] = [
  { value: '1_year', labelAr: 'سنة قابلة للتجديد', labelEn: '1 Year Renewable' },
  { value: '3_years', labelAr: '3 سنوات', labelEn: '3 Years' },
  { value: '5_years_plus', labelAr: '5 سنوات أو أكثر (عقد طويل الأجل)', labelEn: '5+ Years Long Term' },
  { value: 'permanent_ownership', labelAr: 'ملكية دائمة وتنازل نهائي', labelEn: 'Permanent Transfer' },
];

function createProjectFields(
  specialtyField: ListingField,
  industryOptions?: ListingFieldOption[]
): readonly ListingField[] {
  return [
    specialtyField,
    { key: 'stage', labelAr: 'مرحلة وحالة المشروع', labelEn: 'Project Stage', type: 'select', allowOther: true, required: true, options: PROJECT_STAGES },
    ...(industryOptions ? [{
      key: 'industry', labelAr: 'القطاع التجاري', labelEn: 'Industry Sector', type: 'select' as const, allowOther: true, required: false, options: industryOptions
    }] : []),
    { key: 'budget', labelAr: 'السعر المطلوب للتقبيل / رأس المال', labelEn: 'Asking Price / Capital', type: 'number', required: true, placeholder: '20000', placeholderAr: '20000' },
    { key: 'revenue', labelAr: 'متوسط الدخل أو المبيعات الشهرية', labelEn: 'Average Monthly Revenue', type: 'number', required: false, placeholder: '5000', placeholderAr: '5000' },
    { key: 'employees', labelAr: 'عدد الموظفين والعمال الحاليين', labelEn: 'Employees Count', type: 'number', required: false, placeholder: '4', placeholderAr: '4' },
    { key: 'yearsActive', labelAr: 'عمر المشروع في السوق (بالسنوات)', labelEn: 'Years in Business', type: 'number', required: false, placeholder: '3', placeholderAr: '3' },
    { key: 'licensesIncluded', labelAr: 'يشمل السجل التجاري ورخصة المهن واللوحات', labelEn: 'Commercial License & Permits Included', type: 'boolean', required: false },
    { key: 'equipmentIncluded', labelAr: 'يشمل كافة المعدات والأجهزة والأثاث والبضاعة', labelEn: 'Full Equipment & Inventory Included', type: 'boolean', required: false },
    { key: 'locationIncluded', labelAr: 'يشمل التنازل عن عقد إيجار الموقع والمحل', labelEn: 'Location Lease Transfer Included', type: 'boolean', required: false },
    { key: 'brandIncluded', labelAr: 'يشمل الاسم التجاري والعلامة وحسابات السوشيال ميديا', labelEn: 'Brand Name & Social Media Accounts', type: 'boolean', required: false },
    { key: 'reasonForSale', labelAr: 'سبب التقبيل أو عرض الشراكة', labelEn: 'Reason for Sale / Deal', type: 'select', allowOther: true, required: false, options: SALE_REASONS },
    { key: 'includesTraining', labelAr: 'استعداد المالك الحالي لتدريب المشتري وتسليمه أسرار العمل', labelEn: 'Handover Training & Support Included', type: 'boolean', required: false },
    { key: 'partnershipPercent', labelAr: 'نسبة الحصة أو الشراكة المعروضة (%)', labelEn: 'Equity / Share Offered (%)', type: 'number', required: false, placeholder: '50', placeholderAr: '50' },
    { key: 'contractDuration', labelAr: 'مدة عقد الإيجار أو الشراكة', labelEn: 'Lease / Contract Duration', type: 'select', allowOther: true, required: false, options: CONTRACT_DURATIONS },
    { key: 'negotiable', labelAr: 'السعر وشروط الدفع قابلة للتفاوض', labelEn: 'Price / Terms Negotiable', type: 'boolean', required: false },
  ];
}

export const PROJECTS_FIELDS: CategoryFieldMap = {
  restaurant: createProjectFields({
    key: 'restaurantType', labelAr: 'نوع المطعم أو النشاط الغذائي', labelEn: 'Cuisine / Venue Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'fast_food_shawarma', labelAr: 'مطعم وجبات سريعة وشاورما وسناكس', labelEn: 'Fast Food & Shawarma' },
      { value: 'cafe_coffee_shop', labelAr: 'كافيه وكوفي شوب ومشروبات ساخنة', labelEn: 'Coffee Shop & Cafe' },
      { value: 'fine_dining_oriental', labelAr: 'مطعم شرقي / مشاوي ومأكولات عائلية', labelEn: 'Oriental & Dine-In Restaurant' },
      { value: 'cloud_kitchen', labelAr: 'مطبخ سحابي لتوصيل الطلبات (Cloud Kitchen)', labelEn: 'Cloud Kitchen' },
      { value: 'bakery_pastry', labelAr: 'مخبز وحلويات ومعجنات', labelEn: 'Bakery & Pastry' },
      { value: 'juice_icecream', labelAr: 'محل عصائر طبيعية وآيس كريم وبوظة', labelEn: 'Juice & Ice Cream Bar' },
    ],
  }),
  shop: createProjectFields({
    key: 'shopType', labelAr: 'نوع النشاط التجاري للمحل', labelEn: 'Shop Business Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'supermarket_minimarket', labelAr: 'سوبرماركت / ميني ماركت / بقالة', labelEn: 'Supermarket / Grocery' },
      { value: 'fashion_boutique', labelAr: 'محل ملابس وأزياء وأحذية', labelEn: 'Fashion Boutique' },
      { value: 'mobile_electronics', labelAr: 'محل بيع وصيانة هواتف وإلكترونيات', labelEn: 'Mobile & Electronics Store' },
      { value: 'pharmacy_cosmetics', labelAr: 'صيدلية أو مركز تجميل وعناية', labelEn: 'Pharmacy / Cosmetics Store' },
      { value: 'salon_barber_spa', labelAr: 'صالون حلاقة رجالي / صالون نسائي وسبا', labelEn: 'Salon & Spa' },
      { value: 'flower_gifts', labelAr: 'محل ورود وتغليف هدايا وشوكولاتة', labelEn: 'Flowers & Gifts Shop' },
      { value: 'car_wash_accessories', labelAr: 'مغسلة سيارات ومحل زينة وإكسسوارات', labelEn: 'Car Wash & Detailing' },
    ],
  }),
  factory: createProjectFields({
    key: 'factoryType', labelAr: 'قطاع التصنيع والإنتاج', labelEn: 'Manufacturing Sector', type: 'select', allowOther: true, required: true, options: [
      { value: 'food_processing', labelAr: 'تصنيع وتعبئة وتغليف المواد الغذائية', labelEn: 'Food Processing & Packaging' },
      { value: 'plastics_chemicals', labelAr: 'بلاستيك ومطاط وكيماويات ومنظفات', labelEn: 'Plastics & Chemicals' },
      { value: 'metal_aluminum_fabrication', labelAr: 'تشكيل معادن وحدادة وألمنيوم', labelEn: 'Metal & Aluminum Fabrication' },
      { value: 'textiles_garments', labelAr: 'مشغل خياطة وأقمشة وملابس جاهزة', labelEn: 'Textile & Garment Factory' },
      { value: 'carpentry_woodwork', labelAr: 'منجرة ومصنع أثاث ومطابخ خشبية', labelEn: 'Wood & Furniture Manufacturing' },
      { value: 'building_materials', labelAr: 'مصنع طوب وبلاط ومواد بناء ومحاجر', labelEn: 'Building Materials / Concrete' },
    ],
  }),
  'online-store': createProjectFields({
    key: 'storePlatform', labelAr: 'المنصة التقنية للمتجر الإلكتروني', labelEn: 'E-Commerce Platform', type: 'select', allowOther: true, required: true, options: [
      { value: 'shopify', labelAr: 'شوبيفاي (Shopify)', labelEn: 'Shopify' },
      { value: 'salla_zid', labelAr: 'سلة أو زد (Salla / Zid)', labelEn: 'Salla / Zid' },
      { value: 'woocommerce_wordpress', labelAr: 'ووكومرس / ووردبريس (WooCommerce)', labelEn: 'WooCommerce' },
      { value: 'custom_coded_app', labelAr: 'تطبيق وموقع مبرمج خاص (Custom Web/App)', labelEn: 'Custom Mobile App & Web' },
      { value: 'amazon_noon_seller', labelAr: 'حساب بائع أمازون أو نون (FBA Seller Account)', labelEn: 'Amazon / Noon Seller Account' },
      { value: 'instagram_tiktok_shop', labelAr: 'صفحة تجارة سوشيال ميديا ومتابعين حقيقيين', labelEn: 'Social Media Store Page' },
    ],
  }),
  franchise: createProjectFields({
    key: 'franchiseBrand', labelAr: 'اسم العلامة التجارية وحق الامتياز', labelEn: 'Brand / Franchise Name', type: 'text', required: true, placeholder: 'Franchise Brand Name...', placeholderAr: 'اسم البراند أو الامتياز التجاري...'
  }),
  licenses: createProjectFields({
    key: 'licenseCategory', labelAr: 'نوع الرخصة والتصنيف التجاري', labelEn: 'License Category', type: 'select', allowOther: true, required: true, options: [
      { value: 'general_trading_contracting', labelAr: 'سجل تجارة عامة ومقاولات درجة أولى', labelEn: 'General Trading & Contracting' },
      { value: 'tourism_travel_agency', labelAr: 'رخصة سياحة وسفر وحج وعمرة مرخصة', labelEn: 'Travel & Tourism Agency' },
      { value: 'transport_limousine', labelAr: 'رخصة نقل وتأجير سيارات وسياحي', labelEn: 'Transport & Car Rental License' },
      { value: 'medical_pharmacy_license', labelAr: 'رخصة مركز طبي أو صيدلية معتمدة', labelEn: 'Medical / Pharmacy License' },
      { value: 'education_training_center', labelAr: 'رخصة مركز تدريب أو أكاديمية تعليمية', labelEn: 'Training Academy / Center' },
      { value: 'import_export_customs', labelAr: 'بطاقة استيراد وتصدير وتخليص جمركي', labelEn: 'Import / Export & Customs Card' },
    ],
  }),
  equipment: createProjectFields({
    key: 'equipmentCategory', labelAr: 'نوع المعدات والخطوط الإنتاجية', labelEn: 'Equipment Category', type: 'select', allowOther: true, required: true, options: [
      { value: 'restaurant_kitchen_gear', labelAr: 'معدات مطاعم وأفران وكاونترات ستانلس', labelEn: 'Commercial Kitchen & Bakery' },
      { value: 'supermarket_refrigeration', labelAr: 'ثلاجات عرض ورفوف وكاشيرات سوبرماركت', labelEn: 'Supermarket Displays & Shelving' },
      { value: 'heavy_production_lines', labelAr: 'خطوط إنتاج وماكينات تعبئة ومولدات', labelEn: 'Production Lines & Generators' },
      { value: 'medical_dental_clinic', labelAr: 'أجهزة طبية وكراسي عيادات أسنان ومختبرات', labelEn: 'Medical & Dental Clinic Equipment' },
      { value: 'gym_fitness_commercial', labelAr: 'أجهزة جيم وصالات رياضية تجارية كاملة', labelEn: 'Commercial Gym Equipment' },
    ],
  }),
  partnership: createProjectFields({
    key: 'partnershipType', labelAr: 'طبيعة ونوع الشراكة المطلوبة', labelEn: 'Partnership Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'silent_financial_investor', labelAr: 'شريك ممول برأس المال فقط (Silent Partner)', labelEn: 'Financial Silent Partner' },
      { value: 'active_managing_partner', labelAr: 'شريك إداري وتشغيلي بالخبرة والجهد', labelEn: 'Managing / Working Partner' },
      { value: 'technical_cto_partner', labelAr: 'شريك تقني وبرمجي للمشاريع الناشئة (CTO)', labelEn: 'Technical / Co-Founder Partner' },
      { value: 'distributor_agent', labelAr: 'شريك توزيع ووكيل حصري', labelEn: 'Distribution & Sales Partner' },
    ],
  }),
  software: createProjectFields({
    key: 'softwareType', labelAr: 'نوع المشروع التقني والبرمجي', labelEn: 'Software Product Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'saas_platform', labelAr: 'منصة اشتراكات سحابية (SaaS B2B / B2C)', labelEn: 'SaaS Platform' },
      { value: 'mobile_app_marketplace', labelAr: 'تطبيق جوال وسوق إلكتروني مع مستخدمين', labelEn: 'Mobile App / Marketplace' },
      { value: 'fintech_pos', labelAr: 'نظام نقاط بيع ومالي (Fintech / POS)', labelEn: 'Fintech / POS System' },
      { value: 'ai_tool', labelAr: 'أداة ذكاء اصطناعي ونظام أتمتة (AI Tool)', labelEn: 'AI & Automation Software' },
    ],
  }),
  agri: createProjectFields({
    key: 'agriType', labelAr: 'نوع المشروع الزراعي والإنتاجي', labelEn: 'Agricultural Project Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'greenhouses_hydroponic', labelAr: 'بيوت بلاستيكية وزراعة مائية حديثة (Hydroponic)', labelEn: 'Greenhouses & Hydroponics' },
      { value: 'poultry_broiler_layers', labelAr: 'مزرعة دواجن ولاحم وبياض وفقاسات', labelEn: 'Poultry Farm & Hatchery' },
      { value: 'livestock_dairy_sheep', labelAr: 'مزرعة مواشي وأبقار وحظائر تسمين وألبان', labelEn: 'Livestock & Dairy Farm' },
      { value: 'olive_fruit_farm', labelAr: 'مزرعة زيتون أو نخيل أو أشجار مثمرة منتجة', labelEn: 'Olive & Fruit Orchard' },
      { value: 'fish_farming_aquaculture', labelAr: 'مزرعة واستزراع سمكي (Aquaculture)', labelEn: 'Fish Farming' },
      { value: 'apiary_honey', labelAr: 'مناحل ومناحل إنتاج عسل طبيعي', labelEn: 'Apiary & Honey Farm' },
    ],
  }),
  other: createProjectFields({
    key: 'details', labelAr: 'تفاصيل ووصف نوع النشاط الاستثماري', labelEn: 'Project Details & Field', type: 'text', required: true, placeholder: 'Describe the business or investment...', placeholderAr: 'اكتب وصفاً مفصلاً لطبيعة النشاط أو الفرصة الاستثمارية...'
  }),
};
