import { locationsWithOther as locations, locationsArWithOther as locationsAr } from '@/data/locations';

export const getCityPair = (cityName: string, countryCode: string): { cityEn: string; cityAr: string } => {
  const code = (countryCode as 'JO' | 'SA' | 'LB' | 'PS' | 'SY') || 'JO';
  const enKeys = Object.keys(locations[code] || {});
  const arKeys = Object.keys(locationsAr?.[code] || locations[code] || {});
  let idx = arKeys.indexOf(cityName);
  if (idx === -1) idx = enKeys.indexOf(cityName);
  if (idx !== -1) {
    return { cityEn: enKeys[idx] || cityName, cityAr: arKeys[idx] || cityName };
  }
  return { cityEn: cityName, cityAr: cityName };
};
