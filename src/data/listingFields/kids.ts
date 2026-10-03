import type { CategoryFieldMap, ListingFieldOption } from './types';

const KIDS_AGE_OPTIONS: ListingFieldOption[] = [
  { value: '0_3m', labelAr: 'حديث ولادة (0 - 3 أشهر)', labelEn: '0-3 Months' },
  { value: '3_6m', labelAr: '3 - 6 أشهر', labelEn: '3-6 Months' },
  { value: '6_12m', labelAr: '6 - 12 شهراً', labelEn: '6-12 Months' },
  { value: '1_2y', labelAr: '1 - 2 سنة', labelEn: '1-2 Years' },
  { value: '2_4y', labelAr: '2 - 4 سنوات', labelEn: '2-4 Years' },
  { value: '4_6y', labelAr: '4 - 6 سنوات', labelEn: '4-6 Years' },
  { value: '6_8y', labelAr: '6 - 8 سنوات', labelEn: '6-8 Years' },
  { value: '8_12y', labelAr: '8 - 12 سنة', labelEn: '8-12 Years' },
  { value: '12_plus', labelAr: '12+ سنة (محير)', labelEn: '12+ Years' },
];

const KIDS_GENDER_OPTIONS: ListingFieldOption[] = [
  { value: 'boy', labelAr: 'ولادي', labelEn: 'Boys' },
  { value: 'girl', labelAr: 'بناتي', labelEn: 'Girls' },
  { value: 'unisex', labelAr: 'للجنسين (محايد)', labelEn: 'Unisex' },
];

const KIDS_CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new_with_tags', labelAr: 'جديد بالتكت والكرتونة', labelEn: 'New with Tags' },
  { value: 'like_new', labelAr: 'مستعمل بحالة ممتازة جداً ونظيفة', labelEn: 'Like New' },
  { value: 'good', labelAr: 'مستعمل بحالة جيدة', labelEn: 'Good' },
];

export const KIDS_FIELDS: CategoryFieldMap = {
  clothes: [
    { key: 'clothingType', labelAr: 'نوع الملابس', labelEn: 'Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'onesie_bodysuit', labelAr: 'أفرول / سالوبيت / بودي', labelEn: 'Bodysuit / Onesie' },
      { value: 'set_outfit', labelAr: 'طقم خروج كامل (قطعتين/3 قطع)', labelEn: 'Full Outfit Set' },
      { value: 'dress', labelAr: 'فستان بناتي / فستان حفلات', labelEn: 'Girls Dress' },
      { value: 'jacket_coat', labelAr: 'جاكيت / معطف شتوي', labelEn: 'Jacket / Coat' },
      { value: 'pajamas', labelAr: 'بيجامات نوم قطنية', labelEn: 'Pajamas / Sleepwear' },
      { value: 'shoes', labelAr: 'أحذية وشوز أطفال', labelEn: 'Baby / Kids Shoes' },
    ]},
    { key: 'ageRange', labelAr: 'المقاس / الفئة العمرية', labelEn: 'Size / Age Range', type: 'select', allowOther: true, required: true, options: KIDS_AGE_OPTIONS },
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', allowOther: true, required: true, options: KIDS_GENDER_OPTIONS },
    { key: 'color', labelAr: 'اللون الأساسي', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: [
      { value: 'blue', labelAr: 'أزرق / سماوي', labelEn: 'Blue / Light Blue' },
      { value: 'pink', labelAr: 'زهري / وردي', labelEn: 'Pink' },
      { value: 'white', labelAr: 'أبيض / سكري', labelEn: 'White / Off-White' },
      { value: 'yellow', labelAr: 'أصفر', labelEn: 'Yellow' },
      { value: 'grey', labelAr: 'رمادي', labelEn: 'Grey' },
      { value: 'multicolor', labelAr: 'متعدد الألوان / مشجر', labelEn: 'Multicolor' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Mothercare, Carter’s, Zara Kids, H&M, Next...', placeholderAr: 'مثال: مذركير، كارترز، زارا كيدز...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: KIDS_CONDITION_OPTIONS },
    { key: 'season', labelAr: 'الموسم', labelEn: 'Season', type: 'select', allowOther: true, required: false, options: [
      { value: 'summer', labelAr: 'صيفي', labelEn: 'Summer' },
      { value: 'winter', labelAr: 'شتوي', labelEn: 'Winter' },
      { value: 'spring_fall', labelAr: 'ربيعي / خريفي', labelEn: 'Spring / Fall' },
    ]},
    { key: 'quantity', labelAr: 'عدد القطع في العرض', labelEn: 'Pieces Count', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'tags', labelAr: 'التيكيت والتاغ الأصلي متوفر', labelEn: 'Tags Included', type: 'boolean', required: false },
  ],
  toys: [
    { key: 'toyType', labelAr: 'نوع اللعبة', labelEn: 'Toy Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'lego_blocks', labelAr: 'ليجو ومكعبات وتركيب (LEGO)', labelEn: 'LEGO / Building Blocks' },
      { value: 'ride_on_electric', labelAr: 'سيارة / سكوتر كهربائي للأطفال', labelEn: 'Electric Ride-on / Scooter' },
      { value: 'dolls_plush', labelAr: 'دمى وباربي وألعاب محشوة', labelEn: 'Dolls & Plush' },
      { value: 'action_figures', labelAr: 'مجسمات وشخصيات كرتونية', labelEn: 'Action Figures' },
      { value: 'educational', labelAr: 'ألعاب تعليمية وتنمية ذكاء ومونتيسوري', labelEn: 'Educational & Montessori' },
      { value: 'board_games', labelAr: 'ألعاب جماعية وبازل (Board Games)', labelEn: 'Board Games & Puzzles' },
      { value: 'trampoline_swings', labelAr: 'ترامبولين وزحاليق ومراجيح', labelEn: 'Trampolines & Slides' },
    ]},
    { key: 'ageGroup', labelAr: 'الفئة العمرية المناسبة', labelEn: 'Target Age Group', type: 'select', allowOther: true, required: false, options: KIDS_AGE_OPTIONS },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'LEGO, Fisher-Price, Chicco, Disney...', placeholderAr: 'مثال: ليجو، فيشر برايس، شيكو...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: KIDS_CONDITION_OPTIONS },
    { key: 'batteryRequired', labelAr: 'تحتاج بطاريات للتشغيل', labelEn: 'Requires Batteries', type: 'boolean', required: false },
    { key: 'boxIncluded', labelAr: 'الكرتونة الأصلية ودليل التركيب متوفر', labelEn: 'Original Box & Manual Included', type: 'boolean', required: false },
  ],
  strollers: [
    { key: 'strollerType', labelAr: 'نوع التجهيز', labelEn: 'Gear Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'stroller_single', labelAr: 'عربة أطفال مفردة خفيفة (Stroller)', labelEn: 'Single Stroller' },
      { value: 'stroller_double', labelAr: 'عربة توأم / مزدوجة (Double Stroller)', labelEn: 'Double / Twin Stroller' },
      { value: 'travel_system', labelAr: 'نظام سفر كامل 3 في 1 (عربة + كارسيت + سرير)', labelEn: '3-in-1 Travel System' },
      { value: 'car_seat', labelAr: 'مقعد سيارة للأطفال (Car Seat / Isofix)', labelEn: 'Car Seat (Isofix)' },
      { value: 'baby_carrier', labelAr: 'شيالة أطفال قماشية / كانغارو', labelEn: 'Baby Carrier / Wrap' },
      { value: 'baby_rocker', labelAr: 'كرسي هزاز كهربائي / باونسر', labelEn: 'Electric Rocker / Bouncer' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Chicco, Graco, Joie, Stokke, Maxi-Cosi, Cybex...', placeholderAr: 'مثال: شيكو، جراكو، سايبكس، جوي...' },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: [
      { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
      { value: 'grey', labelAr: 'رمادي', labelEn: 'Grey' },
      { value: 'navy', labelAr: 'كحلي', labelEn: 'Navy' },
      { value: 'beige', labelAr: 'بيج', labelEn: 'Beige' },
      { value: 'pink_red', labelAr: 'زهري / أحمر', labelEn: 'Pink / Red' },
    ]},
    { key: 'foldable', labelAr: 'قابلة للطي بحجم الطائرة (Cabin Size)', labelEn: 'Cabin Size Foldable', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: KIDS_CONDITION_OPTIONS },
    { key: 'accessoriesIncluded', labelAr: 'الملحقات المتوفرة (غطاء مطر، شنطة...)', labelEn: 'Accessories (Raincover, Bag...)', type: 'text', required: false, placeholder: 'Raincover, Cup holder, Bag...', placeholderAr: 'مثال: غطاء مطر، حامل كاسات، شنطة...' },
  ],
  feeding: [
    { key: 'itemType', labelAr: 'نوع المستلزم', labelEn: 'Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'high_chair', labelAr: 'كرسي طعام أطفال (High Chair)', labelEn: 'High Chair' },
      { value: 'sterilizer_warmer', labelAr: 'جهاز تعقيم أو تسخين الرضاعات', labelEn: 'Sterilizer / Bottle Warmer' },
      { value: 'breast_pump', labelAr: 'شفاط حليب كهربائي / يدوي', labelEn: 'Breast Pump' },
      { value: 'baby_crib_bed', labelAr: 'سرير أطفال / مهد مواليد (Crib)', labelEn: 'Baby Crib / Bassinet' },
      { value: 'baby_monitor', labelAr: 'كاميرا وجهاز مراقبة الطفل (Baby Monitor)', labelEn: 'Baby Monitor Camera' },
      { value: 'feeding_set', labelAr: 'طقم رضاعات وصحون سيليكون', labelEn: 'Feeding Set / Bottles' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Philips Avent, Medela, Chicco, Tommee Tippee...', placeholderAr: 'مثال: فيليبس أفينت، ميديلا، تومي تيبي...' },
    { key: 'condition', labelAr: 'الحالة والنظافة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: KIDS_CONDITION_OPTIONS },
    { key: 'bpaFree', labelAr: 'خالٍ من مادة BPA وآمن صحياً', labelEn: 'BPA Free & Safe', type: 'boolean', required: false },
    { key: 'boxIncluded', labelAr: 'مغلف بالكرتونة الأصلية', labelEn: 'Original Box Included', type: 'boolean', required: false },
  ],
};
