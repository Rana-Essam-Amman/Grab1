// RULE-14-EXCEPTION: Static taxonomy
import type { CategoryFieldMap, ListingFieldOption } from './types';

const CURRENT_YEAR = new Date().getFullYear();

export const BUILDING_YEAR_OPTIONS: ListingFieldOption[] = Array.from({ length: 80 }, (_, i) => ({
  value: String(CURRENT_YEAR - i), labelAr: String(CURRENT_YEAR - i), labelEn: String(CURRENT_YEAR - i),
}));

export const RESIDENTIAL_AMENITIES: ListingFieldOption[] = [
  { value: 'pool', labelAr: 'مسبح', labelEn: 'Pool' }, { value: 'garden', labelAr: 'حديقة', labelEn: 'Garden' },
  { value: 'elevator', labelAr: 'مصعد', labelEn: 'Elevator' }, { value: 'parking', labelAr: 'موقف سيارة', labelEn: 'Parking' },
  { value: 'security', labelAr: 'أمن 24/7', labelEn: '24/7 Security' }, { value: 'gym', labelAr: 'صالة رياضية', labelEn: 'Gym' },
  { value: 'balcony', labelAr: 'شرفة', labelEn: 'Balcony' }, { value: 'maid_room', labelAr: 'غرفة خادمة', labelEn: 'Maid Room' },
  { value: 'laundry_room', labelAr: 'غرفة غسيل', labelEn: 'Laundry Room' }, { value: 'fitted_kitchen', labelAr: 'مطبخ راكب', labelEn: 'Fitted Kitchen' },
];

export const COMMERCIAL_AMENITIES: ListingFieldOption[] = [
  { value: 'kitchen', labelAr: 'مطبخ', labelEn: 'Kitchen' }, { value: 'bathroom', labelAr: 'حمام', labelEn: 'Bathroom' },
  { value: 'parking', labelAr: 'موقف', labelEn: 'Parking' }, { value: 'storage', labelAr: 'مستودع', labelEn: 'Storage' },
  { value: 'elevator', labelAr: 'مصعد', labelEn: 'Elevator' }, { value: 'ac', labelAr: 'مكيفات', labelEn: 'AC' },
];

export const CHALET_AMENITIES: ListingFieldOption[] = [
  { value: 'garden', labelAr: 'حديقة', labelEn: 'Garden' }, { value: 'outdoor_seating', labelAr: 'جلسة خارجية', labelEn: 'Outdoor Seating' },
  { value: 'bbq', labelAr: 'شواية', labelEn: 'BBQ' }, { value: 'playground', labelAr: 'ملعب أطفال', labelEn: 'Playground' },
  { value: 'pool', labelAr: 'مسبح', labelEn: 'Pool' },
];

export const HOTEL_AMENITIES: ListingFieldOption[] = [
  { value: 'room_service', labelAr: 'خدمة الغرف', labelEn: 'Room Service' }, { value: 'wifi', labelAr: 'واي فاي', labelEn: 'WiFi' },
  { value: 'gym', labelAr: 'صالة رياضية', labelEn: 'Gym' }, { value: 'pool', labelAr: 'مسبح', labelEn: 'Pool' },
  { value: 'spa', labelAr: 'سبا', labelEn: 'Spa' }, { value: 'parking', labelAr: 'موقف', labelEn: 'Parking' },
  { value: 'kitchen', labelAr: 'مطبخ مجهز', labelEn: 'Fully-Equipped Kitchen' }, { value: 'laundry', labelAr: 'خدمة غسيل', labelEn: 'Laundry Service' },
  { value: 'restaurant', labelAr: 'مطعم', labelEn: 'Restaurant' }, { value: 'reception_24h', labelAr: 'استقبال 24 ساعة', labelEn: '24/7 Reception' },
];

export const VIEW_OPTIONS: ListingFieldOption[] = [
  { value: 'street', labelAr: 'شارع', labelEn: 'Street' }, { value: 'garden', labelAr: 'حديقة', labelEn: 'Garden' },
  { value: 'pool', labelAr: 'مسبح', labelEn: 'Pool' }, { value: 'sea', labelAr: 'بحر', labelEn: 'Sea' },
  { value: 'mountain', labelAr: 'جبل', labelEn: 'Mountain' }, { value: 'city', labelAr: 'مدينة', labelEn: 'City' },
];

export const PARKING_OPTIONS: ListingFieldOption[] = [
  { value: 'none', labelAr: 'لا يوجد', labelEn: 'None' }, { value: '1', labelAr: '1', labelEn: '1' },
  { value: '2', labelAr: '2', labelEn: '2' }, { value: '3+', labelAr: '3+', labelEn: '3+' },
];

export const RESIDENTIAL_TYPES: ListingFieldOption[] = [
  { value: 'شقة', labelAr: 'شقة', labelEn: 'Apartment' }, { value: 'منزل', labelAr: 'منزل', labelEn: 'House' },
  { value: 'فيلا', labelAr: 'فيلا', labelEn: 'Villa' }, { value: 'أرض', labelAr: 'أرض', labelEn: 'Land' },
];

export const RENT_RESIDENTIAL_TYPES: ListingFieldOption[] = [
  { value: 'شقة', labelAr: 'شقة', labelEn: 'Apartment' }, { value: 'استديو', labelAr: 'استديو', labelEn: 'Studio' },
  { value: 'فيلا', labelAr: 'فيلا', labelEn: 'Villa' },
];

export const RENT_PERIODS: ListingFieldOption[] = [
  { value: 'monthly', labelAr: 'شهري', labelEn: 'Monthly' }, { value: 'quarterly', labelAr: 'ربع سنوي', labelEn: 'Quarterly' },
  { value: 'yearly', labelAr: 'سنوي', labelEn: 'Yearly' }, { value: 'daily', labelAr: 'يومي', labelEn: 'Daily' },
];

export const COMMERCIAL_TYPES: ListingFieldOption[] = [
  { value: 'shop', labelAr: 'محل', labelEn: 'Shop' }, { value: 'office', labelAr: 'مكتب', labelEn: 'Office' },
  { value: 'showroom', labelAr: 'معرض', labelEn: 'Showroom' }, { value: 'warehouse', labelAr: 'مستودع', labelEn: 'Warehouse' },
  { value: 'workshop', labelAr: 'ورشة', labelEn: 'Workshop' }, { value: 'restaurant', labelAr: 'مطعم', labelEn: 'Restaurant' },
  { value: 'cafe', labelAr: 'كافيه', labelEn: 'Cafe' },
];

export const ZONING_OPTIONS: ListingFieldOption[] = [
  { value: 'residential', labelAr: 'سكني', labelEn: 'Residential' }, { value: 'commercial', labelAr: 'تجاري', labelEn: 'Commercial' },
  { value: 'agricultural', labelAr: 'زراعي', labelEn: 'Agricultural' }, { value: 'industrial', labelAr: 'صناعي', labelEn: 'Industrial' },
];

export const ORIENTATION_OPTIONS: ListingFieldOption[] = [
  { value: 'north', labelAr: 'شمالية', labelEn: 'North' }, { value: 'south', labelAr: 'جنوبية', labelEn: 'South' },
  { value: 'east', labelAr: 'شرقية', labelEn: 'East' }, { value: 'west', labelAr: 'غربية', labelEn: 'West' },
];

export const POOL_OPTIONS: ListingFieldOption[] = [
  { value: 'private', labelAr: 'خاص', labelEn: 'Private' }, { value: 'shared', labelAr: 'مشترك', labelEn: 'Shared' }, { value: 'none', labelAr: 'لا يوجد', labelEn: 'None' },
];

export const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'excellent', labelAr: 'ممتاز', labelEn: 'Excellent' },
  { value: 'good', labelAr: 'جيد', labelEn: 'Good' }, { value: 'fair', labelAr: 'مقبول', labelEn: 'Fair' },
];

export const FURNISHED_OPTIONS: ListingFieldOption[] = [
  { value: 'full', labelAr: 'كامل', labelEn: 'Full' }, { value: 'partial', labelAr: 'جزئي', labelEn: 'Partial' }, { value: 'unfurnished', labelAr: 'غير مفروش', labelEn: 'Unfurnished' },
];

export const CHEQUES_OPTIONS: ListingFieldOption[] = [
  { value: '1', labelAr: 'شيك واحد', labelEn: '1 Cheque' },
  { value: '2', labelAr: 'شيكان', labelEn: '2 Cheques' },
  { value: '3', labelAr: '3 شيكات', labelEn: '3 Cheques' },
  { value: '4', labelAr: '4 شيكات', labelEn: '4 Cheques' },
  { value: '6', labelAr: '6 شيكات', labelEn: '6 Cheques' },
  { value: '12', labelAr: '12 شيكاً', labelEn: '12 Cheques' },
];

export const SELLER_TYPE_OPTIONS: ListingFieldOption[] = [
  { value: 'owner', labelAr: 'مالك', labelEn: 'Owner' },
  { value: 'broker', labelAr: 'وسيط', labelEn: 'Broker' },
  { value: 'company', labelAr: 'شركة', labelEn: 'Company' },
];

export const FINISHING_OPTIONS: ListingFieldOption[] = [
  { value: 'normal', labelAr: 'تشطيب عادي', labelEn: 'Normal Finish' },
  { value: 'semi', labelAr: 'نصف تشطيب', labelEn: 'Semi-Finished' },
  { value: 'super', labelAr: 'سوبر ديلوكس', labelEn: 'Super Deluxe' },
  { value: 'deluxe', labelAr: 'ديلوكس', labelEn: 'Deluxe' },
];

export const FOREIGN_PROPERTY_TYPES: ListingFieldOption[] = [
  { value: 'شقة', labelAr: 'شقة', labelEn: 'Apartment' },
  { value: 'منزل', labelAr: 'منزل', labelEn: 'House' },
  { value: 'فيلا', labelAr: 'فيلا', labelEn: 'Villa' },
  { value: 'أرض', labelAr: 'أرض', labelEn: 'Land' },
  { value: 'تجاري', labelAr: 'تجاري', labelEn: 'Commercial' },
];

export const FOREIGN_FURNISHED: ListingFieldOption[] = [
  { value: 'full', labelAr: 'مفروش كامل', labelEn: 'Fully Furnished' },
  { value: 'partial', labelAr: 'مفروش جزئي', labelEn: 'Partially Furnished' },
  { value: 'unfurnished', labelAr: 'غير مفروش', labelEn: 'Unfurnished' },
];

export const SHARED_ROOM_TYPES: ListingFieldOption[] = [
  { value: 'shared_room', labelAr: 'غرفة مشتركة', labelEn: 'Shared Room' },
  { value: 'private_room', labelAr: 'غرفة خاصة', labelEn: 'Private Room' },
  { value: 'bed_space', labelAr: 'سرير في غرفة', labelEn: 'Bed Space' },
  { value: 'studio_shared', labelAr: 'استوديو مشترك', labelEn: 'Shared Studio' },
];

export const GENDER_OPTIONS: ListingFieldOption[] = [
  { value: 'male', labelAr: 'للذكور', labelEn: 'For Males' },
  { value: 'female', labelAr: 'للإناث', labelEn: 'For Females' },
  { value: 'family', labelAr: 'للعائلات', labelEn: 'For Families' },
  { value: 'mixed', labelAr: 'مختلط', labelEn: 'Mixed' },
];

export const HOTEL_APARTMENT_TYPES: ListingFieldOption[] = [
  { value: 'studio', labelAr: 'استوديو فندقي', labelEn: 'Hotel Studio' },
  { value: 'one_bedroom', labelAr: 'غرفة وصالة', labelEn: '1BR Suite' },
  { value: 'two_bedroom', labelAr: 'غرفتين وصالة', labelEn: '2BR Suite' },
  { value: 'presidential', labelAr: 'سويت رئاسي', labelEn: 'Presidential Suite' },
];

export const STAR_RATING_OPTIONS: ListingFieldOption[] = [
  { value: '3', labelAr: '3 نجوم', labelEn: '3 Stars' },
  { value: '4', labelAr: '4 نجوم', labelEn: '4 Stars' },
  { value: '5', labelAr: '5 نجوم', labelEn: '5 Stars' },
];

export const WHOLE_BUILDING_TYPES: ListingFieldOption[] = [
  { value: 'residential', labelAr: 'عمارة سكنية', labelEn: 'Residential Building' },
  { value: 'commercial', labelAr: 'عمارة تجارية', labelEn: 'Commercial Building' },
  { value: 'mixed', labelAr: 'عمارة مختلطة', labelEn: 'Mixed-Use Building' },
];

export const STAFF_HOUSING_TYPES: ListingFieldOption[] = [
  { value: 'labor', labelAr: 'سكن عمال', labelEn: 'Labor Housing' },
  { value: 'staff', labelAr: 'سكن موظفين', labelEn: 'Staff Housing' },
  { value: 'dormitory', labelAr: 'سكن جماعي', labelEn: 'Dormitory' },
];

export const CONSTRUCTION_SERVICES: ListingFieldOption[] = [
  { value: 'new_build', labelAr: 'بناء جديد', labelEn: 'New Construction' },
  { value: 'renovation', labelAr: 'ترميم وتجديد', labelEn: 'Renovation' },
  { value: 'finishing', labelAr: 'تشطيب', labelEn: 'Finishing' },
  { value: 'maintenance', labelAr: 'صيانة عامة', labelEn: 'Maintenance' },
  { value: 'demolition', labelAr: 'هدم وإزالة', labelEn: 'Demolition' },
  { value: 'design', labelAr: 'تصميم ومخططات', labelEn: 'Design & Blueprints' },
];

export const CONSTRUCTION_PROJECT_TYPES: ListingFieldOption[] = [
  { value: 'residential', labelAr: 'سكني', labelEn: 'Residential' },
  { value: 'commercial', labelAr: 'تجاري', labelEn: 'Commercial' },
  { value: 'industrial', labelAr: 'صناعي', labelEn: 'Industrial' },
  { value: 'infrastructure', labelAr: 'بنية تحتية', labelEn: 'Infrastructure' },
];

export const CONSTRUCTION_DURATION: ListingFieldOption[] = [
  { value: '1_3_months', labelAr: '1-3 أشهر', labelEn: '1-3 Months' },
  { value: '3_6_months', labelAr: '3-6 أشهر', labelEn: '3-6 Months' },
  { value: '6_12_months', labelAr: '6-12 شهر', labelEn: '6-12 Months' },
  { value: 'over_12', labelAr: 'أكثر من سنة', labelEn: 'Over 12 Months' },
];

export const CONSTRUCTION_INCLUDES: ListingFieldOption[] = [
  { value: 'materials', labelAr: 'مواد بناء', labelEn: 'Materials' },
  { value: 'labor', labelAr: 'عمالة', labelEn: 'Labor' },
  { value: 'design', labelAr: 'تصاميم هندسية', labelEn: 'Engineering Design' },
  { value: 'permits', labelAr: 'تراخيص ورخص', labelEn: 'Permits & Licenses' },
  { value: 'equipment', labelAr: 'معدات وآليات', labelEn: 'Equipment & Machinery' },
];

export const CONSTRUCTION_PRICE_TYPE: ListingFieldOption[] = [
  { value: 'per_sqm', labelAr: 'سعر لكل م²', labelEn: 'Price Per SQM' },
  { value: 'total', labelAr: 'سعر إجمالي للمشروع', labelEn: 'Total Project Price' },
  { value: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable' },
];

export const CONTRACTOR_TYPE: ListingFieldOption[] = [
  { value: 'individual', labelAr: 'مقاول فردي', labelEn: 'Individual Contractor' },
  { value: 'company', labelAr: 'شركة مقاولات', labelEn: 'Construction Company' },
  { value: 'engineering_office', labelAr: 'مكتب هندسي', labelEn: 'Engineering Office' },
];

export const APARTMENT_TYPES: ListingFieldOption[] = [
  { value: 'apartment', labelAr: 'شقة', labelEn: 'Apartment' },
  { value: 'studio', labelAr: 'استوديو', labelEn: 'Studio' },
  { value: 'duplex', labelAr: 'دوبلكس', labelEn: 'Duplex' },
  { value: 'penthouse', labelAr: 'بنتهاوس', labelEn: 'Penthouse' },
];

export const VILLA_TYPES: ListingFieldOption[] = [
  { value: 'villa', labelAr: 'فيلا', labelEn: 'Villa' },
  { value: 'palace', labelAr: 'قصر', labelEn: 'Palace' },
  { value: 'townhouse', labelAr: 'تاون هاوس', labelEn: 'Townhouse' },
];

export const HOUSE_TYPES: ListingFieldOption[] = [
  { value: 'house', labelAr: 'منزل', labelEn: 'House' },
  { value: 'traditional', labelAr: 'منزل تراثي', labelEn: 'Traditional House' },
];

export const REAL_ESTATE_FIELDS: CategoryFieldMap = {
  'apartments-for-sale': [
    { key: 'propertyType', labelAr: 'نوع الشقة', labelEn: 'Apartment Type', type: 'select', allowOther: false, required: true, options: APARTMENT_TYPES },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
    { key: 'totalFloors', labelAr: 'عدد الطوابق', labelEn: 'Total Floors', type: 'number', required: false },
    { key: 'year', labelAr: 'سنة البناء', labelEn: 'Year Built', type: 'select', allowOther: false, required: false, options: BUILDING_YEAR_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: false, required: false, options: VIEW_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: false, required: false, options: FURNISHED_OPTIONS },
    { key: 'finishingType', labelAr: 'نوع التشطيب', labelEn: 'Finishing Type', type: 'select', allowOther: false, required: false, options: FINISHING_OPTIONS },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'paymentMethod', labelAr: 'طريقة الدفع', labelEn: 'Payment Method', type: 'select', allowOther: false, required: true, options: [
      { value: 'cash', labelAr: 'كاش', labelEn: 'Cash' },
      { value: 'installments', labelAr: 'تقسيط', labelEn: 'Installments' },
    ]},
    { key: 'deliveryDate', labelAr: 'حالة التسليم', labelEn: 'Delivery Date', type: 'select', allowOther: false, required: false, options: [
      { value: 'ready', labelAr: 'جاهز للسكن', labelEn: 'Ready' },
      { value: 'under_construction', labelAr: 'قيد الإنشاء', labelEn: 'Under Construction' },
    ]},
    { key: 'ownershipType', labelAr: 'نوع الملكية', labelEn: 'Ownership Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'tabu', labelAr: 'طابو', labelEn: 'Tabu' },
      { value: 'not_tabu', labelAr: 'تسجيل عادي', labelEn: 'Not Tabu' },
    ]},
  ],
  'villas-for-sale': [
    { key: 'propertyType', labelAr: 'نوع الفيلا', labelEn: 'Villa Type', type: 'select', allowOther: false, required: true, options: VILLA_TYPES },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'مساحة البناء (م²)', labelEn: 'Built Area (m²)', type: 'number', required: true },
    { key: 'landArea', labelAr: 'مساحة الأرض (م²)', labelEn: 'Land Area (m²)', type: 'number', required: true },
    { key: 'floors', labelAr: 'عدد الطوابق', labelEn: 'Floors', type: 'number', required: false },
    { key: 'year', labelAr: 'سنة البناء', labelEn: 'Year Built', type: 'select', allowOther: false, required: false, options: BUILDING_YEAR_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: false, required: false, options: VIEW_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: false, required: false, options: FURNISHED_OPTIONS },
    { key: 'finishingType', labelAr: 'نوع التشطيب', labelEn: 'Finishing Type', type: 'select', allowOther: false, required: false, options: FINISHING_OPTIONS },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'paymentMethod', labelAr: 'طريقة الدفع', labelEn: 'Payment Method', type: 'select', allowOther: false, required: true, options: [
      { value: 'cash', labelAr: 'كاش', labelEn: 'Cash' },
      { value: 'installments', labelAr: 'تقسيط', labelEn: 'Installments' },
    ]},
    { key: 'deliveryDate', labelAr: 'حالة التسليم', labelEn: 'Delivery Date', type: 'select', allowOther: false, required: false, options: [
      { value: 'ready', labelAr: 'جاهز للسكن', labelEn: 'Ready' },
      { value: 'under_construction', labelAr: 'قيد الإنشاء', labelEn: 'Under Construction' },
    ]},
    { key: 'ownershipType', labelAr: 'نوع الملكية', labelEn: 'Ownership Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'tabu', labelAr: 'طابو', labelEn: 'Tabu' },
      { value: 'not_tabu', labelAr: 'تسجيل عادي', labelEn: 'Not Tabu' },
    ]},
  ],
  'houses-for-sale': [
    { key: 'propertyType', labelAr: 'نوع المنزل', labelEn: 'House Type', type: 'select', allowOther: false, required: true, options: HOUSE_TYPES },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'مساحة البناء (م²)', labelEn: 'Built Area (m²)', type: 'number', required: true },
    { key: 'landArea', labelAr: 'مساحة الأرض (م²)', labelEn: 'Land Area (m²)', type: 'number', required: true },
    { key: 'floors', labelAr: 'عدد الطوابق', labelEn: 'Floors', type: 'number', required: false },
    { key: 'year', labelAr: 'سنة البناء', labelEn: 'Year Built', type: 'select', allowOther: false, required: false, options: BUILDING_YEAR_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: false, required: false, options: VIEW_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: false, required: false, options: FURNISHED_OPTIONS },
    { key: 'finishingType', labelAr: 'نوع التشطيب', labelEn: 'Finishing Type', type: 'select', allowOther: false, required: false, options: FINISHING_OPTIONS },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'paymentMethod', labelAr: 'طريقة الدفع', labelEn: 'Payment Method', type: 'select', allowOther: false, required: true, options: [
      { value: 'cash', labelAr: 'كاش', labelEn: 'Cash' },
      { value: 'installments', labelAr: 'تقسيط', labelEn: 'Installments' },
    ]},
    { key: 'deliveryDate', labelAr: 'حالة التسليم', labelEn: 'Delivery Date', type: 'select', allowOther: false, required: false, options: [
      { value: 'ready', labelAr: 'جاهز للسكن', labelEn: 'Ready' },
      { value: 'under_construction', labelAr: 'قيد الإنشاء', labelEn: 'Under Construction' },
    ]},
    { key: 'ownershipType', labelAr: 'نوع الملكية', labelEn: 'Ownership Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'tabu', labelAr: 'طابو', labelEn: 'Tabu' },
      { value: 'not_tabu', labelAr: 'تسجيل عادي', labelEn: 'Not Tabu' },
    ]},
  ],
  'houses-for-rent': [
    { key: 'propertyType', labelAr: 'نوع المنزل', labelEn: 'House Type', type: 'select', allowOther: false, required: true, options: HOUSE_TYPES },
    { key: 'rentPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rent Period', type: 'select', allowOther: false, required: true, options: RENT_PERIODS },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'مساحة البناء (م²)', labelEn: 'Built Area (m²)', type: 'number', required: true },
    { key: 'landArea', labelAr: 'مساحة الأرض (م²)', labelEn: 'Land Area (m²)', type: 'number', required: true },
    { key: 'depositAmount', labelAr: 'مبلغ التأمين', labelEn: 'Deposit Amount', type: 'number', required: false },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: false, required: false, options: FURNISHED_OPTIONS },
    { key: 'cheques', labelAr: 'عدد الشيكات', labelEn: 'Cheques', type: 'select', allowOther: false, required: false, options: CHEQUES_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'finishingType', labelAr: 'نوع التشطيب', labelEn: 'Finishing Type', type: 'select', allowOther: false, required: false, options: FINISHING_OPTIONS },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'tenantType', labelAr: 'لمن العقار', labelEn: 'Tenant Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'family', labelAr: 'عائلات', labelEn: 'Families' },
      { value: 'singles', labelAr: 'عزاب', labelEn: 'Singles' },
    ]},
    { key: 'availableFrom', labelAr: 'متوفر من تاريخ', labelEn: 'Available From', type: 'text', required: false, placeholder: '2026-01-01' },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
  'apartments-for-rent': [
    { key: 'propertyType', labelAr: 'نوع الشقة', labelEn: 'Apartment Type', type: 'select', allowOther: false, required: true, options: APARTMENT_TYPES },
    { key: 'rentPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rent Period', type: 'select', allowOther: false, required: true, options: RENT_PERIODS },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'depositAmount', labelAr: 'مبلغ التأمين', labelEn: 'Deposit Amount', type: 'number', required: false },
    { key: 'utilitiesIncluded', labelAr: 'شامل الفواتير', labelEn: 'Utilities Included', type: 'boolean', required: false },
    { key: 'petsAllowed', labelAr: 'يسمح بالحيوانات الأليفة', labelEn: 'Pets Allowed', type: 'boolean', required: false },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: false, required: false, options: FURNISHED_OPTIONS },
    { key: 'cheques', labelAr: 'عدد الشيكات', labelEn: 'Cheques', type: 'select', allowOther: false, required: false, options: CHEQUES_OPTIONS },
    { key: 'agencyFee', labelAr: 'يوجد عمولة وسيط', labelEn: 'Agency Fee', type: 'boolean', required: false },
    { key: 'availableFrom', labelAr: 'متوفر من تاريخ', labelEn: 'Available From', type: 'text', required: false, placeholder: '2026-01-01' },
    { key: 'finishingType', labelAr: 'نوع التشطيب', labelEn: 'Finishing Type', type: 'select', allowOther: false, required: false, options: FINISHING_OPTIONS },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
    { key: 'totalFloors', labelAr: 'عدد الطوابق', labelEn: 'Total Floors', type: 'number', required: false },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: false, required: false, options: VIEW_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'tenantType', labelAr: 'لمن العقار', labelEn: 'Tenant Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'family', labelAr: 'عائلات', labelEn: 'Families' },
      { value: 'singles', labelAr: 'عزاب', labelEn: 'Singles' },
      { value: 'students', labelAr: 'طلاب', labelEn: 'Students' },
      { value: 'anyone', labelAr: 'الجميع', labelEn: 'Anyone' },
    ]},
  ],
  'villas-for-rent': [
    { key: 'propertyType', labelAr: 'نوع الفيلا', labelEn: 'Villa Type', type: 'select', allowOther: false, required: true, options: VILLA_TYPES },
    { key: 'rentPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rent Period', type: 'select', allowOther: false, required: true, options: RENT_PERIODS },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'مساحة البناء (م²)', labelEn: 'Built Area (m²)', type: 'number', required: true },
    { key: 'landArea', labelAr: 'مساحة الأرض (م²)', labelEn: 'Land Area (m²)', type: 'number', required: true },
    { key: 'depositAmount', labelAr: 'مبلغ التأمين', labelEn: 'Deposit Amount', type: 'number', required: false },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: false, required: false, options: FURNISHED_OPTIONS },
    { key: 'cheques', labelAr: 'عدد الشيكات', labelEn: 'Cheques', type: 'select', allowOther: false, required: false, options: CHEQUES_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'select', allowOther: false, required: false, options: VIEW_OPTIONS },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'tenantType', labelAr: 'لمن العقار', labelEn: 'Tenant Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'family', labelAr: 'عائلات', labelEn: 'Families' },
      { value: 'singles', labelAr: 'عزاب', labelEn: 'Singles' },
    ]},
  ],
  'for-rent': [
    { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'select', allowOther: false, required: true, options: RENT_RESIDENTIAL_TYPES },
    { key: 'rentPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rent Period', type: 'select', allowOther: false, required: true, options: RENT_PERIODS },
    { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'depositAmount', labelAr: 'مبلغ التأمين', labelEn: 'Deposit Amount', type: 'number', required: false },
    { key: 'utilitiesIncluded', labelAr: 'شامل الفواتير', labelEn: 'Utilities Included', type: 'boolean', required: false },
    { key: 'petsAllowed', labelAr: 'يسمح بالحيوانات الأليفة', labelEn: 'Pets Allowed', type: 'boolean', required: false },
    { key: 'furnished', labelAr: 'الفرش', labelEn: 'Furnished', type: 'select', allowOther: false, required: false, options: FURNISHED_OPTIONS },
    { key: 'cheques', labelAr: 'عدد الشيكات', labelEn: 'Cheques', type: 'select', allowOther: false, required: false, options: CHEQUES_OPTIONS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: RESIDENTIAL_AMENITIES },
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'finishingType', labelAr: 'نوع التشطيب', labelEn: 'Finishing Type', type: 'select', allowOther: false, required: false, options: FINISHING_OPTIONS },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'tenantType', labelAr: 'لمن العقار', labelEn: 'Tenant Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'family', labelAr: 'عائلات', labelEn: 'Families' },
      { value: 'singles', labelAr: 'عزاب', labelEn: 'Singles' },
    ]},
    { key: 'availableFrom', labelAr: 'متوفر من تاريخ', labelEn: 'Available From', type: 'text', required: false, placeholder: '2026-01-01' },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
};

