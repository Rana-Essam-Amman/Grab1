import type { CategoryFieldMap, ListingFieldOption } from './types';

const CONDITION_OPTIONS: readonly ListingFieldOption[] = [
  { value: 'new_sealed', labelAr: 'جديد ومغلق (مغلف)', labelEn: 'Brand New Sealed' },
  { value: 'new_open_box', labelAr: 'جديد علبة مفتوحة', labelEn: 'New Open Box' },
  { value: 'used_like_new', labelAr: 'مستعمل شبه جديد', labelEn: 'Used Like New' },
  { value: 'used_good', labelAr: 'مستعمل بحالة جيدة', labelEn: 'Used Good' },
  { value: 'used_fair', labelAr: 'مستعمل بحالة مقبولة', labelEn: 'Used Fair' },
  { value: 'for_parts', labelAr: 'للبيع كقطع غيار / سكراب', labelEn: 'For Parts / Scrap' },
];

const WORKING_CONDITION_OPTIONS: readonly ListingFieldOption[] = [
  { value: 'fully_working', labelAr: 'شغال تماماً وبكفاءة', labelEn: 'Fully Working' },
  { value: 'minor_issues', labelAr: 'شغال مع وجود عيوب بسيطة', labelEn: 'Minor Issues' },
  { value: 'not_working', labelAr: 'غير شغال (بحاجة صيانة)', labelEn: 'Not Working' },
];

const SELLER_TYPE_OPTIONS: readonly ListingFieldOption[] = [
  { value: 'owner', labelAr: 'مالك مباشر', labelEn: 'Direct Owner' },
  { value: 'shop', labelAr: 'محل تجاري', labelEn: 'Shop / Business' },
  { value: 'reseller', labelAr: 'بائع متجول / وسيط', labelEn: 'Individual Reseller' },
];

const ERA_OPTIONS: readonly ListingFieldOption[] = [
  { value: 'pre_1900', labelAr: 'أنتيك قديم جداً (قبل 1900)', labelEn: 'Antique (Pre-1900)' },
  { value: '1900_1950', labelAr: 'من 1900 إلى 1950', labelEn: '1900 - 1950' },
  { value: '1950_1990', labelAr: 'فينتج (1950 - 1990)', labelEn: 'Vintage (1950 - 1990)' },
  { value: '1990_2010', labelAr: 'ريترو كلاسيك (1990 - 2010)', labelEn: 'Retro (1990 - 2010)' },
];

export const KRAKEEB_FIELDS: CategoryFieldMap = {
  general: [
    { key: 'category', labelAr: 'ما نوع الغرض؟', labelEn: 'What is the item?', type: 'text', required: true, placeholder: 'e.g. Vacuum, Kettle, Tools...', placeholderAr: 'مثال: مكنسة، غلاية، عِدّة...' },
    { key: 'subcategory', labelAr: 'تفصيل إضافي للغرض', labelEn: 'Subcategory Detail', type: 'text', required: false, placeholder: 'e.g. Wireless, Industrial...', placeholderAr: 'مثال: لاسلكي، صناعي...' },
    { key: 'condition', labelAr: 'حالة الغرض', labelEn: 'Item Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة (إن وجدت)', labelEn: 'Brand (If any)', type: 'text', required: false, placeholder: 'Brand name...', placeholderAr: 'اسم الماركة...' },
    { key: 'ageYears', labelAr: 'عمر الغرض (بالسنوات)', labelEn: 'Age (Years)', type: 'number', required: false, placeholder: '0', placeholderAr: '0' },
    { key: 'quantity', labelAr: 'عدد القطع', labelEn: 'Quantity', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'dimensions', labelAr: 'المقاسات / الأبعاد', labelEn: 'Dimensions / Size', type: 'text', required: false, placeholder: 'e.g. 50x30 cm', placeholderAr: 'مثال: 50x30 سم' },
    { key: 'workingCondition', labelAr: 'حالة التشغيل', labelEn: 'Working Condition', type: 'select', allowOther: true, required: false, options: WORKING_CONDITION_OPTIONS },
    { key: 'originalBoxIncluded', labelAr: 'الكرتونة الأصلية متوفرة', labelEn: 'Original Box Included', type: 'boolean', required: false },
    { key: 'pickupNote', labelAr: 'ملاحظات الاستلام', labelEn: 'Pickup Notes', type: 'text', required: false, placeholder: 'Floor level, elevator, location...', placeholderAr: 'الطابق، المصعد، الموقع...' },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'negotiable', labelAr: 'السعر قابل للتفاوض', labelEn: 'Price Negotiable', type: 'boolean', required: false },
  ],
  vintage: [
    { key: 'itemType', labelAr: 'نوع القطعة الكلاسيكية', labelEn: 'Vintage Item Type', type: 'text', required: true, placeholder: 'e.g. Radio, Typewriter, Clock...', placeholderAr: 'مثال: راديو، آلة كاتبة، ساعة...' },
    { key: 'era', labelAr: 'الحقبة الزمنية', labelEn: 'Era / Decade', type: 'select', allowOther: true, required: false, options: ERA_OPTIONS },
    { key: 'origin', labelAr: 'بلد المنشأ الأصلي', labelEn: 'Origin Country', type: 'text', required: false, placeholder: 'Germany, UK, USA...', placeholderAr: 'ألمانيا، بريطانيا، أمريكا...' },
    { key: 'material', labelAr: 'المادة المصنعة', labelEn: 'Material', type: 'text', required: false, placeholder: 'Wood, Brass, Copper...', placeholderAr: 'خشب، نحاس، حديد...' },
    { key: 'condition', labelAr: 'الحالة الفنية', labelEn: 'Technical Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'restored', labelAr: 'تم ترميم القطعة؟', labelEn: 'Was it Restored?', type: 'boolean', required: false },
    { key: 'certified', labelAr: 'يوجد شهادة أصالة؟', labelEn: 'Is it Certified?', type: 'boolean', required: false },
    { key: 'ageYears', labelAr: 'العمر التقريبي (بالسنوات)', labelEn: 'Approximate Age', type: 'number', required: false, placeholder: '50', placeholderAr: '50' },
    { key: 'dimensions', labelAr: 'الأبعاد', labelEn: 'Dimensions', type: 'text', required: false, placeholder: 'Height, Width...', placeholderAr: 'الطول، العرض...' },
    { key: 'story', labelAr: 'تاريخ القطعة / قصتها', labelEn: 'Item Story / History', type: 'text', required: false, placeholder: 'History of this item...', placeholderAr: 'تاريخ أو قصة هذه القطعة...' },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
  clearances: [
    { key: 'itemType', labelAr: 'ما الغرض المتصفي؟', labelEn: 'What is being cleared?', type: 'text', required: true, placeholder: 'Clothing lot, household goods...', placeholderAr: 'شروة ملابس، أغراض منزلية...' },
    { key: 'quantity', labelAr: 'العدد الإجمالي للقطع', labelEn: 'Total Quantity', type: 'number', required: false, placeholder: '10', placeholderAr: '10' },
    { key: 'bundleAvailable', labelAr: 'البيع كمجموعة واحدة (شروة)', labelEn: 'Bundle / Lot Sale Only', type: 'boolean', required: false },
    { key: 'bulkPricing', labelAr: 'يتوفر سعر خاص للجملة', labelEn: 'Bulk Pricing Available', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'حالة البضاعة', labelEn: 'Goods Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'workingCondition', labelAr: 'حالة التشغيل', labelEn: 'Working Condition', type: 'select', allowOther: true, required: false, options: WORKING_CONDITION_OPTIONS },
    { key: 'originalPrice', labelAr: 'السعر الأصلي (قبل التصفية)', labelEn: 'Original Price', type: 'number', required: false, placeholder: '0', placeholderAr: '0' },
    { key: 'clearancePrice', labelAr: 'سعر التصفية (النهائي)', labelEn: 'Clearance Price', type: 'number', required: false, placeholder: '0', placeholderAr: '0' },
    { key: 'dimensions', labelAr: 'الأبعاد / الوزن الإجمالي', labelEn: 'Dimensions / Total Weight', type: 'text', required: false, placeholder: 'Size or Weight...', placeholderAr: 'الحجم أو الوزن...' },
    { key: 'pickupOnly', labelAr: 'الاستلام من الموقع فقط (لا يوجد توصيل)', labelEn: 'Pickup Only (No Delivery)', type: 'boolean', required: false },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'negotiable', labelAr: 'السعر قابل للنقاش', labelEn: 'Price is Negotiable', type: 'boolean', required: false },
  ],
};
