import type { CategoryFieldMap, ListingFieldOption } from './types';

const SENIORITY_LEVELS: ListingFieldOption[] = [
  { value: 'entry_junior', labelAr: 'مبتدئ / خريج جديد (Entry / Junior)', labelEn: 'Entry / Junior' },
  { value: 'mid_level', labelAr: 'متوسط الخبرة (Mid-Level 2-5 Years)', labelEn: 'Mid-Level' },
  { value: 'senior', labelAr: 'خبير / سينير (Senior 5+ Years)', labelEn: 'Senior' },
  { value: 'team_lead_manager', labelAr: 'رئيس فريق / مدير قسم (Team Lead / Manager)', labelEn: 'Lead / Manager' },
  { value: 'director_executive', labelAr: 'إدارة عليا وتنفيذي (Director / Executive)', labelEn: 'Director / Executive' },
];

const EMPLOYMENT_TYPES: ListingFieldOption[] = [
  { value: 'full_time', labelAr: 'دوام كامل (Full-Time)', labelEn: 'Full-Time' },
  { value: 'part_time', labelAr: 'دوام جزئي (Part-Time)', labelEn: 'Part-Time' },
  { value: 'remote', labelAr: 'عمل عن بعد بالكامل (Remote)', labelEn: 'Remote' },
  { value: 'hybrid', labelAr: 'هجين (مكتبي وعن بعد)', labelEn: 'Hybrid' },
  { value: 'contract_freelance', labelAr: 'عقد مؤقت / عمل حر (Freelance)', labelEn: 'Contract / Freelance' },
  { value: 'internship', labelAr: 'تدريب خريجين (Internship)', labelEn: 'Internship' },
];

const INDUSTRY_OPTIONS: ListingFieldOption[] = [
  { value: 'it_software', labelAr: 'تكنولوجيا المعلومات والبرمجة', labelEn: 'IT & Software' },
  { value: 'sales_retail', labelAr: 'المبيعات والتجزئة والتسويق الميداني', labelEn: 'Sales & Retail' },
  { value: 'marketing_media', labelAr: 'التسويق الرقمي والإعلام وصناعة المحتوى', labelEn: 'Digital Marketing & Media' },
  { value: 'accounting_finance', labelAr: 'المحاسبة والمالية والبنوك', labelEn: 'Accounting & Finance' },
  { value: 'healthcare_pharma', labelAr: 'الطب والصيدلة والرعاية الصحية', labelEn: 'Healthcare & Pharma' },
  { value: 'engineering_construction', labelAr: 'الهندسة والمقاولات والإنشاءات', labelEn: 'Engineering & Construction' },
  { value: 'education_teaching', labelAr: 'التعليم والتدريب والمدارس', labelEn: 'Education & Teaching' },
  { value: 'hospitality_restaurants', labelAr: 'الفنادق والمطاعم والمقاهي (شيف، ويتر)', labelEn: 'Hospitality & Restaurants' },
  { value: 'customer_service_callcenter', labelAr: 'خدمة العملاء والكول سنتر', labelEn: 'Customer Service / Call Center' },
  { value: 'logistics_drivers', labelAr: 'السائقين والتوصيل والمستودعات', labelEn: 'Logistics & Drivers' },
  { value: 'admin_hr', labelAr: 'الموارد البشرية والسكرتارية والإدارة', labelEn: 'HR & Administration' },
];

const LANGUAGES_OPTIONS: ListingFieldOption[] = [
  { value: 'arabic_fluent', labelAr: 'اللغة العربية (طليق/أم)', labelEn: 'Arabic (Fluent)' },
  { value: 'english_fluent', labelAr: 'اللغة الإنجليزية (ممتاز)', labelEn: 'English (Fluent)' },
  { value: 'english_intermediate', labelAr: 'اللغة الإنجليزية (متوسط)', labelEn: 'English (Intermediate)' },
  { value: 'french', labelAr: 'اللغة الفرنسية', labelEn: 'French' },
  { value: 'german', labelAr: 'اللغة الألمانية', labelEn: 'German' },
];

const BENEFITS_OPTIONS: ListingFieldOption[] = [
  { value: 'health_insurance', labelAr: 'تأمين صحي خاص', labelEn: 'Health Insurance' },
  { value: 'social_security', labelAr: 'ضمان اجتماعي', labelEn: 'Social Security' },
  { value: 'commute_transport', labelAr: 'بدل مواصلات / تأمين باصات', labelEn: 'Transportation' },
  { value: 'housing', labelAr: 'بدل سكن / سكن مؤمن', labelEn: 'Housing Allowance' },
  { value: 'commissions_bonus', labelAr: 'عمولات مجزية وبونص مبيعات', labelEn: 'Commissions / Bonus' },
  { value: 'flexible_hours', labelAr: 'ساعات عمل مرنة', labelEn: 'Flexible Hours' },
];

export const JOBS_FIELDS: CategoryFieldMap = {
  vacancies: [
    { key: 'title', labelAr: 'المسمى الوظيفي المطلوب', labelEn: 'Job Title', type: 'text', required: true, placeholder: 'Software Engineer, Sales Executive, Accountant...', placeholderAr: 'مثال: مهندس برمجيات، محاسب عام، موظف مبيعات...' },
    { key: 'company', labelAr: 'اسم الشركة أو المنشأة', labelEn: 'Company / Employer Name', type: 'text', required: false, placeholder: 'Company name...', placeholderAr: 'اسم الشركة أو مكان العمل...' },
    { key: 'industry', labelAr: 'القطاع والمجال الوظيفي', labelEn: 'Industry / Domain', type: 'select', allowOther: true, required: true, options: INDUSTRY_OPTIONS },
    { key: 'seniority', labelAr: 'المستوى الوظيفي', labelEn: 'Career Level', type: 'select', allowOther: true, required: true, options: SENIORITY_LEVELS },
    { key: 'employmentType', labelAr: 'نوع الدوام وساعات العمل', labelEn: 'Employment Type', type: 'select', allowOther: true, required: true, options: EMPLOYMENT_TYPES },
    { key: 'experienceYears', labelAr: 'سنوات الخبرة المطلوبة (الحد الأدنى)', labelEn: 'Required Experience (Years)', type: 'number', required: false, placeholder: '2', placeholderAr: '2' },
    { key: 'salary', labelAr: 'الراتب المعروض (شهرياً)', labelEn: 'Offered Salary', type: 'number', required: false, placeholder: '600', placeholderAr: '600' },
    { key: 'salaryPeriod', labelAr: 'نظام دفع الراتب', labelEn: 'Salary Period', type: 'select', allowOther: true, required: false, options: [
      { value: 'monthly', labelAr: 'شهري', labelEn: 'Monthly' },
      { value: 'hourly', labelAr: 'بالساعة', labelEn: 'Hourly' },
      { value: 'per_project', labelAr: 'لكل مشروع / مهمة', labelEn: 'Per Project' },
      { value: 'commission_only', labelAr: 'عمولة على الإنتاجية فقط', labelEn: 'Commission Based' },
    ]},
    { key: 'city', labelAr: 'مكان وموقع العمل (المدينة)', labelEn: 'Job Location / City', type: 'text', required: false, placeholder: 'Amman, Riyadh, Beirut...', placeholderAr: 'مثال: عمان، الرياض، بيروت...' },
    { key: 'languages', labelAr: 'اللغات المطلوبة', labelEn: 'Required Languages', type: 'select', allowOther: true, multiSelect: true, required: false, options: LANGUAGES_OPTIONS },
    { key: 'benefits', labelAr: 'المزايا والبدلات الوظيفية', labelEn: 'Benefits & Perks', type: 'select', allowOther: true, multiSelect: true, required: false, options: BENEFITS_OPTIONS },
  ],
  cvs: [
    { key: 'title', labelAr: 'التخصص والمهنة التي تبحث عنها', labelEn: 'Desired Job Title / Specialty', type: 'text', required: true, placeholder: 'Graphic Designer, Civil Engineer, Driver...', placeholderAr: 'مثال: مصمم جرافيك، سائق، مهندس مدني...' },
    { key: 'seniority', labelAr: 'المستوى المهني للباحث', labelEn: 'Career Level', type: 'select', allowOther: true, required: true, options: SENIORITY_LEVELS },
    { key: 'experienceYears', labelAr: 'إجمالي سنوات الخبرة العملية', labelEn: 'Total Experience (Years)', type: 'number', required: true, placeholder: '3', placeholderAr: '3' },
    { key: 'skills', labelAr: 'أبرز المهارات والكفاءات', labelEn: 'Key Skills', type: 'select', allowOther: true, multiSelect: true, required: false, options: [
      { value: 'leadership', labelAr: 'إدارة فرق وقيادة', labelEn: 'Leadership & Management' },
      { value: 'communication', labelAr: 'تواصل وخدمة عملاء ممتازة', labelEn: 'Communication & Negotiation' },
      { value: 'ms_office', labelAr: 'إجادة برامج مايكروسوفت أوفيس وإكسل', labelEn: 'MS Office & Excel' },
      { value: 'programming', labelAr: 'برمجة وتطوير تقني', labelEn: 'Coding / Software Dev' },
      { value: 'digital_marketing', labelAr: 'تسويق وإدارة حملات إعلانية', labelEn: 'Digital Marketing & Ads' },
      { value: 'driving_license', labelAr: 'رخصة قيادة سارية المفعول', labelEn: 'Valid Driving License' },
    ]},
    { key: 'languages', labelAr: 'اللغات التي يتقنها', labelEn: 'Languages', type: 'select', allowOther: true, multiSelect: true, required: false, options: LANGUAGES_OPTIONS },
    { key: 'availability', labelAr: 'جاهزية وتاريخ بدء العمل', labelEn: 'Availability for Work', type: 'select', allowOther: true, required: false, options: [
      { value: 'immediate', labelAr: 'جاهز للبدء الفوري', labelEn: 'Immediately' },
      { value: 'one_week', labelAr: 'خلال أسبوع', labelEn: 'Within 1 Week' },
      { value: 'two_weeks_month', labelAr: 'خلال شهر (فترة إشعار)', labelEn: 'Within 1 Month (Notice)' },
    ]},
    { key: 'expectedSalary', labelAr: 'الراتب المتوقع (شهرياً)', labelEn: 'Expected Monthly Salary', type: 'number', required: false, placeholder: '500', placeholderAr: '500' },
    { key: 'cvUrl', labelAr: 'رابط السيرة الذاتية (Google Drive / LinkedIn / PDF)', labelEn: 'CV / LinkedIn Link', type: 'text', required: false, placeholder: 'https://linkedin.com/in/... or drive link', placeholderAr: 'رابط لينكدإن أو ملف درايف...' },
  ],
};
