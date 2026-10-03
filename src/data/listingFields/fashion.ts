import type { CategoryFieldMap } from './types';

export const FASHION_FIELDS: CategoryFieldMap = {
  women: [
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'text', required: true },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'text', required: true },
  ],
  men: [
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'text', required: true },
  ],
  'watches-jewelry': [
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: true },
  ],
  bags: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  shoes: [
    { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'number', required: true },
  ],
  perfumes: [
    { key: 'volume', labelAr: 'الحجم (مل)', labelEn: 'Volume (ml)', type: 'number', required: false },
  ],
};
