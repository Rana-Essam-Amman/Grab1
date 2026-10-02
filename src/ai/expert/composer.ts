import { generateFromTemplates, EngineFacts } from './templateEngine';
import { validateListing, ValidatorFacts } from './validator';

/**
 * Layer 5+6 — Composer
 *
 * Public entrypoint. Runs template engine, then validator, then returns
 * a final { title, description } or null.
 *
 * Description = paragraphs joined by "\n\n" (3 paragraphs).
 * Description ends with the standard CTA appended by this layer, not by
 * the templates.
 */

export interface ComposeResult {
  readonly title: string;
  readonly description: string;
}

const CTA_AR = 'للمعاينة والتواصل عبر رسائل الإعلان.';

/**
 * Compose a listing from facts.
 *
 * @returns { title, description } on success, or null if the expert system
 *          cannot produce a valid listing from the given facts.
 */
export function composeListing(
  facts: EngineFacts,
  categorySlug: string,
  variantSeed: number = 0,
  uniqueId: string = ''
): ComposeResult | null {
  const generated = generateFromTemplates(facts, categorySlug, variantSeed, uniqueId);
  if (!generated) return null;

  // If paragraph 3 already ends with a CTA-like line, don't add another.
  const paragraphs = [generated.paragraph1, generated.paragraph2, generated.paragraph3];
  const last = paragraphs[paragraphs.length - 1];
  if (!last.includes('التواصل') && !last.includes('للمعاينة')) {
    paragraphs.push(CTA_AR);
  }

  const validation = validateListing(
    generated.title,
    paragraphs,
    facts as ValidatorFacts
  );
  if (!validation.valid) return null;

  return {
    title: generated.title,
    description: paragraphs.join('\n\n'),
  };
}
