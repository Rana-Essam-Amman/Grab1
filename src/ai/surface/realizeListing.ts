import type { ListingFacts } from '../../types';

/**
 * Fact-bound listing surface for every category and subcategory.
 * States only extracted facts. Variation is seeded. No paid model.
 */

const PACK_VERSION = '2026.10.2';

const CATEGORY_NOUN: Record<string, string> = {
  motors: 'مركبة',
  'real-estate': 'عقار',
  mobiles: 'جوال',
  watches: 'ساعة',
  computers: 'جهاز',
  electronics: 'جهاز',
  furniture: 'قطعة أثاث',
  fashion: 'قطعة',
  services: 'خدمة',
  jobs: 'وظيفة',
  kids: 'غرض',
  beauty: 'منتج',
  pets: 'حيوان',
  sports: 'غرض رياضي',
  books: 'كتاب',
  'home-garden': 'غرض',
  krakeeb: 'غرض',
};

const SUB_NOUN: Record<string, string> = {
  apartments: 'شقة',
  apartment: 'شقة',
  villas: 'فيلا',
  villa: 'فيلا',
  lands: 'أرض',
  land: 'أرض',
  chalets: 'شاليه',
  shops: 'محل',
  offices: 'مكتب',
  cars: 'سيارة',
  car: 'سيارة',
  phones: 'جوال',
  phone: 'جوال',
  tablets: 'تابلت',
  laptops: 'لابتوب',
};

const BANNED = [
  'كما هي موصوفة',
  'كما هو مذكور',
  'كما هي معروضة',
  'ضمن وصف المالك',
  'ما يمكن تأكيده',
  'الموقع المذكور',
  'فرصة لن تتكرر',
  'تشطيبات ممتازة',
  'ديكورات عصرية',
  'إطلالة جميلة',
  'بحالة الوكالة',
  'موقع مميز',
  'مساحة عائلية',
];

export interface SurfaceInput {
  raw: string;
  facts: ListingFacts;
  categorySlug: string;
  subcategorySlug: string;
  sellerId: string;
  city?: string;
}

export interface SurfaceOutput {
  title: string;
  description: string;
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(seed: number, items: readonly T[], salt: number): T {
  return items[(seed + salt) % items.length];
}

function intentOf(raw: string, categorySlug: string): string {
  if (/ايجار|للإيجار|للايجار/.test(raw)) return 'للإيجار';
  if (/مطلوب/.test(raw)) return 'مطلوب';
  if (categorySlug === 'jobs') return 'شاغرة';
  if (categorySlug === 'services') return 'متاحة';
  return 'للبيع';
}

function subjectOf(facts: ListingFacts, categorySlug: string, subcategorySlug: string): string {
  const typed = typeof facts.type === 'string' ? facts.type : '';
  if (typed) return typed;
  const make = typeof facts.make === 'string' ? facts.make : '';
  const model = typeof facts.model === 'string' ? facts.model : '';
  const branded = [make, model].filter(Boolean).join(' ').trim();
  if (branded) return branded;
  if (typeof facts.jobTitle === 'string' && facts.jobTitle) return facts.jobTitle;
  if (typeof facts.serviceType === 'string' && facts.serviceType) return facts.serviceType;
  if (typeof facts.petBreed === 'string' && facts.petBreed) return facts.petBreed;
  return SUB_NOUN[subcategorySlug] || CATEGORY_NOUN[categorySlug] || 'غرض';
}

function placeOf(facts: ListingFacts, city: string | undefined, raw: string): string {
  const fromSentence = raw.match(/في\s+([\u0600-\u06FF]+(?:\s[\u0600-\u06FF]+)?)/);
  if (fromSentence) {
    const place = fromSentence[1].replace(/مساحه|مساحة|مكونة|مكونه|طابق.*/, '').trim();
    if (place) return place;
  }
  if (typeof facts.city === 'string' && facts.city) return facts.city;
  if (city && city !== 'المدينة') return city;
  return '';
}

function explicitPrice(raw: string): boolean {
  return /سعر|دينار|دولار|ريال|شيكل/.test(raw);
}

function factsOf(facts: ListingFacts, raw: string) {
  const beds = typeof facts.rooms === 'string' ? facts.rooms : raw.match(/(\d{1,2})\s*نوم/)?.[1];
  const baths = typeof facts.bathrooms === 'string' ? facts.bathrooms : undefined;
  const area = typeof facts.area === 'string' ? facts.area : undefined;
  const floor = typeof facts.floor === 'string'
    ? facts.floor
    : (/طابق\s*اول|طابق\s*أول|الطابق\s*الاول|الطابق\s*الأول/.test(raw) ? 'الأول' : '');
  const balcony = /بلكون|شرفة/.test(raw);
  return { beds, baths, area, floor, balcony };
}

function compose(seed: number, subject: string, intent: string, place: string, facts: ListingFacts, raw: string): SurfaceOutput {
  const placeBit = place ? ` في ${place}` : '';
  const f = factsOf(facts, raw);
  const bits = [
    f.beds ? `${f.beds} نوم` : '',
    f.baths ? `${f.baths} حمام` : '',
    f.area ? `${f.area} م²` : '',
    f.balcony ? 'بلكونة' : '',
    typeof facts.year === 'string' ? facts.year : '',
    typeof facts.km === 'string' ? `${facts.km} كم` : '',
  ].filter(Boolean);
  const floorBit = f.floor ? ` — الطابق ${f.floor}` : '';
  const titles = [
    `${subject} ${intent}${placeBit}${floorBit}${bits.length ? ` (${bits.join('، ')})` : ''}`,
    `${subject} ${intent}${placeBit}${f.beds ? `، ${f.beds} غرف نوم` : ''}${f.area ? `، ${f.area} م²` : ''}`,
  ];
  const opens = [
    `${subject} ${intent}${placeBit}${f.floor ? `، الطابق ${f.floor}` : ''}${f.area ? `، مساحتها ${f.area} م²` : ''}.`,
    `${subject}${placeBit} ${intent}${f.floor ? `، بالطابق ${f.floor}` : ''}.`,
  ];
  const bodyBits = [
    f.beds ? `${f.beds} غرف نوم` : '',
    f.baths ? `${f.baths} حمامات` : '',
    f.balcony ? 'بلكونة' : '',
  ].filter(Boolean);
  const bodies = [
    bodyBits.length ? `تتكون من ${bodyBits.join('، ')}.` : '',
    bodyBits.length ? `فيها ${bodyBits.join('، ')}.` : '',
  ];
  const extra = [
    typeof facts.year === 'string' ? `سنة ${facts.year}.` : '',
    typeof facts.km === 'string' ? `العداد ${facts.km} كم.` : '',
    typeof facts.condition === 'string' ? `الحالة ${facts.condition}.` : '',
    explicitPrice(raw) && typeof facts.price === 'string' ? `السعر ${facts.price}.` : '',
  ].filter(Boolean);
  const closes = [
    'للتفاصيل والمعاينة يُرجى التواصل.',
    'المعاينة بالتنسيق عبر الإعلان.',
  ];
  const title = pick(seed, titles, 1);
  const description = [
    pick(seed, opens, 3),
    '',
    pick(seed, bodies.filter(Boolean).length ? bodies : [''], 5),
    extra.join(' '),
    '',
    pick(seed, closes, 7),
  ].filter((line, i, all) => line !== '' || (all[i - 1] && all[i + 1])).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return { title, description };
}

export function realizeListing(input: SurfaceInput): SurfaceOutput {
  const subject = subjectOf(input.facts, input.categorySlug, input.subcategorySlug);
  const intent = intentOf(input.raw, input.categorySlug);
  const place = placeOf(input.facts, input.city, input.raw);
  const seed = hash(`${input.sellerId}|${input.raw.trim()}|${input.categorySlug}|${input.subcategorySlug}|${PACK_VERSION}`);
  const surface = compose(seed, subject, intent, place, input.facts, input.raw);
  const banned = BANNED.find((phrase) => surface.title.includes(phrase) || surface.description.includes(phrase));
  if (banned) {
    return {
      title: `${subject} ${intent}${place ? ` في ${place}` : ''}`,
      description: `${subject} ${intent}${place ? ` في ${place}` : ''}.\n\nللتواصل عبر الإعلان.`,
    };
  }
  return surface;
}
