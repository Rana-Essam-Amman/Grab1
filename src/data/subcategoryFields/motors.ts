import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COLORS = ['أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 'بني', 'بيج', 'أخضر', 'أصفر', OTHER];
const CONDITION = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', 'مستعمل - مقبول', OTHER];

export const MOTORS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  motorbikes: [
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'select', required: false, options: [] },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'number', required: true },
    { key: 'km', labelAr: 'العداد (كم)', labelEn: 'Mileage (km)', type: 'number', required: true },
    { key: 'engineCc', labelAr: 'سعة المحرك (cc)', labelEn: 'Engine (cc)', type: 'number', required: true },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: true, options: COLORS },
    { key: 'bikeType', labelAr: 'نوع الدراجة', labelEn: 'Bike Type', type: 'select', required: true, options: ['سكوتر', 'دراجة عادية', 'رياضية', 'كراسي متحركة', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION },
  ],

  heavy: [
    { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'number', required: true },
    { key: 'km', labelAr: 'العداد (كم)', labelEn: 'Mileage (km)', type: 'number', required: true },
    { key: 'capacityTons', labelAr: 'الحمولة (طن)', labelEn: 'Capacity (tons)', type: 'number', required: true },
    { key: 'truckType', labelAr: 'نوع الشاحنة', labelEn: 'Truck Type', type: 'select', required: true, options: ['قلاب', 'سطحة', 'براد', 'صهريج', 'رافعة', 'شاحنة عادية', OTHER] },
    { key: 'fuel', labelAr: 'الوقود', labelEn: 'Fuel', type: 'select', required: true, options: ['ديزل', 'بنزين', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION },
  ],

  plates: [
    { key: 'plateType', labelAr: 'نوع اللوحة', labelEn: 'Plate Type', type: 'select', required: true, options: ['خصوصي', 'تجاري', 'عمومي', 'دبل', OTHER] },
    { key: 'plateCode', labelAr: 'الرمز', labelEn: 'Code', type: 'text', required: true, placeholder: 'مثال: 12' },
    { key: 'plateLetters', labelAr: 'الحروف', labelEn: 'Letters', type: 'text', required: true },
    { key: 'plateNumbers', labelAr: 'الأرقام', labelEn: 'Numbers', type: 'text', required: true },
    { key: 'city', labelAr: 'المدينة', labelEn: 'City', type: 'text', required: false },
  ],

  parts: [
    { key: 'partName', labelAr: 'اسم القطعة', labelEn: 'Part Name', type: 'text', required: true },
    { key: 'carMake', labelAr: 'ماركة السيارة', labelEn: 'Car Make', type: 'select', required: true, options: [] },
    { key: 'partNumber', labelAr: 'رقم القطعة', labelEn: 'Part Number', type: 'text', required: false },
    { key: 'oem', labelAr: 'الأصالة', labelEn: 'OEM', type: 'select', required: true, options: ['أصلي (وكالة)', 'تجاري', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', required: false, options: ['ساري', 'منتهي', 'بدون', OTHER] },
  ],

  boats: [
    { key: 'boatType', labelAr: 'نوع القارب', labelEn: 'Boat Type', type: 'select', required: true, options: ['قارب', 'جت سكي', 'يخت', 'فايبر', 'قارب صيد', OTHER] },
    { key: 'boatMake', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: false },
    { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'number', required: true },
    { key: 'lengthFt', labelAr: 'الطول (قدم)', labelEn: 'Length (ft)', type: 'number', required: true },
    { key: 'engineHp', labelAr: 'قوة المحرك (حصان)', labelEn: 'Engine (HP)', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION },
  ],

  accessories: [
    { key: 'accessoryType', labelAr: 'نوع الإكسسوار', labelEn: 'Accessory Type', type: 'text', required: true, placeholder: 'مقاعد، شاشات، كاميرات، حساسات...' },
    { key: 'carMake', labelAr: 'ماركة السيارة', labelEn: 'Car Make', type: 'select', required: false, options: [] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],
};
