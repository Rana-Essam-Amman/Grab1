import type { CategoryFieldDef } from '../categoryFields';

const OTHER = 'أخرى';

const COVERAGE: CategoryFieldDef = {
  key: 'coverageArea',
  labelAr: 'الموقع',
  labelEn: 'Location',
  type: 'text',
  required: true,
  placeholder: 'مثال: عمّان - الدوار السابع',
};

const PRICE_NEGOTIABLE: CategoryFieldDef = {
  key: 'negotiable',
  labelAr: 'قابل للتفاوض',
  labelEn: 'Negotiable',
  type: 'select',
  required: true,
  options: ['نعم', 'لا', 'حسب العرض', OTHER],
};

const REASON_SALE: CategoryFieldDef = {
  key: 'reasonForSale',
  labelAr: 'سبب البيع',
  labelEn: 'Reason for Sale',
  type: 'select',
  required: false,
  options: ['توسع', 'سفر', 'تغيير مجال', 'تراجع السوق', 'مشاكل إدارية', 'أسباب شخصية', OTHER],
};

const INCLUDES_STAFF: CategoryFieldDef = {
  key: 'includesStaff',
  labelAr: 'شامل الموظفين',
  labelEn: 'Includes Staff',
  type: 'select',
  required: false,
  options: ['نعم', 'لا', 'حسب الاتفاق', OTHER],
};

const PARTNERSHIP_TYPE: CategoryFieldDef = {
  key: 'partnershipType',
  labelAr: 'نوع المشاركة',
  labelEn: 'Partnership Type',
  type: 'select',
  required: false,
  options: ['مستثمر صامت', 'شريك إداري', 'شريك كامل', 'ممول', OTHER],
};

export const PROJECTS_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = {
  restaurant: [
    { key: 'businessType', labelAr: 'نوع المشروع', labelEn: 'Business Type', type: 'select', required: true, options: ['مطعم', 'كافيه', 'كوفي شوب', 'مخبز', 'حلويات', 'وجبات سريعة', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'seats', labelAr: 'عدد الكراسي', labelEn: 'Seats', type: 'number', required: false },
    { key: 'furnished', labelAr: 'مفروش ومجهز', labelEn: 'Furnished & Equipped', type: 'select', required: true, options: ['مفروش كامل', 'شبه مجهز', 'فارغ', OTHER] },
    { key: 'monthlyRent', labelAr: 'الإيجار الشهري', labelEn: 'Monthly Rent', type: 'number', required: false },
    INCLUDES_STAFF,
    COVERAGE,
    PRICE_NEGOTIABLE,
    REASON_SALE,
  ],
  shop: [
    { key: 'shopType', labelAr: 'نوع المحل', labelEn: 'Shop Type', type: 'select', required: true, options: ['بقالة', 'سوبر ماركت', 'صيدلية', 'ملابس', 'إلكترونيات', 'أدوات منزلية', 'حلاق', 'صالون', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'stockIncluded', labelAr: 'شامل البضاعة', labelEn: 'Stock Included', type: 'select', required: true, options: ['نعم كامل', 'جزئي', 'بدون بضاعة', OTHER] },
    { key: 'monthlyRent', labelAr: 'الإيجار الشهري', labelEn: 'Monthly Rent', type: 'number', required: false },
    COVERAGE,
    PRICE_NEGOTIABLE,
    REASON_SALE,
  ],
  factory: [
    { key: 'industryType', labelAr: 'نوع الصناعة', labelEn: 'Industry Type', type: 'select', required: true, options: ['غذائية', 'بلاستيك', 'ورق', 'تعبئة وتغليف', 'معادن', 'خشب', 'كيماويات', OTHER] },
    { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    { key: 'machineryIncluded', labelAr: 'شامل الآلات', labelEn: 'Machinery Included', type: 'select', required: true, options: ['نعم كامل', 'جزئي', 'بدون آلات', OTHER] },
    { key: 'employeesCount', labelAr: 'عدد الموظفين', labelEn: 'Employees Count', type: 'number', required: false },
    INCLUDES_STAFF,
    COVERAGE,
    PRICE_NEGOTIABLE,
    REASON_SALE,
  ],
  'online-store': [
    { key: 'platform', labelAr: 'المنصة', labelEn: 'Platform', type: 'select', required: true, options: ['Shopify', 'WooCommerce', 'Salla', 'Zid', 'مخصص', OTHER] },
    { key: 'niche', labelAr: 'المجال', labelEn: 'Niche', type: 'text', required: true, placeholder: 'مثال: ملابس أطفال' },
    { key: 'monthlyRevenue', labelAr: 'الإيراد الشهري', labelEn: 'Monthly Revenue', type: 'number', required: false },
    { key: 'followersCount', labelAr: 'عدد المتابعين', labelEn: 'Followers Count', type: 'number', required: false },
    PARTNERSHIP_TYPE,
    PRICE_NEGOTIABLE,
    REASON_SALE,
  ],
  franchise: [
    { key: 'brandName', labelAr: 'اسم البراند', labelEn: 'Brand Name', type: 'text', required: true },
    { key: 'branchCount', labelAr: 'عدد الفروع', labelEn: 'Branch Count', type: 'number', required: true },
    { key: 'royalty', labelAr: 'نسبة الامتياز', labelEn: 'Royalty', type: 'text', required: false, placeholder: 'مثال: 5%' },
    { key: 'contractRemaining', labelAr: 'المتبقي من العقد', labelEn: 'Contract Remaining', type: 'text', required: false },
    COVERAGE,
    PRICE_NEGOTIABLE,
  ],
  licenses: [
    { key: 'licenseType', labelAr: 'نوع الرخصة', labelEn: 'License Type', type: 'select', required: true, options: ['سجل تجاري', 'رخصة مهن', 'علامة تجارية مسجلة', 'وكالة تجارية', 'ترخيص استيراد', OTHER] },
    { key: 'validUntil', labelAr: 'صالح حتى', labelEn: 'Valid Until', type: 'text', required: false, placeholder: 'مثال: 2027-12' },
    { key: 'transferable', labelAr: 'قابل للتحويل', labelEn: 'Transferable', type: 'select', required: true, options: ['نعم', 'لا', 'بحاجة موافقة', OTHER] },
    COVERAGE,
    PRICE_NEGOTIABLE,
  ],
  equipment: [
    { key: 'equipmentType', labelAr: 'نوع المعدات', labelEn: 'Equipment Type', type: 'select', required: true, options: ['معدات مطعم', 'معدات مصنع', 'معدات ورشة', 'أثاث مكتبي', 'أجهزة كمبيوتر', 'أدوات كهربائية', OTHER] },
    { key: 'quantity', labelAr: 'الكمية', labelEn: 'Quantity', type: 'number', required: true },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: ['جديد', 'مستعمل ممتاز', 'مستعمل جيد', 'بحاجة صيانة', OTHER] },
    COVERAGE,
    PRICE_NEGOTIABLE,
  ],
  partnership: [
    { key: 'partnershipType', labelAr: 'نوع الشراكة', labelEn: 'Partnership Type', type: 'select', required: true, options: ['مستثمر صامت', 'شريك إداري', 'شريك كامل', 'ممول', OTHER] },
    { key: 'investmentRequired', labelAr: 'المبلغ المطلوب', labelEn: 'Investment Required', type: 'number', required: true },
    { key: 'equityOffered', labelAr: 'نسبة الملكية المعروضة', labelEn: 'Equity Offered', type: 'text', required: false, placeholder: 'مثال: 30%' },
    { key: 'businessStage', labelAr: 'مرحلة المشروع', labelEn: 'Business Stage', type: 'select', required: true, options: ['فكرة', 'نموذج أولي', 'إطلاق حديث', 'مربح', 'توسع', OTHER] },
    COVERAGE,
  ],
  software: [
    { key: 'productType', labelAr: 'نوع المنتج', labelEn: 'Product Type', type: 'select', required: true, options: ['تطبيق جوال', 'موقع ويب', 'SaaS', 'نظام داخلي', 'لعبة', OTHER] },
    { key: 'techStack', labelAr: 'التقنيات', labelEn: 'Tech Stack', type: 'text', required: false, placeholder: 'مثال: React، Node.js' },
    { key: 'usersCount', labelAr: 'عدد المستخدمين', labelEn: 'Users Count', type: 'number', required: false },
    { key: 'monthlyRevenue', labelAr: 'الإيراد الشهري', labelEn: 'Monthly Revenue', type: 'number', required: false },
    PARTNERSHIP_TYPE,
    PRICE_NEGOTIABLE,
  ],
  agri: [
    { key: 'farmType', labelAr: 'نوع المشروع', labelEn: 'Farm Type', type: 'select', required: true, options: ['مزرعة عامة', 'بيوت محمية', 'دواجن', 'مواشي', 'أسماك', 'نباتات طبية', 'أشجار مثمرة', OTHER] },
    { key: 'area', labelAr: 'المساحة (دونم)', labelEn: 'Area (dunum)', type: 'number', required: true },
    { key: 'waterSource', labelAr: 'مصدر المياه', labelEn: 'Water Source', type: 'select', required: true, options: ['بئر', 'شبكة', 'خزان', 'مشروع حصاد', OTHER] },
    { key: 'currentProduction', labelAr: 'الإنتاج الحالي', labelEn: 'Current Production', type: 'text', required: false },
    COVERAGE,
    PRICE_NEGOTIABLE,
    REASON_SALE,
  ],
  other: [
    { key: 'description', labelAr: 'وصف المشروع', labelEn: 'Project Description', type: 'text', required: true, placeholder: 'اكتب وصفاً مختصراً' },
    { key: 'categoryType', labelAr: 'التصنيف', labelEn: 'Category', type: 'text', required: false },
    COVERAGE,
    PRICE_NEGOTIABLE,
  ],
};
