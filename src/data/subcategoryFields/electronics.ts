import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';
const CONDITION_EL = ['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد', 'مستعمل - مقبول', OTHER];

export const ELECTRONICS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  tv: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'size', labelAr: 'الحجم (بوصة)', labelEn: 'Size (inch)', type: 'select', required: true, options: ['32', '43', '50', '55', '65', '75', '85', OTHER] },
    { key: 'resolution', labelAr: 'الدقة', labelEn: 'Resolution', type: 'select', required: true, options: ['HD', 'Full HD', '4K UHD', '8K', OTHER] },
    { key: 'panelType', labelAr: 'نوع الشاشة', labelEn: 'Panel Type', type: 'select', required: false, options: ['LED', 'QLED', 'OLED', 'Mini-LED', OTHER] },
    { key: 'smart', labelAr: 'تلفزيون ذكي', labelEn: 'Smart TV', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_EL },
  ],

  audio: [
    { key: 'audioType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['مكبر صوت بلوتوث', 'سماعات رأس', 'إيربودز', 'مكبر منزلي', 'ساوند بار', 'مكبر حفلات', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'power', labelAr: 'القوة (واط)', labelEn: 'Power (W)', type: 'number', required: false },
    { key: 'connectivity', labelAr: 'الاتصال', labelEn: 'Connectivity', type: 'select', required: false, options: ['بلوتوث', 'واي فاي', 'USB', 'AUX', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_EL },
  ],

  gaming: [
    { key: 'consoleType', labelAr: 'نوع الجهاز', labelEn: 'Console Type', type: 'select', required: true, options: ['PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox Series S', 'Xbox One', 'Nintendo Switch', OTHER] },
    { key: 'storage', labelAr: 'التخزين', labelEn: 'Storage', type: 'select', required: false, options: ['500GB', '1TB', '2TB', OTHER] },
    { key: 'edition', labelAr: 'الإصدار', labelEn: 'Edition', type: 'select', required: false, options: ['Disc', 'Digital', 'Slim', 'Pro', OTHER] },
    { key: 'controllersCount', labelAr: 'عدد اليدات', labelEn: 'Controllers Count', type: 'number', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_EL },
  ],

  cameras: [
    { key: 'cameraType', labelAr: 'النوع', labelEn: 'Type', type: 'select', required: true, options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action', 'كاميرا فيديو', 'كاميرا مراقبة', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: false },
    { key: 'sensor', labelAr: 'المستشعر (MP)', labelEn: 'Sensor (MP)', type: 'number', required: false },
    { key: 'lensIncluded', labelAr: 'عدسة مرافقة', labelEn: 'Lens Included', type: 'select', required: false, options: ['نعم', 'لا', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_EL },
  ],

  'home-appliances': [
    { key: 'applianceType', labelAr: 'نوع الجهاز', labelEn: 'Appliance Type', type: 'select', required: true, options: ['ثلاجة', 'غسالة', 'جلاية', 'فرن', 'ميكروويف', 'مكيف', 'شفاط', 'سخان', OTHER] },
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', required: true, options: [] },
    { key: 'capacity', labelAr: 'السعة', labelEn: 'Capacity', type: 'text', required: false, placeholder: 'مثال: 18 قدم، 7 كغم...' },
    { key: 'energyRating', labelAr: 'كفاءة الطاقة', labelEn: 'Energy Rating', type: 'select', required: false, options: ['A+++', 'A++', 'A+', 'A', 'B', OTHER] },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: CONDITION_EL },
  ],
};
