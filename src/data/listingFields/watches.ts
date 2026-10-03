import type { CategoryFieldMap, ListingFieldOption } from './types';

const WATCH_BRANDS: ListingFieldOption[] = [
  { value: 'rolex', labelAr: 'رولكس', labelEn: 'Rolex' },
  { value: 'omega', labelAr: 'أوميغا', labelEn: 'Omega' },
  { value: 'cartier', labelAr: 'كارتييه', labelEn: 'Cartier' },
  { value: 'tag_heuer', labelAr: 'تاغ هوير', labelEn: 'Tag Heuer' },
  { value: 'seiko', labelAr: 'سيكو', labelEn: 'Seiko' },
  { value: 'casio', labelAr: 'كاسيو', labelEn: 'Casio' },
  { value: 'tissot', labelAr: 'تيسو', labelEn: 'Tissot' },
  { value: 'longines', labelAr: 'لونجين', labelEn: 'Longines' },
  { value: 'iwc', labelAr: 'IWC', labelEn: 'IWC' },
  { value: 'panerai', labelAr: 'بانيراي', labelEn: 'Panerai' },
  { value: 'hublot', labelAr: 'هوبلو', labelEn: 'Hublot' },
  { value: 'breitling', labelAr: 'برايتلينغ', labelEn: 'Breitling' },
  { value: 'patek_philippe', labelAr: 'باتيك فيليب', labelEn: 'Patek Philippe' },
  { value: 'audemars_piguet', labelAr: 'أوديمار بيغيه', labelEn: 'Audemars Piguet' },
  { value: 'vacheron_constantin', labelAr: 'فاشيرون كونستانتين', labelEn: 'Vacheron Constantin' },
  { value: 'citizen', labelAr: 'سيتيزن', labelEn: 'Citizen' },
  { value: 'orient', labelAr: 'أورينت', labelEn: 'Orient' },
  { value: 'fossil', labelAr: 'فوسيل', labelEn: 'Fossil' },
];

const MOVEMENT_OPTIONS: ListingFieldOption[] = [
  { value: 'automatic', labelAr: 'أوتوماتيك', labelEn: 'Automatic' },
  { value: 'quartz', labelAr: 'كوارتز (بطارية)', labelEn: 'Quartz' },
  { value: 'manual', labelAr: 'يدوي (تعبئة)', labelEn: 'Manual Hand-Wind' },
  { value: 'solar', labelAr: 'طاقة شمسية', labelEn: 'Solar' },
];

const CASE_MATERIALS: ListingFieldOption[] = [
  { value: 'steel', labelAr: 'ستانلس ستيل', labelEn: 'Stainless Steel' },
  { value: 'gold', labelAr: 'ذهب أصفر', labelEn: 'Yellow Gold' },
  { value: 'rose_gold', labelAr: 'ذهب وردي', labelEn: 'Rose Gold' },
  { value: 'white_gold', labelAr: 'ذهب أبيض', labelEn: 'White Gold' },
  { value: 'titanium', labelAr: 'تيتانيوم', labelEn: 'Titanium' },
  { value: 'ceramic', labelAr: 'سيراميك', labelEn: 'Ceramic' },
  { value: 'plastic', labelAr: 'بلاستيك / راتنج', labelEn: 'Plastic / Resin' },
  { value: 'bronze', labelAr: 'برونز', labelEn: 'Bronze' },
];

const STRAP_MATERIALS: ListingFieldOption[] = [
  { value: 'leather', labelAr: 'جلد طبيعي', labelEn: 'Leather' },
  { value: 'steel', labelAr: 'ستانلس ستيل', labelEn: 'Stainless Steel' },
  { value: 'silicone', labelAr: 'سيليكون', labelEn: 'Silicone' },
  { value: 'rubber', labelAr: 'مطاط', labelEn: 'Rubber' },
  { value: 'nylon', labelAr: 'نايلون / ناتو', labelEn: 'Nylon / NATO' },
  { value: 'gold', labelAr: 'ذهب', labelEn: 'Gold' },
  { value: 'titanium', labelAr: 'تيتانيوم', labelEn: 'Titanium' },
];

const WATER_RESISTANCE_OPTIONS: ListingFieldOption[] = [
  { value: 'splash', labelAr: 'مقاومة رذاذ (30m)', labelEn: '30m (Splash)' },
  { value: '50m', labelAr: '50 متر (5 ATM)', labelEn: '50m (5 ATM)' },
  { value: '100m', labelAr: '100 متر (10 ATM)', labelEn: '100m (10 ATM)' },
  { value: '200m', labelAr: '200 متر غوص (20 ATM)', labelEn: '200m (Diver 20 ATM)' },
  { value: '300m_plus', labelAr: '300+ متر احترافي', labelEn: '300m+ Professional' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد بالكرتونة', labelEn: 'Brand New' },
  { value: 'excellent', labelAr: 'ممتاز كالجديد', labelEn: 'Excellent / Like New' },
  { value: 'good', labelAr: 'جيد جداً', labelEn: 'Very Good' },
  { value: 'fair', labelAr: 'مستعمل بحالة مقبولة', labelEn: 'Fair' },
  { value: 'needs_service', labelAr: 'يحتاج صيانة / قطع', labelEn: 'Needs Service' },
];

const GENDER_OPTIONS: ListingFieldOption[] = [
  { value: 'men', labelAr: 'رجالي', labelEn: 'Men' },
  { value: 'women', labelAr: 'نسائي', labelEn: 'Women' },
  { value: 'unisex', labelAr: 'للجنسين', labelEn: 'Unisex' },
];

const CURRENT_YEAR = new Date().getFullYear();
const WATCH_YEAR_OPTIONS: ListingFieldOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: String(CURRENT_YEAR - i),
  labelAr: String(CURRENT_YEAR - i),
  labelEn: String(CURRENT_YEAR - i),
}));

export const WATCHES_FIELDS: CategoryFieldMap = {
  luxury: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: WATCH_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'Submariner, Speedmaster...', placeholderAr: 'مثال: صبمارينر، سبيدماستر...' },
    { key: 'gender', labelAr: 'الفئة', labelEn: 'Gender', type: 'select', allowOther: true, required: false, options: GENDER_OPTIONS },
    { key: 'movement', labelAr: 'نوع الحركة', labelEn: 'Movement', type: 'select', allowOther: true, required: true, options: MOVEMENT_OPTIONS },
    { key: 'caseMaterial', labelAr: 'مادة الهيكل', labelEn: 'Case Material', type: 'select', allowOther: true, required: false, options: CASE_MATERIALS },
    { key: 'strapMaterial', labelAr: 'مادة السوار', labelEn: 'Strap Material', type: 'select', allowOther: true, required: false, options: STRAP_MATERIALS },
    { key: 'caseSize', labelAr: 'مقاس الهيكل (ملم)', labelEn: 'Case Size (mm)', type: 'number', required: false, placeholder: '40', placeholderAr: '40' },
    { key: 'waterResistance', labelAr: 'مقاومة الماء', labelEn: 'Water Resistance', type: 'select', allowOther: true, required: false, options: WATER_RESISTANCE_OPTIONS },
    { key: 'year', labelAr: 'سنة الإنتاج', labelEn: 'Year', type: 'select', allowOther: true, required: false, options: WATCH_YEAR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'boxIncluded', labelAr: 'العلبة الأصلية متوفرة', labelEn: 'Original Box Included', type: 'boolean', required: false },
    { key: 'papersIncluded', labelAr: 'شهادة الأصالة / الأوراق متوفرة', labelEn: 'Papers / Certificate Included', type: 'boolean', required: false },
  ],
  everyday: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: WATCH_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: false, placeholder: 'G-Shock, PRX...', placeholderAr: 'مثال: جي شوك، بي ار اكس...' },
    { key: 'gender', labelAr: 'الفئة', labelEn: 'Gender', type: 'select', allowOther: true, required: false, options: GENDER_OPTIONS },
    { key: 'movement', labelAr: 'نوع الحركة', labelEn: 'Movement', type: 'select', allowOther: true, required: false, options: MOVEMENT_OPTIONS },
    { key: 'caseMaterial', labelAr: 'مادة الهيكل', labelEn: 'Case Material', type: 'select', allowOther: true, required: false, options: CASE_MATERIALS },
    { key: 'strapMaterial', labelAr: 'نوع السوار', labelEn: 'Strap Material', type: 'select', allowOther: true, required: false, options: STRAP_MATERIALS },
    { key: 'caseSize', labelAr: 'مقاس الهيكل (ملم)', labelEn: 'Case Size (mm)', type: 'number', required: false, placeholder: '42', placeholderAr: '42' },
    { key: 'waterResistance', labelAr: 'مقاومة الماء', labelEn: 'Water Resistance', type: 'select', allowOther: true, required: false, options: WATER_RESISTANCE_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'boxIncluded', labelAr: 'العلبة متوفرة', labelEn: 'Box Included', type: 'boolean', required: false },
  ],
  'vintage-watch': [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: WATCH_BRANDS },
    { key: 'model', labelAr: 'الموديل / المرجع', labelEn: 'Model / Reference', type: 'text', required: false, placeholder: 'Vintage Seamaster...', placeholderAr: 'مثال: سي ماستر قديم...' },
    { key: 'movement', labelAr: 'نوع الحركة', labelEn: 'Movement', type: 'select', allowOther: true, required: false, options: MOVEMENT_OPTIONS },
    { key: 'caseMaterial', labelAr: 'مادة الهيكل', labelEn: 'Case Material', type: 'select', allowOther: true, required: false, options: CASE_MATERIALS },
    { key: 'strapMaterial', labelAr: 'نوع السوار', labelEn: 'Strap Material', type: 'select', allowOther: true, required: false, options: STRAP_MATERIALS },
    { key: 'year', labelAr: 'فترة الصنع / السنة التقريبية', labelEn: 'Estimated Year / Era', type: 'select', allowOther: true, required: false, options: WATCH_YEAR_OPTIONS },
    { key: 'caseSize', labelAr: 'مقاس الهيكل (ملم)', labelEn: 'Case Size (mm)', type: 'number', required: false, placeholder: '36', placeholderAr: '36' },
    { key: 'condition', labelAr: 'الحالة وتعمل أم لا', labelEn: 'Condition & Functionality', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'boxIncluded', labelAr: 'العلبة الأصلية متوفرة', labelEn: 'Original Box Included', type: 'boolean', required: false },
    { key: 'papersIncluded', labelAr: 'أوراق وشهادات متوفرة', labelEn: 'Papers Included', type: 'boolean', required: false },
  ],
  straps: [
    { key: 'material', labelAr: 'مادة السوار', labelEn: 'Material', type: 'select', allowOther: true, required: true, options: STRAP_MATERIALS },
    { key: 'width', labelAr: 'عرض السوار (ملم)', labelEn: 'Strap Width (mm)', type: 'number', required: true, placeholder: '20', placeholderAr: '20' },
    { key: 'brandCompatible', labelAr: 'الماركة أو الساعة المتوافقة', labelEn: 'Compatible Watch / Brand', type: 'text', required: false, placeholder: 'Apple, Rolex, Universal...', placeholderAr: 'مثال: رولكس، أبل، قياس عالمي...' },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: [
      { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
      { value: 'brown', labelAr: 'بني', labelEn: 'Brown' },
      { value: 'blue', labelAr: 'أزرق', labelEn: 'Blue' },
      { value: 'silver', labelAr: 'فضي', labelEn: 'Silver' },
      { value: 'gold', labelAr: 'ذهبي', labelEn: 'Gold' },
      { value: 'green', labelAr: 'أخضر', labelEn: 'Green' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'boxIncluded', labelAr: 'يشمل علبة حفظ أو أدوات تركيب', labelEn: 'Includes Box / Tools', type: 'boolean', required: false },
  ],
};
