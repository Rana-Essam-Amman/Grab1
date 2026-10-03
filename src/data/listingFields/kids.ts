import type { CategoryFieldMap } from './types';

export const KIDS_FIELDS: CategoryFieldMap = {
  clothes: [
    { key: 'ageGroup', labelAr: 'الفئة العمرية', labelEn: 'Age Group', type: 'text', required: true },
  ],
  toys: [
    { key: 'toyType', labelAr: 'نوع اللعبة', labelEn: 'Toy Type', type: 'text', required: true },
  ],
  strollers: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  feeding: [
    { key: 'itemType', labelAr: 'نوع المستلزم', labelEn: 'Type', type: 'text', required: true },
  ],
};
