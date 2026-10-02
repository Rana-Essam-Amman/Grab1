import type { ListingFacts } from '../../types';

/**
 * Fact-bound listing surface for every category and subcategory.
 * States only extracted facts. Same sentence gives the same surface. No paid model.
 */

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
  cleaning: 'خدمة تنظيف',
  handymen: 'خدمة',
  projects: 'مشروع',
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

function intentOf(raw: string, categorySlug: string): string {
  if (/ايجار|للإيجار|للايجار/.test(raw)) return 'للإيجار';
  if (/مطلوب/.test(raw)) return 'مطلوب';
  if (categorySlug === 'jobs') return 'شاغرة';
  if (categorySlug === 'services') return 'متاحة';
  return 'للبيع';
}

function subjectOf(facts: ListingFacts, categorySlug: string, subcategorySlug: string, raw: string): string {
  const typed = typeof facts.type === 'string' ? facts.type : '';
  if (typed) return typed;
  const make = typeof facts.make === 'string' ? facts.make : '';
  const model = typeof facts.model === 'string' ? facts.model : '';
  const branded = [make, model].filter(Boolean).join(' ').trim();
  if (branded) return branded;
  if (typeof facts.jobTitle === 'string' && facts.jobTitle) return facts.jobTitle;
  if (typeof facts.serviceType === 'string' && facts.serviceType) return facts.serviceType;
  if (typeof facts.petBreed === 'string' && facts.petBreed) return facts.petBreed;
  if (SUB_NOUN[subcategorySlug]) return SUB_NOUN[subcategorySlug];
  if (CATEGORY_NOUN[categorySlug]) return CATEGORY_NOUN[categorySlug];
  const first = raw.match(/[\u0600-\u06FF]{3,}/);
  return first ? first[0] : 'غرض';
}

function placeOf(facts: ListingFacts, city: string | undefined, raw: string): string {
  const fromSentence = raw.match(/في\s+([\u0600-\u06FF]+(?:\s[\u0600-\u06FF]+)?)/);
  if (fromSentence) {
    const place = fromSentence[1].replace(/مساحه|مساحة|مكونة|مكونه|طابق.*/, '').trim();
    if (place) return place.replace('شفابدران', 'شفا بدران').replace('ابو نصير', 'أبو نصير');
  }
  if (typeof facts.city === 'string' && facts.city) return facts.city;
  if (city && city !== 'المدينة') return city;
  return '';
}

function pricePhrase(raw: string, price: string | undefined): string {
  const written = raw.match(/(\d+)\s*(الف|ألف)/);
  if (written) return `السعر ${written[1]} ألف.`;
  if (price) return `السعر ${price}.`;
  return '';
}

function joinAr(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join('، ')}، و${items[items.length - 1]}`;
}

function compose(subject: string, intent: string, place: string, facts: ListingFacts, raw: string): SurfaceOutput {
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
  const title = `${subject} ${intent}${placeBit}${floorBit}${bits.length ? ` (${bits.join('، ')})` : ''}`;
  const open = `${subject} ${intent}${placeBit}${f.floor ? `، الطابق ${f.floor}` : ''}${f.area ? `، مساحتها ${f.area} م²` : ''}.`;
  const bodyBits = [
    f.beds ? `${f.beds} غرف نوم` : '',
    f.baths ? `${f.baths} حمامات` : '',
    f.balcony ? 'بلكونة' : '',
  ].filter(Boolean);
  const body = bodyBits.length ? `تتكون من ${joinAr(bodyBits)}.` : '';
  const extra = [
    typeof facts.year === 'string' ? `سنة ${facts.year}.` : '',
    typeof facts.km === 'string' ? `العداد ${facts.km} كم.` : '',
    typeof facts.condition === 'string' ? `الحالة ${facts.condition}.` : '',
    explicitPrice(raw) ? pricePhrase(raw, typeof facts.price === 'string' ? facts.price : undefined) : '',
  ].filter(Boolean);
  const description = [open, body, extra.join(' '), 'للتفاصيل والمعاينة يُرجى التواصل.'].filter(Boolean).join('\n\n');
  return { title, description };
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

export function realizeListing(input: SurfaceInput): SurfaceOutput {
  const subject = subjectOf(input.facts, input.categorySlug, input.subcategorySlug, input.raw);
  const intent = intentOf(input.raw, input.categorySlug);
  const place = placeOf(input.facts, input.city, input.raw);
  const surface = compose(subject, intent, place, input.facts, input.raw);
  const banned = BANNED.find((phrase) => surface.title.includes(phrase) || surface.description.includes(phrase));
  if (banned) {
    return {
      title: `${subject} ${intent}${place ? ` في ${place}` : ''}`,
      description: `${subject} ${intent}${place ? ` في ${place}` : ''}.\n\nللتواصل عبر الإعلان.`,
    };
  }
  return surface;
}
