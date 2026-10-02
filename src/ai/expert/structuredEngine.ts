import type { EngineFacts } from './templateEngine';
import type { PremiumTemplate, StructuredLayout, StructuredDetailGroup } from './premium/types';

const STRUCTURED_SLOT_RE = /\{(\w+)\}/g;

function fillStructuredTemplate(tpl: string, facts: EngineFacts): string | null {
  const slots = tpl.match(STRUCTURED_SLOT_RE) ?? [];
  let out = tpl;
  for (const raw of slots) {
    const key = raw.slice(1, -1);
    const v = (facts as Record<string, unknown>)[key];
    if (v === undefined || v === null || v === '') return null;
    out = out.replace(new RegExp(`\\{${key}\\}`, 'g'), String(v));
  }
  return out;
}

function distributeSeed(seed: number): number {
  // Fibonacci-style hash: spreads adjacent seeds (0,1,2) far apart.
  // Determinism preserved: same seed → same output.
  return Math.abs(Math.imul(seed | 0, 2654435761)) >>> 0;
}

function pickFirstFillable(
  arr: readonly PremiumTemplate[],
  facts: EngineFacts,
  seed: number
): string | null {
  if (arr.length === 0) return null;
  const start = distributeSeed(seed) % arr.length;
  for (let i = 0; i < arr.length; i++) {
    const t = arr[(start + i) % arr.length];
    const f = fillStructuredTemplate(t.template, facts);
    if (f) return f;
  }
  return null;
}

function pickManyFillable(
  arr: readonly PremiumTemplate[],
  facts: EngineFacts,
  seed: number,
  count: number
): string[] {
  if (arr.length === 0 || count <= 0) return [];
  const out: string[] = [];
  const start = distributeSeed(seed) % arr.length;
  for (let i = 0; i < arr.length && out.length < count; i++) {
    const t = arr[(start + i) % arr.length];
    const f = fillStructuredTemplate(t.template, facts);
    if (f) out.push(f);
  }
  return out;
}

function pickOnePerGroup(
  groups: readonly StructuredDetailGroup[],
  facts: EngineFacts,
  seed: number
): string[] {
  const out: string[] = [];
  const factsRec = facts as Record<string, unknown>;
  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];
    const v = factsRec[group.fact];
    if (v === undefined || v === null || v === '') continue;
    const pick = pickFirstFillable(group.variants, facts, seed + 13 * (g + 1));
    if (pick) out.push(pick);
  }
  return out;
}

function structuredEligible(
  arr: readonly PremiumTemplate[],
  subcategorySlug: string
): readonly PremiumTemplate[] {
  if (!subcategorySlug) return arr;
  const matched = arr.filter(
    (t) => t.subcategories.length === 0 || t.subcategories.includes(subcategorySlug)
  );
  return matched.length > 0 ? matched : arr;
}

function mergeSubPool(
  base: readonly PremiumTemplate[],
  subPool: Readonly<Record<string, readonly PremiumTemplate[]>> | undefined,
  subcategorySlug: string
): readonly PremiumTemplate[] {
  if (!subcategorySlug || !subPool) return base;
  const extras = subPool[subcategorySlug];
  if (!extras || extras.length === 0) return base;
  return [...base, ...extras];
}

export function buildStructured(
  layout: StructuredLayout,
  facts: EngineFacts,
  subcategorySlug: string,
  seed: number
): { title: string | null; body: string | null } {
  const titlePool = mergeSubPool(
    structuredEligible(layout.titleFormat, subcategorySlug),
    layout.subTitleFormat,
    subcategorySlug
  );
  const hookPool = mergeSubPool(
    structuredEligible(layout.hooks, subcategorySlug),
    layout.subHooks,
    subcategorySlug
  );
  const introPool = mergeSubPool(
    structuredEligible(layout.introParagraphs, subcategorySlug),
    layout.subIntroParagraphs,
    subcategorySlug
  );
  const ctaPool = mergeSubPool(
    structuredEligible(layout.ctas, subcategorySlug),
    layout.subCtas,
    subcategorySlug
  );
  const featuresPool = mergeSubPool(
    structuredEligible(layout.featuresBullets, subcategorySlug),
    layout.subFeaturesBullets,
    subcategorySlug
  );

  const title = pickFirstFillable(titlePool, facts, seed);
  const hook = pickFirstFillable(hookPool, facts, seed + 7);
  if (!hook) return { title, body: null };

  const intro = pickManyFillable(introPool, facts, seed + 29, layout.introCount);
  const cta = pickFirstFillable(ctaPool, facts, seed + 101);
  if (!cta) return { title, body: null };

  const groups = layout.detailsGroups.map((g) => ({
    fact: g.fact,
    variants: structuredEligible(g.variants, subcategorySlug),
  }));
  const details = pickOnePerGroup(groups, facts, seed + 17);
  if (details.length < layout.minDetails) return { title, body: null };

  const features = pickManyFillable(
    featuresPool,
    facts,
    seed + 53,
    layout.featuresCount
  );
  if (features.length < 2) return { title, body: null };

  const blocks: string[] = [hook];
  if (intro.length > 0) blocks.push(intro.join(' '));
  blocks.push(`${layout.detailsLabel}\n${details.join('\n')}`);
  blocks.push(`${layout.featuresLabel}\n${features.join('\n')}`);
  blocks.push(cta);

  return {
    title,
    body: blocks.filter((b) => b && b.trim().length > 0).join('\n\n'),
  };
}

/**
 * Public entrypoint. Returns null if no title or any paragraph could be
 * filled — the caller is expected to fall back to a minimal safe output.
 */
