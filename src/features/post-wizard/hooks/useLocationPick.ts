// RULE-14-EXCEPTION: Complex location logic with bilingual resolution + slug extraction for stable persistence
import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';
import { isOtherValue, OTHER_AR, OTHER_EN } from '@/data/locations';
import { googleSearchQuery } from '@/data/mapUrls';
import { toast } from 'sonner';

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

  // DEFENSIVE RESOLUTION: Re-derive slugs from labels at save-time, bilingual-safe.
  // This makes save resilient to stale state (e.g., language was switched while on-screen).
  const resolveSlugsAtSave = useCallback((cityLabel: string, neighborhoodLabel: string): {
    citySlug?: string;
    districtSlug?: string;
    neighborhoodSlug?: string;
  } => {
    // --- Resolve citySlug ---
    let citySlug: string | undefined = undefined;
    if (!isOtherValue(cityLabel)) {
      let gov = rawGovs.find((g) => (isArabic ? g.nameAr : g.nameEn) === cityLabel);
      if (!gov) gov = rawGovs.find((g) => (isArabic ? g.nameEn : g.nameAr) === cityLabel);
      citySlug = gov?.slug;
    }

    // --- Resolve neighborhood slugs (bilingual) ---
    let districtSlug: string | undefined = undefined;
    let neighborhoodSlug: string | undefined = undefined;

    if (citySlug && !isOtherValue(neighborhoodLabel)) {
      const scopeDistricts = getAllDistricts(browseCountryCode, citySlug);
      const scopeCamps = getAllCamps(browseCountryCode).filter((c) => c.governorateSlug === citySlug);

      const sepIdx = neighborhoodLabel.indexOf(LABEL_SEPARATOR);

      if (sepIdx > -1) {
        // "Village — District" format
        const villageName = neighborhoodLabel.substring(0, sepIdx);
        const districtName = neighborhoodLabel.substring(sepIdx + LABEL_SEPARATOR.length);

        let district = scopeDistricts.find((d) => (isArabic ? d.nameAr : d.nameEn) === districtName);
        let village = district?.villages.find((v) => (isArabic ? v.nameAr : v.nameEn) === villageName);
        if (!village) {
          district = scopeDistricts.find((d) => (isArabic ? d.nameEn : d.nameAr) === districtName);
          village = district?.villages.find((v) => (isArabic ? v.nameEn : v.nameAr) === villageName);
        }
        if (district && village) {
          districtSlug = district.slug;
          neighborhoodSlug = village.slug;
        }
      } else {
        // District or camp (no separator)
        let camp = scopeCamps.find((c) => (isArabic ? c.nameAr : c.nameEn) === neighborhoodLabel);
        if (!camp) camp = scopeCamps.find((c) => (isArabic ? c.nameEn : c.nameAr) === neighborhoodLabel);
        if (camp) {
          neighborhoodSlug = camp.slug;
        } else {
          let district = scopeDistricts.find((d) => (isArabic ? d.nameAr : d.nameEn) === neighborhoodLabel);
          if (!district) district = scopeDistricts.find((d) => (isArabic ? d.nameEn : d.nameAr) === neighborhoodLabel);
          if (district) districtSlug = district.slug;
        }
      }
    }

    return { citySlug, districtSlug, neighborhoodSlug };
  }, [rawGovs, isArabic, browseCountryCode]);

  const saveAndContinue = useCallback(() => {
    if (validationError) return;

    const finalCity = isOtherValue(selectedCity) && customCity.trim()
      ? customCity.trim()
      : selectedCity;
    const finalNeighborhood = isOtherValue(selectedNeighborhood) && customNeighborhood.trim()
      ? customNeighborhood.trim()
      : selectedNeighborhood;

    const { citySlug, districtSlug, neighborhoodSlug } = resolveSlugsAtSave(finalCity, finalNeighborhood);

    if (!citySlug) {
      toast.error(isArabic ? 'الرجاء اختيار المدينة من القائمة' : 'Please select the city from the list');
      return;
    }
    if (!districtSlug && !neighborhoodSlug) {
      toast.error(isArabic ? 'الرجاء اختيار المنطقة من القائمة' : 'Please select the area from the list');
      return;
    }

    updatePostDraft({
      city: finalCity,
      neighborhood: finalNeighborhood,
      site,
      citySlug,
      districtSlug,
      neighborhoodSlug,
    });
    navigateTo("post-details");
  }, [validationError, selectedCity, selectedNeighborhood, customCity, customNeighborhood, site, resolveSlugsAtSave, updatePostDraft, navigateTo]);

  return {
    cities, neighborhoods, selectedCity, selectedNeighborhood, site, customCity, setCustomCity,
    customNeighborhood, setCustomNeighborhood, handleCityChange, handleNeighborhoodChange,
    handleSiteChange, mapQuery, saveAndContinue, canContinue: validationError === null, validationError,
  };
                                      }
