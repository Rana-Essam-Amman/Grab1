import type { PremiumCategory } from './types';
import { REAL_ESTATE_PREMIUM } from './real-estate-premium';
import { MOBILES_PREMIUM } from './mobiles-premium';

export const PREMIUM_TEMPLATES: Record<string, PremiumCategory> = {
  'real-estate': REAL_ESTATE_PREMIUM,
  'mobiles': MOBILES_PREMIUM,
};
