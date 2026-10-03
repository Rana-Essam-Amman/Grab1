import type { CategoryFieldMap } from './types';

export const COMPUTERS_FIELDS: CategoryFieldMap = {
  laptops: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    { key: 'processor', labelAr: 'المعالج', labelEn: 'Processor', type: 'text', required: false },
    { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'text', required: false },
  ],
  desktops: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  screens: [
    { key: 'size', labelAr: 'الحجم (بوصة)', labelEn: 'Size (inch)', type: 'number', required: false },
  ],
  'parts-pc': [
    { key: 'partType', labelAr: 'نوع القطعة', labelEn: 'Part Type', type: 'text', required: true },
  ],
  'accessories-pc': [
    { key: 'accessoryType', labelAr: 'نوع الملحق', labelEn: 'Type', type: 'text', required: true },
  ],
};
