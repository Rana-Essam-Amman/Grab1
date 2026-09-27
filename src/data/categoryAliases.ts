// RULE-14-EXCEPTION: Static taxonomy
import { CategoryDef } from '../types';
import { categories } from './categories';
import { normalizeArabic } from './arabicNormalize';

export interface CategoryAlias {
  slug: string;
  terms: string[];
}

export const categoryAliases: CategoryAlias[] = [
  {
    slug: 'motors',
    terms: [
      'سيارة', 'سيارات', 'كامري', 'تويوتا', 'هونداي', 'هيونداي', 'كيا', 'مرسيدس', 'بنز', 'بي ام',
      'لكزس', 'نيسان', 'هوندا', 'مازدا', 'شيفروليه', 'جيب', 'موتر', 'عربية', 'car', 'cars',
      'sedan', 'truck', 'motor', 'pickup', 'تسلا', 'فورد', 'لاند كروزر', 'رنج روفر'
    ],
  },
  {
    slug: 'real-estate',
    terms: [
      'شقة', 'بيت', 'فيلا', 'أرض', 'ارض', 'مكتب', 'عقار', 'أوضة', 'غرفة', 'صالون', 'عقارات',
      'ايجار', 'بيع', 'ملحق', 'استديو', 'apartment', 'flat', 'house', 'land', 'villa',
      'office', 'room', 'studio', 'building', 'منزل', 'قصر', 'محل'
    ],
  },
  {
    slug: 'mobiles',
    terms: [
      'ايفون', 'آيفون', 'سامسونج', 'جالكسي', 'هواوي', 'شاومي', 'موبايل', 'جوال', 'تليفون', 'فون',
      'نوكيا', 'أوبو', 'ايباد', 'تابلت', 'iphone', 'samsung', 'galaxy', 'phone', 'xiaomi',
      'oppo', 'nokia', 'huawei', 'pixel', 'بكسل', 'ريدمي', 'هاتف', 'اتصالات'
    ],
  },
  {
    slug: 'watches',
    terms: [
      'ساعة', 'ساعات', 'رولكس', 'كاسيو', 'أوميغا', 'تيسو', 'باتيك فيليب', 'كارتير', 'سواتش', 'هوبلو',
      'watch', 'rolex', 'casio', 'omega', 'tissot', 'cartier', 'swatch', 'accessories',
      'smartwatch', 'apple watch', 'هواوي ووتش', 'ساعة ذكية', 'اكسسوارات'
    ],
  },
  {
    slug: 'computers',
    terms: [
      'لابتوب', 'ماك بوك', 'شاشة', 'كمبيوتر', 'حاسوب', 'بي سي', 'ديل', 'اتش بي', 'لينوفو', 'ايسوس',
      'macbook', 'monitor', 'laptop', 'pc', 'computer', 'desktop', 'dell', 'hp', 'lenovo',
      'asus', 'mac', 'gaming pc', 'كرت شاشة', 'ماوس', 'كيبورد'
    ],
  },
  {
    slug: 'electronics',
    terms: [
      'تلفزيون', 'ثلاجة', 'غسالة', 'مكيف', 'سماعات', 'بلايستيشن', 'اكس بوكس', 'كاميرا', 'بوتاجاز', 'فرن',
      'tv', 'fridge', 'electronics', 'washer', 'playstation', 'xbox', 'camera', 'headphones',
      'air conditioner', 'ac', 'ميكروويف', 'غسالة صحون', 'شاشة ذكية'
    ],
  },
  {
    slug: 'furniture',
    terms: [
      'كنبة', 'صوفا', 'سرير', 'طاولة', 'كرسي', 'أثاث', 'اثاث', 'دولاب', 'خزانة', 'سجاد', 'ستائر',
      'sofa', 'bed', 'chair', 'table', 'furniture', 'closet', 'carpet', 'curtains', 'decor',
      'مفروشات', 'غرفة نوم', 'طقم كنبات', 'ركنة', 'مكتبة'
    ],
  },
  {
    slug: 'fashion',
    terms: [
      'ملابس', 'قميص', 'فستان', 'حذاء', 'حقيبة', 'شنطة', 'عباية', 'بذلة', 'جاكيت', 'تيشيرت',
      'clothes', 'dress', 'shoes', 'fashion', 'shirt', 'bag', 'jacket', 't-shirt', 'sneakers',
      'زي', 'ملابس رجالية', 'ملابس نسائية', 'بوت', 'كوت'
    ],
  },
  {
    slug: 'services',
    terms: [
      'نقل', 'دهان', 'صيانة', 'سباكة', 'كهرباء', 'تنظيف', 'نجارة', 'تصليح', 'توصيل', 'حلاقة',
      'service', 'services', 'cleaning', 'maintenance', 'delivery', 'repair', 'plumbing',
      'نظافة', 'نقل عفش', 'مقاولات', 'تكييف', 'برمجة', 'تصميم'
    ],
  },
  {
    slug: 'jobs',
    terms: [
      'وظيفة', 'شغل', 'وظائف', 'عمل', 'توظيف', 'سائق', 'محاسب', 'مهندس', 'مندوب', 'طبيب',
      'job', 'hire', 'career', 'recruitment', 'work', 'driver', 'engineer', 'accountant',
      'فرص عمل', 'مطلوب موظفين', 'باحث عن عمل', 'دوام جزئي', 'دوام كامل'
    ],
  },
  {
    slug: 'kids',
    terms: [
      'طفل', 'اطفال', 'أطفال', 'عربة', 'ألعاب', 'العاب', 'ملابس اطفال', 'بامبرز', 'سرير اطفال', 'رضاعة',
      'baby', 'toys', 'kids', 'stroller', 'children', 'nursery', 'lego', 'بلاي موبيل',
      'مستلزمات اطفال', 'حفاضات', 'عربة اطفال', 'لعبة'
    ],
  },
  {
    slug: 'beauty',
    terms: [
      'عطر', 'مكياج', 'كريم', 'شامبو', 'بخور', 'عدسات', 'روائح', 'ماكياج', 'تجميل', 'مرطب',
      'perfume', 'makeup', 'beauty', 'care', 'fragrance', 'cosmetics', 'lipstick', 'skincare',
      'عطور', 'مستحضرات تجميل', 'زيوت طبيعية', 'مشغل'
    ],
  },
  {
    slug: 'pets',
    terms: [
      'كلب', 'قط', 'قطة', 'حيوان', 'حيوانات', 'ببغاء', 'سمك', 'هامستر', 'قفص', 'اكل قطط',
      'dog', 'cat', 'pet', 'pets', 'bird', 'fish', 'parrot', 'hamster', 'cage',
      'قطاوة', 'كلاب', 'عصافير', 'خيول', 'حصان'
    ],
  },
  {
    slug: 'sports',
    terms: [
      'كورة', 'دراجة', 'خيمة', 'رياضة', 'حديد', 'سيكل', 'مضرب', 'تنس', 'كرة قدم', 'نادي',
      'bike', 'tent', 'sports', 'football', 'gym', 'bicycle', 'tennis', 'camping',
      'ادوات رياضية', 'معدات تخييم', 'كرة سلة', 'مسبح'
    ],
  },
  {
    slug: 'books',
    terms: [
      'كتاب', 'كتب', 'مجلة', 'مجلات', 'رواية', 'قصص', 'تعليمي', 'قاموس', 'مصحف', 'قران',
      'book', 'books', 'novel', 'stories', 'educational', 'dictionary', 'quran', 'magazine',
      'روايات', 'كتب دينية', 'كتب مدرسية', 'مكتبة'
    ],
  },
  {
    slug: 'home-garden',
    terms: [
      'حديقة', 'نبات', 'سجاد', 'زرع', 'مظلة', 'عشب', 'ورد', 'اشجار', 'عدة زراعة', 'خرطوم',
      'garden', 'plant', 'plants', 'carpet', 'outdoor', 'umbrella', 'grass', 'flowers',
      'زراعة', 'ادوات حديقة', 'نباتات ظل', 'شجر'
    ],
  },
  {
    slug: 'krakeeb',
    terms: [
      'كراكيب', 'مستعمل', 'قديم', 'خردة', 'انتيك', 'تراث', 'اغراض متنوعة', 'اغراض للبيع', 'لوحة',
      'odds', 'used', 'vintage', 'junk', 'miscellaneous', 'antique', 'collectible',
      'خردوات', 'اشياء قديمة', 'اشياء نادرة', 'بسطة'
    ],
  },
  {
    slug: 'cleaning',
    terms: [
      'تنظيف', 'تنظيفات', 'نظافة', 'نضافة', 'تنضيف',
      'تنظيف بيوت', 'تنظيف منازل', 'تنظيف شقق', 'تنظيف فلل',
      'تنظيف مكاتب', 'تنظيف شركات',
      'شركة تنظيف', 'عامل نظافة', 'عاملة نظافة', 'عاملة منزلية',
      'غسيل كنب', 'غسيل سجاد', 'تنظيف سجاد', 'تنظيف كنب', 'تنظيف موكيت',
      'جلي', 'تلميع', 'تعقيم', 'مكافحة حشرات',
      'تنظيف خزانات', 'تنظيف مسابح', 'تنظيف واجهات',
      'cleaning', 'clean', 'housekeeping', 'deep clean', 'maid',
    ],
  },
  {
    slug: 'handymen',
    terms: [
      'صنايعي', 'صنايعية', 'صنيعي', 'صنايع', 'معلم', 'فني', 'فنيين', 'حرفي', 'حرفيين',
      'كهربائي', 'كهربجي', 'كهربا', 'electrician',
      'سباك', 'مواسرجي', 'تسليك', 'تسليك مجاري', 'plumber',
      'نجار', 'نجاري', 'carpenter',
      'دهان', 'بويا', 'صباغ', 'paint', 'painter',
      'حداد', 'لحام', 'blacksmith', 'welder',
      'فني تكييف', 'مكيفجي', 'فني مكيفات', 'تبريد وتكييف', 'ac', 'hvac',
      'ألمنيوم', 'المنيوم', 'aluminum',
      'جبصين', 'جبص', 'جبس', 'ديكور', 'gypsum',
      'بلاط', 'رخام', 'سيراميك', 'tiles', 'marble',
      'صيانة أجهزة', 'صيانة غسالات', 'صيانة ثلاجات', 'appliance repair',
      'فتح أقفال', 'مفاتيح', 'locksmith',
      'زجاج', 'مرايا', 'glass',
      'تركيب أثاث', 'فك وتركيب', 'furniture assembly',
      'صيانة عامة', 'handyman', 'technician', 'repair',
    ],
  },
];

export function searchCategories(query: string): CategoryDef[] {
  const q = normalizeArabic(query);
  if (!q) {
    return [];
  }

  const matchedSlugs = new Set<string>();

  for (const cat of categories) {
    const nameAr = normalizeArabic(cat.nameAr);
    const nameEn = normalizeArabic(cat.nameEn);

    if (q.includes(nameAr) || nameAr.includes(q) || q.includes(nameEn) || nameEn.includes(q)) {
      matchedSlugs.add(cat.slug);
      continue;
    }

    const alias = categoryAliases.find((a) => a.slug === cat.slug);
    if (alias) {
      for (const rawTerm of alias.terms) {
        const term = normalizeArabic(rawTerm);
        if (q.includes(term) || term.includes(q)) {
          matchedSlugs.add(cat.slug);
          break;
        }
      }
    }
  }

  const results = categories.filter((c) => matchedSlugs.has(c.slug));
  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}
