// RULE-14-EXCEPTION: Complex location logic with bilingual resolution + slug extraction for stable persistence
import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';
import { isOtherValue, OTHER_AR, OTHER_EN } from '@/data/locations';
import { googleSearchQuery } from '@/data/mapUrls';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import { recordNeighborhoodUsage } from '@/services/locations.service';
import { toast } from 'sonner';
import { preserveVerifiedJordanSelection, resolveTraditionalLocationSlugs } from '../helpers/traditionalLocationResolver';

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
function stripAdminWords(label: string): string {
  return label
    .replace(/(^|\s)(لواء|قصبة|قضاء|Liwa|Qasabah|Qada)(?=\s|$)/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim() || label;
}



function stripSuffix(label: string): string {
  const idx = label.indexOf(LABEL_SEPARATOR);
  return idx > -1 ? label.substring(0, idx) : label;
}

export function useLocationPick(): UseLocationPickReturn {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { isArabic, browseCountryCode, navigateTo } = useUI();
  const { authStatus, isAnonymous } = useAuth();
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
    const normalizedSaved = normalizeArabic(saved);
    
    const currentMatch = rawGovs.find((g) => normalizeArabic(isArabic ? g.nameAr : g.nameEn) === normalizedSaved);
    if (currentMatch) return isArabic ? currentMatch.nameAr : currentMatch.nameEn;
    
    const otherMatch = rawGovs.find((g) => normalizeArabic(isArabic ? g.nameEn : g.nameAr) === normalizedSaved);
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
      const raw = isArabic ? d.nameAr : d.nameEn;
      const name = browseCountryCode === 'JO' ? stripAdminWords(raw) : raw;
      if (!seen.has(name)) { labels.push(name); seen.add(name); }
    }
    for (const d of rawDistricts) {
      const rawDistrictName = isArabic ? d.nameAr : d.nameEn;
      const districtName = browseCountryCode === 'JO' ? stripAdminWords(rawDistrictName) : rawDistrictName;
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
  }, [selectedCity, rawDistricts, rawCamps, isArabic, otherLabel, browseCountryCode]);

  const resolveNeighborhoodLabel = useCallback((saved: string): string | null => {
    if (!saved) return null;
    const rawBase = stripSuffix(saved);
    const baseName = browseCountryCode === 'JO' ? stripAdminWords(rawBase) : rawBase;
    const normalizedBase = normalizeArabic(baseName);
    
    for (const d of rawDistricts) {
      const rawName = isArabic ? d.nameAr : d.nameEn;
      const displayName = browseCountryCode === 'JO' ? stripAdminWords(rawName) : rawName;
      if (normalizeArabic(displayName) === normalizedBase) return displayName;
      const rawOther = isArabic ? d.nameEn : d.nameAr;
      const displayOther = browseCountryCode === 'JO' ? stripAdminWords(rawOther) : rawOther;
      if (normalizeArabic(displayOther) === normalizedBase) return displayName;
    }
    for (const d of rawDistricts) {
      const rawDistrictName = isArabic ? d.nameAr : d.nameEn;
      const districtName = browseCountryCode === 'JO' ? stripAdminWords(rawDistrictName) : rawDistrictName;
      for (const v of d.villages ?? []) {
        const mc = normalizeArabic(isArabic ? v.nameAr : v.nameEn) === normalizedBase;
        const mo = normalizeArabic(isArabic ? v.nameEn : v.nameAr) === normalizedBase;
        if (mc || mo) return `${isArabic ? v.nameAr : v.nameEn}${LABEL_SEPARATOR}${districtName}`;
      }
    }
    for (const c of rawCamps) {
      const mc = normalizeArabic(isArabic ? c.nameAr : c.nameEn) === normalizedBase;
      const mo = normalizeArabic(isArabic ? c.nameEn : c.nameAr) === normalizedBase;
      if (mc || mo) return isArabic ? c.nameAr : c.nameEn;
    }
    return null;
  }, [rawDistricts, rawCamps, isArabic, browseCountryCode]);

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
    updatePostDraft({ citySlug: undefined, districtSlug: undefined, neighborhoodSlug: undefined });
    setSelectedCity(c);
    setCustomCity("");
    setSelectedNeighborhood(otherLabel);
    setCustomNeighborhood("");
  }, [otherLabel, updatePostDraft]);

  const handleNeighborhoodChange = useCallback((n: string) => {
    setSelectedNeighborhood(n);
    setCustomNeighborhood("");
    
    // Crowdsourcing (Fire-and-forget)
    // Guard: only authenticated non-anonymous users can contribute
    if (
      n &&
      !isOtherValue(n) &&
      n !== otherLabel &&
      authStatus === 'authenticated' &&
      !isAnonymous
    ) {
      void recordNeighborhoodUsage({
        countryCode: browseCountryCode,
        cityName: selectedCity,
        neighborhoodName: n,
      });
    }
  }, [otherLabel, browseCountryCode, selectedCity, authStatus, isAnonymous]);

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

  const resolveSlugsAtSave = useCallback((cityLabel: string, neighborhoodLabel: string): {
    citySlug?: string;
    districtSlug?: string;
    neighborhoodSlug?: string;
  } => {
    const verified = preserveVerifiedJordanSelection(browseCountryCode, cityLabel, neighborhoodLabel, postDraft);
    if (verified) return verified;
    return resolveTraditionalLocationSlugs(browseCountryCode, cityLabel, neighborhoodLabel);
  }, [browseCountryCode, postDraft.city, postDraft.citySlug, postDraft.districtSlug, postDraft.neighborhood, postDraft.neighborhoodSlug]);

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
    
    // Allow publishing with live-search neighborhoods (no static slug)
    if (!districtSlug && !neighborhoodSlug && !finalNeighborhood) {
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
  }, [validationError, selectedCity, selectedNeighborhood, customCity, customNeighborhood, site, resolveSlugsAtSave, updatePostDraft, navigateTo, isArabic]);

  return {
    cities, neighborhoods, selectedCity, selectedNeighborhood, site, customCity, setCustomCity,
    customNeighborhood, setCustomNeighborhood, handleCityChange, handleNeighborhoodChange,
    handleSiteChange, mapQuery, saveAndContinue, canContinue: validationError === null, validationError,
  };
    }
