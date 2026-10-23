import type { CategoryFieldMap, ListingFieldOption } from './types';
import { getBrandOptions } from '../brands/carBrands';

const CURRENT_YEAR = new Date().getFullYear();
const CAR_YEAR_OPTIONS: ListingFieldOption[] = Array.from({ length: 30 }, (_, i) => ({
  value: String(CURRENT_YEAR - i), labelAr: String(CURRENT_YEAR - i), labelEn: String(CURRENT_YEAR - i),
}));

const COLOR_OPTIONS: ListingFieldOption[] = [
  { value: 'white', labelAr: 'أبيض', labelEn: 'White' }, { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
  { value: 'silver', labelAr: 'فضي', labelEn: 'Silver' }, { value: 'grey', labelAr: 'رمادي', labelEn: 'Grey' },
  { value: 'red', labelAr: 'أحمر', labelEn: 'Red' }, { value: 'blue', labelAr: 'أزرق', labelEn: 'Blue' },
  { value: 'brown', labelAr: 'بني', labelEn: 'Brown' }, { value: 'green', labelAr: 'أخضر', labelEn: 'Green' },
  { value: 'beige', labelAr: 'بيج', labelEn: 'Beige' }, { value: 'gold', labelAr: 'ذهبي', labelEn: 'Gold' },
  { value: 'orange', labelAr: 'برتقالي', labelEn: 'Orange' }, { value: 'yellow', labelAr: 'أصفر', labelEn: 'Yellow' },
];

const INTERIOR_COLOR_OPTIONS: ListingFieldOption[] = [
  { value: 'black', labelAr: 'أسود', labelEn: 'Black' }, { value: 'beige', labelAr: 'بيج', labelEn: 'Beige' },
  { value: 'brown', labelAr: 'بني', labelEn: 'Brown' }, { value: 'grey', labelAr: 'رمادي', labelEn: 'Grey' },
  { value: 'white', labelAr: 'أبيض', labelEn: 'White' },
];

const BODY_TYPE_OPTIONS: ListingFieldOption[] = [
  { value: 'sedan', labelAr: 'سيدان', labelEn: 'Sedan' },
  { value: 'sedan_small', labelAr: 'سيدان صغيرة', labelEn: 'Small Sedan' },
  { value: 'sedan_luxury', labelAr: 'سيدان فاخرة', labelEn: 'Luxury Sedan' },
  { value: 'suv', labelAr: 'SUV', labelEn: 'SUV' },
  { value: 'jeep', labelAr: 'جيوب', labelEn: 'Off-Road / Jeep' },
  { value: 'suv_luxury', labelAr: 'جيوب فاخرة', labelEn: 'Luxury SUV' },
  { value: 'hatchback', labelAr: 'هاتشباك', labelEn: 'Hatchback' },
  { value: 'coupe', labelAr: 'كوبيه', labelEn: 'Coupe' },
  { value: 'pickup', labelAr: 'بيك أب', labelEn: 'Pickup' },
  { value: 'pickup_small', labelAr: 'بيك أب صغير', labelEn: 'Small Pickup' },
  { value: 'pickup_large', labelAr: 'بيك أب كبير', labelEn: 'Large Pickup' },
  { value: 'van', labelAr: 'فان', labelEn: 'Van' },
  { value: 'wagon', labelAr: 'واغن', labelEn: 'Wagon' },
  { value: 'classic', labelAr: 'تراثية', labelEn: 'Classic' },
];

const REGIONAL_SPECS_OPTIONS: ListingFieldOption[] = [
  { value: 'gcc', labelAr: 'خليجي', labelEn: 'GCC' }, { value: 'euro', labelAr: 'أوروبي', labelEn: 'European' },
  { value: 'us', labelAr: 'أمريكي', labelEn: 'American' }, { value: 'japan', labelAr: 'ياباني', labelEn: 'Japanese' },
  { value: 'korea', labelAr: 'كوري', labelEn: 'Korean' },
];

const TRANSMISSION_OPTIONS: ListingFieldOption[] = [
  { value: 'auto', labelAr: 'أوتوماتيك', labelEn: 'Automatic' }, { value: 'manual', labelAr: 'عادي', labelEn: 'Manual' },
];

const FUEL_OPTIONS: ListingFieldOption[] = [
  { value: 'petrol', labelAr: 'بنزين', labelEn: 'Petrol' }, { value: 'diesel', labelAr: 'ديزل', labelEn: 'Diesel' },
  { value: 'hybrid', labelAr: 'هايبرد', labelEn: 'Hybrid' }, { value: 'electric', labelAr: 'كهربائي', labelEn: 'Electric' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'excellent', labelAr: 'ممتاز', labelEn: 'Excellent' },
  { value: 'good', labelAr: 'جيد', labelEn: 'Good' }, { value: 'fair', labelAr: 'مقبول', labelEn: 'Fair' },
];

const MOTORBIKE_BRANDS: ListingFieldOption[] = [
  { value: 'honda', labelAr: 'هوندا', labelEn: 'Honda' }, { value: 'yamaha', labelAr: 'ياماها', labelEn: 'Yamaha' },
  { value: 'suzuki', labelAr: 'سوزوكي', labelEn: 'Suzuki' }, { value: 'kawasaki', labelAr: 'كاوازاكي', labelEn: 'Kawasaki' },
  { value: 'bmw', labelAr: 'بي إم دبليو', labelEn: 'BMW' }, { value: 'ducati', labelAr: 'دوكاتي', labelEn: 'Ducati' },
  { value: 'ktm', labelAr: 'كي تي إم', labelEn: 'KTM' }, { value: 'harley', labelAr: 'هارلي ديفيدسون', labelEn: 'Harley-Davidson' },
];

const DOORS_OPTIONS: ListingFieldOption[] = [
  { value: '2', labelAr: '2', labelEn: '2' }, { value: '3', labelAr: '3', labelEn: '3' },
  { value: '4', labelAr: '4', labelEn: '4' }, { value: '5', labelAr: '5', labelEn: '5' },
];

const SEATS_OPTIONS: ListingFieldOption[] = [
  { value: '2', labelAr: '2', labelEn: '2' }, { value: '4', labelAr: '4', labelEn: '4' },
  { value: '5', labelAr: '5', labelEn: '5' }, { value: '7', labelAr: '7', labelEn: '7' },
];

const HEAVY_TYPES: ListingFieldOption[] = [
  { value: 'truck', labelAr: 'شاحنة', labelEn: 'Truck' }, { value: 'bus', labelAr: 'حافلة / باص', labelEn: 'Bus' },
  { value: 'crane', labelAr: 'رافعة', labelEn: 'Crane' }, { value: 'tractor', labelAr: 'جرار', labelEn: 'Tractor' },
  { value: 'excavator', labelAr: 'حفارة', labelEn: 'Excavator' },
];

const BOAT_TYPES: ListingFieldOption[] = [
  { value: 'boat', labelAr: 'قارب', labelEn: 'Boat' }, { value: 'yacht', labelAr: 'يخت', labelEn: 'Yacht' },
  { value: 'jet_ski', labelAr: 'جت سكي', labelEn: 'Jet Ski' }, { value: 'fishing_boat', labelAr: 'قارب صيد', labelEn: 'Fishing Boat' },
];

const DIGITS_OPTIONS: ListingFieldOption[] = [
  { value: '4', labelAr: '4 أرقام', labelEn: '4 Digits' }, { value: '5', labelAr: '5 أرقام', labelEn: '5 Digits' }, { value: '6', labelAr: '6 أرقام', labelEn: '6 Digits' },
];

const CARS_FIELDS = [
  { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'select' as const, allowOther: true, required: true, options: getBrandOptions() },
  { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'cascading-model' as const, dependsOn: 'make', required: true, placeholder: 'Camry, X5...' },
  { key: 'trim', labelAr: 'الفئة', labelEn: 'Trim', type: 'cascading-trim' as const, dependsOn: 'make', required: true },
  { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select' as const, allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
  { key: 'km', labelAr: 'العداد (كم)', labelEn: 'KM', type: 'number' as const, required: false, placeholder: '50000' },
  { key: 'inspected', labelAr: 'مفحوصة', labelEn: 'Inspected', type: 'boolean' as const, required: false },
  { key: 'transmission', labelAr: 'ناقل الحركة', labelEn: 'Transmission', type: 'select' as const, allowOther: false, required: false, options: TRANSMISSION_OPTIONS },
  { key: 'fuel', labelAr: 'الوقود', labelEn: 'Fuel', type: 'select' as const, allowOther: false, required: false, options: FUEL_OPTIONS },
  { key: 'doors', labelAr: 'الأبواب', labelEn: 'Doors', type: 'select' as const, allowOther: true, required: false, options: DOORS_OPTIONS },
  { key: 'seats', labelAr: 'المقاعد', labelEn: 'Seats', type: 'select' as const, allowOther: true, required: false, options: SEATS_OPTIONS },
  { key: 'exteriorColor', labelAr: 'اللون الخارجي', labelEn: 'Exterior Color', type: 'select' as const, allowOther: false, required: false, options: COLOR_OPTIONS },
  { key: 'interiorColor', labelAr: 'اللون الداخلي', labelEn: 'Interior Color', type: 'select' as const, allowOther: false, required: false, options: INTERIOR_COLOR_OPTIONS },
  { key: 'bodyType', labelAr: 'نوع الهيكل', labelEn: 'Body Type', type: 'select' as const, allowOther: false, required: false, options: BODY_TYPE_OPTIONS },
  { key: 'regionalSpecs', labelAr: 'المواصفات الإقليمية', labelEn: 'Regional Specs', type: 'select' as const, allowOther: false, required: false, options: REGIONAL_SPECS_OPTIONS },
  { key: 'warranty', labelAr: 'تحت الضمان', labelEn: 'Under Warranty', type: 'boolean' as const, required: false },
  { key: 'installment', labelAr: 'متوفر تقسيط', labelEn: 'Installment Available', type: 'boolean' as const, required: false },
];

const RENTAL_FIELDS = [
  { key: 'rentalDuration', labelAr: 'مدة الإيجار المتاحة', labelEn: 'Available Rental Duration', type: 'select' as const, allowOther: true, multiSelect: true, required: true, options: [
    { value: 'daily', labelAr: 'يومي', labelEn: 'Daily' },
    { value: 'weekly', labelAr: 'أسبوعي', labelEn: 'Weekly' },
    { value: 'monthly', labelAr: 'شهري', labelEn: 'Monthly' },
    { value: 'yearly', labelAr: 'سنوي', labelEn: 'Yearly' },
  ]},
  { key: 'dailyRate', labelAr: 'السعر اليومي', labelEn: 'Daily Rate', type: 'number' as const, required: false, placeholder: '25' },
  { key: 'weeklyRate', labelAr: 'السعر الأسبوعي', labelEn: 'Weekly Rate', type: 'number' as const, required: false, placeholder: '150' },
  { key: 'monthlyRate', labelAr: 'السعر الشهري', labelEn: 'Monthly Rate', type: 'number' as const, required: false, placeholder: '500' },
  { key: 'withDriver', labelAr: 'مع سائق / مشغل', labelEn: 'With Driver / Operator', type: 'select' as const, allowOther: true, required: false, options: [
    { value: 'with_driver', labelAr: 'مع سائق', labelEn: 'With Driver' },
    { value: 'without_driver', labelAr: 'بدون سائق', labelEn: 'Without Driver' },
    { value: 'optional', labelAr: 'اختياري', labelEn: 'Optional' },
  ]},
  { key: 'kmLimit', labelAr: 'حد الكيلومترات اليومي', labelEn: 'Daily KM Limit', type: 'number' as const, required: false, placeholder: '200' },
  { key: 'deposit', labelAr: 'مبلغ التأمين المسترد', labelEn: 'Refundable Deposit', type: 'number' as const, required: false },
  { key: 'deliveryArea', labelAr: 'منطقة التسليم والاستلام', labelEn: 'Delivery & Pickup Area', type: 'text' as const, required: false, placeholder: 'عمّان، الزرقاء، إربد...' },
  { key: 'insurance', labelAr: 'تأمين شامل', labelEn: 'Full Insurance Included', type: 'boolean' as const, required: false },
  { key: 'rentalProvider', labelAr: 'الجهة المؤجّرة', labelEn: 'Rental Provider', type: 'select' as const, allowOther: true, required: false, options: [
    { value: 'company', labelAr: 'شركة تأجير', labelEn: 'Rental Company' },
    { value: 'individual', labelAr: 'فرد', labelEn: 'Individual' },
  ]},
];

export const MOTORS_FIELDS: CategoryFieldMap = {
  cars: CARS_FIELDS,
  classic_cars: CARS_FIELDS,
  damaged_cars: CARS_FIELDS,
  cars_for_rent: [...CARS_FIELDS, ...RENTAL_FIELDS],
  buses_for_rent: [
    { key: 'busType', labelAr: 'نوع الباص', labelEn: 'Bus Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'mini_bus', labelAr: 'ميني باص', labelEn: 'Mini Bus' },
      { value: 'coaster', labelAr: 'كوستر', labelEn: 'Coaster' },
      { value: 'large_bus', labelAr: 'باص كبير', labelEn: 'Large Bus' },
      { value: 'van', labelAr: 'فان', labelEn: 'Van' },
      { value: 'school_bus', labelAr: 'باص مدرسة', labelEn: 'School Bus' },
      { value: 'staff_bus', labelAr: 'باص موظفين', labelEn: 'Staff Bus' },
    ]},
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: true, placeholder: 'Toyota, Mercedes, Hino...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'seats', labelAr: 'عدد المقاعد', labelEn: 'Seats', type: 'number', required: false, placeholder: '14' },
    { key: 'ac', labelAr: 'مكيف', labelEn: 'AC', type: 'boolean', required: false },
    ...RENTAL_FIELDS,
  ],
  bikes_for_rent: [
    { key: 'make', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: MOTORBIKE_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'CBR, R1...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'bikeType', labelAr: 'نوع الدراجة', labelEn: 'Bike Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'sport', labelAr: 'رياضية', labelEn: 'Sport' },
      { value: 'cruiser', labelAr: 'كروزر', labelEn: 'Cruiser' },
      { value: 'scooter', labelAr: 'سكوتر', labelEn: 'Scooter' },
      { value: 'dirt', labelAr: 'طرق وعرة', labelEn: 'Dirt / Off-Road' },
    ]},
    { key: 'engineSize', labelAr: 'السعة (سي سي)', labelEn: 'Engine CC', type: 'number', required: false, placeholder: '250' },
    { key: 'helmetIncluded', labelAr: 'خوذة مشمولة', labelEn: 'Helmet Included', type: 'boolean', required: false },
    { key: 'licenseRequired', labelAr: 'يتطلب رخصة', labelEn: 'License Required', type: 'boolean', required: false },
    ...RENTAL_FIELDS,
  ],
  heavy_for_rent: [
    { key: 'type', labelAr: 'نوع الآلية', labelEn: 'Type', type: 'select', allowOther: true, required: true, options: HEAVY_TYPES },
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: true, placeholder: 'Caterpillar, Komatsu...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'tonnage', labelAr: 'الحمولة (طن)', labelEn: 'Tonnage (tons)', type: 'number', required: false },
    { key: 'withOperator', labelAr: 'مع مشغل', labelEn: 'With Operator', type: 'select', allowOther: true, required: false, options: [
      { value: 'with_operator', labelAr: 'مع مشغل', labelEn: 'With Operator' },
      { value: 'without_operator', labelAr: 'بدون مشغل', labelEn: 'Without Operator' },
    ]},
    { key: 'siteDelivery', labelAr: 'نقل للموقع', labelEn: 'Site Delivery', type: 'boolean', required: false },
    ...RENTAL_FIELDS,
  ],
  boats_for_rent: [
    { key: 'type', labelAr: 'نوع القارب', labelEn: 'Boat Type', type: 'select', allowOther: true, required: true, options: BOAT_TYPES },
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: false, placeholder: 'Yamaha, Sea-Doo...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: false, options: CAR_YEAR_OPTIONS },
    { key: 'length', labelAr: 'الطول (قدم)', labelEn: 'Length (ft)', type: 'number', required: false },
    { key: 'capacity', labelAr: 'سعة الركاب', labelEn: 'Passenger Capacity', type: 'number', required: false },
    { key: 'withCaptain', labelAr: 'مع قبطان', labelEn: 'With Captain', type: 'boolean', required: false },
    ...RENTAL_FIELDS,
  ],
  atv_buggies: [
    { key: 'type', labelAr: 'نوع المركبة', labelEn: 'Vehicle Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'atv', labelAr: 'ATV / دراجة رباعية', labelEn: 'ATV / Quad' },
      { value: 'utv', labelAr: 'UTV', labelEn: 'UTV' },
      { value: 'buggy', labelAr: 'باجي', labelEn: 'Buggy' },
      { value: 'dirt_bike', labelAr: 'دراجة طرق وعرة', labelEn: 'Dirt Bike' },
    ]},
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: false, placeholder: 'Polaris, Can-Am...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: false, options: CAR_YEAR_OPTIONS },
    { key: 'engineSize', labelAr: 'السعة (سي سي)', labelEn: 'Engine CC', type: 'number', required: false, placeholder: '500' },
    { key: 'seats', labelAr: 'عدد المقاعد', labelEn: 'Seats', type: 'number', required: false, placeholder: '2' },
    { key: 'fourWD', labelAr: 'دفع رباعي', labelEn: '4WD', type: 'boolean', required: false },
    { key: 'streetLegal', labelAr: 'مرخصة للطرق', labelEn: 'Street Legal', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
  ],
  buses: [
    { key: 'busType', labelAr: 'نوع الباص', labelEn: 'Bus Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'mini_bus', labelAr: 'ميني باص', labelEn: 'Mini Bus' },
      { value: 'coaster', labelAr: 'كوستر', labelEn: 'Coaster' },
      { value: 'large_bus', labelAr: 'باص كبير', labelEn: 'Large Bus' },
      { value: 'van', labelAr: 'فان', labelEn: 'Van' },
      { value: 'school_bus', labelAr: 'باص مدرسة', labelEn: 'School Bus' },
      { value: 'staff_bus', labelAr: 'باص موظفين', labelEn: 'Staff Bus' },
    ]},
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: true, placeholder: 'Toyota, Mercedes, Hino...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'seats', labelAr: 'عدد المقاعد', labelEn: 'Seats', type: 'number', required: false },
    { key: 'km', labelAr: 'العداد (كم)', labelEn: 'KM', type: 'number', required: false },
    { key: 'ac', labelAr: 'مكيف', labelEn: 'AC', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
  ],
  'motorcycle-gear': [
    { key: 'gearType', labelAr: 'نوع الإكسسوار', labelEn: 'Gear Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'helmet', labelAr: 'خوذة', labelEn: 'Helmet' },
      { value: 'jacket', labelAr: 'جاكيت', labelEn: 'Jacket' },
      { value: 'gloves', labelAr: 'قفازات', labelEn: 'Gloves' },
      { value: 'boots', labelAr: 'أحذية', labelEn: 'Boots' },
      { value: 'pants', labelAr: 'بنطال', labelEn: 'Pants' },
      { value: 'accessories', labelAr: 'إكسسوارات أخرى', labelEn: 'Other Accessories' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Shoei, Alpinestars, Dainese...' },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'text', required: false, placeholder: 'L, XL, 42...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'gender', labelAr: 'النوع', labelEn: 'Gender', type: 'select', allowOther: true, required: false, options: [
      { value: 'men', labelAr: 'رجالي', labelEn: 'Men' },
      { value: 'women', labelAr: 'نسائي', labelEn: 'Women' },
      { value: 'unisex', labelAr: 'للجنسين', labelEn: 'Unisex' },
    ]},
  ],
  'heavy-equipment': [
    { key: 'equipmentType', labelAr: 'نوع المعدة', labelEn: 'Equipment Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'excavator', labelAr: 'حفارة', labelEn: 'Excavator' },
      { value: 'bulldozer', labelAr: 'بلدوزر', labelEn: 'Bulldozer' },
      { value: 'loader', labelAr: 'لودر / شيول', labelEn: 'Loader' },
      { value: 'grader', labelAr: 'جريدر', labelEn: 'Grader' },
      { value: 'forklift', labelAr: 'رافعة شوكية', labelEn: 'Forklift' },
      { value: 'crane', labelAr: 'رافعة / كرين', labelEn: 'Crane' },
      { value: 'dumper', labelAr: 'دبابة / قلاب', labelEn: 'Dumper' },
    ]},
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: true, placeholder: 'Caterpillar, Komatsu...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'hours', labelAr: 'ساعات العمل', labelEn: 'Working Hours', type: 'number', required: false, placeholder: '5000' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
  ],
  lease_transfer: CARS_FIELDS,
  motorbikes: [
    { key: 'make', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: MOTORBIKE_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'cascading-model', dependsOn: 'make', required: true, placeholder: 'CBR, R1...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'km', labelAr: 'العداد (كم)', labelEn: 'KM', type: 'number', required: false, placeholder: '15000' },
    { key: 'engineSize', labelAr: 'السعة (سي سي)', labelEn: 'Engine CC', type: 'number', required: false, placeholder: '250' },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
    { key: 'licenseType', labelAr: 'الترخيص', labelEn: 'License Type', type: 'select', allowOther: true, required: false, options: [
      { value: 'licensed', labelAr: 'مطلوب ترخيص / مرخص', labelEn: 'Licensed' }, { value: 'unlicensed', labelAr: 'بدون ترخيص', labelEn: 'Unlicensed' },
    ]},
  ],
  heavy: [
    { key: 'type', labelAr: 'نوع الآلية', labelEn: 'Type', type: 'select', allowOther: true, required: true, options: HEAVY_TYPES },
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: true, placeholder: 'MAN, Mercedes...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'km', labelAr: 'العداد (كم)', labelEn: 'KM', type: 'number', required: false, placeholder: '120000' },
    { key: 'tonnage', labelAr: 'الحمولة (طن)', labelEn: 'Tonnage (tons)', type: 'number', required: false, placeholder: '10' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
    { key: 'fuel', labelAr: 'الوقود', labelEn: 'Fuel', type: 'select', allowOther: true, required: false, options: FUEL_OPTIONS },
    { key: 'transmission', labelAr: 'ناقل الحركة', labelEn: 'Transmission', type: 'select', allowOther: true, required: false, options: TRANSMISSION_OPTIONS },
  ],
  parts: [
    { key: 'partName', labelAr: 'اسم القطعة', labelEn: 'Part Name', type: 'text', required: true },
    { key: 'make', labelAr: 'الماركة المتوافقة', labelEn: 'Compatible Make', type: 'select', allowOther: true, required: false, options: getBrandOptions() },
    { key: 'model', labelAr: 'الموديل المتوافق', labelEn: 'Compatible Model', type: 'cascading-model', dependsOn: 'make', required: false },
    { key: 'year', labelAr: 'سنة الصنع', labelEn: 'Year', type: 'select', allowOther: true, required: false, options: CAR_YEAR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: [
      { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'used', labelAr: 'مستعمل', labelEn: 'Used' },
    ]},
    { key: 'origin', labelAr: 'المنشأ', labelEn: 'Origin', type: 'select', allowOther: true, required: false, options: [
      { value: 'original', labelAr: 'أصلي', labelEn: 'Original' }, { value: 'aftermarket', labelAr: 'تجاري', labelEn: 'Aftermarket' },
    ]},
  ],
  boats: [
    { key: 'type', labelAr: 'نوع القارب', labelEn: 'Boat Type', type: 'select', allowOther: true, required: true, options: BOAT_TYPES },
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: false, placeholder: 'Yamaha, Sea-Doo...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: false, options: CAR_YEAR_OPTIONS },
    { key: 'length', labelAr: 'الطول (قدم)', labelEn: 'Length (ft)', type: 'number', required: false },
    { key: 'engineHours', labelAr: 'ساعات عمل المحرك', labelEn: 'Engine Hours', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
  ],
  accessories: [
    { key: 'type', labelAr: 'نوع الإكسسوار', labelEn: 'Accessory Type', type: 'text', required: true },
    { key: 'make', labelAr: 'الماركة المتوافقة', labelEn: 'Compatible Make', type: 'select', allowOther: true, required: false, options: getBrandOptions() },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
  ],
  plates: [
    { key: 'plateType', labelAr: 'نوع اللوحة', labelEn: 'Plate Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'private', labelAr: 'خصوصي', labelEn: 'Private' }, { value: 'public', labelAr: 'عمومي', labelEn: 'Public' }, { value: 'commercial', labelAr: 'تجاري', labelEn: 'Commercial' },
    ]},
    { key: 'numberFormat', labelAr: 'الرمز / الحرف', labelEn: 'Code / Format', type: 'text', required: false },
    { key: 'digits', labelAr: 'عدد الأرقام', labelEn: 'Number of Digits', type: 'select', allowOther: true, required: true, options: DIGITS_OPTIONS },
    { key: 'city', labelAr: 'المحافظة / المدينة', labelEn: 'City', type: 'text', required: false },
  ],
};
