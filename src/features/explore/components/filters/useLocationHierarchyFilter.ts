import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';
import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';

interface Params {
  readonly countryCode: string;
  readonly activeNeighborhood: string | null;
  readonly onSelect: (nameAr: string | null) => void;
}

const filterItems = <T extends { nameAr: string; nameEn: string }>(
  items: readonly T[],
  term: string,
): readonly T[] => {
  const trimmed = term.trim();
  const q = trimmed.toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) => item.nameAr.includes(trimmed) || item.nameEn.toLowerCase().includes(q),
  );
};

export function useLocationHierarchyFilter({ countryCode, activeNeighborhood, onSelect }: Params) {
  const [textFilter, setTextFilter] = useState('');
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
  const [selectedDist, setSelectedDist] = useState<string | null>(null);
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
    onSelect(next ? g.nameAr : null);
  };

  const onDistSelect = (d: District) => {
    const next = selectedDist === d.slug ? null : d.slug;
    setSelectedDist(next);
    onSelect(next ? d.nameAr : null);
  };

  const onVillageSelect = (v: Village) => {
    onSelect(activeNeighborhood === v.nameAr ? null : v.nameAr);
  };

  const onCampSelect = (c: RefugeeCamp) => {
    onSelect(activeNeighborhood === c.nameAr ? null : c.nameAr);
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
