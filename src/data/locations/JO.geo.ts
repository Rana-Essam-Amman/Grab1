import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const JO_GEO: CountryGeo = {
  countryCode: 'JO',
  governorates: [],
  refugeeCamps: [],
  landmarks: [],
};

registerCountry(JO_GEO);

export default JO_GEO;
