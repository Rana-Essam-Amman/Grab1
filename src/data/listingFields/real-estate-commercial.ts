import type { CategoryFieldMap } from './types';
import {
  COMMERCIAL_AMENITIES,
  COMMERCIAL_TYPES,
  RENT_PERIODS,
  BUILDING_YEAR_OPTIONS,
  PARKING_OPTIONS,
  SELLER_TYPE_OPTIONS,
  WHOLE_BUILDING_TYPES,
  CONDITION_OPTIONS,
} from './real-estate';

export const REAL_ESTATE_COMMERCIAL_FIELDS: CategoryFieldMap = {
  commercial: [
    { key: 'propertyType', labelAr: 'نوع العقار التجاري', labelEn: 'Commercial Type', type: 'select', allowOther: false, required: true, options: COMMERCIAL_TYPES },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
    { key: 'frontage', labelAr: 'عرض الواجهة (متر)', labelEn: 'Frontage (m)', type: 'number', required: false },
    { key: 'footTraffic', labelAr: 'الحركة والنشاط', labelEn: 'Foot Traffic', type: 'select', allowOther: false, required: false, options: [
      { value: 'low', labelAr: 'منخفضة', labelEn: 'Low' }, { value: 'medium', labelAr: 'متوسطة', labelEn: 'Medium' }, { value: 'high', labelAr: 'عالية', labelEn: 'High' },
    ]},
    { key: 'rentOrSale', labelAr: 'نوع العرض', labelEn: 'Offer Type', type: 'select', allowOther: false, required: true, options: [
      { value: 'for_rent', labelAr: 'للإيجار', labelEn: 'For Rent' }, { value: 'for_sale', labelAr: 'للبيع', labelEn: 'For Sale' },
    ]},
    { key: 'rentPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rent Period', type: 'select', allowOther: false, required: false, options: RENT_PERIODS },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: COMMERCIAL_AMENITIES },
    { key: 'year', labelAr: 'سنة البناء', labelEn: 'Year Built', type: 'select', allowOther: false, required: false, options: BUILDING_YEAR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: false, required: false, options: [
      { value: 'new', labelAr: 'جديد', labelEn: 'New' }, { value: 'excellent', labelAr: 'ممتاز', labelEn: 'Excellent' },
      { value: 'good', labelAr: 'جيد', labelEn: 'Good' }, { value: 'needs_renovation', labelAr: 'يحتاج تجديد', labelEn: 'Needs Renovation' },
    ]},
    { key: 'parking', labelAr: 'مواقف السيارات', labelEn: 'Parking', type: 'select', allowOther: false, required: false, options: PARKING_OPTIONS },
    { key: 'securityDeposit', labelAr: 'مبلغ التأمين', labelEn: 'Security Deposit', type: 'number', required: false },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
    { key: 'businessType', labelAr: 'نوع النشاط', labelEn: 'Business Type', type: 'select', allowOther: false, required: false, options: [
      { value: 'office', labelAr: 'مكتب', labelEn: 'Office' },
      { value: 'shop', labelAr: 'محل تجاري', labelEn: 'Shop' },
      { value: 'warehouse', labelAr: 'مستودع', labelEn: 'Warehouse' },
      { value: 'clinic', labelAr: 'عيادة', labelEn: 'Clinic' },
      { value: 'restaurant', labelAr: 'مطعم / كافيه', labelEn: 'Restaurant/Cafe' },
    ]},
    { key: 'ceilingHeight', labelAr: 'ارتفاع السقف (متر)', labelEn: 'Ceiling Height (m)', type: 'number', required: false },
  ],
  'whole-buildings': [
    { key: 'propertyType', labelAr: 'نوع المبنى', labelEn: 'Building Type', type: 'select', allowOther: false, required: true, options: WHOLE_BUILDING_TYPES },
    { key: 'area', labelAr: 'مساحة الأرض (م²)', labelEn: 'Land Area (m²)', type: 'number', required: true },
    { key: 'builtArea', labelAr: 'المساحة المبنية (م²)', labelEn: 'Built Area (m²)', type: 'number', required: false },
    { key: 'floors', labelAr: 'عدد الطوابق', labelEn: 'Number of Floors', type: 'number', required: true },
    { key: 'apartmentsCount', labelAr: 'عدد الوحدات/الشقق', labelEn: 'Number of Units', type: 'number', required: false },
    { key: 'year', labelAr: 'سنة البناء', labelEn: 'Year Built', type: 'select', allowOther: false, required: false, options: BUILDING_YEAR_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: false, required: false, options: CONDITION_OPTIONS },
    { key: 'currentIncome', labelAr: 'الدخل السنوي الحالي', labelEn: 'Current Annual Income', type: 'number', required: false },
    { key: 'amenities', labelAr: 'المميزات والخدمات', labelEn: 'Amenities', type: 'select', multiSelect: true, allowOther: false, required: false, options: COMMERCIAL_AMENITIES },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: SELLER_TYPE_OPTIONS },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
};
