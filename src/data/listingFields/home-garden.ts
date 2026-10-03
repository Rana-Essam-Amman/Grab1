import type { CategoryFieldMap } from './types';

export const HOME_GARDEN_FIELDS: CategoryFieldMap = {
  'garden-furniture': [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
  ],
  plants: [
    { key: 'plantType', labelAr: 'نوع النبات', labelEn: 'Plant Type', type: 'text', required: true },
  ],
  bbq: [
    { key: 'bbqType', labelAr: 'نوع الشواية', labelEn: 'BBQ Type', type: 'text', required: true },
  ],
  tools: [
    { key: 'toolType', labelAr: 'نوع الأداة', labelEn: 'Tool Type', type: 'text', required: true },
  ],
};
