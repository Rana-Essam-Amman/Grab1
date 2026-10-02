import type { Facts } from '../types';
import { resolveLocation } from '../locations';

const NOUN: Record<string, string> = {
  motors: 'مركبة', cars: 'سيارة', motorbikes: 'دراجة', heavy: 'شاحنة', plates: 'لوحة', parts: 'قطعة غيار', boats: 'قارب',
  'real-estate': 'عقار', 'for-sale': 'شقة', 'for-rent': 'شقة', commercial: 'محل', lands: 'أرض', chalets: 'شاليه', foreign: 'عقار',
  mobiles: 'جوال', phones: 'جوال', tablets: 'تابلت', 'smart-watches': 'ساعة', numbers: 'رقم',
  watches: 'ساعة', luxury: 'ساعة', everyday: 'ساعة', 'vintage-watch': 'ساعة', straps: 'سوار',
  computers: 'جهاز', laptops: 'لابتوب', desktops: 'كمبيوتر',
  electronics: 'جهاز', furniture: 'قطعة أثاث', fashion: 'قطعة', services: 'خدمة', jobs: 'وظيفة',
  kids: 'غرض', beauty: 'منتج', pets: 'حيوان', sports: 'غرض', books: 'كتاب', 'home-garden': 'غرض',
  krakeeb: 'غرض', cleaning: 'خدمة تنظيف', handymen: 'خدمة', projects: 'مشروع',
  vacancies: 'وظيفة', cvs: 'سيرة', homes: 'تنظيف منزل',
};

export function subjectOf(draft: string, categorySlug: string, subcategorySlug: string): string {
  if (/شقه|شقة/.test(draft)) return 'شقة';
  if (/فيلا/.test(draft)) return 'فيلا';
  if (/ارض|أرض/.test(draft)) return 'أرض';
  if (/سياره|سيارة/.test(draft)) return 'سيارة';
  if (/ايفون|آيفون/.test(draft)) return 'آيفون';
  if (/جوال|هاتف/.test(draft)) return 'جوال';
  return NOUN[subcategorySlug] || NOUN[categorySlug] || 'غرض';
}

export function intentOf(draft: string, categorySlug: string): string {
  if (/ايجار|للإيجار|للايجار/.test(draft)) return 'للإيجار';
  if (/مطلوب/.test(draft)) return 'مطلوب';
  if (categorySlug === 'jobs') return 'شاغرة';
  if (categorySlug === 'services' || categorySlug === 'cleaning' || categorySlug === 'handymen') return 'متاحة';
  return 'للبيع';
}

export function extractFacts(draft: string, categorySlug: string, subcategorySlug: string): Facts {
  const subject = subjectOf(draft, categorySlug, subcategorySlug);
  const intent = intentOf(draft, categorySlug);
  const location = resolveLocation(draft);
  const area = draft.match(/(\d{1,4})\s*م(?![\u0621-\u064A])/);
  const rooms = draft.match(/(\d{1,2})\s*(?:نوم|غرف)/);
  const baths = draft.match(/(\d{1,2})\s*حمام/);
  const floor = /طابق\s*اول|طابق\s*أول|الطابق\s*الاول|الطابق\s*الأول/.test(draft) ? 'الأول' : undefined;
  const price = draft.match(/(?:بسعر|سعر)\s*(\d+)\s*(الف|ألف)?/);
  const year = draft.match(/\b(19|20)\d{2}\b/);
  const km = draft.match(/(\d+)\s*كم/);
  const storage = draft.match(/(\d+)\s*(جيجا|جيجابايت|gb)/i);
  const traced = [area?.[1], rooms?.[1], baths?.[1], price?.[1], year?.[0], km?.[1], storage?.[1]].filter(Boolean) as string[];
  let priceValue: string | undefined;
  let priceLabel: string | undefined;
  if (price) {
    priceLabel = price[2] ? `${price[1]} ألف` : price[1];
    priceValue = price[2] ? String(Number(price[1]) * 1000) : price[1];
    traced.push(price[1]);
  }
  return {
    subject,
    intent,
    place: location?.district,
    city: location?.city,
    district: location?.district,
    lat: location?.lat,
    lng: location?.lng,
    area: area?.[1],
    rooms: rooms?.[1],
    bathrooms: baths?.[1],
    floor,
    balcony: /بلكون|شرفة/.test(draft),
    living: /معيشة|صالون/.test(draft),
    year: year?.[0],
    km: km?.[1],
    storage: storage ? `${storage[1]} ${storage[2]}` : undefined,
    price: priceValue,
    priceLabel,
    extras: [],
    traced,
  };
}

export function joinAr(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join('، ')}، و${items[items.length - 1]}`;
}
