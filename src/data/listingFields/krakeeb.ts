import type { CategoryFieldMap, ListingFieldOption } from './types';

const KRAKEEB_CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new_surplus', labelAr: 'جديد فائض عن الحاجة', labelEn: 'Brand New Surplus' },
  { value: 'used_good', labelAr: 'مستعمل بحالة جيدة جداً وشغال', labelEn: 'Used - Good Working' },
  { value: 'used_fair', labelAr: 'مستعمل بحالة مقبولة', labelEn: 'Used - Fair' },
  { value: 'for_parts_scrap', labelAr: 'قطع غيار / سكراب وتصليح', labelEn: 'For Parts / Scrap' },
];

export const KRAKEEB_FIELDS: CategoryFieldMap = {
  general: [
    { key: 'category', labelAr: 'تصنيف الأغراض المعروضة', labelEn: 'Category', type: 'select', allowOther: true, required: true, options: [
      { value: 'home_appliances_misc', labelAr: 'أجهزة وأدوات منزلية وكهربائية متنوعة', labelEn: 'Household & Misc Appliances' },
      { value: 'tools_hardware', labelAr: 'عدد يدوية ولوازم ورش ومسامير', labelEn: 'Tools & Hardware' },
      { value: 'electronics_cables', labelAr: 'إلكترونيات وشواحن ووصلات وكوابل', labelEn: 'Electronics & Cables' },
      { value: 'furniture_scraps', labelAr: 'قطع أثاث وأرفف وخزائن قديمة', labelEn: 'Furniture Pieces & Shelves' },
      { value: 'kitchenware', labelAr: 'أواني مطبخ وصحون وكاسات فائضة', labelEn: 'Kitchenware' },
      { value: 'toys_games_misc', labelAr: 'ألعاب وأغراض أطفال متفرقة', labelEn: 'Misc Toys & Games' },
      { value: 'storage_boxes', labelAr: 'صناديق تخزين وتنظيم كراكيب', labelEn: 'Storage Boxes & Totes' },
    ]},
    { key: 'condition', labelAr: 'الحالة العامة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: KRAKEEB_CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة أو الوصف المختصر', labelEn: 'Brand / Description', type: 'text', required: false, placeholder: 'Brand / Brief description...', placeholderAr: 'الماركة أو وصف سريع...' },
    { key: 'quantity', labelAr: 'عدد القطع في الصفقة / الشروة', labelEn: 'Quantity / Count', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'pickupAvailable', labelAr: 'الاستلام من موقع البائع فوراً', labelEn: 'Immediate Pickup Available', type: 'boolean', required: false },
  ],
  vintage: [
    { key: 'era', labelAr: 'الفترة الزمنية / الحقبة', labelEn: 'Era / Decade', type: 'select', allowOther: true, required: false, options: [
      { value: 'pre_1950', labelAr: 'قبل عام 1950 (أنتيك وتاريخي)', labelEn: 'Pre-1950 (Antique)' },
      { value: '1960s_1970s', labelAr: 'الستينات والسبعينات (Vintage 60s/70s)', labelEn: '1960s - 1970s' },
      { value: '1980s_1990s', labelAr: 'الثمانينات والتسعينات (Retro 80s/90s)', labelEn: '1980s - 1990s' },
      { value: 'early_2000s', labelAr: 'أوائل الألفين (Y2K Retro)', labelEn: 'Early 2000s' },
    ]},
    { key: 'itemType', labelAr: 'نوع الغرض الكلاسيكي', labelEn: 'Item Type', type: 'text', required: true, placeholder: 'Radio, Typewriter, Telephone...', placeholderAr: 'مثال: راديو ترانزستور، آلة كاتبة، تلفون قرص...' },
    { key: 'material', labelAr: 'المادة المصنعة الأساسية', labelEn: 'Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'wood_metal', labelAr: 'خشب مع نحاس / حديد', labelEn: 'Wood & Metal' },
      { value: 'bakelite_plastic', labelAr: 'بلاستيك بيكلايت قديم (Bakelite)', labelEn: 'Bakelite / Vintage Plastic' },
      { value: 'glass_porcelain', labelAr: 'زجاج ملون وخزف قديم', labelEn: 'Glass / Porcelain' },
    ]},
    { key: 'workingCondition', labelAr: 'يعمل وشغال بكفاءة', labelEn: 'Working Condition', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة الجمالية', labelEn: 'Aesthetic Condition', type: 'select', allowOther: true, required: true, options: [
      { value: 'mint_preserved', labelAr: 'مقتنى بحالة نادرة جداً كالجديد', labelEn: 'Mint Preserved' },
      { value: 'good_patina', labelAr: 'معتق بلمسة الزمن الأصلية', labelEn: 'Good Vintage Patina' },
      { value: 'display_only', labelAr: 'للعرض والديكور فقط (غير شغال)', labelEn: 'For Display / Decor Only' },
    ]},
  ],
  clearances: [
    { key: 'clearanceReason', labelAr: 'سبب التصفية والشروة', labelEn: 'Clearance Reason', type: 'select', allowOther: true, required: true, options: [
      { value: 'store_closing', labelAr: 'تصفية محل تجاري / إغلاق نشاط', labelEn: 'Store Closing / Liquidation' },
      { value: 'moving_abroad', labelAr: 'تصفية محتويات منزل بداعي السفر', labelEn: 'Relocation / Moving Abroad' },
      { value: 'overstock', labelAr: 'بواقي مستودعات وستوك فائض (Overstock)', labelEn: 'Warehouse Overstock' },
      { value: 'damaged_box', labelAr: 'كراتين تالفة وبواقي معارض', labelEn: 'Open Box / Display Clearance' },
    ]},
    { key: 'itemType', labelAr: 'نوع البضاعة المعروضة في الشروة', labelEn: 'Clearance Inventory Type', type: 'text', required: true, placeholder: 'Clothes, Electronics, Household...', placeholderAr: 'مثال: ملابس جملة، إلكترونيات، مستلزمات...' },
    { key: 'condition', labelAr: 'حالة البضاعة', labelEn: 'Lot Condition', type: 'select', allowOther: true, required: true, options: [
      { value: 'all_new', labelAr: 'جميع القطع جديدة 100%', labelEn: '100% Brand New' },
      { value: 'mixed_condition', labelAr: 'مختلط (جديد + مستعمل نظيف)', labelEn: 'Mixed Lot' },
      { value: 'grade_b', labelAr: 'فرز ثاني / عيوب بسيطة', labelEn: 'Grade B / Minor Defects' },
    ]},
    { key: 'bulkSale', labelAr: 'البيع كامل الصفقة دفعة واحدة (شروة واحدة)', labelEn: 'Take-All Bulk Sale Only', type: 'boolean', required: false },
    { key: 'quantity', labelAr: 'العدد الإجمالي للقطع', labelEn: 'Total Units Count', type: 'number', required: false, placeholder: '50', placeholderAr: '50' },
  ],
};
