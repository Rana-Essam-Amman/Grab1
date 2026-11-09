import type { OpensooqCity } from './types';
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
