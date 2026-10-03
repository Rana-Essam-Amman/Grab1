import type { CategoryFieldMap } from './types';

export const WATCHES_FIELDS: CategoryFieldMap = {
  luxury: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Rolex, Omega...' },
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', allowOther: true, required: true, options: [
      { value: 'men', labelAr: 'رجالي', labelEn: 'Men' }, { value: 'women', labelAr: 'نسائي', labelEn: 'Women' }, { value: 'unisex', labelAr: 'الجنسين', labelEn: 'Unisex' },
    ]},
  ],
  everyday: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  'vintage-watch': [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
  ],
  straps: [
    { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: true },
  ],
};
