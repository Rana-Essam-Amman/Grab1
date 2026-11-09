import type { OpensooqCity, OpensooqArea } from './types';
import { EXTRA_CITIES, EXTRA_AREAS } from './extraAreas';
import { SA_OPENSOOQ_CITIES } from './SA';
import { PS_OPENSOOQ_CITIES } from './PS';
import { LB_OPENSOOQ_CITIES } from './LB';
import { SY_OPENSOOQ_CITIES } from './SY';
import { KW_OPENSOOQ_CITIES } from './KW';

export type { OpensooqArea, OpensooqCity } from './types';

const MAP: Record<string, readonly OpensooqCity[]> = {
  SA: SA_OPENSOOQ_CITIES,
  PS: PS_OPENSOOQ_CITIES,
  LB: LB_OPENSOOQ_CITIES,
  SY: SY_OPENSOOQ_CITIES,
  KW: KW_OPENSOOQ_CITIES,
};

export function hasOpensooqData(countryCode: string): boolean {
  return countryCode in MAP && MAP[countryCode].length > 0;
}

export function getOpensooqCities(countryCode: string): readonly OpensooqCity[] {
  return MAP[countryCode] ?? [];
}

export function getOpensooqCity(countryCode: string, citySlug: string): OpensooqCity | null {
  return (MAP[countryCode] ?? []).find(c => c.slug === citySlug) ?? null;
}

export function getAllOpensooqCities(countryCode: string): readonly OpensooqCity[] {
  const base = MAP[countryCode] ?? [];
  const extras = EXTRA_CITIES[countryCode] ?? [];
  return [...base, ...extras];
}

export function getAllOpensooqCity(countryCode: string, slug: string): OpensooqCity | null {
  return getAllOpensooqCities(countryCode).find(c => c.slug === slug) ?? null;
}

export function getAllOpensooqAreas(countryCode: string, citySlug: string): readonly OpensooqArea[] {
  const city = getAllOpensooqCity(countryCode, citySlug);
  if (!city) return [];
  const extras = (EXTRA_AREAS[countryCode] ?? {})[citySlug] ?? [];
  // Dedupe by normalized nameAr
  const seen = new Set<string>();
  const merged: OpensooqArea[] = [];
  for (const a of [...city.areas, ...extras]) {
    const k = a.nameAr.trim();
    if (!seen.has(k)) { seen.add(k); merged.push(a); }
  }
  return merged;
}
