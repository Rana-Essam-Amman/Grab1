import React from 'react';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';
import { JordanLocationPicker } from './JordanLocationPicker';
import type { useEditListingLocation } from '../hooks/useEditListingLocation';

type LocationController = ReturnType<typeof useEditListingLocation>;

interface Props {
  readonly isArabic: boolean;
  readonly location: LocationController;
}

function levelLabel(isArabic: boolean, level?: { labelAr: string; labelEn: string }): string {
  return isArabic ? (level?.labelAr || '') : (level?.labelEn || '');
}

function selectedLabel(
  isArabic: boolean,
  slug: string | undefined,
  items: readonly { slug: string; nameAr: string; nameEn: string }[],
): string {
  const hit = items.find((item) => item.slug === slug);
  return hit ? (isArabic ? hit.nameAr : hit.nameEn) : '';
}

export const EditListingLocation: React.FC<Props> = ({ isArabic, location }) => {
  if (!location.profile) return null;
  const [level1, level2, level3] = location.profile.visibleLevels;

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

  const cityOptions = location.governorates.map((g) => (isArabic ? g.nameAr : g.nameEn));
  const districtOptions = location.districts.map((d) => (isArabic ? d.nameAr : d.nameEn));
  const villageOptions = location.villages.map((v) => (isArabic ? v.nameAr : v.nameEn));
  const districtValue = selectedLabel(isArabic, location.location.districtSlug, location.districts);
  const localityValue = selectedLabel(isArabic, location.location.neighborhoodSlug, location.villages);

  return (
    <div className="flex flex-col gap-3" data-testid="edit-listing-location">
      <SearchableDropdown
        options={cityOptions}
        value={location.location.city}
        onChange={(value) => {
          const gov = location.governorates.find((g) => (isArabic ? g.nameAr : g.nameEn) === value);
          if (gov) location.onGovernorate(gov.slug);
        }}
        placeholder={levelLabel(isArabic, level1)}
        isArabic={isArabic}
      />
      {location.location.citySlug && (
        <SearchableDropdown
          options={districtOptions}
          value={districtValue}
          onChange={(value) => {
            const district = location.districts.find((d) => (isArabic ? d.nameAr : d.nameEn) === value);
            if (district) location.onDistrict(district.slug);
          }}
          placeholder={levelLabel(isArabic, level2)}
          isArabic={isArabic}
        />
      )}
      {location.hasLevel3 && location.location.districtSlug && (
        <div data-testid="edit-location-level-3">
          <SearchableDropdown
            options={villageOptions}
            value={localityValue}
            onChange={(value) => {
              const locality = location.villages.find((v) => (isArabic ? v.nameAr : v.nameEn) === value);
              if (locality) location.onLocality(locality.slug);
            }}
            placeholder={levelLabel(isArabic, level3)}
            isArabic={isArabic}
          />
        </div>
      )}
    </div>
  );
};
