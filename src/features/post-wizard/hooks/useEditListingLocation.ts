import { useMemo, useState } from 'react';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import type { JordanLocationSearchResult } from '../helpers/jordanLocationIndex';
import {
  clearEditLocation, loadEditLocation, sameEditLocation, selectDistrict, selectGovernorate, selectJordanLocation, selectLocality,
  type EditLocationState,
} from '../helpers/editListingLocation';

export function useEditListingLocation(
  listing: { countryCode?: string; city?: string; neighborhood?: string; citySlug?: string; districtSlug?: string; neighborhoodSlug?: string } | null,
  isArabic: boolean
) {
  const marketCode = listing?.countryCode || '';
  const initial = useMemo(() => loadEditLocation(listing), [listing]);
  const [location, setLocation] = useState<EditLocationState>(initial);
  const profile = getMarketProfile(marketCode);
  const hasLevel3 = (profile?.visibleLevels.length ?? 0) >= 3;
  const governorates = useMemo(() => (marketCode ? getAllGovernorates(marketCode) : []), [marketCode]);
  const districts = useMemo(
    () => (location.citySlug ? getAllDistricts(marketCode, location.citySlug) : []),
    [marketCode, location.citySlug]
  );
  const villages = useMemo(() => {
    if (!hasLevel3 || !location.districtSlug) return [];
    return districts.find((district) => district.slug === location.districtSlug)?.villages ?? [];
  }, [districts, hasLevel3, location.districtSlug]);

  const changed = !sameEditLocation(initial, location);
  const payload = changed ? location : {};

  return {
    marketCode, profile, hasLevel3, location, changed, payload, governorates, districts, villages,
    onGovernorate: (slug: string) => {
      const gov = governorates.find((item) => item.slug === slug);
      if (gov) setLocation(selectGovernorate(isArabic, gov));
    },
    onDistrict: (slug: string) => {
      const district = districts.find((item) => item.slug === slug);
      if (district) setLocation((current) => selectDistrict(current, isArabic, district, hasLevel3));
    },
    onLocality: (slug: string) => {
      const district = districts.find((item) => item.slug === location.districtSlug);
      const locality = district?.villages.find((item) => item.slug === slug);
      if (locality) {
        setLocation((current) => selectLocality(current, isArabic, isArabic ? district?.nameAr || '' : district?.nameEn || '', locality));
      }
    },
    onJordan: (result: JordanLocationSearchResult) => setLocation(selectJordanLocation(isArabic, result)),
    onClear: () => setLocation(clearEditLocation()),
  };
}
