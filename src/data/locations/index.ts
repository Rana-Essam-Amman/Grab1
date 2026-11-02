import { locations, locationsAr } from './data';
export { locations, locationsAr };
export {
  locationsWithOther,
  locationsArWithOther,
  isOtherValue,
  OTHER_AR,
  OTHER_EN,
} from './withOther';
import type { AllLocations } from './types';

export { DEFAULT_REGIONAL_CAPITALS } from './capitals';
export {
  validateRegionalSanity,
  validateLocations,
  getSanitizedRegionalLocation,
  calculateGeoSimilarity,
  reconcileLocation
} from './validator';
export type {
  CountryLocations,
  AllLocations,
  DefaultCapital,
  DefaultCapitals,
  DefaultRegionalCapitals,
  ReconciledLocation
} from './types';

// Geo registry (6-level hierarchy) — side-effect imports for registration
import './JO.geo'; // الأردن
import './SA.geo'; // السعودية
import './PS.geo'; // فلسطين
import './LB.geo'; // لبنان
import './SY.geo'; // سوريا
import './KW.geo'; // الكويت

export * from './types';
export * from './registry';
export * from '@/shared/lib/geo';
