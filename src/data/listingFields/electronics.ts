import type { CategoryFieldMap } from './types';

export const ELECTRONICS_FIELDS: CategoryFieldMap = {
  tv: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    { key: 'size', labelAr: 'الحجم (بوصة)', labelEn: 'Size (inch)', type: 'number', required: true },
  ],
  audio: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  gaming: [
    { key: 'console', labelAr: 'الجهاز', labelEn: 'Console', type: 'text', required: true },
  ],
  cameras: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  'home-appliances': [
    { key: 'applianceType', labelAr: 'نوع الجهاز', labelEn: 'Appliance Type', type: 'text', required: true },
  ],
};
