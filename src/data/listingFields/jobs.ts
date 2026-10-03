import type { CategoryFieldMap } from './types';

export const JOBS_FIELDS: CategoryFieldMap = {
  vacancies: [
    { key: 'jobTitle', labelAr: 'المسمى الوظيفي', labelEn: 'Job Title', type: 'text', required: true },
    { key: 'jobType', labelAr: 'نوع الدوام', labelEn: 'Job Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'full', labelAr: 'دوام كامل', labelEn: 'Full Time' }, { value: 'part', labelAr: 'دوام جزئي', labelEn: 'Part Time' },
    ]},
  ],
  cvs: [
    { key: 'profession', labelAr: 'المجال المهني', labelEn: 'Profession', type: 'text', required: true },
    { key: 'experience', labelAr: 'سنوات الخبرة', labelEn: 'Experience Years', type: 'number', required: true },
  ],
};
