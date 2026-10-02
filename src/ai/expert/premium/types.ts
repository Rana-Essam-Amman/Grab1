// RULE-14-EXCEPTION: Static taxonomy
/**
 * Premium template — subcategory-aware.
 * Each template declares which subcategory slugs it applies to.
 * A template is only eligible if the current subcategory is in the list.
 */
export interface PremiumTemplate {
  readonly template: string;
  readonly subcategories: readonly string[];
}

export interface PremiumCategory {
  readonly titleTemplates: readonly PremiumTemplate[];
  readonly paragraph1: readonly PremiumTemplate[];
  readonly paragraph2: readonly PremiumTemplate[];
  readonly paragraph3: readonly PremiumTemplate[];
  readonly structured?: StructuredLayout;
}

/**
 * A group of variant templates describing the SAME fact (e.g. "rooms").
 * buildStructured picks exactly ONE variant per group per listing.
 * Guarantees: (a) no fact is repeated in a listing, (b) output varies by seed.
 */
export interface StructuredDetailGroup {
  readonly fact: string;
  readonly variants: readonly PremiumTemplate[];
}

export interface StructuredLayout {
  readonly titleFormat: readonly PremiumTemplate[];
  readonly hooks: readonly PremiumTemplate[];
  readonly introParagraphs: readonly PremiumTemplate[];
  readonly detailsGroups: readonly StructuredDetailGroup[];
  readonly featuresBullets: readonly PremiumTemplate[];
  readonly ctas: readonly PremiumTemplate[];
  readonly detailsLabel: string;
  readonly featuresLabel: string;
  readonly featuresCount: number;
  readonly introCount: number;
  readonly minDetails: number;
}

