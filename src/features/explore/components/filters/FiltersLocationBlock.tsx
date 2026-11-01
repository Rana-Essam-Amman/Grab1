import React from 'react';
import { LocationHierarchyFilter } from './LocationHierarchyFilter';

export interface LocationDraft {
  readonly governorateSlug: string | null;
  readonly districtSlug: string | null;
  readonly neighborhoodSlug: string | null;
  readonly cityEn: string | null;
  readonly cityAr: string | null;
}

interface Props {
  readonly isArabic: boolean;
  readonly countryCode: string;
  readonly activeNeighborhood: string | null;
  readonly initialGovSlug?: string | null;
  readonly initialDistSlug?: string | null;
  readonly onCityChange: (cityEn: string, cityAr: string) => void;
  readonly onNeighborhoodChange: (neighborhood: string | null) => void;
  readonly onDraftChange: (draft: LocationDraft) => void;
}

export const FiltersLocationBlock: React.FC<Props> = ({
  isArabic,
  countryCode,
  activeNeighborhood,
  initialGovSlug,
  initialDistSlug,
  onCityChange,
  onNeighborhoodChange,
  onDraftChange,
}) => (
  <LocationHierarchyFilter
    countryCode={countryCode}
    isArabic={isArabic}
    activeNeighborhood={activeNeighborhood}
    initialGovSlug={initialGovSlug}
    initialDistSlug={initialDistSlug}
    onSelect={onNeighborhoodChange}
    onLocationChange={(selection) => {
      if (selection.cityEn && selection.cityAr) onCityChange(selection.cityEn, selection.cityAr);
      onDraftChange({
        governorateSlug: selection.governorateSlug,
        districtSlug: selection.districtSlug,
        neighborhoodSlug: selection.neighborhoodSlug,
        cityEn: selection.cityEn,
        cityAr: selection.cityAr,
      });
    }}
  />
);
