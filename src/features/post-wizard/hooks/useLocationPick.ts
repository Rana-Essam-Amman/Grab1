// RULE-14-EXCEPTION: Complex location logic with bilingual resolution + slug extraction for stable persistence
import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';
import { isOtherValue, OTHER_AR, OTHER_EN } from '@/data/locations';
import { googleSearchQuery } from '@/data/mapUrls';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import { stripAdminWords } from '@/shared/lib/geo/stripAdminWords';
import { JO_OPENSOOQ_AREAS } from '@/data/locations/JO_OPENSOOQ_AREAS';
import { hasOpensooqData, getOpensooqCity, getOpensooqCities } from '@/data/locations/opensooq';
import { recordNeighborhoodUsage } from '@/services/locations.service';
import { toast } from 'sonner';
import { preserveVerifiedJordanSelection, resolveTraditionalLocationSlugs } from '../helpers/traditionalLocationResolver';
import { buildMergedAmmanAreas, matchOpenSooqToGeoNames } from '../helpers/ammanAreaResolver';

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
  const { authStatus, isAnonymous } = useAuth();
  const otherLabel = isArabic ? OTHER_AR : OTHER_EN;

  const rawGovs = useMemo(() => {
    if (hasOpensooqData(browseCountryCode)) {
      return getOpensooqCities(browseCountryCode).map(c => ({
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameAr,
        districts: [],
      }));
    }
    return getAllGovernorates(browseCountryCode);
  }, [browseCountryCode]);
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

    // Amman: use merged GeoNames + OpenSooq list
    if (browseCountryCode === 'JO' && currentGovSlug === 'amman') {
      const merged = buildMergedAmmanAreas();
      for (const a of merged) {
        const label = isArabic ? a.nameAr : a.nameEn;
        if (!seen.has(label)) { labels.push(label); seen.add(label); }
      }
      return [...labels.sort((a, b) => a.localeCompare(b, isArabic ? 'ar' : 'en')), otherLabel];
    }

    // OpenSooq markets (SA/PS/LB/SY/KW): pure OpenSooq areas, per-city only
    if (hasOpensooqData(browseCountryCode) && currentGovSlug) {
      const osCity = getOpensooqCity(browseCountryCode, currentGovSlug);
      if (osCity) {
        const osLabels: string[] = [];
        const osSeen = new Set<string>();
        for (const area of osCity.areas) {
          if (!osSeen.has(area.nameAr)) { osSeen.add(area.nameAr); osLabels.push(area.nameAr); }
        }
        return [...osLabels.sort((a, b) => a.localeCompare(b, isArabic ? 'ar' : 'en')), otherLabel];
      }
    }

    const pushUnique = (label: string) => {
      if (seen.has(label)) return;
      seen.add(label);
      labels.push(label);
    };
    for (const d of rawDistricts) {
      const districtLabel = isArabic
        ? stripAdminWords(d.nameAr)
        : stripAdminWords(d.nameEn);
      // Always include the district itself (pushUnique dedupes)
      pushUnique(districtLabel);

      const villages = d.villages ?? [];
      for (const v of villages) {
        const villageLabel = isArabic
          ? stripAdminWords(v.nameAr)
          : stripAdminWords(v.nameEn);
        pushUnique(villageLabel);
      }
    }
    // OpenSooq extras for this governorate (deduped against GeoNames by display label)
    if (browseCountryCode === 'JO' && currentGovSlug) {
      const extras = JO_OPENSOOQ_AREAS[currentGovSlug] ?? [];
      for (const extra of extras) {
        const label = isArabic ? extra.nameAr : extra.nameEn;
        pushUnique(label);
      }
    }
    for (const c of rawCamps) {
      const name = isArabic ? c.nameAr : c.nameEn;
      if (!seen.has(name)) { labels.push(name); seen.add(name); }
    }
    return [...labels.sort((a, b) => a.localeCompare(b, isArabic ? 'ar' : 'en')), otherLabel];
  }, [selectedCity, rawDistricts, rawCamps, isArabic, otherLabel, browseCountryCode, currentGovSlug]);

  const resolveNeighborhoodLabel = useCallback((saved: string): string | null => {
    if (!saved) return null;
    const rawBase = stripSuffix(saved);
    const baseName = browseCountryCode === 'JO' ? stripAdminWords(rawBase) : rawBase;
    const normalizedBase = normalizeArabic(baseName);

    // Villages first (flat UX): return plain stripped village name
    for (const d of rawDistricts) {
      for (const v of d.villages ?? []) {
        const displayAr = stripAdminWords(v.nameAr);
        const displayEn = stripAdminWords(v.nameEn);
        const displayName = isArabic ? displayAr : displayEn;
        const mc = normalizeArabic(displayAr) === normalizedBase || normalizeArabic(displayEn) === normalizedBase;
        if (mc) return displayName;
      }
    }
    // Districts (0-village fallback or exact district match)
    for (const d of rawDistricts) {
      const displayAr = stripAdminWords(d.nameAr);
      const displayEn = stripAdminWords(d.nameEn);
      const displayName = isArabic ? displayAr : displayEn;
      if (normalizeArabic(displayAr) === normalizedBase || normalizeArabic(displayEn) === normalizedBase) {
        return displayName;
      }
    }
    // Camps
    for (const c of rawCamps) {
      const mc = normalizeArabic(isArabic ? c.nameAr : c.nameEn) === normalizedBase;
      const mo = normalizeArabic(isArabic ? c.nameEn : c.nameAr) === normalizedBase;
      if (mc || mo) return isArabic ? c.nameAr : c.nameEn;
    }
    // OpenSooq extras (custom areas not in GeoNames)
    if (browseCountryCode === 'JO' && currentGovSlug) {
      const extras = JO_OPENSOOQ_AREAS[currentGovSlug] ?? [];
      for (const extra of extras) {
        if (normalizeArabic(extra.nameAr) === normalizedBase || normalizeArabic(extra.nameEn) === normalizedBase) {
          return isArabic ? extra.nameAr : extra.nameEn;
        }
      }
    }
    return null;
  }, [rawDistricts, rawCamps, isArabic, browseCountryCode, currentGovSlug]);

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
    // OpenSooq markets: save citySlug + areaSlug (no district)
    if (hasOpensooqData(browseCountryCode) && currentGovSlug) {
      const osCity = getOpensooqCity(browseCountryCode, currentGovSlug);
      if (osCity) {
        const norm = (s: string) => normalizeArabic(s).replace(/\s+/g, ' ').trim();
        const target = norm(neighborhoodLabel);
        const match = osCity.areas.find(a => norm(a.nameAr) === target);
        if (match) {
          return {
            citySlug: currentGovSlug,
            districtSlug: undefined,
            neighborhoodSlug: match.slug === 'other' ? undefined : match.slug,
          };
        }
        // Not found → custom under the city
        return {
          citySlug: currentGovSlug,
          districtSlug: undefined,
          neighborhoodSlug: undefined,
        };
      }
    }
    const verified = preserveVerifiedJordanSelection(browseCountryCode, cityLabel, neighborhoodLabel, postDraft);
    if (verified) return verified;
    return resolveTraditionalLocationSlugs(browseCountryCode, cityLabel, neighborhoodLabel);
  }, [browseCountryCode, currentGovSlug, postDraft.city, postDraft.citySlug, postDraft.districtSlug, postDraft.neighborhood, postDraft.neighborhoodSlug]);

  const saveAndContinue = useCallback(() => {
    if (validationError) return;

    const finalCity = isOtherValue(selectedCity) && customCity.trim()
      ? customCity.trim()
      : selectedCity;
    const finalNeighborhood = isOtherValue(selectedNeighborhood) && customNeighborhood.trim()
      ? customNeighborhood.trim()
      : selectedNeighborhood;

    let { citySlug, districtSlug, neighborhoodSlug } = resolveSlugsAtSave(finalCity, finalNeighborhood);

    // For Amman, prefer the merged list resolution so OpenSooq entries map correctly
    if (browseCountryCode === 'JO' && citySlug === 'amman' && finalNeighborhood) {
      const merged = buildMergedAmmanAreas();
      const exact = merged.find(a =>
        normalizeArabic(isArabic ? a.nameAr : a.nameEn) ===
        normalizeArabic(finalNeighborhood)
      );
      if (exact) {
        let dSlug = exact.districtSlug;
        let nSlug = exact.neighborhoodSlug;
        if (exact.source === 'opensooq' && !dSlug) {
          const m = matchOpenSooqToGeoNames(exact.nameAr, exact.nameEn);
          if (m) { dSlug = m.districtSlug; nSlug = m.neighborhoodSlug; }
        }
        districtSlug = dSlug ?? undefined;
        neighborhoodSlug = nSlug ?? undefined;
        // neighborhood display is already finalNeighborhood; strip if needed but keep as-is for now
      }
    }


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
