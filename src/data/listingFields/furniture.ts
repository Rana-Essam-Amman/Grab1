import type { CategoryFieldMap, ListingFieldOption } from './types';

const FURNITURE_MATERIALS: ListingFieldOption[] = [
  { value: 'wood_solid', labelAr: 'خشب طبيعي / زان / سويد', labelEn: 'Solid Wood' },
  { value: 'wood_mdf', labelAr: 'خشب مضغوط / MDF / لاتيه', labelEn: 'MDF / Engineered Wood' },
  { value: 'fabric', labelAr: 'قماش / كتان / مخمل', labelEn: 'Fabric / Velvet / Linen' },
  { value: 'leather_natural', labelAr: 'جلد طبيعي', labelEn: 'Genuine Leather' },
  { value: 'leather_faux', labelAr: 'جلد صناعي (PU)', labelEn: 'Faux Leather' },
  { value: 'metal', labelAr: 'حديد / معدن / ستيل', labelEn: 'Metal / Steel' },
  { value: 'marble', labelAr: 'رخام طبيعي / صناعي', labelEn: 'Marble' },
  { value: 'glass', labelAr: 'زجاج سيكوريت', labelEn: 'Tempered Glass' },
  { value: 'rattan', labelAr: 'خيزران / راتان', labelEn: 'Rattan / Wicker' },
];

const COLOR_OPTIONS: ListingFieldOption[] = [
  { value: 'beige', labelAr: 'بيج / أوف وايت', labelEn: 'Beige / Off-White' },
  { value: 'grey', labelAr: 'رمادي / رمادي غامق', labelEn: 'Grey / Dark Grey' },
  { value: 'brown', labelAr: 'بني / خشب جوزي', labelEn: 'Brown / Walnut' },
  { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
  { value: 'white', labelAr: 'أبيض', labelEn: 'White' },
  { value: 'navy_blue', labelAr: 'كحلي / أزرق', labelEn: 'Navy / Blue' },
  { value: 'green', labelAr: 'زيتي / أخضر زمردي', labelEn: 'Olive / Green' },
  { value: 'mustard', labelAr: 'خردلي / ذهبي', labelEn: 'Mustard / Gold' },
];

const STYLE_OPTIONS: ListingFieldOption[] = [
  { value: 'modern', labelAr: 'مودرن حديث', labelEn: 'Modern' },
  { value: 'classic', labelAr: 'كلاسيك فخم / نيو كلاسيك', labelEn: 'Classic / Neo-Classic' },
  { value: 'boho', labelAr: 'بوهيمي / ريفي (Boho / Rustic)', labelEn: 'Boho / Rustic' },
  { value: 'scandinavian', labelAr: 'اسكندنافي بسيط (IKEA style)', labelEn: 'Scandinavian' },
  { value: 'industrial', labelAr: 'صناعي / معدني', labelEn: 'Industrial' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد بالكرتونة / تصنيع جديد', labelEn: 'Brand New' },
  { value: 'excellent', labelAr: 'مستعمل بحالة ممتازة كالجديد', labelEn: 'Excellent / Like New' },
  { value: 'good', labelAr: 'مستعمل بحالة جيدة ونظيف', labelEn: 'Good' },
  { value: 'fair', labelAr: 'مستعمل بحاجة تنظيف أو صيانة بسيطة', labelEn: 'Fair' },
];

const WARDROBE_SUBTYPE: ListingFieldOption[] = [
  { value: 'sliding', labelAr: 'أبواب سحابة', labelEn: 'Sliding Doors' },
  { value: 'hinged', labelAr: 'أبواب مفصليّة', labelEn: 'Hinged Doors' },
  { value: 'walk_in', labelAr: 'غرفة ملابس Walk-in', labelEn: 'Walk-in Closet' },
  { value: 'open_shelves', labelAr: 'رفوف مفتوحة', labelEn: 'Open Shelves' },
];

const CHAIR_SUBTYPE: ListingFieldOption[] = [
  { value: 'executive', labelAr: 'كرسي مدير تنفيذي', labelEn: 'Executive Chair' },
  { value: 'staff', labelAr: 'كرسي موظف', labelEn: 'Staff / Task Chair' },
  { value: 'gaming', labelAr: 'كرسي ألعاب (Gaming)', labelEn: 'Gaming Chair' },
  { value: 'visitor', labelAr: 'كرسي زائر / انتظار', labelEn: 'Visitor Chair' },
];

const DECOR_ORIGIN: ListingFieldOption[] = [
  { value: 'turkish', labelAr: 'تركي', labelEn: 'Turkish' },
  { value: 'persian', labelAr: 'إيراني', labelEn: 'Persian' },
  { value: 'chinese', labelAr: 'صيني', labelEn: 'Chinese' },
  { value: 'handmade', labelAr: 'شغل يدوي / محلي', labelEn: 'Handmade / Local' },
  { value: 'european', labelAr: 'أوروبي', labelEn: 'European' },
];

const FURNITURE_FEATURES: ListingFieldOption[] = [
  { value: 'removable_covers', labelAr: 'أغطية قابلة للفك والغسل', labelEn: 'Removable Covers' },
  { value: 'pet_friendly', labelAr: 'مناسب للحيوانات الأليفة', labelEn: 'Pet Friendly' },
  { value: 'waterproof', labelAr: 'قماش مقاوم للماء', labelEn: 'Waterproof Fabric' },
  { value: 'storage', labelAr: 'يحتوي مساحة تخزين', labelEn: 'Storage Included' },
  { value: 'reclining', labelAr: 'يحتوي خاصية الاستلقاء (Recliner)', labelEn: 'Reclining' },
  { value: 'massage', labelAr: 'يحتوي وظيفة مساج', labelEn: 'Massage Function' },
];

export const FURNITURE_FIELDS: CategoryFieldMap = {
  living: [
    { key: 'itemType', labelAr: 'نوع الأثاث', labelEn: 'Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'sofa_set', labelAr: 'طقم كنب كامل (صالون)', labelEn: 'Full Sofa Set' },
      { value: 'corner_sofa', labelAr: 'كنبة زاوية حرف L أو U', labelEn: 'Sectional / L-Shape' },
      { value: 'single_sofa', labelAr: 'كنبة فردية / ثنائية / ثلاثية', labelEn: 'Sofa (1/2/3 Seater)' },
      { value: 'armchair', labelAr: 'فوتيه / كرسي استرخاء (Recliner)', labelEn: 'Armchair / Recliner' },
      { value: 'sofa_bed', labelAr: 'كنبة سرير (Sofa Bed)', labelEn: 'Sofa Bed' },
      { value: 'tv_unit', labelAr: 'طاولة تلفزيون / مكتبة جدارية', labelEn: 'TV Unit / Media Console' },
    ]},
    { key: 'material', labelAr: 'مادة القماش / التنجيد', labelEn: 'Material', type: 'select', allowOther: true, required: true, options: FURNITURE_MATERIALS },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: true, options: COLOR_OPTIONS },
    { key: 'seats', labelAr: 'عدد المقاعد الإجمالي', labelEn: 'Seating Capacity', type: 'select', allowOther: true, required: false, options: [
      { value: '1', labelAr: 'شخص واحد (فردي)', labelEn: '1 Person' },
      { value: '2', labelAr: 'شخصين', labelEn: '2 Persons' },
      { value: '3', labelAr: '3 أشخاص', labelEn: '3 Persons' },
      { value: '5', labelAr: '5 أشخاص (طقم)', labelEn: '5 Persons' },
      { value: '7_plus', labelAr: '7 أشخاص أو أكثر', labelEn: '7+ Persons' },
    ]},
    { key: 'style', labelAr: 'الستايل والتصميم', labelEn: 'Style', type: 'select', allowOther: true, required: false, options: STYLE_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة أو مكان الشراء', labelEn: 'Brand / Store', type: 'text', required: false, placeholder: 'IKEA, Ashley, Home Centre, Custom...', placeholderAr: 'مثال: ايكيا، هوم سنتر، تفصيل محلي...' },
    { key: 'assemblyRequired', labelAr: 'يحتاج فك وتركيب', labelEn: 'Assembly Required', type: 'boolean', required: false },
    { key: 'includesChaise', labelAr: 'يشمل شازلونج أو طرف ممتد', labelEn: 'Includes Chaise Lounge', type: 'boolean', required: false },
    { key: 'includesOttoman', labelAr: 'يشمل بف أو مسند أقدام (Ottoman)', labelEn: 'Includes Ottoman', type: 'boolean', required: false },
    { key: 'age', labelAr: 'مدة الاستخدام (سنوات)', labelEn: 'Usage (Years)', type: 'number', required: false, placeholder: '2', placeholderAr: '2' },
    { key: 'reclining', labelAr: 'قابل للاستلقاء', labelEn: 'Reclining', type: 'boolean', required: false },
    { key: 'petFriendly', labelAr: 'مناسب للحيوانات الأليفة', labelEn: 'Pet Friendly', type: 'boolean', required: false },
    { key: 'additionalFeatures', labelAr: 'ميزات إضافية', labelEn: 'Additional Features', type: 'select', multiSelect: true, allowOther: true, required: false, options: FURNITURE_FEATURES },
    { key: 'dimensions', labelAr: 'المقاسات والأبعاد (الطول × العرض)', labelEn: 'Dimensions', type: 'text', required: false, placeholder: '300x200 cm', placeholderAr: 'مثال: 300 × 200 سم' },
  ],
  bedroom: [
    { key: 'itemType', labelAr: 'نوع قطعة النوم', labelEn: 'Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'full_bedroom_set', labelAr: 'غرفة نوم كاملة (تخت، خزانة، تسريحة، كمدينو)', labelEn: 'Full Bedroom Set' },
      { value: 'bed_frame', labelAr: 'تخت / هيكل سرير', labelEn: 'Bed Frame' },
      { value: 'wardrobe', labelAr: 'خزانة ملابس (سحاب / مفصلي)', labelEn: 'Wardrobe / Closet' },
      { value: 'mattress', labelAr: 'فرشة سرير طبية / زنبرك', labelEn: 'Mattress' },
      { value: 'dresser', labelAr: 'تسريحة / مرآة ميك أب', labelEn: 'Dresser / Vanity' },
      { value: 'nightstand', labelAr: 'كمدينات (طاولة سرير جانبية)', labelEn: 'Nightstands' },
    ]},
    { key: 'bedSize', labelAr: 'مقاس السرير / الفرشة', labelEn: 'Bed Size', type: 'select', allowOther: true, required: false, options: [
      { value: 'king', labelAr: 'كينج كبير (200 × 200 سم)', labelEn: 'King (200x200)' },
      { value: 'queen', labelAr: 'كوين ماستر (180 × 200 سم)', labelEn: 'Queen (180x200)' },
      { value: 'double', labelAr: 'مزدوج وسط (160 × 200 سم)', labelEn: 'Double (160x200)' },
      { value: 'single_large', labelAr: 'مفرد كبير (120 × 200 سم)', labelEn: 'Single Plus (120x200)' },
      { value: 'single', labelAr: 'مفرد عادي (90/100 × 200 سم)', labelEn: 'Single (90x200)' },
      { value: 'bunk_bed', labelAr: 'سرير طابقين (Bunk Bed)', labelEn: 'Bunk Bed' },
    ]},
    { key: 'material', labelAr: 'المادة المصنعة', labelEn: 'Material', type: 'select', allowOther: true, required: true, options: FURNITURE_MATERIALS },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: true, options: COLOR_OPTIONS },
    { key: 'style', labelAr: 'الستايل', labelEn: 'Style', type: 'select', allowOther: true, required: false, options: STYLE_OPTIONS },
    { key: 'mattressIncluded', labelAr: 'يشمل فرشة السرير', labelEn: 'Mattress Included', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة أو المصنع', labelEn: 'Brand', type: 'text', required: false, placeholder: 'IKEA, Home Centre, Local Carpenter...', placeholderAr: 'مثال: ايكيا، هوم سنتر، منجرة...' },
    { key: 'age', labelAr: 'مدة الاستخدام (سنوات)', labelEn: 'Age (Years)', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'wardrobeSubtype', labelAr: 'نوع الخزانة', labelEn: 'Wardrobe Type', type: 'select', allowOther: true, required: false, options: WARDROBE_SUBTYPE },
    { key: 'underBedStorage', labelAr: 'تخزين أسفل السرير', labelEn: 'Under-Bed Storage', type: 'boolean', required: false },
    { key: 'additionalFeatures', labelAr: 'ميزات إضافية', labelEn: 'Additional Features', type: 'select', multiSelect: true, allowOther: true, required: false, options: FURNITURE_FEATURES },
  ],
  tables: [
    { key: 'tableType', labelAr: 'نوع الطاولة', labelEn: 'Table Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'dining_set', labelAr: 'سفرة طعام كاملة مع كراسي', labelEn: 'Dining Table Set with Chairs' },
      { value: 'dining_table_only', labelAr: 'طاولة طعام فقط بدون كراسي', labelEn: 'Dining Table Only' },
      { value: 'coffee_table', labelAr: 'طاولة وسط صالون (Coffee Table)', labelEn: 'Coffee Table' },
      { value: 'side_nesting_tables', labelAr: 'طاولات خدمة / طقم طاولات متداخلة', labelEn: 'Side / Nesting Tables' },
      { value: 'console_table', labelAr: 'كونسول مدخل مع مرآة', labelEn: 'Console Table' },
    ]},
    { key: 'material', labelAr: 'مادة السطح والقاعدة', labelEn: 'Top & Base Material', type: 'select', allowOther: true, required: true, options: FURNITURE_MATERIALS },
    { key: 'shape', labelAr: 'الشكل الهندسي', labelEn: 'Shape', type: 'select', allowOther: true, required: false, options: [
      { value: 'rectangular', labelAr: 'مستطيل', labelEn: 'Rectangular' },
      { value: 'round', labelAr: 'دائري', labelEn: 'Round' },
      { value: 'oval', labelAr: 'بيضاوي', labelEn: 'Oval' },
      { value: 'square', labelAr: 'مربع', labelEn: 'Square' },
    ]},
    { key: 'seats', labelAr: 'عدد الكراسي / الأشخاص', labelEn: 'Chairs / Seats Count', type: 'select', allowOther: true, required: false, options: [
      { value: '4', labelAr: '4 كراسي', labelEn: '4 Chairs' },
      { value: '6', labelAr: '6 كراسي', labelEn: '6 Chairs' },
      { value: '8', labelAr: '8 كراسي', labelEn: '8 Chairs' },
      { value: '10_plus', labelAr: '10 كراسي أو أكثر', labelEn: '10+ Chairs' },
    ]},
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: true, options: COLOR_OPTIONS },
    { key: 'chairsIncluded', labelAr: 'تشمل الكراسي', labelEn: 'Chairs Included', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'IKEA, Ashley...', placeholderAr: 'مثال: ايكيا...' },
    { key: 'dimensions', labelAr: 'المقاس (سم)', labelEn: 'Dimensions', type: 'text', required: false, placeholder: '200 x 100 cm', placeholderAr: 'مثال: 200 × 100 سم' },
    { key: 'extendable', labelAr: 'قابل للتمديد', labelEn: 'Extendable', type: 'boolean', required: false },
  ],
  outdoor: [
    { key: 'itemType', labelAr: 'نوع الأثاث الخارجي', labelEn: 'Outdoor Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'garden_set', labelAr: 'طقم جلسة حدائق وبلكونة كامل', labelEn: 'Full Garden / Patio Set' },
      { value: 'swing', labelAr: 'مرجوحة حدائق / معلقة', labelEn: 'Garden Swing / Hammock' },
      { value: 'sunbed', labelAr: 'شيزلونج مسبح وتشميس', labelEn: 'Sunbed / Lounger' },
      { value: 'umbrella_gazebo', labelAr: 'مظلة حدائق / شمسية / برجولة', labelEn: 'Umbrella / Gazebo' },
      { value: 'benches', labelAr: 'مقاعد حدائق خشبية / حديد', labelEn: 'Garden Benches' },
    ]},
    { key: 'material', labelAr: 'المادة المقاومة', labelEn: 'Material', type: 'select', allowOther: true, required: true, options: [
      { value: 'rattan_synthetic', labelAr: 'راتان صناعي معالج للطقس', labelEn: 'All-Weather Rattan' },
      { value: 'aluminum', labelAr: 'ألمنيوم غير قابل للصدأ', labelEn: 'Rust-Proof Aluminum' },
      { value: 'wrought_iron', labelAr: 'حديد مشغول ومدهون', labelEn: 'Wrought Iron' },
      { value: 'teak_wood', labelAr: 'خشب تيك طبيعي مقاوم', labelEn: 'Teak / Treated Wood' },
      { value: 'heavy_plastic', labelAr: 'بلاستيك مقوى معالج UV', labelEn: 'Reinforced Plastic' },
    ]},
    { key: 'weatherResistant', labelAr: 'مقاوم للماء وأشعة الشمس والصدأ', labelEn: 'Weather & Rust Resistant', type: 'boolean', required: false },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'seats', labelAr: 'سعة الجلسة (عدد الأشخاص)', labelEn: 'Seats Capacity', type: 'select', allowOther: true, required: false, options: [
      { value: '2', labelAr: 'شخصين (بلكونة)', labelEn: '2 Persons' },
      { value: '4', labelAr: '4 أشخاص', labelEn: '4 Persons' },
      { value: '6_plus', labelAr: '6 أشخاص فما فوق', labelEn: '6+ Persons' },
    ]},
    { key: 'cushionsIncluded', labelAr: 'يشمل مخدات ودواسات الجلوس', labelEn: 'Cushions Included', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Brand name...', placeholderAr: 'اسم الماركة...' },
  ],
  decor: [
    { key: 'decorType', labelAr: 'نوع الديكور', labelEn: 'Decor Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'carpet_rug', labelAr: 'سجاد / موكيت تركي أو إيراني', labelEn: 'Carpet / Rug' },
      { value: 'chandelier_lighting', labelAr: 'ثريا / إضاءة معلقة / أباجورة', labelEn: 'Chandelier / Lighting' },
      { value: 'mirror', labelAr: 'مرآة ديكور جدارية أو أرضية', labelEn: 'Mirror' },
      { value: 'wall_art', labelAr: 'لوحة فنية / كانفس / براويز', labelEn: 'Wall Art / Painting' },
      { value: 'curtains', labelAr: 'ستائر وبلاك آوت كامل', labelEn: 'Curtains / Drapes' },
      { value: 'vases_clocks', labelAr: 'فازات / ساعات حائط / تماثيل ديكور', labelEn: 'Vases / Clocks / Accents' },
    ]},
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', allowOther: true, required: false, options: FURNITURE_MATERIALS },
    { key: 'color', labelAr: 'اللون الأساسي', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'style', labelAr: 'الستايل', labelEn: 'Style', type: 'select', allowOther: true, required: false, options: STYLE_OPTIONS },
    { key: 'dimensions', labelAr: 'الأبعاد / الحجم (سم أو م²)', labelEn: 'Dimensions', type: 'text', required: false, placeholder: '200x300 cm', placeholderAr: 'مثال: 200 × 300 سم' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة أو المنشأ', labelEn: 'Brand / Origin', type: 'text', required: false, placeholder: 'Turkish, Persian, IKEA...', placeholderAr: 'مثال: تركي، يدوي، ايكيا...' },
    { key: 'originCountry', labelAr: 'المنشأ', labelEn: 'Origin', type: 'select', allowOther: true, required: false, options: DECOR_ORIGIN },
  ],
  office: [
    { key: 'itemType', labelAr: 'نوع الأثاث المكتبي', labelEn: 'Office Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'office_desk', labelAr: 'مكتب مدير / مكتب عمل', labelEn: 'Manager / Working Desk' },
      { value: 'ergonomic_chair', labelAr: 'كرسي مكتب طبي هيدروليك (Ergonomic)', labelEn: 'Ergonomic Office Chair' },
      { value: 'filing_cabinet', labelAr: 'خزانة ملفات ومستندات حديد أو خشب', labelEn: 'Filing Cabinet' },
      { value: 'meeting_table', labelAr: 'طاولة اجتماعات', labelEn: 'Meeting Table' },
      { value: 'office_sofa', labelAr: 'كنب استقبال وانتظار', labelEn: 'Reception Sofa' },
      { value: 'bookshelf', labelAr: 'مكتبة كتب ورفوف', labelEn: 'Bookshelf' },
    ]},
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', allowOther: true, required: true, options: FURNITURE_MATERIALS },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'adjustable', labelAr: 'قابل لتعديل الارتفاع أو كهربائي (Sit-Stand)', labelEn: 'Adjustable / Standing Desk', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Herman Miller, Steelcase, IKEA...', placeholderAr: 'مثال: هيرمان ميلر، ايكيا...' },
    { key: 'chairSubtype', labelAr: 'نوع الكرسي', labelEn: 'Chair Type', type: 'select', allowOther: true, required: false, options: CHAIR_SUBTYPE },
    { key: 'dimensions', labelAr: 'الأبعاد (الطول × العرض × الارتفاع)', labelEn: 'Dimensions', type: 'text', required: false, placeholder: '160x80 cm', placeholderAr: 'مثال: 160 × 80 سم' },
  ],
};
