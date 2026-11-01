import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';

interface LocationSelection {
  readonly governorateSlug: string | null;
  readonly districtSlug: string | null;
  readonly neighborhoodSlug: string | null;
  readonly label: string | null;
  readonly cityEn: string | null;
  readonly cityAr: string | null;
}

interface Params {
  readonly countryCode: string;
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly onSelect: (label: string | null) => void;
  readonly onLocationChange?: (selection: LocationSelection) => void;
  readonly initialGovSlug?: string | null;
  readonly initialDistSlug?: string | null;
}

const filterItems = <T extends { nameAr: string; nameEn: string }>(items: readonly T[], term: string): readonly T[] => {
  const q = normalizeArabic(term.trim());
  if (!q) return items;
  return items.filter((item) => normalizeArabic(item.nameAr).includes(q) || item.nameEn.toLowerCase().includes(q));
};

export function useLocationHierarchyFilter({
  countryCode,
  isArabic,
  activeNeighborhood,
  onSelect,
  onLocationChange,
  initialGovSlug = null,
  initialDistSlug = null,
}: Params) {
  const [textFilter, setTextFilter] = useState('');
  const [selectedGov, setSelectedGov] = useState<string | null>(initialGovSlug);
  const [selectedDist, setSelectedDist] = useState<string | null>(initialDistSlug);
  const previousCountryCode = useRef(countryCode);

  useEffect(() => {
    if (previousCountryCode.current === countryCode) return;
    previousCountryCode.current = countryCode;
    setTextFilter('');
    setSelectedGov(null);
    setSelectedDist(null);
    onSelect(null);
  }, [countryCode, onSelect]);

  const governorates = useMemo(() => getAllGovernorates(countryCode), [countryCode]);
  const districts = useMemo(
    () => (selectedGov ? getAllDistricts(countryCode, selectedGov) : []),
    [countryCode, selectedGov],
  );
  const villages = useMemo(
    () =>
      selectedGov && selectedDist
        ? districts.find((d) => d.slug === selectedDist)?.villages ?? []
        : [],
    [selectedGov, selectedDist, districts],
  );
  const camps = useMemo(() => getAllCamps(countryCode), [countryCode]);

  const filteredGovs = useMemo(() => filterItems(governorates, textFilter), [governorates, textFilter]);
  const filteredDistricts = useMemo(() => filterItems(districts, textFilter), [districts, textFilter]);
  const filteredVillages = useMemo(() => filterItems(villages, textFilter), [villages, textFilter]);
  const filteredCamps = useMemo(() => filterItems(camps, textFilter), [camps, textFilter]);

  const onGovSelect = (g: Governorate) => {
    const next = selectedGov === g.slug ? null : g.slug;
    setSelectedGov(next);
    setSelectedDist(null);
    const label = next ? (isArabic ? g.nameAr : g.nameEn) : null;
    onSelect(null);
    onLocationChange?.({
      governorateSlug: next,
      districtSlug: null,
      neighborhoodSlug: null,
      label,
      cityEn: next ? g.nameEn : null,
      cityAr: next ? g.nameAr : null,
    });
  };

  const onDistSelect = (d: District) => {
    const next = selectedDist === d.slug ? null : d.slug;
    setSelectedDist(next);
    const label = next ? (isArabic ? d.nameAr : d.nameEn) : null;
    onSelect(null);
    onLocationChange?.({
      governorateSlug: selectedGov,
      districtSlug: next,
      neighborhoodSlug: null,
      label,
      cityEn: null,
      cityAr: null,
    });
  };

  const onVillageSelect = (v: Village) => {
    const label = isArabic ? v.nameAr : v.nameEn;
    const active = activeNeighborhood === v.nameAr || activeNeighborhood === v.nameEn;
    const next = active ? null : label;
    onSelect(next);
    onLocationChange?.({
      governorateSlug: selectedGov,
      districtSlug: selectedDist,
      neighborhoodSlug: next ? v.slug : null,
      label: next,
      cityEn: null,
      cityAr: null,
    });
  };

  const onCampSelect = (c: RefugeeCamp) => {
    const label = isArabic ? c.nameAr : c.nameEn;
    const active = activeNeighborhood === c.nameAr || activeNeighborhood === c.nameEn;
    const next = active ? null : label;
    onSelect(next);
    onLocationChange?.({
      governorateSlug: selectedGov,
      districtSlug: null,
      neighborhoodSlug: next ? c.slug : null,
      label: next,
      cityEn: null,
      cityAr: null,
    });
  };

  return {
    textFilter,
    setTextFilter,
    selectedGov,
    selectedDist,
    filteredGovs,
    filteredDistricts,
    filteredVillages,
    filteredCamps,
    onGovSelect,
    onDistSelect,
    onVillageSelect,
    onCampSelect,
  };
}
