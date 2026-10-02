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

function countOf(value: string | undefined): number {
  if (!value) return 0;
  if (value === 'غرفتين' || value === 'حمامين') return 2;
  const digit = Number(value);
  return Number.isFinite(digit) ? digit : 0;
}

function bedPhrase(value: string | undefined): string {
  const count = countOf(value);
  if (count === 1) return 'غرفة نوم واحدة';
  if (count === 2) return 'غرفتا نوم';
  return count ? `${count} غرف نوم` : '';
}

function bathPhrase(value: string | undefined): string {
  const count = countOf(value);
  if (count === 1) return 'حمام واحد';
  if (count === 2) return 'حمامان';
  return count ? `${count} حمامات` : '';
}

function featureLines(facts: Facts): string[] {
  const rooms = countOf(facts.rooms);
  const lines = [
    facts.balcony ? 'بلكونة تفتح على واجهة هادئة وتمنح تهوية طبيعية.' : '',
    facts.living ? 'صالة معيشة منفصلة عن غرف النوم.' : '',
    facts.floor ? `الطابق ${facts.floor} يوفر وصولاً سهلاً.` : '',
    facts.area && Number(facts.area) >= 100 ? `مساحة ${facts.area} م² تكفي عائلة متوسطة.` : '',
    rooms >= 3 ? `${rooms} غرف نوم تكفي عائلة بأطفال.` : '',
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
    const bits = [bedPhrase(facts.rooms), bathPhrase(facts.bathrooms), facts.area ? `${facts.area} م²` : ''].filter(Boolean);
    return `شقة ${facts.intent}${place}${bits.length ? ` — ${bits.join('، ')}` : ''}`;
  },
  opening: (facts, seed) => {
    const place = facts.place ? `في ${facts.place}` : '';
    const floor = facts.floor ? `في الطابق ${facts.floor}` : '';
    const where = [place, floor].filter(Boolean).join('، ');
    const leads = ['تقع الشقة', 'تتوزع الشقة', 'تأتي الشقة'];
    const first = where ? `${pick(seed, leads, 1)} ${where}.` : `${pick(seed, leads, 1)}.`;
    const bits = [facts.living ? 'غرفة معيشة' : '', facts.balcony ? 'بلكونة' : ''].filter(Boolean);
    const second = bits.length ? ` تتكون من ${bits.join(' و')}.` : '';
    return `${first}${second}`;
  },
  composition: () => null,
  details: (facts) => {
    const lines = [
      facts.rooms ? `عدد غرف النوم: ${bedPhrase(facts.rooms)}.` : '',
      facts.bathrooms ? `عدد الحمامات: ${bathPhrase(facts.bathrooms)}.` : '',
      facts.area ? `المساحة: ${facts.area} م².` : '',
      facts.floor ? `الطابق: ${facts.floor}.` : '',
      facts.living ? 'المعيشة: صالة معيشة.' : '',
      facts.balcony ? 'الملحقات: بلكونة.' : '',
    ].filter(Boolean);
    return lines.length ? `🔹 تفاصيل الوحدة:\n${lines.map((line) => `• ${line}`).join('\n')}` : null;
  },
  features: (facts) => {
    const lines = featureLines(facts);
    return lines.length ? `🔹 أبرز المميزات:\n${lines.map((line) => `• ${line}`).join('\n')}` : null;
  },
  close: (seed) => pick(seed, CLOSES, 7),
};
