import React from 'react';
import { useLocationHierarchyFilter } from './useLocationHierarchyFilter';
import { JordanExploreSearchResults } from './JordanExploreSearchResults';
import { LocationHierarchySections } from './LocationHierarchySections';
import { hierarchyLabels } from './locationHierarchyProfile';
import type { JordanLocationSearchResult } from '@/features/post-wizard/helpers/jordanLocationIndex';
import { matchOpenSooqToGeoNames } from '@/features/post-wizard/helpers/ammanAreaResolver';
interface Props {
  readonly countryCode: string; readonly isArabic: boolean; readonly activeNeighborhood: string | null;
  readonly onSelect: (label: string | null) => void;
  readonly onLocationChange?: (selection: { readonly governorateSlug: string | null; readonly districtSlug: string | null; readonly neighborhoodSlug: string | null; readonly label: string | null; readonly cityEn: string | null; readonly cityAr: string | null; }) => void;
  readonly initialGovSlug?: string | null; readonly initialDistSlug?: string | null;
}

export const LocationHierarchyFilter: React.FC<Props> = ({
  countryCode,
  isArabic,
  activeNeighborhood,
  onSelect,
  onLocationChange,
  initialGovSlug,
  initialDistSlug,
}) => {
  const {
    textFilter,
    setTextFilter,
    selectedGov,
    selectedDist,
    filteredGovs,
    filteredDistricts,
    filteredVillages,
    filteredCamps,
    flatAreas,
    filteredFlatAreas,
    setSelectedDistrict,
    onGovSelect,
    onDistSelect,
    onVillageSelect,
    onCampSelect,
  } = useLocationHierarchyFilter({
    countryCode,
    isArabic,
    activeNeighborhood,
    onSelect,
    onLocationChange,
    initialGovSlug,
    initialDistSlug,
  });

  const handleJordanDirectSelect = (item: JordanLocationSearchResult) => {
    const label = isArabic ? item.nameAr : item.nameEn;
    onLocationChange?.({
      governorateSlug: item.citySlug,
      districtSlug: item.districtSlug ?? null,
      neighborhoodSlug: item.neighborhoodSlug ?? null,
      label,
      cityEn: item.cityEn,
      cityAr: item.cityAr,
    });
    onSelect(item.neighborhoodSlug ? label : null);
    setTextFilter('');
  };

  const labels = hierarchyLabels(countryCode, isArabic);
  const selectedGovernorate = filteredGovs.find(g => g.slug === selectedGov) ?? null;
  const isJordanDirectSearch = countryCode === 'JO' && textFilter.trim().length > 0;

  return (
    <div className="flex flex-col gap-3 mt-3" data-testid="location-hierarchy-filter">
      <input
        type="text"
        value={textFilter}
        onChange={(e) => setTextFilter(e.target.value)}
        placeholder={isArabic ? 'ابحث عن مدينة أو منطقة أو حي...' : 'Search city, area, or neighbourhood...'}
        className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
        data-testid="geo-hierarchy-search"
      />

      {isJordanDirectSearch ? (
        <JordanExploreSearchResults query={textFilter} isArabic={isArabic} onSelect={handleJordanDirectSelect} />
      ) : (
        <LocationHierarchySections
          isArabic={isArabic}
          labels={labels}
          activeNeighborhood={activeNeighborhood}
          selectedGov={selectedGov}
          selectedDist={selectedDist}
          selectedGovernorate={selectedGovernorate}
          filteredGovs={filteredGovs}
          filteredDistricts={filteredDistricts}
          filteredVillages={filteredVillages}
          filteredCamps={filteredCamps}
          flatAreas={filteredFlatAreas}
          onFlatAreaSelect={(area) => {
            const label = isArabic ? area.nameAr : area.nameEn;
            let districtSlug = area.districtSlug, neighborhoodSlug = area.neighborhoodSlug;
            if (countryCode === 'JO' && area.source === 'opensooq' && !districtSlug) {
              const m = matchOpenSooqToGeoNames(area.nameAr, area.nameEn);
              if (m) { districtSlug = m.districtSlug; neighborhoodSlug = m.neighborhoodSlug; }
            }
            setSelectedDistrict(districtSlug);
            onLocationChange?.({ governorateSlug: selectedGov ?? null, districtSlug, neighborhoodSlug, label, cityEn: null, cityAr: null });
            onSelect(neighborhoodSlug || area.source === 'opensooq' ? label : null); setTextFilter('');
          }}
          onGovSelect={onGovSelect}
          onDistSelect={onDistSelect}
          onVillageSelect={onVillageSelect}
          onCampSelect={onCampSelect}
        />
      )}
    </div>
  );
};
