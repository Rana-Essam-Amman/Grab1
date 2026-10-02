import type { Facts } from '../types';
import { resolveLocation } from '../locations';
import { pick } from '../seeded';
import type { Pack } from './apartments';

export interface GoodsSpec {
  readonly id: string;
  readonly noun: string;
  readonly detect: RegExp;
  readonly brands?: readonly string[];
}

export function goodsPack(spec: GoodsSpec): Pack {
  return {
    id: spec.id,
    detect: (text) => spec.detect.test(text),
    extract: (text) => extractGoods(spec, text),
    title: (facts) => titleOf(spec, facts),
    opening: (facts, seed) => openingOf(spec, facts, seed),
    composition: () => null,
    details: (facts) => detailsOf(spec, facts),
    features: (facts) => featuresOf(facts),
    close: (seed) => pick(seed, CLOSES, 2),
  };
}

const CLOSES = [
  'للتفاصيل والمعاينة يُرجى التواصل.',
  'المعاينة بالتنسيق عبر الإعلان.',
  'للاستفسار يُرجى التواصل عبر الإعلان.',
  'الرجاء التواصل عبر الإعلان لتحديد المعاينة.',
];

function extractGoods(spec: GoodsSpec, text: string): Facts {
  const location = resolveLocation(text);
  const brand = spec.brands?.find((item) => text.toLowerCase().includes(item.toLowerCase()));
  const storage = text.match(/(\d+)\s*(?:جيجا|جيجابايت|gb)/i)?.[1];
  const color = text.match(/لون\s+([\u0600-\u06FF]+)/)?.[1];
  return {
    subject: brand || spec.noun,
    intent: /ايجار/.test(text) ? 'للإيجار' : 'للبيع',
    place: location?.district,
    city: location?.city,
    district: location?.district,
    lat: location?.lat,
    lng: location?.lng,
    storage,
    extras: [color ? `لون ${color}` : '', /جديد/.test(text) ? 'جديد' : '', /ضمان/.test(text) ? 'ضمان' : ''].filter(Boolean),
    traced: [storage].filter((value): value is string => Boolean(value)),
  };
}

function titleOf(spec: GoodsSpec, facts: Facts): string {
  const place = facts.place ? ` في ${facts.place}` : '';
  const storage = facts.storage ? ` — ${facts.storage} جيجا` : '';
  return `${facts.subject || spec.noun} ${facts.intent}${place}${storage}`;
}

function openingOf(spec: GoodsSpec, facts: Facts, seed: number): string {
  const place = facts.place ? ` في ${facts.place}` : '';
  const leads = [`${spec.noun} معروض${place}.`, `هذا ${spec.noun} متاح${place}.`, `${spec.noun} جاهز للمعاينة${place}.`];
  return pick(seed, leads, 1);
}

function detailsOf(spec: GoodsSpec, facts: Facts): string | null {
  const lines = [
    `النوع: ${spec.noun}.`,
    facts.storage ? `السعة: ${facts.storage} جيجا.` : '',
    ...facts.extras.map((item) => `${item}.`),
  ].filter(Boolean);
  return `🔹 التفاصيل:\n${lines.map((line) => `• ${line}`).join('\n')}`;
}

function featuresOf(facts: Facts): string | null {
  const lines = [
    facts.storage ? `سعة ${facts.storage} جيجا تكفي للاستخدام اليومي.` : '',
    facts.extras.includes('ضمان') ? 'الضمان مذكور في وصف البائع.' : '',
    facts.extras.includes('جديد') ? 'الحالة مذكورة كجديدة في الجملة.' : '',
  ].filter(Boolean);
  return lines.length ? `🔹 أبرز المميزات:\n${lines.map((line) => `• ${line}`).join('\n')}` : null;
}
