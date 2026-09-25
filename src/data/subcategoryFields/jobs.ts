import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';

export const JOBS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  vacancies: [
    { key: 'jobTitle', labelAr: 'المسمى الوظيفي', labelEn: 'Job Title', type: 'text', required: true },
    { key: 'field', labelAr: 'المجال', labelEn: 'Field', type: 'select', required: true, options: ['تقنية معلومات', 'هندسة', 'تسويق ومبيعات', 'تعليم', 'طب وصحة', 'محاسبة ومالية', 'إدارة', 'خدمة عملاء', 'مطاعم وضيافة', 'توصيل', OTHER] },
    { key: 'jobType', labelAr: 'نوع الوظيفة', labelEn: 'Job Type', type: 'select', required: true, options: ['دوام كامل', 'دوام جزئي', 'عن بعد', 'تدريب', 'عقد مؤقت', OTHER] },
    { key: 'experience', labelAr: 'سنوات الخبرة', labelEn: 'Experience', type: 'select', required: true, options: ['بدون خبرة', '1-2 سنة', '3-5 سنوات', '5-10 سنوات', '10+ سنوات', OTHER] },
    { key: 'education', labelAr: 'المؤهل العلمي', labelEn: 'Education', type: 'select', required: true, options: ['ثانوي', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', OTHER] },
    { key: 'salary', labelAr: 'الراتب', labelEn: 'Salary', type: 'text', required: true, placeholder: 'أو "حسب الاتفاق"' },
    { key: 'company', labelAr: 'الشركة', labelEn: 'Company', type: 'text', required: false },
  ],

  cvs: [
    { key: 'role', labelAr: 'الوظيفة المطلوبة', labelEn: 'Desired Role', type: 'text', required: true },
    { key: 'field', labelAr: 'المجال', labelEn: 'Field', type: 'select', required: true, options: ['تقنية معلومات', 'هندسة', 'تسويق ومبيعات', 'تعليم', 'طب وصحة', 'محاسبة ومالية', 'إدارة', 'خدمة عملاء', 'مطاعم وضيافة', 'توصيل', OTHER] },
    { key: 'experience', labelAr: 'سنوات الخبرة', labelEn: 'Experience', type: 'select', required: true, options: ['بدون خبرة', '1-2 سنة', '3-5 سنوات', '5-10 سنوات', '10+ سنوات', OTHER] },
    { key: 'education', labelAr: 'المؤهل العلمي', labelEn: 'Education', type: 'select', required: true, options: ['ثانوي', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', OTHER] },
    { key: 'skills', labelAr: 'المهارات', labelEn: 'Skills', type: 'text', required: false, placeholder: 'مثال: Excel، تسويق رقمي، SQL' },
    { key: 'availability', labelAr: 'التوفر', labelEn: 'Availability', type: 'select', required: true, options: ['فوري', 'أسبوع', 'شهر', 'حسب الاتفاق', OTHER] },
  ],
};
