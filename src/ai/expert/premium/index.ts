import type { PremiumCategory } from './types';
import { REAL_ESTATE_PREMIUM } from './real-estate';
import { MOBILES_PREMIUM } from './mobiles';

export const PREMIUM_TEMPLATES: Record<string, PremiumCategory> = {
  'real-estate': REAL_ESTATE_PREMIUM,
  'mobiles': MOBILES_PREMIUM,
};
