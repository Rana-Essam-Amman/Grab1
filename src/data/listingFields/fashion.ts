import type { CategoryFieldMap, ListingFieldOption } from './types';

const CLOTHING_SIZES: ListingFieldOption[] = [
  { value: 'xs', labelAr: 'XS (صغير جداً)', labelEn: 'XS' },
  { value: 's', labelAr: 'S (صغير)', labelEn: 'S' },
  { value: 'm', labelAr: 'M (وسط)', labelEn: 'M' },
  { value: 'l', labelAr: 'L (كبير)', labelEn: 'L' },
  { value: 'xl', labelAr: 'XL (كبير جداً)', labelEn: 'XL' },
  { value: 'xxl', labelAr: 'XXL (2XL)', labelEn: 'XXL' },
  { value: '3xl_plus', labelAr: '3XL فما فوق (Plus Size)', labelEn: '3XL+' },
  { value: 'free_size', labelAr: 'قياس موحد (Free Size)', labelEn: 'Free Size' },
];

const SHOE_SIZES: ListingFieldOption[] = [
  { value: '36', labelAr: 'EU 36', labelEn: 'EU 36' },
  { value: '37', labelAr: 'EU 37', labelEn: 'EU 37' },
  { value: '38', labelAr: 'EU 38', labelEn: 'EU 38' },
  { value: '39', labelAr: 'EU 39', labelEn: 'EU 39' },
  { value: '40', labelAr: 'EU 40', labelEn: 'EU 40' },
  { value: '41', labelAr: 'EU 41', labelEn: 'EU 41' },
  { value: '42', labelAr: 'EU 42', labelEn: 'EU 42' },
  { value: '43', labelAr: 'EU 43', labelEn: 'EU 43' },
  { value: '44', labelAr: 'EU 44', labelEn: 'EU 44' },
  { value: '45', labelAr: 'EU 45', labelEn: 'EU 45' },
  { value: '46_plus', labelAr: 'EU 46+', labelEn: 'EU 46+' },
];

const COLOR_OPTIONS: ListingFieldOption[] = [
  { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
  { value: 'white', labelAr: 'أبيض', labelEn: 'White' },
  { value: 'beige', labelAr: 'بيج / نود', labelEn: 'Beige / Nude' },
  { value: 'brown', labelAr: 'بني / هافان', labelEn: 'Brown / Tan' },
  { value: 'navy', labelAr: 'كحلي / أزرق', labelEn: 'Navy / Blue' },
  { value: 'red', labelAr: 'أحمر / نبيذي', labelEn: 'Red / Burgundy' },
  { value: 'green', labelAr: 'أخضر / زيتي', labelEn: 'Green / Olive' },
  { value: 'pink', labelAr: 'زهري / وردي', labelEn: 'Pink' },
  { value: 'grey', labelAr: 'رمادي', labelEn: 'Grey' },
  { value: 'gold_silver', labelAr: 'ذهبي / فضي / ميتاليك', labelEn: 'Gold / Silver' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new_with_tags', labelAr: 'جديد مع التيكيت والتاغ الأصلي', labelEn: 'New with Tags' },
  { value: 'new_without_tags', labelAr: 'جديد بدون تيكيت (لم يُلبس)', labelEn: 'New without Tags' },
  { value: 'like_new', labelAr: 'مستعمل مرة واحدة بحالة الوكالة', labelEn: 'Like New (Worn Once)' },
  { value: 'good', labelAr: 'مستعمل بحالة جيدة ونظيفة جداً', labelEn: 'Good / Clean' },
];

const OCCASION_OPTIONS: ListingFieldOption[] = [
  { value: 'casual', labelAr: 'يومي وكاجوال', labelEn: 'Casual / Daily' },
  { value: 'formal', labelAr: 'رسمي وعمل', labelEn: 'Formal / Business' },
  { value: 'evening_party', labelAr: 'سهرات ومناسبات وأعراس', labelEn: 'Evening / Wedding' },
  { value: 'sports', labelAr: 'رياضي', labelEn: 'Sportswear' },
];

const SEASON_OPTIONS: ListingFieldOption[] = [
  { value: 'all_season', labelAr: 'جميع الفصول', labelEn: 'All Seasons' },
  { value: 'summer', labelAr: 'صيفي', labelEn: 'Summer' },
  { value: 'winter', labelAr: 'شتوي', labelEn: 'Winter' },
  { value: 'spring_autumn', labelAr: 'ربيعي / خريفي', labelEn: 'Spring / Autumn' },
];

export const FASHION_FIELDS: CategoryFieldMap = {
  women: [
    { key: 'clothingType', labelAr: 'نوع القطعة', labelEn: 'Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'dress', labelAr: 'فستان (سهرة / كاجوال)', labelEn: 'Dress' },
      { value: 'abaya', labelAr: 'عباية / جلابية / قفطان', labelEn: 'Abaya / Jalabiya' },
      { value: 'hijab', labelAr: 'حجاب وشالات', labelEn: 'Hijab / Scarves' },
      { value: 'top_blouse', labelAr: 'بلوزة / قميص / توب', labelEn: 'Top / Blouse / Shirt' },
      { value: 'jacket_coat', labelAr: 'جاكيت / معطف / بليزر', labelEn: 'Jacket / Coat / Blazer' },
      { value: 'pants_jeans', labelAr: 'بنطال / جينز / ليقنز', labelEn: 'Pants / Jeans / Leggings' },
      { value: 'skirt', labelAr: 'تنورة', labelEn: 'Skirt' },
      { value: 'suit_set', labelAr: 'طقم كامل / بدلة نسائية', labelEn: 'Suit / Two-Piece Set' },
    ]},
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', allowOther: true, required: true, options: CLOTHING_SIZES },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: true, options: COLOR_OPTIONS },
    { key: 'material', labelAr: 'المادة / نوع القماش', labelEn: 'Fabric / Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'cotton', labelAr: 'قطن 100%', labelEn: 'Cotton' },
      { value: 'silk_satin', labelAr: 'حرير / ساتان', labelEn: 'Silk / Satin' },
      { value: 'chiffon', labelAr: 'شيفون', labelEn: 'Chiffon' },
      { value: 'wool', labelAr: 'صوف / كشمير', labelEn: 'Wool / Cashmere' },
      { value: 'linen', labelAr: 'كتان طبيعي', labelEn: 'Linen' },
      { value: 'polyester_blend', labelAr: 'بوليستر / مخلوط', labelEn: 'Polyester Blend' },
    ]},
    { key: 'brand', labelAr: 'الماركة المصممة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Zara, Mango, Massimo Dutti, Shein...', placeholderAr: 'مثال: زارا، مانجو، ماسيمو دوتي...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'occasion', labelAr: 'المناسبة', labelEn: 'Occasion', type: 'select', allowOther: true, required: false, options: OCCASION_OPTIONS },
    { key: 'season', labelAr: 'الموسم', labelEn: 'Season', type: 'select', allowOther: true, required: false, options: SEASON_OPTIONS },
    { key: 'tags', labelAr: 'التيكيت والتاغ الأصلي موجود', labelEn: 'Original Tags Attached', type: 'boolean', required: false },
    { key: 'boxIncluded', labelAr: 'الكيس أو العلبة الأصلية متوفرة', labelEn: 'Original Bag / Box Included', type: 'boolean', required: false },
  ],
  men: [
    { key: 'clothingType', labelAr: 'نوع الملابس', labelEn: 'Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'suit_blazer', labelAr: 'بدلة رسمية / بليزر', labelEn: 'Suit / Blazer' },
      { value: 'shirt', labelAr: 'قميص رسمي / كاجوال', labelEn: 'Shirt' },
      { value: 'tshirt_polo', labelAr: 'تيشيرت / بولو', labelEn: 'T-Shirt / Polo' },
      { value: 'jacket_coat', labelAr: 'جاكيت / معطف شتوي / جلد', labelEn: 'Jacket / Coat' },
      { value: 'hoodie_sweater', labelAr: 'هودي / سويتر / كنزة', labelEn: 'Hoodie / Sweater' },
      { value: 'pants_jeans', labelAr: 'بنطال جينز / قماش / شينو', labelEn: 'Jeans / Pants' },
      { value: 'thobe', labelAr: 'دشداشة / ثوب رجالي', labelEn: 'Thobe / Traditional' },
      { value: 'sportswear', labelAr: 'ملابس رياضية / ترنج كامل', labelEn: 'Tracksuit / Activewear' },
    ]},
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', allowOther: true, required: true, options: CLOTHING_SIZES },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: true, options: COLOR_OPTIONS },
    { key: 'material', labelAr: 'المادة / القماش', labelEn: 'Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'cotton', labelAr: 'قطن', labelEn: 'Cotton' },
      { value: 'leather', labelAr: 'جلد طبيعي', labelEn: 'Genuine Leather' },
      { value: 'wool', labelAr: 'صوف', labelEn: 'Wool' },
      { value: 'denim', labelAr: 'جينز (Denim)', labelEn: 'Denim' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Hugo Boss, Ralph Lauren, Zara, Nike...', placeholderAr: 'مثال: رالف لورين، زارا، نايكي...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'occasion', labelAr: 'المناسبة', labelEn: 'Occasion', type: 'select', allowOther: true, required: false, options: OCCASION_OPTIONS },
    { key: 'season', labelAr: 'الموسم', labelEn: 'Season', type: 'select', allowOther: true, required: false, options: SEASON_OPTIONS },
    { key: 'tags', labelAr: 'التاغ الأصلي متوفر', labelEn: 'Tags Included', type: 'boolean', required: false },
  ],
  'watches-jewelry': [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'necklace', labelAr: 'سلسال / قلادة / عقد', labelEn: 'Necklace' },
      { value: 'ring', labelAr: 'خاتم / محبس / دبلة', labelEn: 'Ring' },
      { value: 'bracelet', labelAr: 'سوار / إسوارة / بنجر', labelEn: 'Bracelet / Bangle' },
      { value: 'earrings', labelAr: 'حلق / أقراط', labelEn: 'Earrings' },
      { value: 'jewelry_set', labelAr: 'طقم مجوهرات كامل', labelEn: 'Full Jewelry Set' },
      { value: 'cufflinks', labelAr: 'كبك رجالي / بروش', labelEn: 'Cufflinks / Brooch' },
    ]},
    { key: 'metalType', labelAr: 'نوع المعدن / الحجر', labelEn: 'Metal / Stone', type: 'select', allowOther: true, required: true, options: [
      { value: 'gold_24k', labelAr: 'ذهب عيار 24', labelEn: 'Gold 24K' },
      { value: 'gold_21k', labelAr: 'ذهب عيار 21', labelEn: 'Gold 21K' },
      { value: 'gold_18k', labelAr: 'ذهب عيار 18', labelEn: 'Gold 18K' },
      { value: 'silver_925', labelAr: 'فضة عيار 925 إسترليني', labelEn: 'Sterling Silver 925' },
      { value: 'diamond', labelAr: 'ألماس طبيعي / معتمد', labelEn: 'Diamond' },
      { value: 'gold_plated', labelAr: 'مطلية بالذهب / إكسسوار فاخر', labelEn: 'Gold-Plated' },
    ]},
    { key: 'weightGrams', labelAr: 'الوزن التقريبي (بالجرام)', labelEn: 'Weight in Grams', type: 'number', required: false, placeholder: '5.5', placeholderAr: '5.5' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة المصنعة (إن وجدت)', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Cartier, Tiffany & Co, Pandora, Damas...', placeholderAr: 'مثال: داماس، تيفاني، باندورا...' },
    { key: 'certified', labelAr: 'مرفق فاتورة أو شهادة فحص معتمدة', labelEn: 'Certificate / Invoice Included', type: 'boolean', required: false },
    { key: 'boxIncluded', labelAr: 'العلبة الأصلية متوفرة', labelEn: 'Original Box Included', type: 'boolean', required: false },
  ],
  bags: [
    { key: 'bagType', labelAr: 'نوع الحقيبة', labelEn: 'Bag Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'handbag', labelAr: 'حقيبة يد نسائية (Handbag)', labelEn: 'Handbag' },
      { value: 'crossbody', labelAr: 'حقيبة كتف / كروس بودي (Crossbody)', labelEn: 'Crossbody' },
      { value: 'backpack', labelAr: 'حقيبة ظهر (Backpack)', labelEn: 'Backpack' },
      { value: 'tote', labelAr: 'حقيبة تسوق كبيرة (Tote Bag)', labelEn: 'Tote Bag' },
      { value: 'clutch', labelAr: 'كلاتش / سهرة (Clutch)', labelEn: 'Clutch' },
      { value: 'luggage', labelAr: 'حقيبة سفر / ترولي (Luggage)', labelEn: 'Luggage / Suitcase' },
      { value: 'wallet', labelAr: 'محفظة نقود وبطاقات (Wallet)', labelEn: 'Wallet' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Louis Vuitton, Chanel, Michael Kors, Coach...', placeholderAr: 'مثال: لويس فيتون، كوتش، مايكل كورس...' },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'genuine_leather', labelAr: 'جلد طبيعي فاخر', labelEn: 'Genuine Leather' },
      { value: 'vegan_leather', labelAr: 'جلد صناعي (Vegan Leather / PU)', labelEn: 'Vegan / Faux Leather' },
      { value: 'canvas', labelAr: 'كانفس مقوى (Canvas)', labelEn: 'Canvas' },
      { value: 'nylon', labelAr: 'نايلون مقاوم للماء', labelEn: 'Nylon' },
    ]},
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: true, options: COLOR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'dustbagIncluded', labelAr: 'كيس الحماية القماشي متوفر (Dustbag)', labelEn: 'Dustbag Included', type: 'boolean', required: false },
    { key: 'boxIncluded', labelAr: 'العلبة الأصلية والفاتورة متوفرة', labelEn: 'Original Box & Receipt Included', type: 'boolean', required: false },
  ],
  shoes: [
    { key: 'shoeType', labelAr: 'نوع الحذاء', labelEn: 'Shoe Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'sneakers', labelAr: 'سنيكرز / حذاء رياضي (Sneakers)', labelEn: 'Sneakers' },
      { value: 'formal_oxford', labelAr: 'حذاء رسمي / أوكسفورد / لوفر', labelEn: 'Formal / Oxford / Loafers' },
      { value: 'heels', labelAr: 'كعب عالي / صندل سهرة نسائي', labelEn: 'Heels / Pumps' },
      { value: 'boots', labelAr: 'بوت / هاف بوت شتوي (Boots)', labelEn: 'Boots' },
      { value: 'sandals_slippers', labelAr: 'صندل / سليبر / شبشب مريح', labelEn: 'Sandals / Slippers' },
    ]},
    { key: 'gender', labelAr: 'الفئة', labelEn: 'Gender', type: 'select', allowOther: true, required: true, options: [
      { value: 'men', labelAr: 'رجالي', labelEn: 'Men' },
      { value: 'women', labelAr: 'نسائي', labelEn: 'Women' },
      { value: 'kids', labelAr: 'أطفال', labelEn: 'Kids' },
      { value: 'unisex', labelAr: 'للجنسين', labelEn: 'Unisex' },
    ]},
    { key: 'size', labelAr: 'المقاس الأوروبي (EU Size)', labelEn: 'Size (EU)', type: 'select', allowOther: true, required: true, options: SHOE_SIZES },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Nike, Adidas, Jordan, New Balance, Aldo...', placeholderAr: 'مثال: نايكي، أديداس، جوردن...' },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: true, options: COLOR_OPTIONS },
    { key: 'material', labelAr: 'الخامة الخارجية', labelEn: 'Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'leather', labelAr: 'جلد طبيعي', labelEn: 'Leather' },
      { value: 'suede', labelAr: 'جلد شمواه (Suede)', labelEn: 'Suede' },
      { value: 'mesh_fabric', labelAr: 'قماش شبكي خفيف (Mesh)', labelEn: 'Mesh / Fabric' },
      { value: 'synthetic', labelAr: 'مواد صناعية', labelEn: 'Synthetic' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'boxIncluded', labelAr: 'الكرتونة الأصلية متوفرة', labelEn: 'Original Box Included', type: 'boolean', required: false },
  ],
  perfumes: [
    { key: 'brand', labelAr: 'الماركة ودار العطور', labelEn: 'Brand / House', type: 'text', required: true, placeholder: 'Dior, Chanel, Creed, Tom Ford, Arabian Oud...', placeholderAr: 'مثال: ديور، شانيل، توم فورد، العربية للعود...' },
    { key: 'perfumeName', labelAr: 'اسم العطر', labelEn: 'Perfume Name', type: 'text', required: true, placeholder: 'Sauvage, Bleu de Chanel, Aventus...', placeholderAr: 'مثال: سوفاج، بلو دو شانيل، أفينتوس...' },
    { key: 'concentration', labelAr: 'تركيز العطر', labelEn: 'Concentration', type: 'select', allowOther: true, required: false, options: [
      { value: 'edp', labelAr: 'أو دو بارفيوم (Eau de Parfum)', labelEn: 'Eau de Parfum (EDP)' },
      { value: 'edt', labelAr: 'أو دو تواليت (Eau de Toilette)', labelEn: 'Eau de Toilette (EDT)' },
      { value: 'parfum_elixir', labelAr: 'بارفيوم / إكسير نقي (Parfum / Elixir)', labelEn: 'Parfum / Elixir' },
      { value: 'cologne', labelAr: 'أو دو كولونيا (Cologne)', labelEn: 'Eau de Cologne' },
      { value: 'oil_oud', labelAr: 'دهن عود / زيت عطري مركز', labelEn: 'Oud Oil / Concentrated' },
    ]},
    { key: 'gender', labelAr: 'الفئة', labelEn: 'Gender', type: 'select', allowOther: true, required: true, options: [
      { value: 'men', labelAr: 'رجالي', labelEn: 'Men' },
      { value: 'women', labelAr: 'نسائي', labelEn: 'Women' },
      { value: 'unisex', labelAr: 'للجنسين (Unisex)', labelEn: 'Unisex' },
    ]},
    { key: 'volume', labelAr: 'حجم الزجاجة (مل)', labelEn: 'Bottle Volume (ml)', type: 'select', allowOther: true, required: true, options: [
      { value: '50ml', labelAr: '50 مل', labelEn: '50 ml' },
      { value: '75ml', labelAr: '75 مل', labelEn: '75 ml' },
      { value: '100ml', labelAr: '100 مل', labelEn: '100 ml' },
      { value: '125_150ml', labelAr: '125 - 150 مل', labelEn: '125 - 150 ml' },
      { value: '200ml', labelAr: '200 مل', labelEn: '200 ml' },
      { value: 'decant_sample', labelAr: 'عينة / تقسيمة (Decant 5-10ml)', labelEn: 'Sample / Decant' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: [
      { value: 'sealed_new', labelAr: 'جديد ومغلف بالسيلوفان بالكامل', labelEn: 'Brand New Sealed' },
      { value: 'opened_full', labelAr: 'مفتوح للتجربة (بخات معدودة 99%)', labelEn: 'Open Box (99% Full)' },
      { value: 'used_partial', labelAr: 'مستعمل متبقي جزء من الزجاجة', labelEn: 'Partially Used' },
      { value: 'tester', labelAr: 'تستر أصلي (Tester)', labelEn: 'Tester' },
    ]},
    { key: 'boxIncluded', labelAr: 'العلبة الأصلية متوفرة', labelEn: 'Original Box Included', type: 'boolean', required: false },
  ],
};
