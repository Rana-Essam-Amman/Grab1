import type { CategoryFieldMap } from './types';

export const BOOKS_FIELDS: CategoryFieldMap = {
  'books-magazines': [
    { key: 'genre', labelAr: 'التصنيف', labelEn: 'Genre', type: 'text', required: true },
  ],
  instruments: [
    { key: 'instrumentType', labelAr: 'نوع الآلة', labelEn: 'Instrument Type', type: 'text', required: true },
  ],
  antiques: [
    { key: 'antiqueType', labelAr: 'نوع التحفة', labelEn: 'Type', type: 'text', required: true },
  ],
  crafts: [
    { key: 'craftType', labelAr: 'نوع العمل', labelEn: 'Craft Type', type: 'text', required: true },
  ],
};
