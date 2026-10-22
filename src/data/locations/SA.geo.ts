import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const SA_GEO: CountryGeo = {
  countryCode: 'SA',
  governorates: [],
  refugeeCamps: [],
  landmarks: [],
};

registerCountry(SA_GEO);

export default SA_GEO;
