import React from 'react';
import { LocationFilterSection } from './LocationHierarchySection';
import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';
import type { HierarchyLabels } from './locationHierarchyProfile';

const stripAdmin = (s: string): string =>
  s.split(/\s+/)
   .filter(t => !['لواء','قصبة','قضاء','Liwa','Qada','Qasabah'].includes(t))
   .join(' ')
   .trim() || s;

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
  readonly villagesUnderGov: readonly (Village & { parentDistrict: District })[];
  readonly parentDistrictOf: (slug: string) => District | null;
  readonly onFlatVillageSelect?: (v: Village, parent: District) => void;
  readonly onGovSelect: (g: Governorate) => void;
  readonly onDistSelect: (d: District) => void;
  readonly onVillageSelect: (v: Village) => void;
  readonly onCampSelect: (c: RefugeeCamp) => void;
}

export const LocationHierarchySections: React.FC<Props> = ({
  isArabic, labels, activeNeighborhood, selectedGov, selectedDist,
  filteredGovs, filteredDistricts, filteredVillages, filteredCamps,
  villagesUnderGov, parentDistrictOf, onFlatVillageSelect,
  onGovSelect, onDistSelect, onVillageSelect, onCampSelect,
}) => (
  <>
    {labels.level1 && (
      <LocationFilterSection
        title={stripAdmin(labels.level1)}
        items={filteredGovs}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        selectedSlug={selectedGov}
        onItemSelect={onGovSelect}
      />
    )}
    {selectedGov && villagesUnderGov.length > 0 && (
      <LocationFilterSection
        title={stripAdmin(labels.level2 || (isArabic ? 'المنطقة' : 'Area'))}
        items={villagesUnderGov}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        onItemSelect={(item) => {
          if (onFlatVillageSelect) {
            const parent = parentDistrictOf(item.slug);
            if (parent) onFlatVillageSelect(item, parent);
            else onVillageSelect(item);
          } else {
            onVillageSelect(item);
          }
        }}
      />
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
