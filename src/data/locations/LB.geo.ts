import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const LB_GEO: CountryGeo = {
  countryCode: 'LB',
  governorates: [],
  refugeeCamps: [],
  landmarks: [],
};

registerCountry(LB_GEO);

export default LB_GEO;
