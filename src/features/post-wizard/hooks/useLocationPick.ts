import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { locationsWithOther, locationsArWithOther, isOtherValue } from '@/data/locations';
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
  const { postDraft, updatePostDraft, startPostFlow } = usePostWizard();
  const { isArabic, browseCountryCode, navigateTo } = useUI();

  const citiesRecord = useMemo(() => {
    return isArabic ? locationsArWithOther[browseCountryCode] : locationsWithOther[browseCountryCode];
  }, [isArabic, browseCountryCode]);

  const cities = useMemo(() => Object.keys(citiesRecord || {}), [citiesRecord]);

  const [selectedCity, setSelectedCity] = useState(postDraft.city || cities[0] || "");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(postDraft.neighborhood || (citiesRecord?.[selectedCity]?.[0] || ""));
  const [site, setSite] = useState(postDraft.site || "");
  const [customCity, setCustomCity] = useState("");
  const [customNeighborhood, setCustomNeighborhood] = useState("");

  const handleCityChange = useCallback((c: string) => {
    setSelectedCity(c);
    setCustomCity("");
    const hoods = citiesRecord?.[c] || [];
    setSelectedNeighborhood(hoods[0] || "");
    setCustomNeighborhood("");
  }, [citiesRecord]);

  const handleNeighborhoodChange = useCallback((n: string) => {
    setSelectedNeighborhood(n);
    setCustomNeighborhood("");
  }, []);

  const handleSiteChange = useCallback((s: string) => setSite(s), []);

  const mapQuery = useMemo(() => googleSearchQuery({ city: selectedCity, area: selectedNeighborhood, site }), [selectedCity, selectedNeighborhood, site]);

  const validationError = useMemo(() => {
    if (isOtherValue(selectedCity) && !customCity.trim()) {
      return isArabic ? 'يرجى كتابة اسم المدينة' : 'Please enter the city name';
    }
    if (isOtherValue(selectedNeighborhood) && !customNeighborhood.trim()) {
      return isArabic ? 'يرجى كتابة اسم الحي' : 'Please enter the neighborhood name';
    }
    return null;
  }, [selectedCity, customCity, selectedNeighborhood, customNeighborhood, isArabic]);

  const canContinue = validationError === null;

  const saveAndContinue = useCallback(() => {
    if (validationError) return;
    const finalCity = isOtherValue(selectedCity) && customCity.trim() ? customCity.trim() : selectedCity;
    const finalNeighborhood = isOtherValue(selectedNeighborhood) && customNeighborhood.trim() ? customNeighborhood.trim() : selectedNeighborhood;
    updatePostDraft({ city: finalCity, neighborhood: finalNeighborhood, site });
    navigateTo("post-details");
  }, [validationError, selectedCity, selectedNeighborhood, customCity, customNeighborhood, site, updatePostDraft, navigateTo]);

  return {
    cities,
    neighborhoods: citiesRecord?.[selectedCity] || [],
    selectedCity,
    selectedNeighborhood,
    site,
    customCity,
    setCustomCity,
    customNeighborhood,
    setCustomNeighborhood,
    handleCityChange,
    handleNeighborhoodChange,
    handleSiteChange,
    mapQuery,
    saveAndContinue,
    canContinue,
    validationError,
  };
}
