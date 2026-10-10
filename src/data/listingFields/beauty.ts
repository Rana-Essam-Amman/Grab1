import type { CategoryFieldMap, ListingFieldOption } from './types';

const PERFUME_BRANDS: ListingFieldOption[] = [
  { value: 'dior', labelAr: 'ديور (Dior)', labelEn: 'Dior' },
  { value: 'chanel', labelAr: 'شانيل (Chanel)', labelEn: 'Chanel' },
  { value: 'ysl', labelAr: 'إيف سان لوران (YSL)', labelEn: 'YSL' },
  { value: 'gucci', labelAr: 'غوتشي (Gucci)', labelEn: 'Gucci' },
  { value: 'armani', labelAr: 'أرماني (Armani)', labelEn: 'Armani' },
  { value: 'tom_ford', labelAr: 'توم فورد (Tom Ford)', labelEn: 'Tom Ford' },
  { value: 'versace', labelAr: 'فيرزاتشي (Versace)', labelEn: 'Versace' },
  { value: 'calvin_klein', labelAr: 'كالفين كلاين (Calvin Klein)', labelEn: 'Calvin Klein' },
  { value: 'hugo_boss', labelAr: 'هوغو بوس (Hugo Boss)', labelEn: 'Hugo Boss' },
  { value: 'lacoste', labelAr: 'لاكوست (Lacoste)', labelEn: 'Lacoste' },
  { value: 'rasasi', labelAr: 'رصاصي (Rasasi)', labelEn: 'Rasasi' },
  { value: 'ajmal', labelAr: 'أجمل (Ajmal)', labelEn: 'Ajmal' },
  { value: 'al_haramain', labelAr: 'الحرمين (Al Haramain)', labelEn: 'Al Haramain' },
  { value: 'lattafa', labelAr: 'لطافة (Lattafa)', labelEn: 'Lattafa' },
];

const COSMETICS_BRANDS: ListingFieldOption[] = [
  { value: 'loreal', labelAr: 'لوريال (L\'Oréal)', labelEn: 'L\'Oréal' },
  { value: 'maybelline', labelAr: 'ميبيلين (Maybelline)', labelEn: 'Maybelline' },
  { value: 'mac', labelAr: 'ماك (MAC)', labelEn: 'MAC' },
  { value: 'nars', labelAr: 'نارس (NARS)', labelEn: 'NARS' },
  { value: 'estee_lauder', labelAr: 'إستي لودر (Estée Lauder)', labelEn: 'Estée Lauder' },
  { value: 'lancome', labelAr: 'لانكوم (Lancôme)', labelEn: 'Lancôme' },
  { value: 'clinique', labelAr: 'كلينيك (Clinique)', labelEn: 'Clinique' },
  { value: 'fenty', labelAr: 'فينتي بيوتي (Fenty Beauty)', labelEn: 'Fenty Beauty' },
  { value: 'huda_beauty', labelAr: 'هدى بيوتي (Huda Beauty)', labelEn: 'Huda Beauty' },
  { value: 'charlotte_tilbury', labelAr: 'شارلوت تيلبري (Charlotte Tilbury)', labelEn: 'Charlotte Tilbury' },
  { value: 'nyx', labelAr: 'نيكس (NYX)', labelEn: 'NYX' },
];

const SKINCARE_BRANDS: ListingFieldOption[] = [
  { value: 'the_ordinary', labelAr: 'ذا أورديناري (The Ordinary)', labelEn: 'The Ordinary' },
  { value: 'cerave', labelAr: 'سيرافي (CeraVe)', labelEn: 'CeraVe' },
  { value: 'la_roche_posay', labelAr: 'لاروش بوزيه (La Roche-Posay)', labelEn: 'La Roche-Posay' },
  { value: 'neutrogena', labelAr: 'نيوتروجينا (Neutrogena)', labelEn: 'Neutrogena' },
  { value: 'nivea', labelAr: 'نيفيا (Nivea)', labelEn: 'Nivea' },
  { value: 'loccitane', labelAr: 'لوكسيتان (L\'Occitane)', labelEn: 'L\'Occitane' },
  { value: 'kiehls', labelAr: 'كيلز (Kiehl\'s)', labelEn: 'Kiehl\'s' },
  { value: 'vichy', labelAr: 'فيشي (Vichy)', labelEn: 'Vichy' },
  { value: 'bioderma', labelAr: 'بيوديرما (Bioderma)', labelEn: 'Bioderma' },
  { value: 'avene', labelAr: 'أفين (Avene)', labelEn: 'Avene' },
];

const HAIRCARE_BRANDS: ListingFieldOption[] = [
  { value: 'loreal', labelAr: 'لوريال (L\'Oréal)', labelEn: 'L\'Oréal' },
  { value: 'pantene', labelAr: 'بانتين (Pantene)', labelEn: 'Pantene' },
  { value: 'head_shoulders', labelAr: 'هيد آند شولدرز (Head & Shoulders)', labelEn: 'Head & Shoulders' },
  { value: 'dove', labelAr: 'دوف (Dove)', labelEn: 'Dove' },
  { value: 'garnier', labelAr: 'غارنييه (Garnier)', labelEn: 'Garnier' },
  { value: 'kerastase', labelAr: 'كيراستاس (Kerastase)', labelEn: 'Kerastase' },
  { value: 'olaplex', labelAr: 'أولابلكس (Olaplex)', labelEn: 'Olaplex' },
  { value: 'tresemme', labelAr: 'تريسمي (TRESemmé)', labelEn: 'TRESemmé' },
  { value: 'schwarzkopf', labelAr: 'شوارزكوف (Schwarzkopf)', labelEn: 'Schwarzkopf' },
  { value: 'dyson', labelAr: 'دايسون (Dyson)', labelEn: 'Dyson' },
];

const BEAUTY_DEVICE_BRANDS: ListingFieldOption[] = [
  { value: 'philips', labelAr: 'فيليبس (Philips)', labelEn: 'Philips' },
  { value: 'braun', labelAr: 'براون (Braun)', labelEn: 'Braun' },
  { value: 'oral_b', labelAr: 'أورال بي (Oral-B)', labelEn: 'Oral-B' },
  { value: 'foreo', labelAr: 'فوريو (Foreo)', labelEn: 'Foreo' },
  { value: 'dyson', labelAr: 'دايسون (Dyson)', labelEn: 'Dyson' },
  { value: 'remington', labelAr: 'ريمينغتون (Remington)', labelEn: 'Remington' },
  { value: 'panasonic', labelAr: 'باناسونيك (Panasonic)', labelEn: 'Panasonic' },
  { value: 'wahl', labelAr: 'وول (Wahl)', labelEn: 'Wahl' },
  { value: 'theragun', labelAr: 'ثيراغن (Theragun)', labelEn: 'Theragun' },
];

const BEAUTY_CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new_sealed', labelAr: 'جديد ومغلق بالكامل (مغلف)', labelEn: 'Brand New Sealed' },
  { value: 'new_unsealed', labelAr: 'جديد غير مستخدم (بدون تغليف)', labelEn: 'New Unsealed' },
  { value: 'lightly_used', labelAr: 'مستعمل بحالة ممتازة / تجربة خفيفة', labelEn: 'Lightly Used' },
];

const VOLUME_OPTIONS: ListingFieldOption[] = [
  { value: '30ml', labelAr: '30 مل أو أقل', labelEn: '30ml or less' },
  { value: '50ml', labelAr: '50 مل', labelEn: '50ml' },
  { value: '100ml', labelAr: '100 مل', labelEn: '100ml' },
  { value: '200ml', labelAr: '200 مل', labelEn: '200ml' },
  { value: '500ml_plus', labelAr: '500 مل فما فوق (حجم صالونات)', labelEn: '500ml+' },
];

export const BEAUTY_FIELDS: CategoryFieldMap = {
  'perfumes-cosmetics': [
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: [...PERFUME_BRANDS, ...COSMETICS_BRANDS] },
    { key: 'productType', labelAr: 'نوع المستحضر', labelEn: 'Product Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'foundation_powder', labelAr: 'كريم أساس وبودرة (Foundation / Powder)', labelEn: 'Foundation / Powder' },
      { value: 'lipstick_lipgloss', labelAr: 'أحمر شفاه وقلوس (Lipstick / Gloss)', labelEn: 'Lipstick / Gloss' },
      { value: 'eyeshadow_palette', labelAr: 'باليت ظلال عيون ومحددات', labelEn: 'Eyeshadow Palette' },
      { value: 'perfume_fragrance', labelAr: 'عطر / معطر جسم (Body Mist)', labelEn: 'Perfume / Mist' },
      { value: 'makeup_set', labelAr: 'طقم ومجموعة مكياج كاملة', labelEn: 'Makeup Kit / Set' },
      { value: 'brushes_tools', labelAr: 'فراشي مكياج وإسفنجات', labelEn: 'Brushes & Tools' },
    ]},
    { key: 'volume', labelAr: 'الحجم / السعة', labelEn: 'Volume / Size', type: 'select', allowOther: true, required: false, options: VOLUME_OPTIONS },
    { key: 'expiry', labelAr: 'تاريخ الانتهاء أو الصلاحية (MM/YYYY)', labelEn: 'Expiry Date', type: 'text', required: false, placeholder: '12/2026', placeholderAr: 'مثال: 12/2026' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: BEAUTY_CONDITION_OPTIONS },
    { key: 'original', labelAr: 'الأصالة', labelEn: 'Authenticity', type: 'select', allowOther: true, required: false, options: [
      { value: 'original_100', labelAr: 'أصلي 100% مع باركود', labelEn: '100% Authentic' },
      { value: 'high_copy', labelAr: 'هاي كوبي / بديل ممتاز', labelEn: 'High Copy' },
    ]},
  ],
  hair: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: false, options: HAIRCARE_BRANDS },
    { key: 'productType', labelAr: 'نوع المنتج أو الجهاز', labelEn: 'Product / Device Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'hair_dryer', labelAr: 'استشوار ومجفف شعر (Hair Dryer)', labelEn: 'Hair Dryer' },
      { value: 'straightener', labelAr: 'مملس شعر ومكواة (Straightener)', labelEn: 'Straightener' },
      { value: 'curler_styler', labelAr: 'فير ومصفف تمويج (Curler / Styler)', labelEn: 'Curler / Styler' },
      { value: 'hair_oil_serum', labelAr: 'زيوت وسيروم علاجي', labelEn: 'Hair Oil / Serum' },
      { value: 'treatment_mask', labelAr: 'علاج بروتين / كيراتين / ماسك', labelEn: 'Protein / Keratin Mask' },
      { value: 'shampoo_conditioner', labelAr: 'شامبو وبلسم علاجي', labelEn: 'Shampoo & Conditioner' },
    ]},
    { key: 'hairType', labelAr: 'مناسب لنوع الشعر', labelEn: 'Suitable Hair Type', type: 'select', allowOther: true, required: false, options: [
      { value: 'all', labelAr: 'جميع أنواع الشعر', labelEn: 'All Hair Types' },
      { value: 'curly', labelAr: 'للشعر الكيرلي والمجعد', labelEn: 'Curly / Wavy' },
      { value: 'dry_damaged', labelAr: 'للشعر الجاف والتالف والمصبوغ', labelEn: 'Dry / Damaged' },
      { value: 'oily', labelAr: 'للشعر الدهني', labelEn: 'Oily Hair' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: BEAUTY_CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان (للأجهزة الكهربائية)', labelEn: 'Warranty (Devices)', type: 'select', allowOther: true, required: false, options: [
      { value: 'active_warranty', labelAr: 'ساري الضمان', labelEn: 'Active Warranty' },
      { value: 'no_warranty', labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
    ]},
  ],
  skin: [
    { key: 'brand', labelAr: 'الماركة الطبية أو التجارية', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: SKINCARE_BRANDS },
    { key: 'productType', labelAr: 'نوع المستحضر', labelEn: 'Product Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'cleanser', labelAr: 'غسول وجه ومنظف (Cleanser)', labelEn: 'Cleanser' },
      { value: 'moisturizer', labelAr: 'كريم مرطب (Moisturizer)', labelEn: 'Moisturizer' },
      { value: 'serum', labelAr: 'سيروم علاجي (Vitamin C, Hyaluronic, Retinol)', labelEn: 'Serum' },
      { value: 'sunscreen', labelAr: 'واقي شمس (Sunscreen SPF 50+)', labelEn: 'Sunscreen' },
      { value: 'face_mask', labelAr: 'ماسك وتقشير (Peeling / Mask)', labelEn: 'Peeling / Mask' },
      { value: 'anti_aging', labelAr: 'علاج هالات وتجاعيد (Anti-Aging)', labelEn: 'Anti-Aging' },
    ]},
    { key: 'skinType', labelAr: 'نوع البشرة المناسب', labelEn: 'Skin Type', type: 'select', allowOther: true, required: false, options: [
      { value: 'all', labelAr: 'لجميع أنواع البشرة', labelEn: 'All Skin Types' },
      { value: 'sensitive', labelAr: 'للبشرة الحساسة', labelEn: 'Sensitive Skin' },
      { value: 'oily_acne', labelAr: 'للبشرة الدهنية والمعرضة للحبوب', labelEn: 'Oily & Acne-Prone' },
      { value: 'dry', labelAr: 'للبشرة الجافة وشديدة الجفاف', labelEn: 'Dry Skin' },
      { value: 'combination', labelAr: 'للبشرة المختلطة', labelEn: 'Combination Skin' },
    ]},
    { key: 'volume', labelAr: 'الحجم', labelEn: 'Volume', type: 'select', allowOther: true, required: false, options: VOLUME_OPTIONS },
    { key: 'expiry', labelAr: 'تاريخ الانتهاء (MM/YYYY)', labelEn: 'Expiry Date', type: 'text', required: false, placeholder: '06/2026', placeholderAr: 'مثال: 06/2026' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: BEAUTY_CONDITION_OPTIONS },
  ],
  care: [
    { key: 'deviceType', labelAr: 'نوع جهاز العناية', labelEn: 'Device Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'ipl_laser', labelAr: 'جهاز ليزر منزلي لإزالة الشعر (IPL Laser)', labelEn: 'IPL Laser Device' },
      { value: 'shaver_trimmer', labelAr: 'ماكينة حلاقة وتشذيب رجالية / نسائية', labelEn: 'Shaver / Trimmer' },
      { value: 'sonic_toothbrush', labelAr: 'فرشاة أسنان كهربائية أو جهاز خيط مائي', labelEn: 'Electric Toothbrush / Flosser' },
      { value: 'face_cleanser_device', labelAr: 'جهاز تنظيف الوجه والمساج (Foreo Style)', labelEn: 'Facial Cleanser Device' },
      { value: 'massage_gun', labelAr: 'جهاز تدليك ومساج عضلي (Massage Gun)', labelEn: 'Massage Gun' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: BEAUTY_DEVICE_BRANDS },
    { key: 'powerSource', labelAr: 'نوع الطاقة والتغذية', labelEn: 'Power Source', type: 'select', allowOther: true, required: false, options: [
      { value: 'rechargeable', labelAr: 'شحن لاسلكي / بطارية مدمجة', labelEn: 'Rechargeable Battery' },
      { value: 'corded', labelAr: 'سلك كهربائي مباشر', labelEn: 'Corded Electric' },
      { value: 'battery_aa', labelAr: 'بطاريات جافة عادية', labelEn: 'AA / AAA Batteries' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: BEAUTY_CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: [
      { value: 'with_warranty', labelAr: 'مرفق ضمان', labelEn: 'With Warranty' },
      { value: 'no_warranty', labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
    ]},
    { key: 'boxIncluded', labelAr: 'الكرتونة والملحقات الكاملة متوفرة', labelEn: 'Complete Box & Accessories', type: 'boolean', required: false },
  ],
};
