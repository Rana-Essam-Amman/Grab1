import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const SY_GEO: CountryGeo = {
  countryCode: 'SY',
  governorates: [],
  refugeeCamps: [],
  landmarks: [],
};

registerCountry(SY_GEO);

export default SY_GEO;
