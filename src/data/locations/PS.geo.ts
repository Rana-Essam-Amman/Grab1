import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const PS_GEO: CountryGeo = {
  countryCode: 'PS',
  governorates: [],
  refugeeCamps: [],
  landmarks: [],
};

registerCountry(PS_GEO);

export default PS_GEO;
