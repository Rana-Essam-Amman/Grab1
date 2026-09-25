import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { locations, locationsAr } from '@/data/locations';
import { googleSearchQuery } from '@/data/mapUrls';

export interface UseLocationPickReturn {
  cities: string[];
  neighborhoods: string[];
  selectedCity: string;
  selectedNeighborhood: string;
  site: string;
  handleCityChange: (c: string) => void;
  handleNeighborhoodChange: (n: string) => void;
  handleSiteChange: (s: string) => void;
  mapQuery: string;
  saveAndContinue: () => void;
}

export function useLocationPick(): UseLocationPickReturn {
  const { postDraft, updatePostDraft, startPostFlow } = usePostWizard();
  const { isArabic, browseCountryCode, navigateTo } = useUI();

  const citiesRecord = useMemo(() => {
    return isArabic ? locationsAr[browseCountryCode] : locations[browseCountryCode];
  }, [isArabic, browseCountryCode]);

  const cities = useMemo(() => Object.keys(citiesRecord || {}), [citiesRecord]);

  const [selectedCity, setSelectedCity] = useState(postDraft.city || cities[0] || '');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(postDraft.neighborhood || (citiesRecord?.[selectedCity]?.[0] || ''));
  const [site, setSite] = useState(postDraft.site || '');

  const handleCityChange = useCallback((c: string) => {
    setSelectedCity(c);
    const hoods = citiesRecord?.[c] || [];
    setSelectedNeighborhood(hoods[0] || '');
  }, [citiesRecord]);

  const handleNeighborhoodChange = useCallback((n: string) => setSelectedNeighborhood(n), []);
  const handleSiteChange = useCallback((s: string) => setSite(s), []);

  const mapQuery = useMemo(() => googleSearchQuery({ city: selectedCity, area: selectedNeighborhood, site }), [selectedCity, selectedNeighborhood, site]);

  const saveAndContinue = useCallback(() => {
    updatePostDraft({ city: selectedCity, neighborhood: selectedNeighborhood, site });
    navigateTo('post-details');
  }, [selectedCity, selectedNeighborhood, site, updatePostDraft, navigateTo]);

  return { cities, neighborhoods: citiesRecord?.[selectedCity] || [], selectedCity, selectedNeighborhood, site, handleCityChange, handleNeighborhoodChange, handleSiteChange, mapQuery, saveAndContinue };
}
