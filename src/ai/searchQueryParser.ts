import { categories } from '../data/categories';
import { locations, locationsAr, validateRegionalSanity } from '../data/locations';

export interface ParsedSearchFilters {
  categorySlug?: string;
  maxPrice?: number;
  city?: string;
  neighborhood?: string;
  locationLabel?: string;
  cleanTextQuery?: string;
  voidedCrossBorderLocation?: string;
}

// Convert Eastern Arabic Numerals (٠-٩) to Standard (0-9)
function normalizeNumerals(text: string): string {
  return text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

/**
 * Extracts numeric price bound from conversational terms like:
 * "تحت الـ 50 الف", "تحت 50 الف", "أقل من 20000", "بحدود 15000", "under 20k", "max 50000"
 */
function extractMaxPrice(raw: string): { price?: number; matchedText?: string } {
  const norm = normalizeNumerals(raw);

  // Conversational shortcuts: نص مليون = 500,000, ربع مليون = 250,000
  if (/(نص|نصف)\s*مليون/i.test(norm)) {
    return { price: 500000, matchedText: 'نصف مليون' };
  }
  if (/ربع\s*مليون/i.test(norm)) {
    return { price: 250000, matchedText: 'ربع مليون' };
  }

  // Common price bound trigger prefixes
  const prefixPattern = '(?:تحت|أقل\\s*من|اقل\\s*من|أقل|اقل|بحدود|حتى|ماكس|سعر\\s*أقل\\s*من|سعر\\s*اقل\\s*من|under|max|less\\s*than|below|up\\s*to)';

  // Pattern A: Prefix + optional (الـ / ال) + digits + optional (الف / k / مليون / m)
  const regexA = new RegExp(
    `${prefixPattern}\\s*(?:الـ|ال)?\\s*(\\d+[\\d,\\.]*)\\s*(الف|ألف|آلاف|مليون|ملايين|k|m)?`,
    'i'
  );

  const matchA = norm.match(regexA);
  if (matchA) {
    const rawDigits = matchA[1].replace(/,/g, '');
    let baseVal = parseFloat(rawDigits);
    const unit = (matchA[2] || '').toLowerCase();

    if (unit.includes('الف') || unit.includes('ألف') || unit.includes('آلاف') || unit === 'k') {
      baseVal *= 1000;
    } else if (unit.includes('مليون') || unit.includes('ملايين') || unit === 'm') {
      baseVal *= 1000000;
    }

    if (!isNaN(baseVal) && baseVal > 0) {
      return { price: Math.round(baseVal), matchedText: matchA[0] };
    }
  }

  // Pattern B: Digits + (الف / k) + (وجاي / وتحت / فما دون)
  const regexB = /(\d+[\d,\.]*)\s*(الف|ألف|k)?\s*(?:وتحت|وجاي|فما\s*دون|أو\s*أقل|او\s*اقل)/i;
  const matchB = norm.match(regexB);
  if (matchB) {
    const rawDigits = matchB[1].replace(/,/g, '');
    let baseVal = parseFloat(rawDigits);
    const unit = (matchB[2] || '').toLowerCase();
    if (unit.includes('الف') || unit.includes('ألف') || unit === 'k') {
      baseVal *= 1000;
    }
    if (!isNaN(baseVal) && baseVal > 0) {
      return { price: Math.round(baseVal), matchedText: matchB[0] };
    }
  }

  return {};
}

// Taxonomy keyword map tied directly to categories in categories.ts
const TAXONOMY_KEYWORDS: Record<string, string[]> = {
  motors: [
    'سيارة', 'سيارات', 'مركبة', 'مركبات', 'باص', 'موتور', 'دراجة', 'كامري', 'مرسيدس',
    'بي ام', 'هيونداي', 'كيا', 'تويوتا', 'نيسان', 'افانتي', 'سوناتا', 'النترا', 'بريدوس',
    'car', 'cars', 'motor', 'vehicle', 'camry', 'bmw', 'toyota', 'hyundai'
  ],
  'real-estate': [
    'شقة', 'شقق', 'ارض', 'أرض', 'اراضي', 'أراضي', 'بيت', 'بيوت', 'فيلا', 'فلل',
    'عقار', 'عقارات', 'للايجار', 'للإيجار', 'للبيع', 'استوديو', 'مكتب', 'مخزن', 'عمارة',
    'apartment', 'flat', 'land', 'villa', 'real estate', 'rent'
  ],
  mobiles: [
    'تلفون', 'تلفونات', 'موبايل', 'موبايلات', 'جوال', 'جوالات', 'ايفون', 'آيفون',
    'سامسونج', 'شاومي', 'هاتف', 'هواتف', 'تابلت', 'ايباد', 'آيباد', 'galaxy',
    'phone', 'mobile', 'iphone', 'samsung', 'tablet', 'ipad'
  ],
  watches: ['ساعة', 'ساعات', 'رولكس', 'كاسيو', 'أوميغا', 'watch', 'watches', 'rolex'],
  computers: ['لابتوب', 'لاب توب', 'كمبيوتر', 'حاسوب', 'ماك بوك', 'بي سي', 'pc', 'laptop', 'macbook', 'computer'],
  electronics: ['تلفزيون', 'شاشة', 'سماعات', 'بلايستيشن', 'بلاي ستيشن', 'كونسول', 'tv', 'screen', 'playstation', 'ps5', 'electronics'],
  furniture: ['كنب', 'كنباية', 'غرفة نوم', 'خزانة', 'طاولة', 'كراسي', 'فرش', 'أثاث', 'اثاث', 'صالون', 'furniture', 'sofa'],
  fashion: ['فستان', 'ملابس', 'جاكيت', 'قميص', 'بنطلون', 'حذاء', 'بوط', 'شنطة', 'حقيبة', 'عباية', 'clothes', 'fashion', 'shoes'],
  services: ['صيانة', 'تصليح', 'نقل عفش', 'تنظيف', 'مقاولات', 'خدمة', 'خدمات', 'services', 'maintenance'],
  jobs: ['وظيفة', 'وظائف', 'شغل', 'توظيف', 'مطلوب موظف', 'محاسب', 'مهندس', 'job', 'jobs', 'hiring'],
  kids: ['العاب', 'ألعاب', 'اطفال', 'أطفال', 'عرباية', 'toys', 'kids', 'baby'],
  beauty: ['عطر', 'عطور', 'مكياج', 'عناية', 'beauty', 'perfume'],
  pets: ['بسة', 'بساس', 'قطط', 'قطة', 'كلب', 'كلاب', 'طيور', 'طير', 'حمام', 'pet', 'pets', 'cat', 'dog'],
  sports: ['جيم', 'دراجة هوائية', 'بسكليت', 'اثقال', 'sports', 'gym', 'bicycle'],
  books: ['كتاب', 'كتب', 'رواية', 'روايات', 'books'],
  'home-garden': ['حديقة', 'شجر', 'نباتات', 'زرع', 'garden', 'plants'],
  krakeeb: ['كراكيب', 'انتيك', 'مستعمل', 'سكراب', 'antique', 'used', 'krakeeb'],
};

function extractTaxonomy(raw: string): { slug?: string; matchedKeyword?: string } {
  const norm = raw.toLowerCase();
  for (const [slug, keywords] of Object.entries(TAXONOMY_KEYWORDS)) {
    for (const kw of keywords) {
      // Word boundary match
      const regex = new RegExp(`(^|\\s|[.,!؟])${kw}($|\\s|[.,!؟])`, 'i');
      if (regex.test(norm)) {
        return { slug, matchedKeyword: kw };
      }
    }
  }
  return {};
}

/**
 * Strict Locale Filtering:
 * Checks query against current country's cities & neighborhoods.
 * Defensively catches cross-border queries (e.g. Beirut while in Jordan) and voids them.
 */
function extractLocation(
  raw: string,
  countryCode: string
): {
  city?: string;
  neighborhood?: string;
  locationLabel?: string;
  matchedText?: string;
  voidedCrossBorderLocation?: string;
} {
  const norm = raw.toLowerCase();
  const allCountries = ['JO', 'LB', 'PS', 'SY', 'SA'];

  // 1. Cross-border tripwire detection
  const otherCountries = allCountries.filter((c) => c !== countryCode);
  for (const otherC of otherCountries) {
    const foreignTree = locationsAr[otherC] || {};
    const foreignTreeEn = locations[otherC] || {};

    for (const fCity of Object.keys(foreignTree)) {
      if (fCity.length >= 3 && norm.includes(fCity.toLowerCase())) {
        // Sanity guard check
        if (!validateRegionalSanity(countryCode, fCity)) {
          return { voidedCrossBorderLocation: fCity, matchedText: fCity };
        }
      }
    }

    for (const fCityEn of Object.keys(foreignTreeEn)) {
      if (fCityEn.length >= 3 && norm.includes(fCityEn.toLowerCase())) {
        if (!validateRegionalSanity(countryCode, fCityEn)) {
          return { voidedCrossBorderLocation: fCityEn, matchedText: fCityEn };
        }
      }
    }
  }

  // 2. In-country resolution (Neighborhoods first because they are more specific than Cities)
  const curCountryAr = locationsAr[countryCode] || {};
  const curCountryEn = locations[countryCode] || {};

  // Check neighborhoods
  for (const [cityName, neighs] of Object.entries(curCountryAr)) {
    for (const neigh of neighs) {
      if (neigh.length >= 3) {
        const regex = new RegExp(`(^|\\s|[.,!؟])${neigh}($|\\s|[.,!؟])`, 'i');
        if (regex.test(norm)) {
          if (validateRegionalSanity(countryCode, cityName, neigh)) {
            return {
              city: cityName,
              neighborhood: neigh,
              locationLabel: neigh,
              matchedText: neigh,
            };
          }
        }
      }
    }
  }

  for (const [cityNameEn, neighsEn] of Object.entries(curCountryEn)) {
    for (const neighEn of neighsEn) {
      if (neighEn.length >= 3) {
        const regex = new RegExp(`(^|\\s|[.,!؟])${neighEn}($|\\s|[.,!؟])`, 'i');
        if (regex.test(norm)) {
          if (validateRegionalSanity(countryCode, cityNameEn, neighEn)) {
            return {
              city: cityNameEn,
              neighborhood: neighEn,
              locationLabel: neighEn,
              matchedText: neighEn,
            };
          }
        }
      }
    }
  }

  // Check cities
  for (const cityName of Object.keys(curCountryAr)) {
    if (cityName.length >= 3) {
      const regex = new RegExp(`(^|\\s|[.,!؟])${cityName}($|\\s|[.,!؟])`, 'i');
      if (regex.test(norm)) {
        if (validateRegionalSanity(countryCode, cityName)) {
          return {
            city: cityName,
            locationLabel: cityName,
            matchedText: cityName,
          };
        }
      }
    }
  }

  for (const cityNameEn of Object.keys(curCountryEn)) {
    if (cityNameEn.length >= 3) {
      const regex = new RegExp(`(^|\\s|[.,!؟])${cityNameEn}($|\\s|[.,!؟])`, 'i');
      if (regex.test(norm)) {
        if (validateRegionalSanity(countryCode, cityNameEn)) {
          return {
            city: cityNameEn,
            locationLabel: cityNameEn,
            matchedText: cityNameEn,
          };
        }
      }
    }
  }

  return {};
}

/**
 * Main Semantic Natural Language Search Query Parser:
 * Integrates Price bounds, Taxonomy classification, and Rigid Locale filtering.
 */
export function parseNaturalLanguageSearch(
  rawInput: string,
  countryCode: string
): ParsedSearchFilters {
  const trimmed = rawInput.trim();
  if (!trimmed) return {};

  const priceResult = extractMaxPrice(trimmed);
  const taxonomyResult = extractTaxonomy(trimmed);
  const locationResult = extractLocation(trimmed, countryCode);

  // Clean residual search text for remaining keywords
  let residual = trimmed;

  if (priceResult.matchedText) {
    residual = residual.replace(priceResult.matchedText, ' ');
  }
  if (locationResult.matchedText) {
    residual = residual.replace(locationResult.matchedText, ' ');
  }

  // Remove conversational filler and search intent verbs
  residual = residual
    .replace(/^(بدي|بدنا|أبحث عن|ابحث عن|مطلوب|شراء|ابحث|بحث|اريد|أريد|looking for|want to buy|search for|search|buy)\s+/gi, '')
    .replace(/\s+(في|بـ|ب|in|at|under|تحت|أقل من|اقل من)\s+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    categorySlug: taxonomyResult.slug,
    maxPrice: priceResult.price,
    city: locationResult.city,
    neighborhood: locationResult.neighborhood,
    locationLabel: locationResult.locationLabel,
    voidedCrossBorderLocation: locationResult.voidedCrossBorderLocation,
    cleanTextQuery: residual.length > 0 ? residual : undefined,
  };
}
