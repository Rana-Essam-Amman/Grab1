import type { PremiumCategory, StructuredLayout } from '../types';
import { REAL_ESTATE_GENERIC_POOLS } from './generic';
import { REAL_ESTATE_SUB_POOLS } from './subs';

export const REAL_ESTATE_PREMIUM: PremiumCategory = {
  titleTemplates: [],
  paragraph1: [],
  paragraph2: [],
  paragraph3: [],
  structured: {
    ...REAL_ESTATE_GENERIC_POOLS,
    ...REAL_ESTATE_SUB_POOLS,
  } as StructuredLayout,
};
