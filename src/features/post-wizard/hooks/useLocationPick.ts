// RULE-14-EXCEPTION: Complex location logic with bilingual resolution + slug extraction for stable persistence
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

function stripSuffix(label: string): string {
  const idx = label.indexOf(LABEL_SEPARATOR);
  return idx > -1 ? label.substring(0, idx) : label;
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

  const cities = useMemo(
    () => [...rawGovs.map((g) => (isArabic ? g.nameAr : g.nameEn)), otherLabel],
    [rawGovs, isArabic, otherLabel]
  );

  // P0 FIX: Bilingual resolution so language switch doesn't lose location
  const resolveCityLabel = useCallback((saved: string): string | null => {
    if (!saved) return null;
    const currentMatch = rawGovs.find((g) => (isArabic ? g.nameAr : g.nameEn) === saved);
    if (currentMatch) return isArabic ? currentMatch.nameAr : currentMatch.nameEn;
    const otherMatch = rawGovs.find((g) => (isArabic ? g.nameEn : g.nameAr) === saved);
    if (otherMatch) return isArabic ? otherMatch.nameAr : otherMatch.nameEn;
    return null;
  }, [rawGovs, isArabic]);

  const initialCityLabel = useMemo(
    () => resolveCityLabel(postDraft.city || ""),
    [resolveCityLabel, postDraft.city]
  );

  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (!postDraft.city) return cities[0] || "";
    return initialCityLabel || otherLabel;
  });

  const [customCity, setCustomCity] = useState<string>(() => {
    if (!postDraft.city) return "";
    return initialCityLabel ? "" : postDraft.city;
  });

  const currentGovSlug = useMemo(() => govsMap.get(selectedCity) || null, [govsMap, selectedCity]);

  const rawDistricts = useMemo(
    () => (currentGovSlug ? getAllDistricts(browseCountryCode, currentGovSlug) : []),
    [browseCountryCode, currentGovSlug]
  );
  const rawCamps = useMemo(
    () => (currentGovSlug ? getAllCamps(browseCountryCode).filter((c) => c.governorateSlug === currentGovSlug) : []),
    [browseCountryCode, currentGovSlug]
  );

  const neighborhoods = useMemo(() => {
    if (isOtherValue(selectedCity)) return [otherLabel];
    const labels: string[] = [];
    const seen = new Set<string>();
    for (const d of rawDistricts) {
      const name = isArabic ? d.nameAr : d.nameEn;
      if (!seen.has(name)) { labels.push(name); seen.add(name); }
    }
    for (const d of rawDistricts) {
      const districtName = isArabic ? d.nameAr : d.nameEn;
      for (const v of d.villages ?? []) {
        const villageName = isArabic ? v.nameAr : v.nameEn;
        const label = `${villageName}${LABEL_SEPARATOR}${districtName}`;
        if (!seen.has(label)) { labels.push(label); seen.add(label); }
      }
    }
    for (const c of rawCamps) {
      const name = isArabic ? c.nameAr : c.nameEn;
      if (!seen.has(name)) { labels.push(name); seen.add(name); }
    }
    return [...labels.sort((a, b) => a.localeCompare(b, isArabic ? 'ar' : 'en')), otherLabel];
  }, [selectedCity, rawDistricts, rawCamps, isArabic, otherLabel]);

  // P0 FIX: Bilingual resolution for neighborhood
  const resolveNeighborhoodLabel = useCallback((saved: string): string | null => {
    if (!saved) return null;
    const baseName = stripSuffix(saved);
    for (const d of rawDistricts) {
      if ((isArabic ? d.nameAr : d.nameEn) === baseName) return isArabic ? d.nameAr : d.nameEn;
      if ((isArabic ? d.nameEn : d.nameAr) === baseName) return isArabic ? d.nameAr : d.nameEn;
    }
    for (const d of rawDistricts) {
      const districtName = isArabic ? d.nameAr : d.nameEn;
      for (const v of d.villages ?? []) {
        const mc = (isArabic ? v.nameAr : v.nameEn) === baseName;
        const mo = (isArabic ? v.nameEn : v.nameAr) === baseName;
        if (mc || mo) return `${isArabic ? v.nameAr : v.nameEn}${LABEL_SEPARATOR}${districtName}`;
      }
    }
    for (const c of rawCamps) {
      const mc = (isArabic ? c.nameAr : c.nameEn) === baseName;
      const mo = (isArabic ? c.nameEn : c.nameAr) === baseName;
      if (mc || mo) return isArabic ? c.nameAr : c.nameEn;
    }
    return null;
  }, [rawDistricts, rawCamps, isArabic]);

  const initialNeighborhoodLabel = useMemo(
    () => resolveNeighborhoodLabel(postDraft.neighborhood || ""),
    [resolveNeighborhoodLabel, postDraft.neighborhood]
  );

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(() => {
    if (!postDraft.neighborhood) return neighborhoods[0] || "";
    return initialNeighborhoodLabel || otherLabel;
  });

  const [customNeighborhood, setCustomNeighborhood] = useState<string>(() => {
    if (!postDraft.neighborhood) return "";
    return initialNeighborhoodLabel ? "" : postDraft.neighborhood;
  });

  const [site, setSite] = useState(postDraft.site || "");

  // NEW: Extract slugs from display label (for stable persistence)
  const extractSlugs = useCallback((label: string): { districtSlug?: string; neighborhoodSlug?: string } => {
    if (!label || isOtherValue(label)) return {};
    const sepIdx = label.indexOf(LABEL_SEPARATOR);
    if (sepIdx > -1) {
      const villageName = label.substring(0, sepIdx);
      const districtName = label.substring(sepIdx + LABEL_SEPARATOR.length);
      const district = rawDistricts.find((d) => (isArabic ? d.nameAr : d.nameEn) === districtName);
      if (district) {
        const village = district.villages.find((v) => (isArabic ? v.nameAr : v.nameEn) === villageName);
        if (village) return { districtSlug: district.slug, neighborhoodSlug: village.slug };
      }
    }
    const camp = rawCamps.find((c) => (isArabic ? c.nameAr : c.nameEn) === label);
    if (camp) return { neighborhoodSlug: camp.slug };
    const district = rawDistricts.find((d) => (isArabic ? d.nameAr : d.nameEn) === label);
    if (district) return { districtSlug: district.slug };
    return {};
  }, [rawDistricts, rawCamps, isArabic]);

  const handleCityChange = useCallback((c: string) => {
    setSelectedCity(c);
    setCustomCity("");
    setSelectedNeighborhood(otherLabel);
    setCustomNeighborhood("");
  }, [otherLabel]);

  const handleNeighborhoodChange = useCallback((n: string) => {
    setSelectedNeighborhood(n);
    setCustomNeighborhood("");
  }, []);

  const handleSiteChange = useCallback((s: string) => setSite(s), []);

  const mapQuery = useMemo(() => {
    const area = isOtherValue(selectedNeighborhood) && customNeighborhood.trim()
      ? customNeighborhood.trim()
      : stripSuffix(selectedNeighborhood);
    const city = isOtherValue(selectedCity) && customCity.trim()
      ? customCity.trim()
      : selectedCity;
    return googleSearchQuery({ city, area, site });
  }, [selectedCity, customCity, selectedNeighborhood, customNeighborhood, site]);

  const validationError = useMemo(() => {
    if (isOtherValue(selectedCity) && !customCity.trim())
      return isArabic ? 'يرجى كتابة اسم المدينة' : 'Please enter the city name';
    if (isOtherValue(selectedNeighborhood) && !customNeighborhood.trim())
      return isArabic ? 'يرجى كتابة اسم الحي' : 'Please enter the neighborhood name';
    return null;
  }, [selectedCity, customCity, selectedNeighborhood, customNeighborhood, isArabic]);

  const saveAndContinue = useCallback(() => {
    if (validationError) return;
    const finalCity = isOtherValue(selectedCity) && customCity.trim()
      ? customCity.trim()
      : selectedCity;
    const finalNeighborhood = isOtherValue(selectedNeighborhood) && customNeighborhood.trim()
      ? customNeighborhood.trim()
      : selectedNeighborhood;

    // Extract slugs for stable persistence
    const slugs = extractSlugs(finalNeighborhood);
    const citySlug = isOtherValue(selectedCity) ? undefined : (currentGovSlug || undefined);

    updatePostDraft({
      city: finalCity,
      neighborhood: finalNeighborhood,
      site,
      citySlug,
      districtSlug: slugs.districtSlug,
      neighborhoodSlug: slugs.neighborhoodSlug,
    });
    navigateTo("post-details");
  }, [validationError, selectedCity, selectedNeighborhood, customCity, customNeighborhood, site, currentGovSlug, extractSlugs, updatePostDraft, navigateTo]);

  return {
    cities, neighborhoods, selectedCity, selectedNeighborhood, site, customCity, setCustomCity,
    customNeighborhood, setCustomNeighborhood, handleCityChange, handleNeighborhoodChange,
    handleSiteChange, mapQuery, saveAndContinue, canContinue: validationError === null, validationError,
  };
}
