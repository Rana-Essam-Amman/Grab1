// RULE-14-EXCEPTION: Static taxonomy
import { CategoryDef } from '../types';
import { categories } from './categories';

export interface CategoryAlias {
  slug: string;
  terms: string[];
}

export const categoryAliases: CategoryAlias[] = [
  {
    slug: 'motors',
    terms: ['كامري', 'تويوتا', 'هونداي', 'كيا', 'مرسيدس', 'بي ام', 'سيارة', 'car', 'شاحنة', 'motor', 'cars'],
  },
  {
    slug: 'real-estate',
    terms: ['شقة', 'بيت', 'فيلا', 'أرض', 'ارض', 'مكتب', 'عقار', 'apartment', 'house', 'land', 'villa'],
  },
  {
    slug: 'mobiles',
    terms: ['ايفون', 'آيفون', 'سامسونج', 'جالكسي', 'هواوي', 'موبايل', 'جوال', 'iphone', 'galaxy', 'phone'],
  },
  {
    slug: 'watches',
    terms: ['ساعة', 'رولكس', 'كاسيو', 'watch', 'rolex', 'casio', 'ساعات', 'accessories'],
  },
  {
    slug: 'computers',
    terms: ['لابتوب', 'ماك بوك', 'شاشة', 'كمبيوتر', 'macbook', 'monitor', 'laptop', 'pc'],
  },
  {
    slug: 'electronics',
    terms: ['تلفزيون', 'ثلاجة', 'غسالة', 'مكيف', 'سماعات', 'tv', 'fridge', 'electronics', 'washer'],
  },
  {
    slug: 'furniture',
    terms: ['كنبة', 'صوفا', 'سرير', 'طاولة', 'كرسي', 'أثاث', 'اثاث', 'sofa', 'bed', 'chair', 'table'],
  },
  {
    slug: 'fashion',
    terms: ['ملابس', 'قميص', 'فستان', 'حذاء', 'حقيبة', 'clothes', 'dress', 'shoes', 'fashion', 'shirt'],
  },
  {
    slug: 'services',
    terms: ['نقل', 'دهان', 'صيانة', 'سباكة', 'كهرباء', 'service', 'services', 'cleaning', 'نظافة'],
  },
  {
    slug: 'jobs',
    terms: ['وظيفة', 'شغل', 'وظائف', 'job', 'hire', 'career', 'عمل'],
  },
  {
    slug: 'kids',
    terms: ['طفل', 'اطفال', 'أطفال', 'عربة', 'ألعاب', 'العاب', 'baby', 'toys', 'kids'],
  },
  {
    slug: 'beauty',
    terms: ['عطر', 'مكياج', 'كريم', 'شامبو', 'perfume', 'makeup', 'beauty', 'care'],
  },
  {
    slug: 'pets',
    terms: ['كلب', 'قط', 'قطة', 'حيوان', 'حيوانات', 'dog', 'cat', 'pet', 'pets'],
  },
  {
    slug: 'sports',
    terms: ['كورة', 'دراجة', 'خيمة', 'رياضة', 'bike', 'tent', 'sports', 'football'],
  },
  {
    slug: 'books',
    terms: ['كتاب', 'كتب', 'مجلة', 'مجلات', 'book', 'books', 'novel', 'رواية'],
  },
  {
    slug: 'home-garden',
    terms: ['حديقة', 'نبات', 'سجاد', 'زرع', 'garden', 'plant', 'plants', 'carpet'],
  },
  {
    slug: 'krakeeb',
    terms: ['كراكيب', 'مستعمل', 'قديم', 'odds', 'used', 'vintage', 'خردة'],
  },
];

export function searchCategories(query: string): CategoryDef[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [];
  }

  const matchedSlugs = new Set<string>();

  for (const cat of categories) {
    const nameAr = cat.nameAr.toLowerCase();
    const nameEn = cat.nameEn.toLowerCase();

    if (q.includes(nameAr) || nameAr.includes(q) || q.includes(nameEn) || nameEn.includes(q)) {
      matchedSlugs.add(cat.slug);
      continue;
    }

    const alias = categoryAliases.find((a) => a.slug === cat.slug);
    if (alias) {
      for (const rawTerm of alias.terms) {
        const term = rawTerm.toLowerCase();
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
