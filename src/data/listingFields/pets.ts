import type { CategoryFieldMap } from './types';

export const PETS_FIELDS: CategoryFieldMap = {
  dogs: [
    { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: true },
    { key: 'age', labelAr: 'العمر', labelEn: 'Age', type: 'text', required: false },
  ],
  cats: [
    { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: true },
  ],
  birds: [
    { key: 'birdType', labelAr: 'نوع الطير', labelEn: 'Bird Type', type: 'text', required: true },
  ],
  fish: [
    { key: 'fishType', labelAr: 'نوع السمك', labelEn: 'Fish Type', type: 'text', required: true },
  ],
  'pet-supplies': [
    { key: 'supplyType', labelAr: 'نوع المستلزم', labelEn: 'Type', type: 'text', required: true },
  ],
};
