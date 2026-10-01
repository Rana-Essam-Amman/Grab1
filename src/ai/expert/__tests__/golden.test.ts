import { describe, it, expect } from 'vitest';
import { extractFacts } from '@/ai/listingCopyAgent';
import { normalizeArabic } from '@/data/arabicNormalize';
import { GOLDEN_CASES } from './golden-cases';

function norm(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return normalizeArabic(String(v)).toLowerCase().trim();
}

const KEY_ALIASES: Record<string, string> = {
  trans: 'transmission',
  exp: 'experience',
  breed: 'petBreed',
  age: 'kidsAge',
  brand: 'make',
};

function resolveKey(k: string): string {
  return KEY_ALIASES[k] ?? k;
}

function tolerantMatch(key: string, eN: string, aN: string): boolean {
  if (eN === aN) return true;
  if (key === 'storage' && /^\d+$/.test(eN) && aN.startsWith(eN)) return true;
  if (key === 'floor') {
    if ((eN === 'أرضي' || eN === 'ارضي') && aN === '0') return true;
    if (eN === 'روف' && aN === 'roof') return true;
    if (eN === 'روف' && aN === 'روف') return true;
  }
  return false;
}

describe('Golden cases — extraction', () => {
  for (const gc of GOLDEN_CASES) {
    it(`${gc.id} — ${gc.input.slice(0, 40)}`, () => {
      const facts = extractFacts(gc.input) as Record<string, unknown>;
      const failures: string[] = [];
      for (const [rawKey, expectedVal] of Object.entries(gc.expectedFacts)) {
        const key = resolveKey(rawKey);
        const actual = facts[key];
        const eN = norm(expectedVal);
        const aN = norm(actual);
        if (!tolerantMatch(key, eN, aN)) {
          failures.push(`${key}: expected "${eN}" | got "${aN}"`);
        }
      }
      expect(failures, failures.join(' || ')).toEqual([]);
    });
  }
});
