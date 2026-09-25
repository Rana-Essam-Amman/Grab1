import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const YES_NO = ['نعم', 'لا', 'جزئياً', OTHER];

export const REAL_ESTATE_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  'for-sale': [
    { key: 'unitType', labelAr: 'نوع الوحدة', labelEn: 'Unit Type', type: 'select', required: true, options: ['شقة', 'فيلا', 'دوبلكس', 'بنتهاوس', 'استوديو', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'rooms', labelAr: 'عدد الغرف', labelEn: 'Rooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: true, placeholder: 'أرضي، 2، 5...' },
    { key: 'buildingAge', labelAr: 'عمر البناء', labelEn: 'Building Age', type: 'select', required: true, options: ['جديد', '1-5 سنوات', '6-10 سنوات', 'أكثر من 10 سنوات', OTHER] },
    { key: 'furnished', labelAr: 'مفروشة', labelEn: 'Furnished', type: 'select', required: false, options: YES_NO },
    { key: 'ownershipType', labelAr: 'نوع الملكية', labelEn: 'Ownership', type: 'select', required: true, options: ['طابو', 'حجة', 'مفتاح', 'إسكان', OTHER] },
    { key: 'view', labelAr: 'الإطلالة', labelEn: 'View', type: 'text', required: false },
  ],

  'for-rent': [
    { key: 'unitType', labelAr: 'نوع الوحدة', labelEn: 'Unit Type', type: 'select', required: true, options: ['شقة', 'فيلا', 'استوديو', 'غرفة', 'دوبلكس', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'rooms', labelAr: 'عدد الغرف', labelEn: 'Rooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false, placeholder: 'أرضي، 2، 5...' },
    { key: 'furnished', labelAr: 'مفروشة', labelEn: 'Furnished', type: 'select', required: true, options: YES_NO },
    { key: 'rentalPeriod', labelAr: 'مدة الإيجار', labelEn: 'Rental Period', type: 'select', required: true, options: ['شهري', 'ربع سنوي', 'نصف سنوي', 'سنوي', OTHER] },
    { key: 'deposit', labelAr: 'التأمين', labelEn: 'Deposit', type: 'text', required: false, placeholder: 'مثال: شهر إيجار' },
  ],

  commercial: [
    { key: 'commercialType', labelAr: 'نوع العقار التجاري', labelEn: 'Commercial Type', type: 'select', required: true, options: ['مكتب', 'محل', 'مستودع', 'مصنع', 'أرض تجارية', 'مطعم', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: false },
    { key: 'parking', labelAr: 'مواقف سيارات', labelEn: 'Parking', type: 'select', required: false, options: ['نعم', 'لا', 'مشترك', OTHER] },
    { key: 'listingType', labelAr: 'نوع العرض', labelEn: 'Listing Type', type: 'select', required: true, options: ['للبيع', 'للإيجار', OTHER] },
  ],

  lands: [
    { key: 'landType', labelAr: 'نوع الأرض', labelEn: 'Land Type', type: 'select', required: true, options: ['سكني', 'تجاري', 'زراعي', 'صناعي', 'مختلط', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'facadeWidth', labelAr: 'عرض الواجهة (م)', labelEn: 'Facade Width (m)', type: 'number', required: false },
    { key: 'streetsCount', labelAr: 'عدد الشوارع', labelEn: 'Streets Count', type: 'number', required: false },
    { key: 'zoning', labelAr: 'التنظيم', labelEn: 'Zoning', type: 'select', required: true, options: ['سكني A', 'سكني B', 'تجاري', 'زراعي', 'غير منظم', OTHER] },
    { key: 'services', labelAr: 'الخدمات', labelEn: 'Services', type: 'text', required: false, placeholder: 'كهرباء، ماء، صرف صحي، هاتف...' },
  ],

  chalets: [
    { key: 'chaletType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'select', required: true, options: ['شاليه', 'مزرعة', 'استراحة', 'مخيم', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: false },
    { key: 'rooms', labelAr: 'عدد الغرف', labelEn: 'Rooms', type: 'number', required: true },
    { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: false },
    { key: 'pool', labelAr: 'مسبح', labelEn: 'Pool', type: 'select', required: false, options: ['نعم', 'لا', 'مشترك', OTHER] },
    { key: 'garden', labelAr: 'حديقة', labelEn: 'Garden', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
    { key: 'capacity', labelAr: 'السعة (أشخاص)', labelEn: 'Capacity (persons)', type: 'number', required: true },
    { key: 'rentalPeriod', labelAr: 'مدة الإيجار', labelEn: 'Rental Period', type: 'select', required: true, options: ['يومي', 'نهاية الأسبوع', 'أسبوعي', 'شهري', OTHER] },
  ],

  foreign: [
    { key: 'countryName', labelAr: 'الدولة', labelEn: 'Country', type: 'text', required: true, placeholder: 'مثال: تركيا، قبرص، مصر...' },
    { key: 'cityName', labelAr: 'المدينة', labelEn: 'City', type: 'text', required: true },
    { key: 'unitType', labelAr: 'نوع العقار', labelEn: 'Unit Type', type: 'select', required: true, options: ['شقة', 'فيلا', 'أرض', 'مكتَب', 'محل', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: false },
    { key: 'rooms', labelAr: 'عدد الغرف', labelEn: 'Rooms', type: 'number', required: false },
    { key: 'currencyCode', labelAr: 'العملة', labelEn: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'TRY', 'AED', 'EGP', OTHER] },
    { key: 'ownershipType', labelAr: 'نوع الملكية', labelEn: 'Ownership', type: 'text', required: false },
  ],
};
