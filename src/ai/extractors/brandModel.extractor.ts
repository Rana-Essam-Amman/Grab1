import { MOTOR_BRANDS } from '@/data/brands/motors';
import { TECH_BRANDS } from '@/data/brands/tech';
import { EXTRAS_BRANDS } from '@/data/brands/extras';
import { normalizeArabic } from '@/data/arabicNormalize';

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
  normalizedTerm: string;
  makeAr: string;
  modelAr?: string;
}

function buildFlat(brands: readonly BrandEntry[]): FlatEntry[] {
  const out: FlatEntry[] = [];
  for (const b of brands) {
    const makeAr = b.nameAr || b.ar || b.en;
    // brand term
    out.push({
      normalizedTerm: normalizeArabic(makeAr).toLowerCase(),
      makeAr,
    });
    out.push({
      normalizedTerm: normalizeArabic(b.en).toLowerCase(),
      makeAr,
    });
    // model terms
    for (const [mAr] of b.models) {
      out.push({
        normalizedTerm: normalizeArabic(mAr).toLowerCase(),
        makeAr,
        modelAr: mAr,
      });
    }
  }
  return out.sort((a, b) => b.normalizedTerm.length - a.normalizedTerm.length);
}

const MOTORS_FLAT = buildFlat(MOTOR_BRANDS as unknown as BrandEntry[]);

// TECH_BRANDS is Record<string, Brand[]>
const TECH_FLAT = buildFlat(
  Object.values(TECH_BRANDS).flat() as unknown as BrandEntry[]
);
const EXTRAS_FLAT = buildFlat(EXTRAS_BRANDS as unknown as BrandEntry[]);

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
  return (
    findInDict(text, MOTORS_FLAT) ||
    findInDict(text, TECH_FLAT) ||
    findInDict(text, EXTRAS_FLAT)
  );
}
