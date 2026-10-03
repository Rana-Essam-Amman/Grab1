import type { CategoryFieldMap } from './types';

export const SPORTS_FIELDS: CategoryFieldMap = {
  fitness: [
    { key: 'equipmentType', labelAr: 'نوع الجهاز', labelEn: 'Equipment Type', type: 'text', required: true },
  ],
  bicycles: [
    { key: 'bikeType', labelAr: 'نوع الدراجة', labelEn: 'Bike Type', type: 'text', required: true },
  ],
  camping: [
    { key: 'itemType', labelAr: 'نوع التجهيز', labelEn: 'Item Type', type: 'text', required: true },
  ],
  'water-sports': [
    { key: 'sportType', labelAr: 'نوع الرياضة', labelEn: 'Sport Type', type: 'text', required: true },
  ],
};
