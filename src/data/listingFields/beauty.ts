import type { CategoryFieldMap, ListingFieldOption } from './types';

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
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Huda Beauty, MAC, Maybelline, Dior...', placeholderAr: 'مثال: هدى بيوتي، ماك، ميبلين...' },
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
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Dyson, L’Oreal, Olaplex, Philips...', placeholderAr: 'مثال: دايسون، لوريال، أولابلكس...' },
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
    { key: 'brand', labelAr: 'الماركة الطبية أو التجارية', labelEn: 'Brand', type: 'text', required: true, placeholder: 'La Roche-Posay, CeraVe, The Ordinary, Vichy...', placeholderAr: 'مثال: لاروش بوزيه، سيرافي، ذا أورديناري...' },
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
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Philips, Braun, Braun Silk-expert, Oral-B...', placeholderAr: 'مثال: فيليبس، براون، أورال بي...' },
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
