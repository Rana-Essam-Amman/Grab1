import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const COND_F = ['جديد بالكيس', 'جديد بدون كيس', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER];
const SIZES_CLOTHES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', OTHER];
const SIZES_SHOES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', OTHER];

export const FASHION_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  women: [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'select', required: true, options: ['فستان', 'بلوزة', 'قميص', 'بنطال', 'جينز', 'تنورة', 'جاكيت', 'عباية', 'حجاب', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', required: true, options: SIZES_CLOTHES },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: false, options: ['أبيض', 'أسود', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'بني', 'بيج', 'وردي', 'ذهبي', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_F },
  ],

  men: [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'select', required: true, options: ['قميص', 'تي شيرت', 'بنطال', 'جينز', 'بدلة', 'جاكيت', 'شماغ', 'ثوب', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', required: true, options: SIZES_CLOTHES },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: false, options: ['أبيض', 'أسود', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'بني', 'بيج', OTHER] },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_F },
  ],

  'watches-jewelry': [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['خاتم', 'سلسال', 'أسورة', 'حلق', 'طقم كامل', 'ساعة يد', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: true, options: ['ذهب', 'فضة', 'بلاتين', 'ألماس', 'لؤلؤ', 'مطلي', OTHER] },
    { key: 'weightGrams', labelAr: 'الوزن (غرام)', labelEn: 'Weight (g)', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', OTHER] },
  ],

  bags: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['شنطة يد', 'حقيبة ظهر', 'كروس', 'حقيبة سفر', 'محفظة', 'حزام', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'select', required: false, options: ['جلد طبيعي', 'جلد صناعي', 'قماش', 'كوتش', OTHER] },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: false, options: ['أسود', 'بني', 'بيج', 'أبيض', 'أحمر', 'أزرق', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_F },
  ],

  shoes: [
    { key: 'itemType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['رياضي', 'رسمي', 'كاجوال', 'شبشب', 'بوت', 'صندل', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false },
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'select', required: true, options: SIZES_SHOES },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', required: false, options: ['أسود', 'أبيض', 'رمادي', 'بني', 'أحمر', 'أزرق', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: COND_F },
  ],

  perfumes: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    { key: 'perfumeType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['شرقي', 'غربي', 'زهري', 'خشبي', 'حمضي', 'عود', 'مسك', OTHER] },
    { key: 'gender', labelAr: 'الفئة', labelEn: 'For', type: 'select', required: true, options: ['رجالي', 'نسائي', 'مشترك', OTHER] },
    { key: 'volume', labelAr: 'الحجم (مل)', labelEn: 'Volume (ml)', type: 'select', required: true, options: ['30', '50', '75', '100', '150', '200', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد بالكرتونة', 'جديد بدون كرتونة', 'مستعمل جزئياً', OTHER] },
  ],
};
