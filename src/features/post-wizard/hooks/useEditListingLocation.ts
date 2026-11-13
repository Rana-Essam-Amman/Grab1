import { useState, useCallback, useMemo } from 'react';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import {
  loadEditLocation, sameEditLocation, clearEditLocation,
  selectGovernorate, selectDistrict, selectLocality, selectJordanLocation,
  type EditLocationState,
} from '../helpers/editListingLocation';
import type { JordanLocationSearchResult } from '../helpers/jordanLocationIndex';
import type { Listing } from '@/types';
import '@/data/locations/JO.geo';
import '@/data/locations/SA.geo';
import '@/data/locations/PS.geo';
import '@/data/locations/LB.geo';
import '@/data/locations/SY.geo';
import '@/data/locations/KW.geo';

export function useEditListingLocation(listing: Listing | null, isArabic: boolean) {
  const marketCode = listing?.countryCode || '';
  const profile = getMarketProfile(marketCode);
  const initial = useMemo(() => loadEditLocation(listing), [listing]);
  const [location, setLocation] = useState<EditLocationState>(initial);

  const governorates = useMemo(() => getAllGovernorates(marketCode), [marketCode]);
  const districts = useMemo(
    () => (location.citySlug ? getAllDistricts(marketCode, location.citySlug) : []),
    [marketCode, location.citySlug]
  );
  const villages = useMemo(() => {
    const d = districts.find((x) => x.slug === location.districtSlug);
    return d?.villages ?? [];
  }, [districts, location.districtSlug]);

  const onGovernorate = useCallback((slug: string) => {
    const g = governorates.find((x) => x.slug === slug);
    if (g) setLocation(selectGovernorate(isArabic, g));
  }, [governorates, isArabic]);

  const onDistrict = useCallback((slug: string) => {
    const d = districts.find((x) => x.slug === slug);
    if (d) setLocation((p) => selectDistrict(p, isArabic, d));
  }, [districts, isArabic]);

  const onLocality = useCallback((slug: string) => {
    const v = villages.find((x) => x.slug === slug);
    if (v) setLocation((p) => selectLocality(p, isArabic, v));
  }, [villages, isArabic]);

  const onJordan = useCallback((res: JordanLocationSearchResult) => {
    setLocation(selectJordanLocation(isArabic, res));
  }, [isArabic]);

  const onClear = useCallback(() => setLocation(clearEditLocation()), []);

  const changed = !sameEditLocation(initial, location);
  const payload = changed ? location : {};

  return {
    marketCode, profile, hasLevel3: (profile?.visibleLevels.length ?? 0) >= 3,
    location, changed, payload, governorates, districts, villages,
    onGovernorate, onDistrict, onLocality, onJordan, onClear,
  };
}
