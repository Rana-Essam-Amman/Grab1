import React from 'react';
import { LocationHierarchyFilter } from './LocationHierarchyFilter';
import { useUIStore } from '@/store/ui.slice';

interface Props {
  readonly isArabic: boolean;
  readonly countryCode: string;
  readonly activeNeighborhood: string | null;
  readonly onCityChange: (cityEn: string, cityAr: string) => void;
  readonly onNeighborhoodChange: (neighborhood: string | null) => void;
}

export const FiltersLocationBlock: React.FC<Props> = ({
  isArabic,
  countryCode,
  activeNeighborhood,
  onCityChange,
  onNeighborhoodChange,
}) => (
  <LocationHierarchyFilter
    countryCode={countryCode}
    isArabic={isArabic}
    activeNeighborhood={activeNeighborhood}
    onSelect={onNeighborhoodChange}
    onLocationChange={(selection) => {
      if (selection.cityEn && selection.cityAr) onCityChange(selection.cityEn, selection.cityAr);
      useUIStore.setState({
        browseGovernorateSlug: selection.governorateSlug,
        browseDistrictSlug: selection.districtSlug,
        neighborhoodSlugFilter: selection.neighborhoodSlug,
      });
    }}
  />
);
