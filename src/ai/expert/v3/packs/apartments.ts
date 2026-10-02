import type { Facts } from '../types';
import { resolveLocation } from '../locations';
import { pick } from '../seeded';

export interface Pack {
  readonly id: string;
  detect: (text: string) => boolean;
  extract: (text: string) => Facts;
  title: (facts: Facts) => string;
  opening: (facts: Facts, seed: number) => string;
  composition: (facts: Facts) => string | null;
  details: (facts: Facts) => string | null;
  features: (facts: Facts) => string | null;
  close: (seed: number) => string;
}

const CLOSES = [
  'للتفاصيل والمعاينة يُرجى التواصل.',
  'المعاينة بالتنسيق عبر الإعلان.',
  'للاستفسار يُرجى التواصل عبر الإعلان.',
  'الرجاء التواصل عبر الإعلان لتحديد المعاينة.',
];

function roomsOf(text: string): string | undefined {
  const digit = text.match(/(\d{1,2})\s*(?:نوم|غرف)/);
  if (digit) return digit[1];
  if (/غرفتين|غرفتان/.test(text)) return 'غرفتين';
  return undefined;
}

function bathsOf(text: string): string | undefined {
  const digit = text.match(/(\d{1,2})\s*حمام/);
  if (digit) return digit[1];
  if (/حمامين|حمامان/.test(text)) return 'حمامين';
  return undefined;
}

function usedInTitle(facts: Facts): Set<string> {
  const used = new Set<string>();
  if (facts.rooms) used.add('rooms');
  if (facts.bathrooms) used.add('bathrooms');
  if (facts.area) used.add('area');
  return used;
}

function featureLines(facts: Facts): string[] {
  const lines = [
    facts.area && Number(facts.area) >= 100 ? `المساحة ${facts.area} م².` : '',
    facts.balcony ? 'بلكونة ضمن تكوين الشقة.' : '',
    facts.living ? 'غرفة معيشة ضمن تكوين الشقة.' : '',
    facts.floor ? `الطابق ${facts.floor}.` : '',
    facts.rooms && !/^\d+$/.test(facts.rooms) ? `غرف النوم: ${facts.rooms}.` : '',
    facts.bathrooms && !/^\d+$/.test(facts.bathrooms) ? `الحمامات: ${facts.bathrooms}.` : '',
  ].filter(Boolean);
  return lines.slice(0, 4);
}

function floorOf(text: string): string | undefined {
  if (/طابق\s*اول|طابق\s*أول|الطابق\s*الاول|الطابق\s*الأول/.test(text)) return 'الأول';
  if (/طابق\s*ثاني|الطابق\s*الثاني/.test(text)) return 'الثاني';
  if (/طابق\s*ثالث|الطابق\s*الثالث/.test(text)) return 'الثالث';
  if (/طابق\s*رابع|الطابق\s*الرابع/.test(text)) return 'الرابع';
  if (/طابق\s*ارضي|طابق\s*أرضي/.test(text)) return 'الأرضي';
  return undefined;
}

export const apartmentsPack: Pack = {
  id: 'apartments',
  detect: (text) => /شقه|شقة/.test(text),
  extract: (text) => {
    const location = resolveLocation(text);
    const area = text.match(/(\d{1,4})\s*(?:متر|م(?![\u0621-\u064A]))/);
    const rooms = roomsOf(text);
    const bathrooms = bathsOf(text);
    const traced = [area?.[1], rooms, bathrooms].filter((value) => value && /^\d+$/.test(value)) as string[];
    return {
      subject: 'شقة',
      intent: /ايجار|للإيجار|للايجار/.test(text) ? 'للإيجار' : 'للبيع',
      place: location?.district,
      city: location?.city,
      district: location?.district,
      lat: location?.lat,
      lng: location?.lng,
      area: area?.[1],
      rooms,
      bathrooms,
      floor: floorOf(text),
      balcony: /بلكون|شرفة/.test(text),
      living: /معيشة|صالون/.test(text),
      extras: [],
      traced,
    };
  },
  title: (facts) => {
    const place = facts.place ? ` في ${facts.place}` : '';
    const bits = [
      facts.rooms ? (/غرف/.test(facts.rooms) ? facts.rooms : `${facts.rooms} نوم`) : '',
      facts.bathrooms ? (/حمام/.test(facts.bathrooms) ? facts.bathrooms : `${facts.bathrooms} حمام`) : '',
      facts.area ? `${facts.area} م²` : '',
    ].filter(Boolean);
    return `شقة ${facts.intent}${place}${bits.length ? ` — ${bits.join('، ')}` : ''}`;
  },
  opening: (facts, seed) => {
    const floor = facts.floor ? `في الطابق ${facts.floor}` : '';
    const leads = ['تقع الشقة', 'تتوزع الشقة', 'تأتي الشقة'];
    return floor ? `${pick(seed, leads, 1)} ${floor}.` : `${pick(seed, leads, 1)}.`;
  },
  composition: (facts) => {
    const bits = [
      facts.living ? 'غرفة معيشة' : '',
      facts.balcony ? 'بلكونة' : '',
    ].filter(Boolean);
    return bits.length ? `فيها ${bits.join(' و')}.` : null;
  },
  details: (facts) => {
    const used = usedInTitle(facts);
    const lines = [
      !used.has('rooms') && facts.rooms ? `غرف النوم: ${facts.rooms}.` : '',
      !used.has('bathrooms') && facts.bathrooms ? `الحمامات: ${facts.bathrooms}.` : '',
      facts.living ? 'المعيشة: غرفة معيشة.' : '',
      facts.balcony ? 'الملحق: بلكونة.' : '',
      !used.has('area') && facts.area ? `المساحة: ${facts.area} م².` : '',
    ].filter(Boolean);
    return lines.length ? lines.join('\n') : null;
  },
  features: (facts) => {
    const lines = featureLines(facts);
    return lines.length ? `أبرز المميزات:\n${lines.map((line) => `• ${line}`).join('\n')}` : null;
  },
  close: (seed) => pick(seed, CLOSES, 7),
};
