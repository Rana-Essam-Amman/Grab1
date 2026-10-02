import type { Facts, Listing } from './types';
import { extractFacts, joinAr } from './packs/extract';
import { assertGuarded } from './guard';
import { fingerprint } from './fingerprint';
import { advance, seedOf } from './seeded';

const VERSION = 'v3.1';
const cache = new Map<string, Listing>();
const seen = new Map<string, string>();

function title(facts: Facts): string {
  const place = facts.place ? ` في ${facts.place}` : '';
  return `${facts.subject} ${facts.intent}${place}`;
}

function composition(facts: Facts): string | null {
  const bits = [
    facts.rooms ? `${facts.rooms} غرف نوم` : '',
    facts.bathrooms ? `${facts.bathrooms} حمامات` : '',
    facts.living ? 'غرفة معيشة' : '',
    facts.balcony ? 'بلكونة' : '',
    facts.year ? `سنة ${facts.year}` : '',
    facts.km ? `عداد ${facts.km} كم` : '',
    facts.storage ? `سعة ${facts.storage}` : '',
  ].filter(Boolean);
  if (!bits.length) return null;
  const verb = facts.subject === 'شقة' || facts.subject === 'فيلا' ? 'تتكون من' : 'فيها';
  return `${verb} ${joinAr(bits)}.`;
}

function details(facts: Facts): string | null {
  const bits = [
    facts.area ? `المساحة ${facts.area} م²` : '',
    facts.floor ? `الطابق ${facts.floor}` : '',
    facts.priceLabel ? `السعر ${facts.priceLabel}` : '',
  ].filter(Boolean);
  return bits.length ? bits.join('، ') + '.' : null;
}

function opening(facts: Facts): string {
  const place = facts.place ? ` في ${facts.place}` : '';
  return `${facts.subject} ${facts.intent}${place}.`;
}

export function realize(userId: string, draft: string, categorySlug: string, subcategorySlug: string, attempt: number): Listing {
  const facts = extractFacts(draft, categorySlug, subcategorySlug);
  const seed = advance(seedOf(userId, draft, VERSION), attempt);
  const planId = (['prose', 'compact', 'minimal'] as const)[seed % 3];
  const parts = [opening(facts)];
  if (planId !== 'compact') {
    const line = composition(facts);
    if (line) parts.push(line);
  }
  if (planId !== 'minimal') {
    const line = details(facts);
    if (line) parts.push(line);
  }
  const close = {
    prose: 'للتفاصيل والمعاينة يُرجى التواصل.',
    compact: 'المعاينة بالتنسيق عبر الإعلان.',
    minimal: 'للاستفسار يُرجى التواصل عبر الإعلان.',
  }[planId];
  parts.push(close);
  const listing: Listing = {
    title: title(facts),
    description: parts.join('\n\n'),
    planId,
    seed,
    fingerprint: '',
    facts,
  };
  const text = `${listing.title}\n${listing.description}`;
  assertGuarded(text, facts.traced);
  return { ...listing, fingerprint: fingerprint(listing.title, listing.description) };
}

export function generate(input: {
  userId: string;
  draft: string;
  categorySlug: string;
  subcategorySlug: string;
}): Listing {
  const key = `${input.userId}|${input.draft.trim()}|${input.categorySlug}|${input.subcategorySlug}`;
  const cached = cache.get(key);
  if (cached) return cached;
  let last = 'guard';
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const listing = realize(input.userId, input.draft, input.categorySlug, input.subcategorySlug, attempt);
      const owner = seen.get(listing.fingerprint);
      if (owner && owner !== key) {
        last = 'collision';
        continue;
      }
      seen.set(listing.fingerprint, key);
      cache.set(key, listing);
      return listing;
    } catch (error) {
      last = error instanceof Error ? error.message : 'guard';
    }
  }
  throw new Error(last);
}
