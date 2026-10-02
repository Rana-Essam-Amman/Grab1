import type { PremiumCategory, StructuredLayout } from '../types';
import { MOBILES_GENERIC_POOLS } from './generic';
import { MOBILES_SUB_POOLS } from './subs';

export const MOBILES_PREMIUM: PremiumCategory = {
  titleTemplates: [],
  paragraph1: [],
  paragraph2: [],
  paragraph3: [],
  structured: {
    ...MOBILES_GENERIC_POOLS,
    ...MOBILES_SUB_POOLS,
  } as StructuredLayout,
};
