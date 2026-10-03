import type { CategoryFieldMap } from './types';

export const CLEANING_FIELDS: CategoryFieldMap = {
  homes: [
    { key: 'serviceScope', labelAr: 'نطاق الخدمة', labelEn: 'Scope', type: 'text', required: true },
  ],
  offices: [
    { key: 'officeSize', labelAr: 'حجم المكتب', labelEn: 'Office Size', type: 'text', required: false },
  ],
  'sofas-carpets': [
    { key: 'itemsCount', labelAr: 'عدد القطع', labelEn: 'Items Count', type: 'number', required: true },
  ],
  'water-tanks': [
    { key: 'tankSize', labelAr: 'حجم الخزان', labelEn: 'Tank Size', type: 'text', required: true },
  ],
  pools: [
    { key: 'poolSize', labelAr: 'حجم المسبح', labelEn: 'Pool Size', type: 'text', required: false },
  ],
  'post-construction': [
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: false },
  ],
  'windows-facades': [
    { key: 'facadeType', labelAr: 'نوع الواجهة', labelEn: 'Facade Type', type: 'text', required: true },
  ],
};
