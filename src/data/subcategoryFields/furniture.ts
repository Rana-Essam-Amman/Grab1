import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COND_FR = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER];

export const FURNITURE_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  living: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['كنبة', 'طقم جلوس', 'كرسي مفرد', 'طاولة وسط', 'طاولة جانبية', 'مكتبة', 'كوفية', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: true, options: ['خشب', 'جلد', 'قماش', 'معدن', 'زجاج', 'مختلط', OTHER] },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: true, options: ['أبيض', 'أسود', 'رمادي', 'بني', 'بيج', 'أزرق', 'أخضر', OTHER] },
    { key: 'seats', labelAr: 'عدد المقاعد', labelEn: 'Seats', type: 'number', required: false },
    { key: 'dimensions', labelAr: 'الأبعاد', labelEn: 'Dimensions', type: 'text', required: false, placeholder: 'الطول × العرض × الارتفاع' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_FR },
  ],

  bedroom: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['سرير', 'خزانة', 'تسريحة', 'كومودينو', 'طقم غرفة نوم', 'مرتبة', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: true, options: ['خشب', 'معاكس', 'MDF', 'معدن', OTHER] },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', required: false, options: ['مفرد', 'مزدوج', 'كينغ', 'كوين', OTHER] },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: false, options: ['أبيض', 'أسود', 'رمادي', 'بني', 'بيج', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_FR },
  ],

  tables: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['سفرة', 'طاولة قهوة', 'طاولة مكتب', 'طاولة جانبية', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: true, options: ['خشب', 'زجاج', 'رخام', 'معدن', 'مختلط', OTHER] },
    { key: 'seats', labelAr: 'عدد الكراسي', labelEn: 'Seats', type: 'number', required: false },
    { key: 'shape', labelAr: 'الشكل', labelEn: 'Shape', type: 'select', required: false, options: ['دائري', 'مستطيل', 'مربع', 'بيضاوي', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_FR },
  ],

  outdoor: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['كرسي حديقة', 'طاولة حديقة', 'مظلة', 'أرجوحة', 'طقم حديقة', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: true, options: ['راتان', 'خشب', 'معدن', 'بلاستيك', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_FR },
  ],

  decor: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['سجاد', 'ستائر', 'لوحة فنية', 'مرآة', 'إضاءة', 'مزهرية', 'مفارش', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    { key: 'dimensions', labelAr: 'الأبعاد', labelEn: 'Dimensions', type: 'text', required: false },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_FR },
  ],

  office: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['مكتب', 'كرسي مكتبي', 'طقم مكتب', 'خزانة ملفات', 'طاولة اجتماعات', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: false, options: ['خشب', 'معدن', 'جلد', 'مختلط', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_FR },
  ],
};
