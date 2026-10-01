// RULE-14-EXCEPTION: Static taxonomy
// Service / job attribute extractors — MENA classifieds
// Deterministic regex + alias tables. No LLM at runtime.

export interface ExtractorPattern {
  readonly canonical: string;
  readonly aliases: readonly string[];
}

export const JOB_TITLE_PATTERNS: readonly ExtractorPattern[] = [
  { canonical: 'مهندس مدني', aliases: ['مهندس مدني', 'مهندس مدنى', 'مهندس انشائي', 'مهندس إنشائي', 'civil engineer'] },
  { canonical: 'مهندس معماري', aliases: ['مهندس معماري', 'مهندس معمارى', 'مهندس عمارة', 'architect'] },
  { canonical: 'مهندس كهرباء', aliases: ['مهندس كهرباء', 'مهندس كهربائي', 'electrical engineer'] },
  { canonical: 'مهندس ميكانيك', aliases: ['مهندس ميكانيك', 'مهندس ميكانيكا', 'mechanical engineer'] },
  { canonical: 'مهندس برمجيات', aliases: ['مهندس برمجيات', 'مهندس سوفتوير', 'software engineer'] },
  { canonical: 'مهندس مساحة', aliases: ['مهندس مساحة', 'مساح', 'surveyor'] },
  { canonical: 'مهندس ديكور', aliases: ['مهندس ديكور', 'مصمم ديكور', 'interior designer'] },
  { canonical: 'طبيب', aliases: ['طبيب', 'دكتور', 'doctor', 'physician'] },
  { canonical: 'طبيب أسنان', aliases: ['طبيب اسنان', 'طبيب أسنان', 'دكتور اسنان', 'dentist'] },
  { canonical: 'ممرض', aliases: ['ممرض', 'ممرضة', 'ممرضه', 'nurse'] },
  { canonical: 'صيدلي', aliases: ['صيدلي', 'صيدلاني', 'pharmacist'] },
  { canonical: 'فني مختبر', aliases: ['فني مختبر', 'فني مختبرات', 'فني معمل', 'lab technician'] },
  { canonical: 'أخصائي علاج طبيعي', aliases: ['اخصائي علاج طبيعي', 'أخصائي علاج طبيعي', 'علاج طبيعي', 'physiotherapist'] },
  { canonical: 'مدرس', aliases: ['مدرس', 'مدرسة', 'مدرّس', 'teacher'] },
  { canonical: 'معلم', aliases: ['معلم', 'معلمة', 'معلمه', 'tutor'] },
  { canonical: 'أستاذ جامعي', aliases: ['استاذ جامعي', 'أستاذ جامعي', 'lecturer'] },
  { canonical: 'مدرب', aliases: ['مدرب', 'مدربة', 'كوتش', 'coach', 'trainer'] },
  { canonical: 'مدرس خصوصي', aliases: ['مدرس خصوصي', 'مدرس خصوصى', 'دروس خصوصية', 'private teacher'] },
  { canonical: 'محاسب', aliases: ['محاسب', 'محاسبة', 'محاسبه', 'accountant'] },
  { canonical: 'سكرتير', aliases: ['سكرتير', 'سكرتيرة', 'secretary'] },
  { canonical: 'مدير', aliases: ['مدير', 'مديرة', 'مدير عام', 'manager'] },
  { canonical: 'موظف استقبال', aliases: ['موظف استقبال', 'موظفة استقبال', 'ريسبشن', 'receptionist'] },
  { canonical: 'مدخل بيانات', aliases: ['مدخل بيانات', 'مدخل داتا', 'data entry'] },
  { canonical: 'موارد بشرية', aliases: ['موارد بشرية', 'اتش ار', 'hr'] },
  { canonical: 'مندوب مبيعات', aliases: ['مندوب مبيعات', 'sales representative', 'sales rep'] },
  { canonical: 'بائع', aliases: ['بائع', 'بائعة', 'salesperson'] },
  { canonical: 'كاشير', aliases: ['كاشير', 'كاشيرة', 'أمين صندوق', 'cashier'] },
  { canonical: 'مسوق', aliases: ['مسوق', 'مسوقة', 'marketer'] },
  { canonical: 'مبرمج', aliases: ['مبرمج', 'مبرمجة', 'مطور', 'programmer', 'developer'] },
  { canonical: 'مصمم جرافيك', aliases: ['مصمم جرافيك', 'جرافيك ديزاينر', 'graphic designer'] },
  { canonical: 'مسوق الكتروني', aliases: ['مسوق الكتروني', 'مسوق إلكتروني', 'digital marketer'] },
  { canonical: 'مدير سوشيال ميديا', aliases: ['مدير سوشيال ميديا', 'ادمن صفحات', 'social media manager'] },
  { canonical: 'مصمم مواقع', aliases: ['مصمم مواقع', 'مطور مواقع', 'web designer'] },
  { canonical: 'سائق', aliases: ['سائق', 'سواق', 'درايفر', 'driver'] },
  { canonical: 'طباخ', aliases: ['طباخ', 'طباخة', 'cook'] },
  { canonical: 'شيف', aliases: ['شيف', 'رئيس طهاة', 'chef'] },
  { canonical: 'باريستا', aliases: ['باريستا', 'barista'] },
  { canonical: 'عامل', aliases: ['عامل', 'عاملة', 'worker'] },
  { canonical: 'حارس أمن', aliases: ['حارس امن', 'حارس أمن', 'حارس', 'security guard'] },
  { canonical: 'منظف', aliases: ['منظف', 'عاملة تنظيف', 'عامل نظافة', 'cleaner'] },
  { canonical: 'كهربائي', aliases: ['كهربائي', 'كهربجي', 'electrician'] },
  { canonical: 'سباك', aliases: ['سباك', 'مواسرجي', 'plumber'] },
  { canonical: 'نجار', aliases: ['نجار', 'carpenter'] },
  { canonical: 'دهان', aliases: ['دهان', 'صباغ', 'بوياجي', 'painter'] },
  { canonical: 'حداد', aliases: ['حداد', 'blacksmith'] },
  { canonical: 'فني تكييف', aliases: ['فني تكييف', 'فني مكيفات', 'ac technician'] },
];

const Y = '(?:50|[1-4][0-9]|[1-9]|0)(?![0-9٠-٩])';
const YA = '(?:٥٠|[١-٤][٠-٩]|[١-٩]|٠)(?![0-9٠-٩])';
const UNIT = '(?:سنوات|سنين|سنة|اعوام|أعوام|عام)';

export const EXPERIENCE_PATTERNS: readonly RegExp[] = [
  new RegExp('خبرة\\s*(' + Y + ')\\s*' + UNIT),
  new RegExp('(' + Y + ')\\s*' + UNIT + '\\s*خبرة'),
  new RegExp('(?:خبرة|experience)\\s*(?:لا\\s*تقل\\s*عن|اكثر\\s*من|أكثر\\s*من|min(?:imum)?|at\\s*least)?\\s*(' + Y + ')', 'i'),
  new RegExp('(' + Y + ')\\s*\\+\\s*(?:years|yrs|سنة|سنوات)', 'i'),
  new RegExp('(?:experience|exp)\\s*(?:of|:)?\\s*(' + Y + ')\\s*(?:years|yrs)?', 'i'),
  new RegExp('(' + Y + ')\\s*(?:years|yrs)\\s*(?:of\\s*)?(?:experience|exp)?', 'i'),
  new RegExp('خبرة\\s*(' + YA + ')\\s*' + UNIT),
  new RegExp('(' + YA + ')\\s*' + UNIT + '\\s*خبرة'),
  new RegExp('(' + Y + ')\\s*' + UNIT + '\\s*(?:في\\s*المجال|في\\s*نفس\\s*المجال)'),
];

export const TRADE_PATTERNS: readonly ExtractorPattern[] = [
  { canonical: 'كهربائي', aliases: ['كهربائي', 'كهربجي', 'فني كهرباء', 'electrician'] },
  { canonical: 'سباك', aliases: ['سباك', 'سباك منازل', 'فني صحي', 'plumber'] },
  { canonical: 'مواسرجي', aliases: ['مواسرجي', 'فني مواسير'] },
  { canonical: 'نجار', aliases: ['نجار', 'نجار موبيليا', 'نجار خشب', 'carpenter'] },
  { canonical: 'دهان', aliases: ['دهان', 'صباغ', 'بوياجي', 'painter'] },
  { canonical: 'حداد', aliases: ['حداد', 'فني حدادة', 'welder'] },
  { canonical: 'فني تكييف', aliases: ['فني تكييف', 'فني مكيفات', 'تركيب مكيفات', 'ac technician'] },
  { canonical: 'فني تبريد', aliases: ['فني تبريد', 'فني ثلاجات', 'refrigeration technician'] },
  { canonical: 'فني أجهزة', aliases: ['فني اجهزة', 'فني أجهزة', 'صيانة اجهزة', 'appliance technician'] },
  { canonical: 'فني مصاعد', aliases: ['فني مصاعد', 'صيانة مصاعد', 'فني اسانسير', 'elevator technician'] },
  { canonical: 'جبصين', aliases: ['جبصين', 'فني جبص', 'gypsum technician'] },
  { canonical: 'بلاط', aliases: ['بلاط', 'مبلط', 'تركيب بلاط', 'tiler'] },
  { canonical: 'رخام', aliases: ['رخام', 'فني رخام', 'marble technician'] },
  { canonical: 'ألمنيوم', aliases: ['المنيوم', 'ألمنيوم', 'فني المنيوم', 'aluminum'] },
  { canonical: 'زجاج', aliases: ['زجاج', 'فني زجاج', 'glazier'] },
  { canonical: 'مفتاح أقفال', aliases: ['مفتاح اقفال', 'مفتاح أقفال', 'locksmith'] },
  { canonical: 'تركيب أثاث', aliases: ['تركيب اثاث', 'تركيب أثاث', 'furniture assembly'] },
  { canonical: 'صيانة عامة', aliases: ['صيانة عامة', 'فني صيانة عامة', 'handyman'] },
  { canonical: 'مكافحة حشرات', aliases: ['مكافحة حشرات', 'رش حشرات', 'pest control'] },
  { canonical: 'تنظيف مسابح', aliases: ['تنظيف مسابح', 'صيانة مسابح', 'pool cleaning'] },
  { canonical: 'فني ستلايت', aliases: ['فني ستلايت', 'تركيب ستلايت', 'satellite technician'] },
  { canonical: 'لحام', aliases: ['لحام', 'فني لحام', 'welding'] },
];
