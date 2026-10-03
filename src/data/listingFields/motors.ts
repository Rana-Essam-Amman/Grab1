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
  { value: 'sedan', labelAr: 'سيدان', labelEn: 'Sedan' }, { value: 'suv', labelAr: 'SUV', labelEn: 'SUV' },
  { value: 'hatchback', labelAr: 'هاتشباك', labelEn: 'Hatchback' }, { value: 'coupe', labelAr: 'كوبيه', labelEn: 'Coupe' },
  { value: 'pickup', labelAr: 'بيك أب', labelEn: 'Pickup' }, { value: 'van', labelAr: 'فان', labelEn: 'Van' },
  { value: 'wagon', labelAr: 'واغن', labelEn: 'Wagon' },
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

export const MOTORS_FIELDS: CategoryFieldMap = {
  cars: [
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'select', allowOther: true, required: true, options: getBrandOptions() },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'Camry, X5...' },
    { key: 'trim', labelAr: 'الفئة', labelEn: 'Trim', type: 'text', required: false, placeholder: 'LE, SE, Sport...' },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'select', allowOther: true, required: true, options: CAR_YEAR_OPTIONS },
    { key: 'km', labelAr: 'العداد (كم)', labelEn: 'KM', type: 'number', required: false, placeholder: '50000' },
    { key: 'transmission', labelAr: 'ناقل الحركة', labelEn: 'Transmission', type: 'select', allowOther: true, required: true, options: TRANSMISSION_OPTIONS },
    { key: 'fuel', labelAr: 'الوقود', labelEn: 'Fuel', type: 'select', allowOther: true, required: true, options: FUEL_OPTIONS },
    { key: 'doors', labelAr: 'الأبواب', labelEn: 'Doors', type: 'select', allowOther: true, required: false, options: DOORS_OPTIONS },
    { key: 'seats', labelAr: 'المقاعد', labelEn: 'Seats', type: 'select', allowOther: true, required: false, options: SEATS_OPTIONS },
    { key: 'exteriorColor', labelAr: 'اللون الخارجي', labelEn: 'Exterior Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'interiorColor', labelAr: 'اللون الداخلي', labelEn: 'Interior Color', type: 'select', allowOther: true, required: false, options: INTERIOR_COLOR_OPTIONS },
    { key: 'bodyType', labelAr: 'نوع الهيكل', labelEn: 'Body Type', type: 'select', allowOther: true, required: false, options: BODY_TYPE_OPTIONS },
    { key: 'regionalSpecs', labelAr: 'المواصفات الإقليمية', labelEn: 'Regional Specs', type: 'select', allowOther: true, required: false, options: REGIONAL_SPECS_OPTIONS },
    { key: 'warranty', labelAr: 'تحت الضمان', labelEn: 'Under Warranty', type: 'boolean', required: false },
    { key: 'installment', labelAr: 'متوفر تقسيط', labelEn: 'Installment Available', type: 'boolean', required: false },
  ],
  motorbikes: [
    { key: 'make', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: MOTORBIKE_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'CBR, R1...' },
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
    { key: 'model', labelAr: 'الموديل المتوافق', labelEn: 'Compatible Model', type: 'text', required: false },
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
