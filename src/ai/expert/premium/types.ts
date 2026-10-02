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
}
