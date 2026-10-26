// RULE-14-EXCEPTION: Complex cascading location logic for flattening districts and villages
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

const LABEL_SEPARATOR = ' — ';

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
    
    const labels: string[] = [];
    const seen = new Set<string>();

    // Districts: plain names
    for (const d of rawDistricts) {
      const name = isArabic ? d.nameAr : d.nameEn;
      if (!seen.has(name)) {
        labels.push(name);
        seen.add(name);
      }
    }

    // Villages: "Village — District"
    for (const d of rawDistricts) {
      const districtName = isArabic ? d.nameAr : d.nameEn;
      for (const v of d.villages ?? []) {
        const villageName = isArabic ? v.nameAr : v.nameEn;
        const label = `${villageName}${LABEL_SEPARATOR}${districtName}`;
        if (!seen.has(label)) {
          labels.push(label);
          seen.add(label);
        }
      }
    }

    // Camps: plain names
    for (const c of rawCamps) {
      const name = isArabic ? c.nameAr : c.nameEn;
      if (!seen.has(name)) {
        labels.push(name);
        seen.add(name);
      }
    }

    return [...labels.sort((a, b) => a.localeCompare(b, 'ar')), otherLabel];
  }, [selectedCity, rawDistricts, rawCamps, isArabic, otherLabel]);

  // Extract the raw neighborhood name from a label (strips " — District" suffix) - used for mapQuery only
  const extractNeighborhoodName = useCallback((label: string): string => {
    const idx = label.indexOf(LABEL_SEPARATOR);
    return idx > -1 ? label.substring(0, idx) : label;
  }, []);

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
      setSelectedNeighborhood(otherLabel); // Reset to "Other" until user picks
    }
    setCustomNeighborhood("");
  }, [govsMap, otherLabel]);

  const handleNeighborhoodChange = useCallback((n: string) => {
    setSelectedNeighborhood(n);
    setCustomNeighborhood("");
  }, []);

  const handleSiteChange = useCallback((s: string) => setSite(s), []);

  const mapQuery = useMemo(() => {
    // Google Maps works better with the clean village name
    const cleanArea = extractNeighborhoodName(selectedNeighborhood);
    return googleSearchQuery({ city: selectedCity, area: cleanArea, site });
  }, [selectedCity, selectedNeighborhood, site, extractNeighborhoodName]);

  const validationError = useMemo(() => {
    if (isOtherValue(selectedCity) && !customCity.trim()) return isArabic ? 'يرجى كتابة اسم المدينة' : 'Please enter the city name';
    if (isOtherValue(selectedNeighborhood) && !customNeighborhood.trim()) return isArabic ? 'يرجى كتابة اسم الحي' : 'Please enter the neighborhood name';
    return null;
  }, [selectedCity, customCity, selectedNeighborhood, customNeighborhood, isArabic]);

  const saveAndContinue = useCallback(() => {
    if (validationError) return;
    const finalCity = isOtherValue(selectedCity) && customCity.trim() ? customCity.trim() : selectedCity;
    
    // CTO FIX: Preserve the full label "Village — District" in the saved draft to maintain disambiguation
    const finalNeighborhood = isOtherValue(selectedNeighborhood) && customNeighborhood.trim() 
      ? customNeighborhood.trim() 
      : selectedNeighborhood;
      
    updatePostDraft({ city: finalCity, neighborhood: finalNeighborhood, site });
    navigateTo("post-details");
  }, [validationError, selectedCity, selectedNeighborhood, customCity, customNeighborhood, site, updatePostDraft, navigateTo]);

  return {
    cities, neighborhoods, selectedCity, selectedNeighborhood, site, customCity, setCustomCity,
    customNeighborhood, setCustomNeighborhood, handleCityChange, handleNeighborhoodChange,
    handleSiteChange, mapQuery, saveAndContinue, canContinue: validationError === null, validationError,
  };
}
