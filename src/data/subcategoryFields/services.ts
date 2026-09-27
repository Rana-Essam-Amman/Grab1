import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';

export const SERVICES_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {

  delivery: [
    { key: 'deliveryType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'select', required: true, options: ['نقل عفش', 'نقل مكاتب', 'توصيل طرود', 'سطحة سيارات', 'فك وتركيب أثاث', 'تخزين', OTHER] },
    { key: 'vehicleType', labelAr: 'نوع المركبة', labelEn: 'Vehicle Type', type: 'select', required: false, options: ['بيك أب', 'شاحنة صغيرة', 'شاحنة كبيرة', 'ونش', 'سيارة خاصة', OTHER] },
    { key: 'coverageArea', labelAr: 'منطقة التغطية', labelEn: 'Coverage Area', type: 'text', required: true },
    { key: 'capacityTons', labelAr: 'الحمولة (طن)', labelEn: 'Capacity (tons)', type: 'number', required: false },
  ],

  events: [
    { key: 'eventType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'select', required: true, options: ['تصوير', 'DJ', 'مهرج', 'تزيين وبالونات', 'كوش أعراس', 'شاشات عرض', 'إضاءة وصوت', 'كراسي وطاولات', 'بوفيه', OTHER] },
    { key: 'coverageArea', labelAr: 'منطقة التغطية', labelEn: 'Coverage Area', type: 'text', required: true },
    { key: 'availability', labelAr: 'التوفر', labelEn: 'Availability', type: 'select', required: false, options: ['نهاية الأسبوع', 'أي يوم', 'حسب المناسبة', OTHER] },
    { key: 'portfolio', labelAr: 'أعمال سابقة', labelEn: 'Portfolio', type: 'text', required: false },
  ],

  design: [
    { key: 'designType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'select', required: true, options: ['تصميم شعار', 'هوية بصرية', 'تصميم مواقع', 'تصميم تطبيقات', 'تصميم سوشيال ميديا', 'إدارة حملات', 'كتابة محتوى', OTHER] },
    { key: 'portfolio', labelAr: 'أعمال سابقة', labelEn: 'Portfolio', type: 'text', required: true, placeholder: 'رابط portfolio أو وصف' },
    { key: 'turnaround', labelAr: 'مدة التسليم', labelEn: 'Turnaround', type: 'select', required: false, options: ['24 ساعة', '3 أيام', 'أسبوع', 'أسبوعان', OTHER] },
  ],

  tutor: [
    { key: 'subject', labelAr: 'المادة', labelEn: 'Subject', type: 'select', required: true, options: ['رياضيات', 'عربي', 'إنجليزي', 'فيزياء', 'كيمياء', 'أحياء', 'لغات أخرى', 'قرآن وتجويد', 'برمجة', 'موسيقى', 'رسم', 'تأسيس أطفال', 'توجيهي', 'جامعي', OTHER] },
    { key: 'level', labelAr: 'المستوى', labelEn: 'Level', type: 'select', required: true, options: ['ابتدائي', 'إعدادي', 'ثانوي', 'جامعي', 'بالغين', OTHER] },
    { key: 'mode', labelAr: 'طريقة التدريس', labelEn: 'Teaching Mode', type: 'select', required: true, options: ['حضوري', 'أونلاين', 'الاثنين', OTHER] },
    { key: 'hourlyRate', labelAr: 'السعر/ساعة', labelEn: 'Hourly Rate', type: 'text', required: false, placeholder: 'أو "حسب الاتفاق"' },
    { key: 'gender', labelAr: 'جنس المدرّس', labelEn: 'Tutor Gender', type: 'select', required: false, options: ['ذكر', 'أنثى', 'أي', OTHER] },
  ],
};
