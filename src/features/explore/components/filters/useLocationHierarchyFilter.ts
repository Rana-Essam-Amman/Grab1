import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';
import { campsForGovernorate } from './locationHierarchyProfile';
import {
  campBelongsToGovernorate, childSelection, districtSelection, emptySelection, governorateSelection,
} from './locationHierarchySelection';

interface Params {
  readonly countryCode: string;
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly onSelect: (label: string | null) => void;
  readonly onLocationChange?: (selection: ReturnType<typeof emptySelection>) => void;
  readonly initialGovSlug?: string | null;
  readonly initialDistSlug?: string | null;
}


type FlatArea = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  parentDistrict: District | null;
  isDistrict: boolean;
};

const filterItems = <T extends { nameAr: string; nameEn: string }>(items: readonly T[], term: string): readonly T[] => {
  const q = normalizeArabic(term.trim());
  if (!q) return items;
  return items.filter((item) => normalizeArabic(item.nameAr).includes(q) || item.nameEn.toLowerCase().includes(q));
};

const isActive = (active: string | null, item: { nameAr: string; nameEn: string }): boolean =>
  active === item.nameAr || active === item.nameEn;

export function useLocationHierarchyFilter({
  countryCode, isArabic, activeNeighborhood, onSelect, onLocationChange, initialGovSlug = null, initialDistSlug = null,
}: Params) {
  const [textFilter, setTextFilter] = useState('');
  const [selectedGov, setSelectedGov] = useState<string | null>(initialGovSlug);
  const [selectedDist, setSelectedDist] = useState<string | null>(initialDistSlug);
  const previousCountryCode = useRef(countryCode);

  useEffect(() => {
    setSelectedGov(initialGovSlug ?? null);
    setSelectedDist(initialDistSlug ?? null);
    if (!initialGovSlug && !initialDistSlug) setTextFilter('');
  }, [initialGovSlug, initialDistSlug]);

  useEffect(() => {
    if (previousCountryCode.current === countryCode) return;
    previousCountryCode.current = countryCode;
    setTextFilter('');
    setSelectedGov(null);
    setSelectedDist(null);
    onSelect(null);
    onLocationChange?.(emptySelection());
  }, [countryCode, onSelect, onLocationChange]);

  const governorates = useMemo(() => getAllGovernorates(countryCode), [countryCode]);
  const districts = useMemo(() => (selectedGov ? getAllDistricts(countryCode, selectedGov) : []), [countryCode, selectedGov]);
  const villages = useMemo(
    () => (selectedGov && selectedDist ? districts.find((d) => d.slug === selectedDist)?.villages ?? [] : []),
    [selectedGov, selectedDist, districts],
  );
  const camps = useMemo(() => campsForGovernorate(getAllCamps(countryCode), selectedGov), [countryCode, selectedGov]);
  const filteredGovs = useMemo(() => filterItems(governorates, textFilter), [governorates, textFilter]);
  const filteredDistricts = useMemo(() => filterItems(districts, textFilter), [districts, textFilter]);
  const filteredVillages = useMemo(() => filterItems(villages, textFilter), [villages, textFilter]);
  const filteredCamps = useMemo(() => filterItems(camps, textFilter), [camps, textFilter]);

  const villagesUnderGov = useMemo(() => {
    if (!selectedGov) return [];
    const gov = governorates.find(g => g.slug === selectedGov) ?? null;
    if (!gov) return [];
    return gov.districts.flatMap(d =>
      (d.villages ?? []).map(v => ({ ...v, parentDistrict: d }))
    );
  }, [selectedGov, governorates]);

  const parentDistrictOf = useCallback((villageSlug: string) => {
    for (const d of (governorates.find(g => g.slug === selectedGov)?.districts ?? [])) {
      if ((d.villages ?? []).some(v => v.slug === villageSlug)) return d;
    }
    return null;
  }, [selectedGov, governorates]);
  const flatAreas = useMemo(() => {
    if (!selectedGov) return [];
    const gov = governorates.find(g => g.slug === selectedGov) ?? null;
    if (!gov) return [];
    const areas: FlatArea[] = [];
    for (const d of gov.districts ?? []) {
      if (d.slug === 'unverified') continue;
      areas.push({ id: `district:${d.slug}`, slug: d.slug, nameAr: d.nameAr, nameEn: d.nameEn, parentDistrict: null, isDistrict: true });
      for (const v of (d.villages ?? [])) {
        areas.push({ id: `village:${d.slug}:${v.slug}`, slug: v.slug, nameAr: v.nameAr, nameEn: v.nameEn, parentDistrict: d, isDistrict: false });
      }
    }
    return areas;
  }, [selectedGov, governorates]);

  const filteredFlatAreas = useMemo(
    () => filterItems(flatAreas, textFilter),
    [flatAreas, textFilter],
  );

  const onGovSelect = (g: Governorate) => {
    const next = selectedGov === g.slug ? null : g;
    setSelectedGov(next?.slug ?? null);
    setSelectedDist(null);
    onSelect(null);
    onLocationChange?.(governorateSelection(next, isArabic));
  };

  const onDistSelect = (d: District) => {
    const next = selectedDist === d.slug ? null : d;
    setSelectedDist(next?.slug ?? null);
    onSelect(null);
    onLocationChange?.(districtSelection(selectedGov, next, isArabic));
  };

  const setSelectedDistrict = useCallback((slug: string | null) => {
    setSelectedDist(slug);
  }, []);

  const onVillageSelect = (v: Village) => {
    const next = isActive(activeNeighborhood, v) ? null : v;
    onSelect(next ? (isArabic ? v.nameAr : v.nameEn) : null);
    onLocationChange?.(childSelection(selectedGov, selectedDist, next, isArabic));
  };

  const onCampSelect = (c: RefugeeCamp) => {
    if (!campBelongsToGovernorate(c, selectedGov)) return;
    const next = isActive(activeNeighborhood, c) ? null : c;
    onSelect(next ? (isArabic ? c.nameAr : c.nameEn) : null);
    onLocationChange?.(childSelection(selectedGov, null, next, isArabic));
  };

  return {
    textFilter, setTextFilter, selectedGov, selectedDist,
    filteredGovs, filteredDistricts, filteredVillages, filteredCamps, villagesUnderGov, parentDistrictOf, flatAreas, filteredFlatAreas,
    onGovSelect, onDistSelect, onVillageSelect, onCampSelect, setSelectedDistrict,
  };
}
