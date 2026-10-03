import type { CategoryFieldMap, ListingFieldOption } from './types';

const SPORT_CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد بالكرتونة', labelEn: 'Brand New' },
  { value: 'like_new', labelAr: 'مستعمل بحالة ممتازة وشبه جديد', labelEn: 'Like New / Excellent' },
  { value: 'good', labelAr: 'مستعمل بحالة جيدة ويعمل بكفاءة', labelEn: 'Good Working Condition' },
  { value: 'needs_service', labelAr: 'بحاجة لصيانة خفيفة', labelEn: 'Needs Light Maintenance' },
];

const BICYCLE_BRANDS: ListingFieldOption[] = [
  { value: 'trek', labelAr: 'تريك (Trek)', labelEn: 'Trek' },
  { value: 'giant', labelAr: 'جاينت (Giant)', labelEn: 'Giant' },
  { value: 'specialized', labelAr: 'سبيشالايزد (Specialized)', labelEn: 'Specialized' },
  { value: 'merida', labelAr: 'ميريدا (Merida)', labelEn: 'Merida' },
  { value: 'cannondale', labelAr: 'كانونديل (Cannondale)', labelEn: 'Cannondale' },
  { value: 'scott', labelAr: 'سكوت (Scott)', labelEn: 'Scott' },
  { value: 'trinx', labelAr: 'ترينكس (Trinx)', labelEn: 'Trinx' },
  { value: 'btwin', labelAr: 'بي توين ديكاتلون (B’Twin / Rockrider)', labelEn: 'B’Twin / Decathlon' },
];

export const SPORTS_FIELDS: CategoryFieldMap = {
  fitness: [
    { key: 'equipmentType', labelAr: 'نوع الجهاز الرياضي', labelEn: 'Equipment Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'treadmill', labelAr: 'جهاز ركض / مشاية كهربائية (Treadmill)', labelEn: 'Treadmill' },
      { value: 'stationary_bike', labelAr: 'دراجة ثابتة / سبينينج (Exercise Bike)', labelEn: 'Stationary / Spin Bike' },
      { value: 'elliptical', labelAr: 'جهاز أوربتراك / إيلبتيكال (Elliptical)', labelEn: 'Elliptical' },
      { value: 'weights_dumbbells', labelAr: 'أثقال / دامبلز / بار مع أوزان طارات', labelEn: 'Dumbbells / Barbell & Plates' },
      { value: 'weight_bench', labelAr: 'بنش تمارين مستوي أو مائل (Weight Bench)', labelEn: 'Weight Bench' },
      { value: 'multi_gym', labelAr: 'محطة أجهزة جيم منزلية متكاملة (Multi-Gym)', labelEn: 'Multi-Gym Station' },
      { value: 'rowing_machine', labelAr: 'جهاز تجديف (Rowing Machine)', labelEn: 'Rowing Machine' },
    ]},
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'NordicTrack, ProForm, Life Fitness, Decathlon...', placeholderAr: 'مثال: نوردك تراك، ديكاتلون...' },
    { key: 'maxWeight', labelAr: 'أقصى وزن للمستخدم (كجم)', labelEn: 'Max User Weight (kg)', type: 'number', required: false, placeholder: '120', placeholderAr: '120' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: SPORT_CONDITION_OPTIONS },
    { key: 'age', labelAr: 'مدة الاستخدام (بالسنوات)', labelEn: 'Age (Years)', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'dimensions', labelAr: 'الأبعاد التقريبية وميزة الطي', labelEn: 'Dimensions / Foldable', type: 'text', required: false, placeholder: 'Foldable, 180x80 cm...', placeholderAr: 'مثال: قابل للطي، 180 × 80 سم...' },
    { key: 'manualIncluded', labelAr: 'دليل المستخدم وشهادة الشراء متوفرة', labelEn: 'Manual / Receipt Included', type: 'boolean', required: false },
    { key: 'warranty', labelAr: 'حالة الضمان', labelEn: 'Warranty Status', type: 'select', allowOther: true, required: false, options: [
      { value: 'under_warranty', labelAr: 'تحت كفالة الوكيل', labelEn: 'Under Warranty' },
      { value: 'expired', labelAr: 'منتهي الضمان', labelEn: 'Expired' },
    ]},
  ],
  bicycles: [
    { key: 'bikeType', labelAr: 'نوع الدراجة', labelEn: 'Bicycle Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'mountain', labelAr: 'دراجة جبلية (Mountain Bike / MTB)', labelEn: 'Mountain Bike' },
      { value: 'road', labelAr: 'دراجة سباق وطريق سريعة (Road Bike)', labelEn: 'Road Bike' },
      { value: 'hybrid_city', labelAr: 'دراجة هجين ومدن ومواصلات (Hybrid / City)', labelEn: 'Hybrid / City' },
      { value: 'electric_ebike', labelAr: 'دراجة كهربائية (E-Bike)', labelEn: 'Electric E-Bike' },
      { value: 'bmx_stunt', labelAr: 'دراجة استعراضية (BMX)', labelEn: 'BMX' },
      { value: 'kids_bike', labelAr: 'دراجة أطفال مع عجلات توازن', labelEn: 'Kids Bike' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: BICYCLE_BRANDS },
    { key: 'frameSize', labelAr: 'مقاس الهيكل (Frame Size)', labelEn: 'Frame Size', type: 'select', allowOther: true, required: false, options: [
      { value: 'xs_s', labelAr: 'صغير (S / 15-16 Inch) للأطوال 155-168 سم', labelEn: 'Small (S)' },
      { value: 'm', labelAr: 'وسط (M / 17-18 Inch) للأطوال 168-178 سم', labelEn: 'Medium (M)' },
      { value: 'l_xl', labelAr: 'كبير (L/XL / 19+ Inch) للأطوال 178+ سم', labelEn: 'Large (L/XL)' },
    ]},
    { key: 'wheelSize', labelAr: 'مقاس العجلات (بوصة)', labelEn: 'Wheel Size', type: 'select', allowOther: true, required: false, options: [
      { value: '26', labelAr: '26 بوصة', labelEn: '26"' },
      { value: '27.5', labelAr: '27.5 بوصة', labelEn: '27.5"' },
      { value: '29', labelAr: '29 بوصة', labelEn: '29"' },
      { value: '700c', labelAr: '700c (دراجات سباق)', labelEn: '700c' },
      { value: '20_kids', labelAr: '20 بوصة أو أصغر (أطفال/BMX)', labelEn: '20" or smaller' },
    ]},
    { key: 'gears', labelAr: 'عدد السرعات / الغيارات (Shimano)', labelEn: 'Gears Count', type: 'number', required: false, placeholder: '21', placeholderAr: '21' },
    { key: 'brakes', labelAr: 'نوع الفرامل', labelEn: 'Brakes Type', type: 'select', allowOther: true, required: false, options: [
      { value: 'hydraulic_disc', labelAr: 'ديسك هيدروليك زيت (Hydraulic Disc)', labelEn: 'Hydraulic Disc' },
      { value: 'mechanical_disc', labelAr: 'ديسك سلك ميكانيكي (Mechanical Disc)', labelEn: 'Mechanical Disc' },
      { value: 'v_brake', labelAr: 'فرامل فحمات عادية (V-Brake)', labelEn: 'V-Brake / Rim' },
    ]},
    { key: 'frameMaterial', labelAr: 'مادة الهيكل (الشاسي)', labelEn: 'Frame Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'aluminum', labelAr: 'ألمنيوم خفيف الوزن', labelEn: 'Aluminum' },
      { value: 'carbon_fiber', labelAr: 'ألياف كربون احترافية (Carbon Fiber)', labelEn: 'Carbon Fiber' },
      { value: 'steel', labelAr: 'حديد صلب (Steel)', labelEn: 'Steel' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: SPORT_CONDITION_OPTIONS },
    { key: 'batteryRangeKm', labelAr: 'مدى البطارية بالشحنة (للكهربائية - كم)', labelEn: 'Battery Range (km)', type: 'number', required: false, placeholder: '50', placeholderAr: '50' },
  ],
  camping: [
    { key: 'itemType', labelAr: 'نوع تجهيزات التخييم', labelEn: 'Camping Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'tent', labelAr: 'خيمة تخييم ورحلات برية', labelEn: 'Camping Tent' },
      { value: 'sleeping_bag_mat', labelAr: 'كيس نوم وفرشة هوائية (Sleeping Bag)', labelEn: 'Sleeping Bag / Mat' },
      { value: 'chairs_table', labelAr: 'كراسي وطاولة رحلات قابلة للطي', labelEn: 'Foldable Chairs & Table' },
      { value: 'stove_cooking', labelAr: 'موقد غاز متنقل وأواني طبخ برية', labelEn: 'Portable Stove & Cookware' },
      { value: 'cooler_icebox', labelAr: 'حافظة برودة / آيس بوكس / ثلاجة سيارة', labelEn: 'Cooler / Ice Box' },
      { value: 'lighting_lantern', labelAr: 'كشافات وإضاءة سنارة طاقة شمسية', labelEn: 'Lantern / LED Lighting' },
      { value: 'backpack', labelAr: 'حقيبة ظهر رحلات وتسلق (Hiking Backpack)', labelEn: 'Hiking Backpack' },
    ]},
    { key: 'capacity', labelAr: 'السعة (عدد الأشخاص)', labelEn: 'Person Capacity', type: 'select', allowOther: true, required: false, options: [
      { value: '1_2', labelAr: 'شخص - شخصين', labelEn: '1 - 2 Persons' },
      { value: '3_4', labelAr: '3 - 4 أشخاص', labelEn: '3 - 4 Persons' },
      { value: '5_6', labelAr: '5 - 6 أشخاص', labelEn: '5 - 6 Persons' },
      { value: '8_plus', labelAr: '8 أشخاص فأكثر (عائلية كبيرة)', labelEn: '8+ Persons' },
    ]},
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Coleman, Quechua, The North Face, Naturehike...', placeholderAr: 'مثال: كولمان، كيشوا، ذا نورث فيس...' },
    { key: 'waterproof', labelAr: 'مقاوم للماء والأمطار والرياح الشديدة', labelEn: 'Waterproof & Windproof', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: SPORT_CONDITION_OPTIONS },
    { key: 'dimensions', labelAr: 'المقاس والوزن التقريبي', labelEn: 'Dimensions & Weight', type: 'text', required: false, placeholder: 'Weight / Dimensions', placeholderAr: 'مثال: وزن 4 كجم، 2×2 متر' },
  ],
  'water-sports': [
    { key: 'sportType', labelAr: 'نوع الرياضة المائية', labelEn: 'Water Sport Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'scuba_diving', labelAr: 'غوص سكوبا وبدلات وأسطوانات (Scuba Diving)', labelEn: 'Scuba Diving' },
      { value: 'snorkeling', labelAr: 'سنوركل ونظارات وزعانف سباحة', labelEn: 'Snorkeling & Fins' },
      { value: 'kayak_sup', labelAr: 'قارب كاياك أو لوح تجديف واقفا (Paddleboard / SUP)', labelEn: 'Kayak / SUP' },
      { value: 'surf_kite', labelAr: 'ركوب أمواج وركمجة وكايت سيرف (Kitesurf)', labelEn: 'Surfing / Kitesurf' },
      { value: 'fishing_gear', labelAr: 'مستلزمات صيد سمك وصنانير ومكائن', labelEn: 'Fishing Rods & Reels' },
      { value: 'lifejacket_safety', labelAr: 'سترات نجاة ومعدات سلامة', labelEn: 'Lifejackets & Safety' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Cressi, Mares, Scubapro, Speedo, Shimano...', placeholderAr: 'مثال: كريسي، ماريس، شيمانو...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: SPORT_CONDITION_OPTIONS },
    { key: 'safetyGearIncluded', labelAr: 'تشمل حقيبة حفظ أو أحزمة أمان متطابقة', labelEn: 'Safety Gear / Bag Included', type: 'boolean', required: false },
  ],
};
