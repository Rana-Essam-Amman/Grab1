import type { CategoryFieldMap } from './types';

export const HANDYMEN_FIELDS: CategoryFieldMap = {
  electrician: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
  ],
  plumber: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
  ],
  carpenter: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
  ],
  painter: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
  ],
  blacksmith: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
  ],
  'ac-technician': [
    { key: 'acType', labelAr: 'نوع المكيف', labelEn: 'AC Type', type: 'text', required: true },
  ],
  aluminum: [
    { key: 'workType', labelAr: 'نوع العمل', labelEn: 'Work Type', type: 'text', required: true },
  ],
  gypsum: [
    { key: 'workType', labelAr: 'نوع العمل', labelEn: 'Work Type', type: 'text', required: true },
  ],
  'tiles-marble': [
    { key: 'workType', labelAr: 'نوع العمل', labelEn: 'Work Type', type: 'text', required: true },
  ],
  'appliance-repair': [
    { key: 'applianceType', labelAr: 'نوع الجهاز', labelEn: 'Appliance Type', type: 'text', required: true },
  ],
  locksmith: [
    { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
  ],
  glass: [
    { key: 'glassType', labelAr: 'نوع الزجاج', labelEn: 'Glass Type', type: 'text', required: true },
  ],
  'furniture-assembly': [
    { key: 'brand', labelAr: 'ماركة الأثاث', labelEn: 'Brand', type: 'text', required: false },
  ],
  general: [
    { key: 'taskDescription', labelAr: 'نوع المهمة', labelEn: 'Task', type: 'text', required: true },
  ],
};
