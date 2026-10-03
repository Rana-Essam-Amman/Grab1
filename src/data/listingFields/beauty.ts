import type { CategoryFieldMap } from './types';

export const BEAUTY_FIELDS: CategoryFieldMap = {
  'perfumes-cosmetics': [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  hair: [
    { key: 'productType', labelAr: 'نوع المنتج', labelEn: 'Type', type: 'text', required: true },
  ],
  skin: [
    { key: 'productType', labelAr: 'نوع المنتج', labelEn: 'Type', type: 'text', required: true },
  ],
  care: [
    { key: 'deviceType', labelAr: 'نوع الجهاز', labelEn: 'Device Type', type: 'text', required: true },
  ],
};
