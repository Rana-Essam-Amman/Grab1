import { TONE_LIBRARY, pickTone, hashFacts } from './toneLibrary';
import { CATEGORY_TEMPLATES } from './categoryTemplates';
import { findEnrichment } from './enrichmentRules';
import { PREMIUM_TEMPLATES } from './premium';
import type { PremiumTemplate } from './premium/types';

/**
 * Layer 5 — Template Engine
 *
 * Deterministic selection + slot filling. Every template's required slots
 * are declared by {slotName} markers. If ANY required slot cannot be resolved
 * from facts/enrichment/tone, the template is skipped and another is tried.
 *
 * If ALL templates fail (e.g. facts empty), returns null — caller decides
 * what to do.
 */

export interface EngineFacts {
  readonly [key: string]: string | boolean | undefined;
}

export interface EngineOutput {
  readonly title: string;
  readonly paragraph1: string;
  readonly paragraph2: string;
  readonly paragraph3: string;
  readonly seed: number;
}

// Facts keys that must exist for a template's slots to resolve.
// Map: slot name -> facts key (or special: TONE_* / ENRICH_*).
const SLOT_SOURCES: Record<
  string,
  | string
  | { tone: string }
  | { enrich: [string, string] }
  | { fact: string; fallback?: string }
> = {
  // Tone library slots
  open:    { tone: 'openings' },
  hook:    { tone: 'hooks' },
  close:   { tone: 'closings' },

  // Direct facts
  make:    'make',
  // model falls back to `type` (furniture and other categories produce type, not model)
  model:   { fact: 'model', fallback: 'type' },
  year:    'year',
  price:   'price',
  fuel:    'fuel',
  color:   'color',
  trans:   'transmission',
  km:      'km',
  // area falls back to `city` (jobs/services use location not meters)
  area:    { fact: 'area', fallback: 'city' },
  rooms:   'rooms',
  floor:   'floor',
  bathrooms: 'bathrooms',
  storage: 'storage',
  jobTitle:'jobTitle',
  exp:     'experience',

  // Enrichment slots (derived, not required — if fact missing, slot is optional)
  fuelTone:  { enrich: ['fuel', 'fuel'] },
  colorTone: { enrich: ['color', 'color'] },
  yearTone:  { enrich: ['year', 'year'] },
  condTone:  { enrich: ['condition', 'condition'] },
};

const OPTIONAL_SLOTS = new Set(['fuelTone', 'colorTone', 'yearTone', 'condTone', 'price']);

/** Extract all slot names from a template string. */
function extractSlots(template: string): string[] {
  const slots: string[] = [];
  const re = /\{([a-zA-Z0-9_]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template)) !== null) slots.push(m[1]);
  return slots;
}

/** Read a fact as a trimmed string, or undefined. */
function readFact(facts: EngineFacts, key: string): string | undefined {
  const v = facts[key];
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (typeof v === 'boolean' && v) return 'yes';
  return undefined;
}

/** Resolve a slot to its string value, or undefined if unresolvable. */
function resolveSlot(
  slot: string,
  facts: EngineFacts,
  categoryKey: string,
  toneSeed: number
): string | undefined {
  const src = SLOT_SOURCES[slot];
  if (!src) return undefined;

  if (typeof src === 'string') {
    return readFact(facts, src);
  }

  if ('fact' in src) {
    const primary = readFact(facts, src.fact);
    if (primary) return primary;
    if (src.fallback) {
      const fb = readFact(facts, src.fallback);
      if (fb) return fb;
    }
    return undefined;
  }

  if ('tone' in src) {
    const pool = TONE_LIBRARY[categoryKey] ?? TONE_LIBRARY.generic;
    const arr = (pool as unknown as Record<string, readonly string[]>)[src.tone];
    if (!arr || arr.length === 0) return undefined;
    return pickTone(arr, toneSeed);
  }

  if ('enrich' in src) {
    const [key, factKey] = src.enrich;
    const val = readFact(facts, factKey);
    if (!val) return undefined;
    return findEnrichment(key, val);
  }

  return undefined;
}

/** Fill a template. Returns null if any required slot fails. */
function fillTemplate(
  template: string,
  facts: EngineFacts,
  categoryKey: string,
  toneSeed: number
): string | null {
  const slots = extractSlots(template);
  let out = template;
  for (const slot of slots) {
    const value = resolveSlot(slot, facts, categoryKey, toneSeed);
    if (value === undefined) {
      if (OPTIONAL_SLOTS.has(slot)) {
        // Price gets a graceful substitute, not a silent deletion.
        if (slot === 'price') {
          out = out.replace(/\{price\}/g, 'عند التواصل');
          continue;
        }
        out = out.replace(new RegExp(`\\s*و\\{${slot}\\}`, 'g'), '');
        out = out.replace(new RegExp(`\\{${slot}\\}`, 'g'), '');
        continue;
      }
      return null;
    }
    out = out.replace(new RegExp(`\\{${slot}\\}`, 'g'), value);
  }
  // Cleanup artifacts: double spaces, stray punctuation.
  out = out.replace(/\s{2,}/g, ' ').replace(/\s+([،.])/g, '$1').trim();
  return out;
}

/**
 * Pick the template with the HIGHEST fact coverage, tie-broken by seed.
 *
 * Rationale: templates that use more available facts produce richer
 * listings. A template with 5 resolved slots beats one with 3, even if
 * the 3-slot one appears earlier in the array.
 *
 * Variety: among templates with identical top score, seed%N picks one.
 * If that one fails to fill, we fall through to the next in the same tier.
 */
function pickAndFill(
  templates: readonly string[],
  facts: EngineFacts,
  categoryKey: string,
  seed: number
): string | null {
  if (templates.length === 0) return null;

  // Score each template by how many required slots it can resolve.
  // Higher score = uses more facts = richer output.
  interface ScoredTemplate {
    readonly template: string;
    readonly score: number;
  }
  const scored: ScoredTemplate[] = templates.map((t) => {
    const slots = extractSlots(t);
    let score = 0;
    for (const slot of slots) {
      const value = resolveSlot(slot, facts, categoryKey, seed);
      if (value !== undefined) score += 1;
    }
    return { template: t, score };
  });

  const maxScore = Math.max(...scored.map((s) => s.score));
  if (maxScore === 0) return null;

  // All templates that hit the max score — variety pool.
  const topTier = scored.filter((s) => s.score === maxScore).map((s) => s.template);
  if (topTier.length === 0) return null;

  // Deterministic variety within the top tier.
  const start = seed % topTier.length;
  for (let i = 0; i < topTier.length; i++) {
    const t = topTier[(start + i) % topTier.length];
    const filled = fillTemplate(t, facts, categoryKey, seed);
    if (filled) return filled;
  }

  // Fallback: if no top-tier template fills cleanly (edge case), try the
  // next-best score tier. Rarely hit — resolveSlot already validated each.
  for (const { template } of scored) {
    const filled = fillTemplate(template, facts, categoryKey, seed);
    if (filled) return filled;
  }
  return null;
}

/**
 * Public entrypoint. Returns null if no title or any paragraph could be
 * filled — the caller is expected to fall back to a minimal safe output.
 */
export function generateFromTemplates(
  facts: EngineFacts,
  categorySlug: string,
  variantSeed: number = 0,
  uniqueId: string = '',
  subcategorySlug: string = ''
): EngineOutput | null {
  // Premium tier: subcategory-aware, preferred when it fills cleanly.
  const premium = PREMIUM_TEMPLATES[categorySlug];
  if (premium && subcategorySlug) {
    const uniqueSeed = uniqueId ? hashFacts(uniqueId) : 0;
    const premiumSeed = variantSeed + uniqueSeed;

    const pickPremium = (section: readonly PremiumTemplate[], offset: number): string | null => {
      // Match exactly; if no exact match, and subcategorySlug is empty, allow all.
      let eligible = section.filter((t) => t.subcategories.includes(subcategorySlug));
      if (eligible.length === 0 && !subcategorySlug) {
        // No sub matched — take the union of all (best-effort). This only runs
        // when we genuinely don't know the sub.
        eligible = section.slice();
      }
      if (eligible.length === 0) return null;
      // Score by fact coverage
      const scored = eligible.map((t) => {
        const slots = extractSlots(t.template);
        let score = 0;
        for (const s of slots) {
          if (resolveSlot(s, facts, categorySlug, 0) !== undefined) score += 1;
        }
        return { template: t.template, score };
      });
      const maxScore = Math.max(...scored.map((s) => s.score));
      if (maxScore === 0) return null;
      // Priority 1: top tier (score >= max - 1). Rotation for variety.
      const topTier = scored
        .filter((s) => s.score >= maxScore - 1)
        .map((s) => s.template);
      const seedVal = premiumSeed + offset;
      const start = Math.abs(seedVal) % topTier.length;
      for (let i = 0; i < topTier.length; i++) {
        const t = topTier[(start + i) % topTier.length];
        const filled = fillTemplate(t, facts, categorySlug, seedVal);
        if (filled) return filled;
      }
      // Priority 2 fallback: try ALL scored templates in descending score order.
      // This handles cases where the top tier uses a fact the user omitted
      // (e.g., rooms) while a lower-tier template would fill cleanly.
      const sortedAll = [...scored].sort((a, b) => b.score - a.score).map((s) => s.template);
      const start2 = Math.abs(seedVal) % sortedAll.length;
      for (let i = 0; i < sortedAll.length; i++) {
        const t = sortedAll[(start2 + i) % sortedAll.length];
        const filled = fillTemplate(t, facts, categorySlug, seedVal);
        if (filled) return filled;
      }
      return null;
    };

    const pTitle = pickPremium(premium.titleTemplates, 0);
    const pP1 = pickPremium(premium.paragraph1, 17);
    const pP2 = pickPremium(premium.paragraph2, 31);
    const pP3 = pickPremium(premium.paragraph3, 47);
    if (pTitle && pP1 && pP2 && pP3) {
      const fp = [String(facts.make ?? ''), String(facts.model ?? ''), categorySlug, subcategorySlug].join('|');
      return {
        title: pTitle,
        paragraph1: pP1,
        paragraph2: pP2,
        paragraph3: pP3,
        seed: hashFacts(fp) + variantSeed + uniqueSeed,
      };
    }
    // else fall through to the generic pool
  }

  const categoryKey = CATEGORY_TEMPLATES[categorySlug] ? categorySlug : 'generic';
  const templates = CATEGORY_TEMPLATES[categoryKey];
  if (!templates) return null;

  // Deterministic seed from facts fingerprint.
  const fingerprint = [
    String(facts.make ?? ''),
    String(facts.model ?? ''),
    String(facts.year ?? ''),
    String(facts.price ?? ''),
    String(facts.fuel ?? ''),
    String(facts.color ?? ''),
    categorySlug,
  ].join('|');
  const uniqueSeed = uniqueId ? hashFacts(uniqueId) : 0;
  const baseSeed = hashFacts(fingerprint) + variantSeed + uniqueSeed;

  const title = pickAndFill(templates.titleTemplates, facts, categoryKey, baseSeed);
  const paragraph1 = pickAndFill(templates.paragraph1, facts, categoryKey, baseSeed + 17);
  const paragraph2 = pickAndFill(templates.paragraph2, facts, categoryKey, baseSeed + 31);
  const paragraph3 = pickAndFill(templates.paragraph3, facts, categoryKey, baseSeed + 47);

  if (!title || !paragraph1 || !paragraph2 || !paragraph3) return null;

  return { title, paragraph1, paragraph2, paragraph3, seed: baseSeed };
}
