import React from 'react';
import { LocationFilterSection } from './LocationHierarchySection';
import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';
import type { HierarchyLabels } from './locationHierarchyProfile';

interface Props {
  readonly isArabic: boolean;
  readonly labels: HierarchyLabels;
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
  isArabic, labels, activeNeighborhood, selectedGov, selectedDist,
  filteredGovs, filteredDistricts, filteredVillages, filteredCamps,
  onGovSelect, onDistSelect, onVillageSelect, onCampSelect,
}) => (
  <>
    {labels.level1 && (
      <LocationFilterSection
        title={labels.level1}
        items={filteredGovs}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        selectedSlug={selectedGov}
        onItemSelect={onGovSelect}
      />
    )}
    {selectedGov && labels.level2 && (
      <LocationFilterSection
        title={labels.level2}
        items={filteredDistricts}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        selectedSlug={selectedDist}
        onItemSelect={onDistSelect}
      />
    )}
    {selectedDist && filteredVillages.length > 0 && (
      <div data-testid="hierarchy-level-3">
        <LocationFilterSection
          title={labels.level3 || labels.level2 || (isArabic ? 'الحي' : 'Neighbourhood')}
          items={filteredVillages}
          isArabic={isArabic}
          activeNeighborhood={activeNeighborhood}
          onItemSelect={onVillageSelect}
        />
      </div>
    )}
    {selectedGov && (
      <div data-testid="hierarchy-camps">
        <LocationFilterSection
          title={isArabic ? 'مخيمات' : 'Refugee Camps'}
          items={filteredCamps}
          isArabic={isArabic}
          activeNeighborhood={activeNeighborhood}
          onItemSelect={onCampSelect}
        />
      </div>
    )}
  </>
);
