import { useCallback, useMemo, useState } from 'react';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import type { JordanLocationSearchResult } from '../helpers/jordanLocationIndex';
import {
  clearEditLocation,
  loadEditLocation,
  locationPayload,
  selectDistrict,
  selectGovernorate,
  selectJordanLocation,
  selectLocality,
  sameEditLocation,
  type EditLocationState,
  type LocationListingSeed,
} from '../helpers/editListingLocation';

export function useEditListingLocation(listing: LocationListingSeed | null, isArabic: boolean) {
  const marketCode = listing?.countryCode || '';
  const profile = useMemo(() => getMarketProfile(marketCode), [marketCode]);
  const [initial] = useState(() => loadEditLocation(listing));
  const [location, setLocation] = useState<EditLocationState>(initial);

  const governorates = useMemo(() => getAllGovernorates(marketCode), [marketCode]);
  const districts = useMemo(
    () => (location.citySlug ? getAllDistricts(marketCode, location.citySlug) : []),
    [marketCode, location.citySlug],
  );
  const villages = useMemo(() => {
    if (!location.citySlug || !location.districtSlug) return [];
    return districts.find((d) => d.slug === location.districtSlug)?.villages ?? [];
  }, [districts, location.citySlug, location.districtSlug]);

  const onGovernorate = useCallback((slug: string) => {
    const gov = governorates.find((g) => g.slug === slug);
    if (gov) setLocation(selectGovernorate(isArabic, gov));
  }, [governorates, isArabic]);

  const onDistrict = useCallback((slug: string) => {
    const district = districts.find((d) => d.slug === slug);
    if (district) setLocation((prev) => selectDistrict(prev, isArabic, district));
  }, [districts, isArabic]);

  const onLocality = useCallback((slug: string) => {
    const village = villages.find((v) => v.slug === slug);
    if (village) setLocation((prev) => selectLocality(prev, isArabic, village));
  }, [villages, isArabic]);

  const onJordan = useCallback((result: JordanLocationSearchResult) => {
    setLocation(selectJordanLocation(isArabic, result));
  }, [isArabic]);

  const onClear = useCallback(() => setLocation(clearEditLocation()), []);

  const changed = !sameEditLocation(initial, location);
  const payload = locationPayload(initial, location);
  const hasLevel3 = (profile?.visibleLevels.length ?? 0) >= 3 && villages.length > 0;

  return {
    marketCode,
    profile,
    hasLevel3,
    location,
    changed,
    payload,
    governorates,
    districts,
    villages,
    onGovernorate,
    onDistrict,
    onLocality,
    onJordan,
    onClear,
  };
}
