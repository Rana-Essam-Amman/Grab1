// RULE-14-EXCEPTION: Static taxonomy
import { CategoryDef } from '../types';
import { categories } from './categories';

export interface CategoryAlias {
  slug: string;
  terms: string[];
}

export const categoryAliases: CategoryAlias[] = [
  { slug: 'motors', terms: ['كامري', 'تويوتا', 'هونداي', 'كيا', 'مرسيدس', 'بي ام', 'سيارة', 'car', 'شاحنة', 'مركبة'] },
  { slug: 'real-estate', terms: ['شقة', 'بيت', 'فيلا', 'أرض', 'مكتب', 'عقار', 'apartment', 'house', 'land', 'building'] },
  { slug: 'mobiles', terms: ['ايفون', 'سامسونج', 'جالكسي', 'هواوي', 'موبايل', 'جوال', 'iphone', 'galaxy', 'phone'] },
  { slug: 'watches', terms: ['ساعة', 'رولكس', 'كاسيو', 'watch', 'rolex', 'casio', 'ساعات', 'إكسسوار'] },
  { slug: 'computers', terms: ['لابتوب', 'ماك بوك', 'شاشة', 'كمبيوتر', 'macbook', 'monitor', 'pc', 'laptop'] },
  { slug: 'electronics', terms: ['تلفزيون', 'ثلاجة', 'غسالة', 'مكيف', 'سماعات', 'tv', 'fridge', 'ac', 'speaker'] },
  { slug: 'furniture', terms: ['كنبة', 'صوفا', 'سرير', 'طاولة', 'كرسي', 'أثاث', 'sofa', 'bed', 'chair', 'table'] },
  { slug: 'fashion', terms: ['ملابس', 'قميص', 'فستان', 'حذاء', 'حقيبة', 'clothes', 'dress', 'shoes', 'bag'] },
  { slug: 'services', terms: ['نقل', 'دهان', 'صيانة', 'سباكة', 'كهرباء', 'service', 'repair', 'moving'] },
  { slug: 'jobs', terms: ['وظيفة', 'شغل', 'وظائف', 'job', 'hire', 'vacancy', 'career'] },
  { slug: 'kids', terms: ['طفل', 'اطفال', 'عربة', 'ألعاب', 'baby', 'toys', 'stroller', 'kids'] },
  { slug: 'beauty', terms: ['عطر', 'مكياج', 'كريم', 'شامبو', 'perfume', 'makeup', 'cream', 'beauty'] },
  { slug: 'pets', terms: ['كلب', 'قط', 'حيوان', 'dog', 'cat', 'pet', 'animals'] },
  { slug: 'sports', terms: ['كورة', 'دراجة', 'خيمة', 'رياضة', 'bike', 'tent', 'sport', 'football'] },
  { slug: 'books', terms: ['كتاب', 'كتب', 'مجلة', 'book', 'books', 'magazine', 'novel'] },
  { slug: 'home-garden', terms: ['حديقة', 'نبات', 'سجاد', 'زرع', 'garden', 'plant', 'rug', 'home'] },
  { slug: 'krakeeb', terms: ['كراكيب', 'مستعمل', 'قديم', 'odds', 'used', 'secondhand'] },
];

export function searchCategories(query: string): CategoryDef[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  
  const matchedSlugs = new Set<string>();

  for (const cat of categories) {
    const nameAr = cat.nameAr.toLowerCase();
    const nameEn = cat.nameEn.toLowerCase();
    const slug = cat.slug.toLowerCase();

    if (nameAr.includes(q) || q.includes(nameAr) ||
        nameEn.includes(q) || q.includes(nameEn) ||
        slug.includes(q) || q.includes(slug)) {
      matchedSlugs.add(cat.slug);
      continue;
    }

    const aliasObj = categoryAliases.find((a) => a.slug === cat.slug);
    if (aliasObj) {
      for (const term of aliasObj.terms) {
        const t = term.toLowerCase();
        if (q.includes(t) || t.includes(q)) {
          matchedSlugs.add(cat.slug);
          break;
        }
      }
    }
  }

  const result = categories.filter((cat) => matchedSlugs.has(cat.slug));
  return result.sort((a, b) => a.slug.localeCompare(b.slug));
}
