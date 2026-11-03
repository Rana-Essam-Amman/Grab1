import React from 'react';
import { LocationFilterSection } from './LocationHierarchySection';
import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';

interface Props {
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly selectedGov: string | null;
  readonly selectedDist: string | null;
  readonly filteredGovs: readonly Governorate[];
  readonly filteredDistricts: readonly District[];
  readonly filteredVillages: readonly Village[];
  readonly filteredCamps: readonly RefugeeCamp[];
  readonly onGovSelect: (g: Governorate) => void;
  readonly onDistSelect: (d: District) => void;
  readonly onVillageSelect: (v: Village) => void;
  readonly onCampSelect: (c: RefugeeCamp) => void;
}

export const LocationHierarchySections: React.FC<Props> = ({
  isArabic,
  activeNeighborhood,
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
}) => (
  <>
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
  </>
);
