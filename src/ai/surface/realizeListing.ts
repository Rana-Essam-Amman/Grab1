import type { ListingFacts } from '../../types';

/**
 * Fact-bound listing surface for every category and subcategory.
 * States only extracted facts. Variation is seeded. No paid model.
 */

const PACK_VERSION = '2026.10.1';

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
  if (typeof facts.city === 'string' && facts.city) return facts.city;
  if (city && city !== 'المدينة') return city;
  const match = raw.match(/في\s+([\u0600-\u06FF]+(?:\s[\u0600-\u06FF]+)?)/);
  if (!match) return '';
  const place = match[1].replace(/مساحه|مساحة|مكونة|مكونه|طابق.*/, '').trim();
  return place;
}

function detailLines(facts: ListingFacts, raw: string): string[] {
  const lines: string[] = [];
  const add = (label: string, value: string | undefined) => {
    if (value) lines.push(`${label}: ${value}.`);
  };
  if (typeof facts.area === 'string') add('المساحة', `${facts.area} م²`);
  if (typeof facts.rooms === 'string') add('غرف النوم', facts.rooms);
  if (typeof facts.bathrooms === 'string') add('الحمامات', facts.bathrooms);
  if (typeof facts.floor === 'string') add('الطابق', facts.floor);
  if (/بلكون|شرفة/.test(raw)) lines.push('بلكونة.');
  if (typeof facts.year === 'string') add('السنة', facts.year);
  if (typeof facts.km === 'string') add('العداد', `${facts.km} كم`);
  if (typeof facts.fuel === 'string') add('الوقود', facts.fuel);
  if (typeof facts.transmission === 'string') add('القير', facts.transmission);
  if (typeof facts.storage === 'string') add('السعة', facts.storage);
  if (typeof facts.condition === 'string') add('الحالة', facts.condition);
  if (typeof facts.color === 'string') add('اللون', facts.color);
  if (typeof facts.size === 'string') add('المقاس', facts.size);
  if (typeof facts.material === 'string') add('الخامة', facts.material);
  if (typeof facts.seats === 'string') add('المقاعد', facts.seats);
  if (typeof facts.experience === 'string') add('الخبرة', facts.experience);
  if (typeof facts.price === 'string' && facts.price !== facts.area) add('السعر', facts.price);
  return lines;
}

function compose(seed: number, subject: string, intent: string, place: string, lines: string[]): SurfaceOutput {
  const placeBit = place ? ` في ${place}` : '';
  const hint = lines.slice(0, 2).map((line) => line.replace(/\.$/, '')).join('، ');
  const titles = [
    `${subject} ${intent}${placeBit}`,
    place ? `${subject} ${intent} — ${place}` : `${subject} ${intent}`,
    hint ? `${subject} ${intent}${placeBit} — ${hint}` : `${subject} ${intent}${placeBit}`,
  ];
  const opens = [
    `${subject} ${intent}${placeBit}.`,
    place ? `${subject}${placeBit}، ${intent}.` : `${subject} ${intent}.`,
    `${intent}: ${subject}${placeBit}.`,
  ];
  const closes = [
    'للتفاصيل والمعاينة يُرجى التواصل.',
    'المعاينة بالتنسيق عبر الإعلان.',
    'للاستفسار يُرجى التواصل عبر الإعلان.',
  ];
  const title = pick(seed, titles, 1);
  const open = pick(seed, opens, 3);
  const close = pick(seed, closes, 5);
  const ordered = [...lines];
  const shift = seed % Math.max(ordered.length, 1);
  const rotated = ordered.slice(shift).concat(ordered.slice(0, shift));
  const plan = seed % 3;
  let description = open;
  if (plan === 0 && rotated.length) {
    description += `\n\nالتفاصيل:\n${rotated.map((line) => `• ${line}`).join('\n')}`;
  } else if (plan === 1 && rotated.length) {
    description += `\n\n${rotated.join(' ')}`;
  } else if (rotated.length) {
    description += `\n\n${rotated.slice(0, 3).join(' ')}`;
  }
  description += `\n\n${close}`;
  return { title, description };
}

export function realizeListing(input: SurfaceInput): SurfaceOutput {
  const subject = subjectOf(input.facts, input.categorySlug, input.subcategorySlug);
  const intent = intentOf(input.raw, input.categorySlug);
  const place = placeOf(input.facts, input.city, input.raw);
  const lines = detailLines(input.facts, input.raw);
  const seed = hash(`${input.sellerId}|${input.raw.trim()}|${input.categorySlug}|${input.subcategorySlug}|${PACK_VERSION}`);
  const surface = compose(seed, subject, intent, place, lines);
  const banned = BANNED.find((phrase) => surface.title.includes(phrase) || surface.description.includes(phrase));
  if (banned) {
    return {
      title: `${subject} ${intent}${place ? ` في ${place}` : ''}`,
      description: `${subject} ${intent}${place ? ` في ${place}` : ''}.\n\n${lines.join('\n')}\n\nللتواصل عبر الإعلان.`.trim(),
    };
  }
  return surface;
}
