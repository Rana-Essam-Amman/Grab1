import { TONE_LIBRARY, pickTone, hashFacts } from './toneLibrary';
import { CATEGORY_TEMPLATES } from './categoryTemplates';
import { findEnrichment } from './enrichmentRules';

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
const SLOT_SOURCES: Record<string, string | { tone: string } | { enrich: [string, string] }> = {
  // Tone library slots
  open:    { tone: 'openings' },
  hook:    { tone: 'hooks' },
  close:   { tone: 'closings' },

  // Direct facts
  make:    'make',
  model:   'model',
  year:    'year',
  price:   'price',
  fuel:    'fuel',
  color:   'color',
  trans:   'transmission',
  km:      'km',
  area:    'area',
  rooms:   'rooms',
  floor:   'floor',
  storage: 'storage',
  jobTitle:'jobTitle',
  exp:     'experience',

  // Enrichment slots (derived, not required — if fact missing, slot is optional)
  fuelTone:  { enrich: ['fuel', 'fuel'] },
  colorTone: { enrich: ['color', 'color'] },
  yearTone:  { enrich: ['year', 'year'] },
  condTone:  { enrich: ['condition', 'condition'] },
};

const OPTIONAL_SLOTS = new Set(['fuelTone', 'colorTone', 'yearTone', 'condTone']);

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
        // Strip the optional slot cleanly (remove trailing " و" if any).
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

/** Pick the first template (starting from seed offset) that fills cleanly. */
function pickAndFill(
  templates: readonly string[],
  facts: EngineFacts,
  categoryKey: string,
  seed: number
): string | null {
  if (templates.length === 0) return null;
  const start = seed % templates.length;
  for (let i = 0; i < templates.length; i++) {
    const t = templates[(start + i) % templates.length];
    const filled = fillTemplate(t, facts, categoryKey, seed);
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
  categorySlug: string
): EngineOutput | null {
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
  const baseSeed = hashFacts(fingerprint);

  const title = pickAndFill(templates.titleTemplates, facts, categoryKey, baseSeed);
  const paragraph1 = pickAndFill(templates.paragraph1, facts, categoryKey, baseSeed + 17);
  const paragraph2 = pickAndFill(templates.paragraph2, facts, categoryKey, baseSeed + 31);
  const paragraph3 = pickAndFill(templates.paragraph3, facts, categoryKey, baseSeed + 47);

  if (!title || !paragraph1 || !paragraph2 || !paragraph3) return null;

  return { title, paragraph1, paragraph2, paragraph3, seed: baseSeed };
}
