import React from 'react';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';
import { JordanLocationPicker } from './JordanLocationPicker';
import { selectedHierarchyLabels } from '../helpers/editListingLocation';
import type { useEditListingLocation } from '../hooks/useEditListingLocation';

type LocationController = ReturnType<typeof useEditListingLocation>;

interface Props {
  readonly isArabic: boolean;
  readonly location: LocationController;
}

const label = (isArabic: boolean, level?: { labelAr: string; labelEn: string }): string =>
  isArabic ? level?.labelAr || '' : level?.labelEn || '';

export const EditListingLocation: React.FC<Props> = ({ isArabic, location }) => {
  if (!location.profile) return null;
  const [level1, level2, level3] = location.profile.visibleLevels;
  const cityOptions = location.governorates.map((item) => isArabic ? item.nameAr : item.nameEn);
  const districtOptions = location.districts.map((item) => isArabic ? item.nameAr : item.nameEn);
  const villageOptions = location.villages.map((item) => isArabic ? item.nameAr : item.nameEn);
  const selected = selectedHierarchyLabels(isArabic, location.location, location.districts, location.villages);

  if (location.marketCode === 'JO') {
    return (
      <JordanLocationPicker
        isArabic={isArabic}
        selectedCity={location.location.city}
        selectedNeighborhood={location.location.neighborhood}
        onSelect={location.onJordan}
        onClear={location.onClear}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3" data-testid="edit-listing-location">
      <SearchableDropdown
        options={cityOptions}
        value={location.location.city}
        onChange={(value) => {
          const gov = location.governorates.find((item) => (isArabic ? item.nameAr : item.nameEn) === value);
          if (gov) location.onGovernorate(gov.slug);
        }}
        placeholder={label(isArabic, level1)}
        isArabic={isArabic}
      />
      {location.location.citySlug && (
        <SearchableDropdown
          options={districtOptions}
          value={selected.districtValue}
          onChange={(value) => {
            const district = location.districts.find((item) => (isArabic ? item.nameAr : item.nameEn) === value);
            if (district) location.onDistrict(district.slug);
          }}
          placeholder={label(isArabic, level2)}
          isArabic={isArabic}
        />
      )}
      {location.hasLevel3 && location.location.districtSlug && (
        <div data-testid="edit-location-level-3">
          <SearchableDropdown
            options={villageOptions}
            value={selected.localityValue}
            onChange={(value) => {
              const locality = location.villages.find((item) => (isArabic ? item.nameAr : item.nameEn) === value);
              if (locality) location.onLocality(locality.slug);
            }}
            placeholder={label(isArabic, level3)}
            isArabic={isArabic}
          />
        </div>
      )}
    </div>
  );
};
