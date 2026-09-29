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
