/**
 * FOX Expert System — Internal AI for listing generation.
 *
 * Deterministic, hallucination-proof, zero external dependencies.
 *
 * Pipeline:
 *   facts (from extractors) → templates → validator → final listing
 *
 * Public API:
 *   - composeListing(facts, categorySlug): ComposeResult | null
 */

export { composeListing } from './composer';
export type { ComposeResult } from './composer';
export type { EngineFacts } from './templateEngine';
export { ENRICHMENT_RULES, findEnrichment } from './enrichmentRules';
export { TONE_LIBRARY, pickTone, hashFacts } from './toneLibrary';
export { CATEGORY_TEMPLATES } from './categoryTemplates';
export { validateListing } from './validator';
