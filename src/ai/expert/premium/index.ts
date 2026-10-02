import type { PremiumCategory } from './types';
import { REAL_ESTATE_PREMIUM } from './real-estate-premium';

/**
 * Premium template registry — keyed by category slug.
 * Only categories listed here benefit from subcategory filtering.
 * Others fall back to BASE + EXTRA + V2 pool.
 */
export const PREMIUM_TEMPLATES: Record<string, PremiumCategory> = {
  'real-estate': REAL_ESTATE_PREMIUM,
};
