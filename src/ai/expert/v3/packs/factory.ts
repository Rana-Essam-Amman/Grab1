import type { Facts } from '../types';
import { resolveLocation } from '../locations';
import { pick } from '../seeded';
import type { Pack } from './apartments';

export interface PackSpec {
  readonly id: string;
  readonly noun: string;
  readonly detect: RegExp;
  readonly allowRooms?: boolean;
  readonly allowBaths?: boolean;
  readonly allowFloor?: boolean;
  readonly allowArea?: boolean;
  readonly flags?: Readonly<Record<string, RegExp>>;
}

export function makePack(spec: PackSpec): Pack {
  return {
    id: spec.id,
    detect: (text) => spec.detect.test(text),
    extract: (text) => extract(spec, text),
    title: (facts) => title(spec, facts),
    opening: (facts, seed) => opening(spec, facts, seed),
    composition: () => null,
    details: (facts) => details(spec, facts),
    features: (facts) => features(spec, facts),
    close: (seed) => pick(seed, CLOSES, 3),
  };
}

const CLOSES = [
  'للتفاصيل والمعاينة يُرجى التواصل.',
  'المعاينة بالتنسيق عبر الإعلان.',
  'للاستفسار يُرجى التواصل عبر الإعلان.',
  'الرجاء التواصل عبر الإعلان لتحديد المعاينة.',
];

function extract(spec: PackSpec, text: string): Facts {
  const location = resolveLocation(text);
  const area = spec.allowArea === false ? undefined : text.match(/(\d{1,4})\s*(?:متر|م(?![\u0621-\u064A]))/)?.[1];
  const rooms = spec.allowRooms ? text.match(/(\d{1,2})\s*(?:نوم|غرف)/)?.[1] : undefined;
  const bathrooms = spec.allowBaths ? text.match(/(\d{1,2})\s*حمام/)?.[1] : undefined;
  const flags = Object.fromEntries(Object.entries(spec.flags ?? {}).filter(([, re]) => re.test(text)).map(([key]) => [key, '1']));
  return {
    subject: spec.noun,
    intent: /ايجار|للإيجار/.test(text) ? 'للإيجار' : 'للبيع',
    place: location?.district,
    city: location?.city,
    district: location?.district,
    lat: location?.lat,
    lng: location?.lng,
    area,
    rooms,
    bathrooms,
    extras: Object.keys(flags),
    traced: [area, rooms, bathrooms].filter((value): value is string => Boolean(value)),
  };
}

function title(spec: PackSpec, facts: Facts): string {
  const place = facts.place ? ` في ${facts.place}` : '';
  const bits = [facts.area ? `${facts.area} م²` : '', facts.rooms ? `${facts.rooms} غرف` : ''].filter(Boolean);
  return `${spec.noun} ${facts.intent}${place}${bits.length ? ` — ${bits.join('، ')}` : ''}`;
}

function opening(spec: PackSpec, facts: Facts, seed: number): string {
  const place = facts.place ? `في ${facts.place}` : '';
  const lead = pick(seed, [`تقع ${spec.noun}`, `تتوزع ${spec.noun}`, `تأتي ${spec.noun}`], 1);
  return place ? `${lead} ${place}.` : `${lead}.`;
}

function details(spec: PackSpec, facts: Facts): string | null {
  const lines = [
    facts.area ? `المساحة: ${facts.area} م².` : '',
    facts.rooms ? `الغرف: ${facts.rooms}.` : '',
    facts.bathrooms ? `الحمامات: ${facts.bathrooms}.` : '',
    ...facts.extras.map((item) => `${item} ضمن الوصف.`),
  ].filter(Boolean);
  return lines.length ? `🔹 تفاصيل ${spec.noun}:\n${lines.map((line) => `• ${line}`).join('\n')}` : null;
}

function features(spec: PackSpec, facts: Facts): string | null {
  const lines = [
    facts.area ? `المساحة ${facts.area} م² تعطي مرونة في الاستخدام.` : '',
    facts.extras.includes('حديقة') ? 'حديقة مذكورة ضمن العقار.' : '',
    facts.extras.includes('مسبح') ? 'مسبح مذكور ضمن العقار.' : '',
    facts.extras.includes('إطلالة') ? 'الإطلالة مذكورة في وصف البائع.' : '',
  ].filter(Boolean);
  return lines.length ? `🔹 أبرز المميزات:\n${lines.map((line) => `• ${line}`).join('\n')}` : null;
}
