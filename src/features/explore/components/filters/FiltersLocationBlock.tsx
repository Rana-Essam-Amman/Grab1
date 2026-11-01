import React from 'react';
import { LocationFilterSection } from './LocationFilterSection';
import { LocationHierarchyFilter } from './LocationHierarchyFilter';
import { useUIStore } from '@/store/ui.slice';

interface Props {
  readonly isArabic: boolean;
  readonly countryCode: string;
  readonly activeCity: string;
  readonly activeNeighborhood: string | null;
  readonly onCityChange: (cityEn: string, cityAr: string) => void;
  readonly onNeighborhoodChange: (neighborhood: string | null) => void;
}

export const FiltersLocationBlock: React.FC<Props> = ({
  isArabic,
  countryCode,
  activeCity,
  activeNeighborhood,
  onCityChange,
  onNeighborhoodChange,
}) => (
  <>
    <LocationFilterSection
      isArabic={isArabic}
      countryCode={countryCode}
      activeCity={activeCity}
      activeNeighborhood={activeNeighborhood}
      onCityChange={onCityChange}
      onNeighborhoodChange={onNeighborhoodChange}
    />
    <LocationHierarchyFilter
      countryCode={countryCode}
      isArabic={isArabic}
      activeNeighborhood={activeNeighborhood}
      onSelect={onNeighborhoodChange}
      onLocationChange={(selection) => {
        useUIStore.setState({
          browseGovernorateSlug: selection.governorateSlug,
          browseDistrictSlug: selection.districtSlug,
          neighborhoodSlugFilter: selection.neighborhoodSlug,
        });
        if (selection.cityEn && selection.cityAr) {
          onCityChange(selection.cityEn, selection.cityAr);
        }
      }}
    />
  </>
);
