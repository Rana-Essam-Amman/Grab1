import React from 'react';
import { LocationFilterSection } from './LocationHierarchySection';
import { useLocationHierarchyFilter } from './useLocationHierarchyFilter';

interface Props {
  readonly countryCode: string;
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly onSelect: (label: string | null) => void;
  readonly onCitySelect?: (cityEn: string, cityAr: string) => void;
}

export const LocationHierarchyFilter: React.FC<Props> = ({
  countryCode,
  isArabic,
  activeNeighborhood,
  onSelect,
  onCitySelect,
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
    onGovSelect,
    onDistSelect,
    onVillageSelect,
    onCampSelect,
  } = useLocationHierarchyFilter({
    countryCode,
    isArabic,
    activeNeighborhood,
    onSelect,
    onCitySelect,
  });

  return (
    <div className="flex flex-col gap-3 mt-3" data-testid="location-hierarchy-filter">
      <input
        type="text"
        value={textFilter}
        onChange={(e) => setTextFilter(e.target.value)}
        placeholder={
          isArabic
            ? 'ابحث عن محافظة أو لواء أو قرية...'
            : 'Search governorate, district, village...'
        }
        className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
        data-testid="geo-hierarchy-search"
      />

      <LocationFilterSection
        title={isArabic ? 'المحافظة' : 'Governorate'}
        items={filteredGovs}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        selectedSlug={selectedGov}
        onItemSelect={onGovSelect}
      />

      {selectedGov && (
        <LocationFilterSection
          title={isArabic ? 'الألواء / الأقضية' : 'Districts'}
          items={filteredDistricts}
          isArabic={isArabic}
          activeNeighborhood={activeNeighborhood}
          selectedSlug={selectedDist}
          onItemSelect={onDistSelect}
        />
      )}

      {selectedDist && (
        <LocationFilterSection
          title={isArabic ? 'القرى / المناطق' : 'Villages'}
          items={filteredVillages}
          isArabic={isArabic}
          activeNeighborhood={activeNeighborhood}
          onItemSelect={onVillageSelect}
        />
      )}

      <LocationFilterSection
        title={isArabic ? 'مخيمات' : 'Refugee Camps'}
        items={filteredCamps}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        onItemSelect={onCampSelect}
      />
    </div>
  );
};
