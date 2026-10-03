import type { CategoryFieldMap } from './types';

export const SERVICES_FIELDS: CategoryFieldMap = {
  delivery: [
    { key: 'vehicle', labelAr: 'نوع المركبة', labelEn: 'Vehicle', type: 'text', required: true },
  ],
  events: [
    { key: 'eventType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
  ],
  design: [
    { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'text', required: true },
  ],
  tutor: [
    { key: 'subject', labelAr: 'المادة', labelEn: 'Subject', type: 'text', required: true },
  ],
};
