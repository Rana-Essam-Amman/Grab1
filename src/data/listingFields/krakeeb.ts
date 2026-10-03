import type { CategoryFieldMap } from './types';

export const KRAKEEB_FIELDS: CategoryFieldMap = {
  general: [
    { key: 'itemCondition', labelAr: 'الحالة', labelEn: 'Condition', type: 'text', required: true },
  ],
  vintage: [
    { key: 'era', labelAr: 'الفترة الزمنية', labelEn: 'Era', type: 'text', required: false },
  ],
  clearances: [
    { key: 'reason', labelAr: 'سبب التصفية', labelEn: 'Reason', type: 'text', required: false },
  ],
};
