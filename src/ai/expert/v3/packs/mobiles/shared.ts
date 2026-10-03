import type { Facts } from '../../types';
import { resolveLocation } from '../../locations';
import { pick } from '../../seeded';
import type { Pack } from '../apartments';

export const CLOSES = [
  'للاستفسار والمعاينة، تواصل عبر الإعلان.',
  'للمعاينة يُرجى التواصل عبر الإعلان.',
  'الزيارة والمعاينة بالتنسيق عبر الإعلان.',
  'للاستفسار أو المعاينة، تواصل عبر الإعلان.',
];

export interface MobileSpec {
  readonly id: string;
  readonly noun: string;
  readonly detect: RegExp;
  readonly brands: readonly string[];
}

export function mobileFacts(spec: MobileSpec, text: string): Facts {
  const location = resolveLocation(text);
  const brand = spec.brands.find((item) => text.toLowerCase().includes(item.toLowerCase()));
  const storage = text.match(/(\d+)\s*(?:جيجا|جيجابايت|gb)/i)?.[1];
  const color = text.match(/لون\s+([\u0600-\u06FF]+)/)?.[1];
  const battery = text.match(/بطارية\s*(\d+)?/)?.[1];
  const screen = text.match(/(\d+(?:\.\d+)?)\s*إنش/)?.[1];
  const price = text.match(/(?:بسعر|سعر)\s*(\d+)/)?.[1];
  const condition = /جديد/.test(text) ? 'جديد' : /مستعمل/.test(text) ? 'مستعمل' : undefined;
  const extras = [
    color ? `لون ${color}` : '',
    condition || '',
    /ضمان/.test(text) ? 'ضمان' : '',
    /مقاوم/.test(text) ? 'مقاومة ماء' : '',
    battery ? `بطارية ${battery}` : '',
    screen ? `شاشة ${screen}` : '',
  ].filter(Boolean);
  return {
    subject: brand || spec.noun,
    intent: 'للبيع',
    place: location?.district,
    city: location?.city,
    district: location?.district,
    lat: location?.lat,
    lng: location?.lng,
    storage,
    price,
    priceLabel: price,
    extras,
    traced: [storage, battery, screen, price].filter((value): value is string => Boolean(value)),
  };
}

export function bullets(header: string, lines: readonly string[]): string | null {
  const ready = lines.filter(Boolean);
  return ready.length ? `${header}\n${ready.map((line) => `• ${line}`).join('\n')}` : null;
}

export function closeOf(seed: number): string {
  return pick(seed, CLOSES, 4);
}

export function packOf(spec: MobileSpec, body: Omit<Pack, 'id' | 'detect' | 'extract' | 'close'>): Pack {
  return {
    id: spec.id,
    detect: (text) => spec.detect.test(text),
    extract: (text) => mobileFacts(spec, text),
    close: closeOf,
    ...body,
  };
}
