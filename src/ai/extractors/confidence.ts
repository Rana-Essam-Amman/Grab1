import { normalizeArabic } from '@/data/arabicNormalize';

export type Confidence = 'high' | 'medium' | 'low';

/**
 * Keys whose values are produced deterministically by a numeric parser
 * (regex → number). Presence = high confidence.
 */
const NUMERIC_PARSER_KEYS = new Set<string>([
  'price', 'year', 'km', 'area', 'rooms', 'bathrooms',
  'floor', 'storage', 'seats', 'experience',
]);

/**
 * Compute a per-field confidence map from the raw input and extracted facts.
 *
 * Rules:
 *   - Missing / empty / false             → 'low'
 *   - Boolean true                        → 'high'
 *   - Numeric parser key with digits      → 'high' (regex-derived)
 *   - Canonical value appears in raw text → 'high' (exact match)
 *   - Canonical value NOT in raw text     → 'medium' (fuzzy / inferred)
 */
export function computeConfidence(
  raw: string,
  facts: Record<string, unknown>
): Record<string, Confidence> {
  const conf: Record<string, Confidence> = {};
  if (!raw) {
    for (const key of Object.keys(facts)) conf[key] = 'low';
    return conf;
  }

  const normRaw = normalizeArabic(raw).toLowerCase();

  for (const [key, value] of Object.entries(facts)) {
    if (key.startsWith('_')) continue;

    if (value === undefined || value === null || value === '' || value === false) {
      conf[key] = 'low';
      continue;
    }
    if (typeof value === 'boolean') {
      conf[key] = value ? 'high' : 'low';
      continue;
    }
    if (typeof value !== 'string') {
      conf[key] = 'medium';
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      conf[key] = 'low';
      continue;
    }

    if (NUMERIC_PARSER_KEYS.has(key) && /^\d/.test(trimmed)) {
      conf[key] = 'high';
      continue;
    }

    const normVal = normalizeArabic(trimmed).toLowerCase();
    conf[key] = normRaw.includes(normVal) ? 'high' : 'medium';
  }

  return conf;
}
