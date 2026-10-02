import { collapse, normalize } from './normalize';

export interface ResolvedLocation {
  readonly district: string;
  readonly city: string;
  readonly lat: number;
  readonly lng: number;
}

type District = { readonly name: string; readonly lat: number; readonly lng: number };
type Market = Record<string, readonly District[]>;

const REGISTRY: Record<string, Market> = {
  JO: {
    عمان: [
      { name: 'شفا بدران', lat: 32.0066, lng: 35.9038 },
      { name: 'أبو نصير', lat: 32.0472, lng: 35.9284 },
      { name: 'عبدون', lat: 31.9494, lng: 35.8902 },
      { name: 'الدوار السابع', lat: 31.9598, lng: 35.8697 },
      { name: 'طريق المطار', lat: 31.9124, lng: 35.9611 },
      { name: 'خلدا', lat: 31.9891, lng: 35.8416 },
      { name: 'الجبيهة', lat: 32.0254, lng: 35.8708 },
      { name: 'صويلح', lat: 32.0188, lng: 35.8342 },
      { name: 'مرج الحمام', lat: 31.9033, lng: 35.8744 },
      { name: 'دابوق', lat: 31.9898, lng: 35.8186 },
      { name: 'تلاع العلي', lat: 31.9842, lng: 35.8641 },
      { name: 'العبدلي', lat: 31.9632, lng: 35.9088 },
    ],
    الزرقاء: [{ name: 'الزرقاء الجديدة', lat: 32.0728, lng: 36.0942 }],
    اربد: [{ name: 'اربد', lat: 32.5556, lng: 35.85 }],
  },
  LB: {
    بيروت: [
      { name: 'الأشرفية', lat: 33.8869, lng: 35.5215 },
      { name: 'الحمرا', lat: 33.8961, lng: 35.4828 },
    ],
  },
  PS: {
    'رام الله': [{ name: 'رام الله', lat: 31.9038, lng: 35.2034 }],
    نابلس: [{ name: 'نابلس', lat: 32.2211, lng: 35.2544 }],
    الخليل: [{ name: 'الخليل', lat: 31.5326, lng: 35.0998 }],
  },
  SY: {
    دمشق: [
      { name: 'المزة', lat: 33.5022, lng: 36.2461 },
      { name: 'كفرسوسة', lat: 33.4944, lng: 36.2708 },
    ],
  },
  SA: {
    الرياض: [{ name: 'العليا', lat: 24.694, lng: 46.685 }],
    جدة: [{ name: 'الروضة', lat: 21.561, lng: 39.165 }],
  },
};

const INDEX: Array<ResolvedLocation & { key: string }> = [];
for (const market of Object.values(REGISTRY)) {
  for (const [city, districts] of Object.entries(market)) {
    for (const district of districts) {
      INDEX.push({ key: collapse(district.name), district: district.name, city, lat: district.lat, lng: district.lng });
      INDEX.push({ key: collapse(city), district: district.name, city, lat: district.lat, lng: district.lng });
    }
  }
}

export function resolveLocation(draft: string): ResolvedLocation | null {
  const folded = collapse(draft);
  const hit = INDEX.find((item) => folded.includes(item.key) && item.key.length > 3);
  if (!hit) return null;
  return { district: hit.district, city: hit.city, lat: hit.lat, lng: hit.lng };
}

export function isApprovedPlace(name: string): boolean {
  const key = collapse(name);
  return INDEX.some((item) => item.key === key || normalize(item.district) === normalize(name));
}
