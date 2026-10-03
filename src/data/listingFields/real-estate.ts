import type { CategoryFieldMap, ListingFieldOption } from './types';

const CURRENT_YEAR = new Date().getFullYear();
const BUILDING_YEAR_OPTIONS: ListingFieldOption[] = Array.from({ length: 40 }, (_, i) => ({
  value: String(CURRENT_YEAR - i), labelAr: String(CURRENT_YEAR - i), labelEn: String(CURRENT_YEAR - i),
}));

const RESIDENTIAL_AMENITIES: ListingFieldOption[] = [
  { value: 'pool', labelAr: 'مسبح', labelEn: 'Pool' }, { value: 'garden', labelAr: 'حديقة', labelEn: 'Garden' },
  { value: 'elevator', labelAr: 'مصعد', labelEn: 'Elevator' }, { value: 'parking', labelAr: 'موقف سيارة', labelEn: 'Parking' },
  { value: 'security', labelAr: 'أمن 24/7', labelEn: '24/7 Security' }, { value: 'gym', labelAr: 'صالة رياضية', labelEn: 'Gym' },
  { value: 'balcony', labelAr: 'شرفة', labelEn: 'Balcony' }, { value: 'maid_room', labelAr: 'غرفة خادمة', labelEn: 'Maid Room' },
  { value: 'laundry_room', labelAr: 'غرفة غسيل', labelEn: 'Laundry Room' }, { value: 'fitted_kitchen', labelAr: 'مطبخ راكب', labelEn: 'Fitted Kitchen' },
];

const COMMERCIAL_AMENITIES: ListingFieldOption[] = [
  { value: 'kitchen', labelAr: 'مطبخ', labelEn: 'Kitchen' }, { value: 'bathroom', labelAr: 'حمام', labelEn: 'Bathroom' },
  { value: 'parking', labelAr: 'موقف', labelEn: 'Parking' }, { value: 'storage', labelAr: 'مستودع', labelEn: 'Storage' },
  { value: 'elevator', labelAr: 'مصعد', labelEn: 'Elevator' }, { value: 'ac', labelAr: 'مكيفات', labelEn: 'AC' },
];

const CHALET_AMENITIES: ListingFieldOption[] = [
  { value: 'garden', labelAr: 'حديقة', labelEn: 'Garden' }, { value: 'outdoor_seating', labelAr: 'جلسة خارجية', labelEn: 'Outdoor Seating' },
  { value: 'bbq', labelAr: 'شواية', labelEn: 'BBQ' }, { value: 'playground', labelAr: 'ملعب أطفال', labelEn: 'Playground' },
  { value: 'pool', labelAr: 'مسبح', labelEn: 'Pool' },
];

const VIEW_OPTIONS: ListingFieldOption[] = [
  { value: 'street', labelAr: 'شارع', labelEn: 'Street' }, { value: 'garden', labelAr: 'حديقة', labelEn: 'Garden' },
  { value: 'pool', labelAr: 'مسبح', labelEn: 'Pool' }, { value: 'sea', labelAr: 'بحر', labelEn: 'Sea' },
  { value: 'mountain', labelAr: 'جبل', labelEn: 'Mountain' }, { value: 'city', labelAr: 'مدينة', labelEn: 'City' },
];

const PARKING_OPTIONS: ListingFieldOption[] = [
  { value: 'none', labelAr: 'لا يوجد', labelEn: 'None' }, { value: '1', labelAr: '1', labelEn: '1' },
  { value: '2', labelAr: '2', labelEn: '2' }, { value: '3+', labelAr: '3+', labelEn: '3+' },
];

const RESIDENTIAL_TYPES: ListingFieldOption[] = [
  { value: 'apartment', labelAr: 'شقة', labelEn: 'Apartment' }, { value: 'house', labelAr: 'منزل', labelEn: 'House' },
  { value: 'villa', labelAr: 'فيلا', labelEn: 'Villa' }, { value: 'land', labelAr: 'أرض', labelEn: 'Land' },
];

const RENT_RESIDENTIAL_TYPES: ListingFieldOption[] = [
  { value: 'apartment', labelAr: 'شقة', labelEn: 'Apartment' }, { value: 'studio', labelAr: 'استديو', labelEn: 'Studio' },
  { value: 'villa', labelAr: 'فيلا', labelEn: 'Villa' },
];

const RENT_PERIODS: ListingFieldOption[] = [
  { value: 'monthly', labelAr: 'شهري', labelEn: 'Monthly' }, { value: 'quarterly', labelAr: 'ربع سنوي', labelEn: 'Quarterly' },
  { value: 'yearly', labelAr: 'سنوي', labelEn: 'Yearly' }, { value: 'daily', labelAr: 'يومي', labelEn: 'Daily' },
];

const COMMERCIAL_TYPES: ListingFieldOption[] = [
  { value: 'shop', labelAr: 'محل', labelEn: 'Shop' }, { value: 'office', labelAr: 'مكتب', labelEn: 'Office' },
  { value: 'showroom', labelAr: 'معرض', labelEn: 'Showroom' }, { value: 'warehouse', labelAr: 'مستودع', labelEn: 'Warehouse' },
  { value: 'workshop', labelAr: 'ورشة', labelEn: 'Workshop' }, { value: 'restaurant', labelAr: 'مطعم', labelEn: 'Restaurant' },
  { value: 'cafe', labelAr: 'كافيه', labelEn: 'Cafe' },
];

const ZONING_OPTIONS: ListingFieldOption[] = [
  { value: 'residential', labelAr: 'سكني', labelEn: 'Residential' }, { value: 'commercial', labelAr: 'تجاري', labelEn: 'Commercial' },
  { value: 'agricultural', labelAr: 'زراعي', labelEn: 'Agricultural' }, { value: 'industrial', labelAr: 'صناعي', labelEn: 'Industrial' },
];

const ORIENTATION_OPTIONS: ListingFieldOption[] = [
  { value: 'north', labelAr: 'شمالية', labelEn: 'North' }, { value: 'south', labelAr: 'جنوبية', labelEn: 'South' },
  { value: 'east', labelAr: 'شرقية', labelEn: 'East' }, { value: 'west', labelAr: 'غربية', labelEn: 'West' },
];

const POOL_OPTIONS: ListingFieldOption[] = [
  { value: 'private', labelAr: 'خاص', labelEn: 'Private' }, { value: 'shared', labelAr: 'مشترك', labelEn: 'Shared' }, { value: 'none', labelAr: 'لا يوجد', labelEn: 'None' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'excellent', labelAr: 'ممتاز', labelEn: 'Excellent' },
  { value: 'good', labelAr: 'جيد', labelEn: 'Good' }, { value: 'fair', labelAr: 'مقبول', labelEn: 'Fair' },
];

const FURNISHED_OPTIONS: ListingFieldOption[] = [
  { value: 'full', labelAr: 'كامل', labelEn: 'Full' }, { value: 'partial', labelAr: 'جزئي', labelEn: 'Partial' }, { value: 'unfurnished', labelAr: 'غير مفروش', labelEn: 'Unfurnished' },
];

export const REAL_ESTATE_FIELDS: CategoryFieldMap = {
  'for-sale': [
    { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'select', allowOther: true, required: true, options: RESIDENTIAL_TYPES },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
    { key: 'totalFloors', labelAr: 'عدد الطوابق', labelEn: 'Total Floors', type: 'number', required: false },
    { key: 'year', labelAr: 'سنة البناء', labelEn: 'Year Built', type: 'select', allowOther: true, required: false, options: BUILDING_YEAR_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: true, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: true, required: false, options: VIEW_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: true, required: false, options: PARKING_OPTIONS },
    { key: 'furnished', labelAr: 'مفروشة', labelEn: 'Furnished', type: 'boolean', required: false },
  ],
  'for-rent': [
    { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'select', allowOther: true, required: true, options: RENT_RESIDENTIAL_TYPES },
    { key: 'rentPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rent Period', type: 'select', allowOther: true, required: true, options: RENT_PERIODS },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'depositAmount', labelAr: 'مبلغ التأمين', labelEn: 'Deposit Amount', type: 'number', required: false },
    { key: 'utilitiesIncluded', labelAr: 'شامل الفواتير', labelEn: 'Utilities Included', type: 'boolean', required: false },
    { key: 'petsAllowed', labelAr: 'يسمح بالحيوانات الأليفة', labelEn: 'Pets Allowed', type: 'boolean', required: false },
    { key: 'furnished', labelAr: 'مفروشة', labelEn: 'Furnished', type: 'boolean', required: false },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
    { key: 'totalFloors', labelAr: 'عدد الطوابق', labelEn: 'Total Floors', type: 'number', required: false },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: true, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: true, required: false, options: VIEW_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: true, required: false, options: PARKING_OPTIONS },
  ],
  commercial: [
    { key: 'propertyType', labelAr: 'نوع العقار التجاري', labelEn: 'Commercial Type', type: 'select', allowOther: true, required: true, options: COMMERCIAL_TYPES },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
    { key: 'frontage', labelAr: 'عرض الواجهة (متر)', labelEn: 'Frontage (m)', type: 'number', required: false },
    { key: 'footTraffic', labelAr: 'الحركة والنشاط', labelEn: 'Foot Traffic', type: 'select', allowOther: true, required: false, options: [
      { value: 'low', labelAr: 'منخفضة', labelEn: 'Low' }, { value: 'medium', labelAr: 'متوسطة', labelEn: 'Medium' }, { value: 'high', labelAr: 'عالية', labelEn: 'High' },
    ]},
    { key: 'rentOrSale', labelAr: 'نوع العرض', labelEn: 'Offer Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'for_rent', labelAr: 'للإيجار', labelEn: 'For Rent' }, { value: 'for_sale', labelAr: 'للبيع', labelEn: 'For Sale' },
    ]},
    { key: 'rentPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rent Period', type: 'select', allowOther: true, required: false, options: RENT_PERIODS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: true, required: false, options: COMMERCIAL_AMENITIES },
    { key: 'year', labelAr: 'سنة البناء', labelEn: 'Year Built', type: 'select', allowOther: true, required: false, options: BUILDING_YEAR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: [
      { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'excellent', labelAr: 'ممتاز', labelEn: 'Excellent' },
      { value: 'good', labelAr: 'جيد', labelEn: 'Good' }, { value: 'needs_renovation', labelAr: 'يحتاج تجديد', labelEn: 'Needs Renovation' },
    ]},
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: true, required: false, options: PARKING_OPTIONS },
    { key: 'securityDeposit', labelAr: 'مبلغ التأمين', labelEn: 'Security Deposit', type: 'number', required: false },
  ],
  lands: [
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'zoning', labelAr: 'نوع التنظيم / الاستخدام', labelEn: 'Zoning', type: 'select', allowOther: true, required: true, options: ZONING_OPTIONS },
    { key: 'frontage', labelAr: 'عرض الواجهة (متر)', labelEn: 'Frontage (m)', type: 'number', required: false },
    { key: 'orientation', labelAr: 'الاتجاه', labelEn: 'Orientation', type: 'select', allowOther: true, required: false, options: ORIENTATION_OPTIONS },
    { key: 'corner', labelAr: 'قطعة زاوية', labelEn: 'Corner Plot', type: 'boolean', required: false },
    { key: 'readyForBuilding', labelAr: 'جاهزة للبناء', labelEn: 'Ready For Building', type: 'boolean', required: false },
    { key: 'waterAccess', labelAr: 'متوفر ماء', labelEn: 'Water Access', type: 'boolean', required: false },
    { key: 'electricityAccess', labelAr: 'متوفر كهرباء', labelEn: 'Electricity Access', type: 'boolean', required: false },
  ],
  chalets: [
    { key: 'rooms', labelAr: 'عدد الغرف', labelEn: 'Rooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'pool', labelAr: 'المسبح', labelEn: 'Pool', type: 'select', allowOther: true, required: true, options: POOL_OPTIONS },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: true, required: false, options: VIEW_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: true, required: false, options: CHALET_AMENITIES },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: false, options: CONDITION_OPTIONS },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: true, required: false, options: FURNISHED_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: true, required: false, options: PARKING_OPTIONS },
    { key: 'minimumStay', labelAr: 'أقل مدة حجز', labelEn: 'Minimum Stay', type: 'select', allowOther: true, required: false, options: [
      { value: 'daily', labelAr: 'يومي', labelEn: 'Daily' }, { value: 'weekly', labelAr: 'أسبوعي', labelEn: 'Weekly' }, { value: 'monthly', labelAr: 'شهري', labelEn: 'Monthly' },
    ]},
  ],
  foreign: [
    { key: 'country', labelAr: 'الدولة', labelEn: 'Country', type: 'text', required: true },
    { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'text', required: true },
  ],
};
