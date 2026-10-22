import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';
import { isOtherValue, OTHER_AR, OTHER_EN } from '@/data/locations';
import { googleSearchQuery } from '@/data/mapUrls';

export interface UseLocationPickReturn {
  cities: string[];
  neighborhoods: string[];
  selectedCity: string;
  selectedNeighborhood: string;
  site: string;
  readonly customCity: string;
  readonly setCustomCity: (v: string) => void;
  readonly customNeighborhood: string;
  readonly setCustomNeighborhood: (v: string) => void;
  handleCityChange: (c: string) => void;
  handleNeighborhoodChange: (n: string) => void;
  handleSiteChange: (s: string) => void;
  mapQuery: string;
  saveAndContinue: () => void;
  readonly canContinue: boolean;
  readonly validationError: string | null;
}

export function useLocationPick(): UseLocationPickReturn {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { isArabic, browseCountryCode, navigateTo } = useUI();
  const otherLabel = isArabic ? OTHER_AR : OTHER_EN;

  const rawGovs = useMemo(() => getAllGovernorates(browseCountryCode), [browseCountryCode]);
  const govsMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of rawGovs) map.set(isArabic ? g.nameAr : g.nameEn, g.slug);
    return map;
  }, [rawGovs, isArabic]);

  const cities = useMemo(() => [...rawGovs.map((g) => (isArabic ? g.nameAr : g.nameEn)), otherLabel], [rawGovs, isArabic, otherLabel]);
  const [selectedCity, setSelectedCity] = useState(postDraft.city || cities[0] || "");
  const currentGovSlug = useMemo(() => govsMap.get(selectedCity) || null, [govsMap, selectedCity]);

  const rawDistricts = useMemo(() => (currentGovSlug ? getAllDistricts(browseCountryCode, currentGovSlug) : []), [browseCountryCode, currentGovSlug]);
  const rawCamps = useMemo(() => (currentGovSlug ? getAllCamps(browseCountryCode).filter((c) => c.governorateSlug === currentGovSlug) : []), [browseCountryCode, currentGovSlug]);

  const neighborhoods = useMemo(() => {
    if (isOtherValue(selectedCity)) return [otherLabel];
    return [...rawDistricts.map((d) => (isArabic ? d.nameAr : d.nameEn)), ...rawCamps.map((c) => (isArabic ? c.nameAr : c.nameEn)), otherLabel];
  }, [selectedCity, rawDistricts, rawCamps, isArabic, otherLabel]);

  const [selectedNeighborhood, setSelectedNeighborhood] = useState(postDraft.neighborhood || (neighborhoods[0] || ""));
  const [site, setSite] = useState(postDraft.site || "");
  const [customCity, setCustomCity] = useState("");
  const [customNeighborhood, setCustomNeighborhood] = useState("");

  const handleCityChange = useCallback((c: string) => {
    setSelectedCity(c);
    setCustomCity("");
    const govSlug = govsMap.get(c);
    if (!govSlug) {
      setSelectedNeighborhood(otherLabel);
    } else {
      const dists = getAllDistricts(browseCountryCode, govSlug).map((d) => (isArabic ? d.nameAr : d.nameEn));
      const camps = getAllCamps(browseCountryCode).filter((cmp) => cmp.governorateSlug === govSlug).map((cmp) => (isArabic ? cmp.nameAr : cmp.nameEn));
      setSelectedNeighborhood([...dists, ...camps, otherLabel][0] || otherLabel);
    }
    setCustomNeighborhood("");
  }, [govsMap, browseCountryCode, isArabic, otherLabel]);

  const handleNeighborhoodChange = useCallback((n: string) => {
    setSelectedNeighborhood(n);
    setCustomNeighborhood("");
  }, []);

  const handleSiteChange = useCallback((s: string) => setSite(s), []);
  const mapQuery = useMemo(() => googleSearchQuery({ city: selectedCity, area: selectedNeighborhood, site }), [selectedCity, selectedNeighborhood, site]);

  const validationError = useMemo(() => {
    if (isOtherValue(selectedCity) && !customCity.trim()) return isArabic ? 'يرجى كتابة اسم المدينة' : 'Please enter the city name';
    if (isOtherValue(selectedNeighborhood) && !customNeighborhood.trim()) return isArabic ? 'يرجى كتابة اسم الحي' : 'Please enter the neighborhood name';
    return null;
  }, [selectedCity, customCity, selectedNeighborhood, customNeighborhood, isArabic]);

  const saveAndContinue = useCallback(() => {
    if (validationError) return;
    const finalCity = isOtherValue(selectedCity) && customCity.trim() ? customCity.trim() : selectedCity;
    const finalNeighborhood = isOtherValue(selectedNeighborhood) && customNeighborhood.trim() ? customNeighborhood.trim() : selectedNeighborhood;
    updatePostDraft({ city: finalCity, neighborhood: finalNeighborhood, site });
    navigateTo("post-details");
  }, [validationError, selectedCity, selectedNeighborhood, customCity, customNeighborhood, site, updatePostDraft, navigateTo]);

  return {
    cities, neighborhoods, selectedCity, selectedNeighborhood, site, customCity, setCustomCity,
    customNeighborhood, setCustomNeighborhood, handleCityChange, handleNeighborhoodChange,
    handleSiteChange, mapQuery, saveAndContinue, canContinue: validationError === null, validationError,
  };
}
