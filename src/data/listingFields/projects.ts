import type { CategoryFieldMap } from './types';

export const PROJECTS_FIELDS: CategoryFieldMap = {
  restaurant: [
    { key: 'equipmentIncluded', labelAr: 'تشمل المعدات', labelEn: 'Equipment Included', type: 'boolean', required: false },
  ],
  shop: [
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: false },
  ],
  factory: [
    { key: 'industry', labelAr: 'قطاع الصناعة', labelEn: 'Industry', type: 'text', required: true },
  ],
  'online-store': [
    { key: 'platform', labelAr: 'المنصة', labelEn: 'Platform', type: 'text', required: false },
  ],
  franchise: [
    { key: 'brandName', labelAr: 'اسم العلامة', labelEn: 'Brand Name', type: 'text', required: true },
  ],
  licenses: [
    { key: 'licenseType', labelAr: 'نوع الرخصة', labelEn: 'License Type', type: 'text', required: true },
  ],
  equipment: [
    { key: 'equipmentType', labelAr: 'نوع المعدات', labelEn: 'Equipment Type', type: 'text', required: true },
  ],
  partnership: [
    { key: 'partnershipType', labelAr: 'نوع الشراكة', labelEn: 'Partnership Type', type: 'text', required: true },
  ],
  software: [
    { key: 'techStack', labelAr: 'تقنيات البرمجة', labelEn: 'Tech Stack', type: 'text', required: false },
  ],
  agri: [
    { key: 'projectType', labelAr: 'نوع المشروع', labelEn: 'Project Type', type: 'text', required: true },
  ],
  other: [
    { key: 'details', labelAr: 'تفاصيل', labelEn: 'Details', type: 'text', required: true },
  ],
};
