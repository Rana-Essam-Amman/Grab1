import { MOTOR_BRANDS } from '@/data/brands/motors';
import { TECH_BRANDS } from '@/data/brands/tech';
import { EXTRAS_BRANDS } from '@/data/brands/extras';
import { normalizeArabic } from '@/data/arabicNormalize';
import { fuzzyFindCanonical } from '../lib/fuzzyMatch';

interface BrandEntry {
  nameAr: string;
  ar?: string;
  en: string;
  models: Array<[string, string]>;
}

interface BrandModel {
  make: string;
  model?: string;
}

// Flatten dictionaries once. Match BOTH model name and brand name.
// Longer strings first to prevent partial matches.
interface FlatEntry {
  term: string;
  canonical: string;
  normalizedTerm: string;
  makeAr: string;
  modelAr?: string;
}

function buildFlat(brands: readonly BrandEntry[]): FlatEntry[] {
  const out: FlatEntry[] = [];
  for (const b of brands) {
    const makeAr = b.nameAr || b.ar || b.en;
    const normMakeAr = normalizeArabic(makeAr).toLowerCase();
    const normEn = normalizeArabic(b.en).toLowerCase();
    // brand term
    out.push({
      term: normMakeAr,
      canonical: makeAr,
      normalizedTerm: normMakeAr,
      makeAr,
    });
    out.push({
      term: normEn,
      canonical: makeAr,
      normalizedTerm: normEn,
      makeAr,
    });
    // model terms
    for (const [mAr] of b.models) {
      const normMAr = normalizeArabic(mAr).toLowerCase();
      out.push({
        term: normMAr,
        canonical: makeAr,
        normalizedTerm: normMAr,
        makeAr,
        modelAr: mAr,
      });
    }
  }
  return out.sort((a, b) => b.normalizedTerm.length - a.normalizedTerm.length);
}

// Single merged dictionary. Longest term wins — this prevents short models
// like "ايفون 13" from shadowing longer ones like "ايفون 13 برو".
const MERGED_FLAT = buildFlat([
  ...(MOTOR_BRANDS as unknown as BrandEntry[]),
  ...(Object.values(TECH_BRANDS).flat() as unknown as BrandEntry[]),
  ...(EXTRAS_BRANDS as unknown as BrandEntry[]),
]);

function findInDict(
  text: string,
  dict: readonly FlatEntry[]
): BrandModel | undefined {
  const t = normalizeArabic(text).toLowerCase();

  // Pass 1: prefer MODEL matches (return both make + model)
  for (const entry of dict) {
    if (!entry.modelAr) continue;
    if (!entry.normalizedTerm) continue;
    if (/^\d+$/.test(entry.normalizedTerm)) continue;
    if (t.includes(entry.normalizedTerm)) {
      return { make: entry.makeAr, model: entry.modelAr };
    }
  }

  // Pass 2: fall back to BRAND only
  for (const entry of dict) {
    if (entry.modelAr) continue;
    if (!entry.normalizedTerm) continue;
    if (/^\d+$/.test(entry.normalizedTerm)) continue;
    if (t.includes(entry.normalizedTerm)) {
      return { make: entry.makeAr };
    }
  }

  return undefined;
}

/**
 * Extract brand + model from text using local dictionaries.
 * Priority: motors first (larger market), then tech.
 * Returns ONLY if a match is found — never guesses.
 */
export function extractBrandModel(text: string): BrandModel | undefined {
  if (!text) return undefined;

  // Fast path: exact substring match (current behaviour).
  const exact = findInDict(text, MERGED_FLAT);
  if (exact) return exact;

  // Fuzzy fallback: tolerate 1-2 character Arabic typos (كامرى, هونداى...).
  const canonical = fuzzyFindCanonical(text, MERGED_FLAT);
  if (!canonical) return undefined;

  // Resolve back to { make, model } by finding the matched entry.
  const normHay = normalizeArabic(text).toLowerCase();
  for (const entry of MERGED_FLAT) {
    if (entry.makeAr !== canonical) continue;
    if (entry.modelAr && normHay.includes(entry.normalizedTerm)) {
      return { make: entry.makeAr, model: entry.modelAr };
    }
  }
  return { make: canonical };
}
