// RULE-14-EXCEPTION: Search index built from static taxonomies
import type { CategoryDef } from '../types';
import { categories } from './categories';
import { categoryAliases } from './categoryAliases';
import { normalizeArabic } from './arabicNormalize';
import type { CategoryFieldDef } from './categoryFields';
import { MOTORS_SUBCATEGORY_FIELDS as motors } from './subcategoryFields/motors';
import { REAL_ESTATE_SUBCATEGORY_FIELDS as re } from './subcategoryFields/real-estate';
import { MOBILES_SUBCATEGORY_FIELDS as mobiles } from './subcategoryFields/mobiles';
import { COMPUTERS_SUBCATEGORY_FIELDS as pc } from './subcategoryFields/computers';
import { ELECTRONICS_SUBCATEGORY_FIELDS as el } from './subcategoryFields/electronics';
import { WATCHES_SUBCATEGORY_FIELDS as wt } from './subcategoryFields/watches';
import { FASHION_SUBCATEGORY_FIELDS as fs } from './subcategoryFields/fashion';
import { FURNITURE_SUBCATEGORY_FIELDS as fr } from './subcategoryFields/furniture';
import { KIDS_SUBCATEGORY_FIELDS as kd } from './subcategoryFields/kids';
import { BEAUTY_SUBCATEGORY_FIELDS as bt } from './subcategoryFields/beauty';
import { PETS_SUBCATEGORY_FIELDS as pt } from './subcategoryFields/pets';
import { SPORTS_SUBCATEGORY_FIELDS as sp } from './subcategoryFields/sports';
import { BOOKS_SUBCATEGORY_FIELDS as bk } from './subcategoryFields/books';
import { HOME_GARDEN_SUBCATEGORY_FIELDS as hg } from './subcategoryFields/home-garden';
import { JOBS_SUBCATEGORY_FIELDS as jb } from './subcategoryFields/jobs';
import { SERVICES_SUBCATEGORY_FIELDS as sv } from './subcategoryFields/services';

const SUBCATEGORY_FIELDS: Record<string, Record<string, readonly CategoryFieldDef[]>> = {
  motors, 'real-estate': re, mobiles, computers: pc, electronics: el,
  watches: wt, fashion: fs, furniture: fr, kids: kd, beauty: bt, pets: pt, sports: sp,
  books: bk, 'home-garden': hg, jobs: jb, services: sv,
};

const SYNONYMS: Record<string, string[]> = {
  motors: ['سلندر', 'سلندرات', 'موتور', 'مواتر', 'عربيه', 'عربيات', 'كامري', 'تويوتا', 'هونداي', 'كيا'],
  'real-estate': ['نوم', 'غرف', 'حمام', 'حمامات', 'مطبخ', 'صاله', 'صالة', 'بلكون', 'بلكونة', 'شقق', 'بيوت'],
  mobiles: ['جوالات', 'موبايلات', 'ايفونات', 'ايباد', 'تابلت', 'تلفون'],
  computers: ['لابتوبات', 'كمبيوترات', 'شاشات', 'ماوس', 'كيبورد'],
  electronics: ['تلفزيونات', 'ثلاجات', 'غسالات', 'مكيفات', 'سماعات'],
  fashion: ['مقاس', 'قياس', 'احذيه', 'احذية', 'فساتين', 'قمصان'],
  furniture: ['قياس', 'ابعاد', 'كنبات', 'سجاد'],
  kids: ['عرايات', 'العاب', 'اطفال'],
  beauty: ['عطور', 'كريمات', 'مكياج'],
  pets: ['كلاب', 'قطط'],
  sports: ['دراجات', 'خيام', 'كرات'],
  books: ['روايات', 'مجلات'],
  watches: ['ساعات', 'اكسسوارات', 'اكسسوار'],
  'home-garden': ['حدايق', 'نباتات', 'زرع'],
  jobs: ['وظايف', 'اعمال'],
  services: ['نقل', 'دهان', 'صيانه', 'سباكه', 'كهرباء'],
  krakeeb: ['كراكيب', 'خرده', 'خرداوات', 'مستعمل', 'قديم'],
};

function add(index: Record<string, Set<string>>, term: string, slug: string): void {
  const norm = normalizeArabic(term);
  if (!norm) return;
  if (!index[norm]) index[norm] = new Set<string>();
  index[norm].add(slug);
}

function buildIndex(): Record<string, Set<string>> {
  const index: Record<string, Set<string>> = {};
  for (const cat of categories) {
    add(index, cat.nameAr, cat.slug);
    add(index, cat.nameEn, cat.slug);
  }
  for (const alias of categoryAliases) {
    for (const term of alias.terms) add(index, term, alias.slug);
  }
  for (const [catSlug, subs] of Object.entries(SUBCATEGORY_FIELDS)) {
    for (const [subKey, fields] of Object.entries(subs)) {
      add(index, subKey, catSlug);
      for (const field of fields) {
        add(index, field.labelAr, catSlug);
        add(index, field.labelEn, catSlug);
        if (field.options) {
          for (const opt of field.options) add(index, opt, catSlug);
        }
      }
    }
  }
  for (const [slug, terms] of Object.entries(SYNONYMS)) {
    for (const term of terms) add(index, term, slug);
  }
  return index;
}

const INDEX = buildIndex();
const STOP_WORDS = new Set(['في', 'من', 'على', 'الى', 'إلى', 'او', 'أو', 'و', 'مع', 'عن', 'the', 'a', 'an', 'of', 'in', 'on', 'at', 'with', 'for']);

function tokenize(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .map(normalizeArabic)
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));
}

export function searchCategories(query: string): CategoryDef[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scores = new Map<string, number>();
  for (const token of tokens) {
    const exact = INDEX[token];
    if (exact) {
      for (const slug of exact) scores.set(slug, (scores.get(slug) || 0) + 3);
    }
    for (const [key, slugs] of Object.entries(INDEX)) {
      if (key !== token && (key.includes(token) || token.includes(key))) {
        for (const slug of slugs) scores.set(slug, (scores.get(slug) || 0) + 1);
      }
    }
  }

  return categories
    .filter((c) => scores.has(c.slug))
    .sort((a, b) => {
      const diff = (scores.get(b.slug) || 0) - (scores.get(a.slug) || 0);
      return diff !== 0 ? diff : a.slug.localeCompare(b.slug);
    });
}
