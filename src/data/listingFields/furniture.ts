import type { CategoryFieldMap } from './types';

export const FURNITURE_FIELDS: CategoryFieldMap = {
  living: [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
  ],
  bedroom: [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
  ],
  tables: [
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: true },
  ],
  outdoor: [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
  ],
  decor: [
    { key: 'decorType', labelAr: 'نوع الديكور', labelEn: 'Type', type: 'text', required: true },
  ],
  office: [
    { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
  ],
};
