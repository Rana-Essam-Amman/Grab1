import React from 'react';
import { LocationFilterSection } from './LocationHierarchySection';
import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';
import type { HierarchyLabels } from './locationHierarchyProfile';

export const stripAdmin = (s: string): string =>
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
  readonly flatAreas: readonly {
    slug: string;
    nameAr: string;
    nameEn: string;
    parentDistrict: District | null;
    isDistrict: boolean;
  }[];
  readonly onFlatAreaSelect?: (area: {
    slug: string;
    nameAr: string;
    nameEn: string;
    parentDistrict: District | null;
    isDistrict: boolean;
  }) => void;
  readonly onGovSelect: (g: Governorate) => void;
  readonly onDistSelect: (d: District) => void;
  readonly onVillageSelect: (v: Village) => void;
  readonly onCampSelect: (c: RefugeeCamp) => void;
}

export const LocationHierarchySections: React.FC<Props> = ({
  isArabic, labels, activeNeighborhood, selectedGov, selectedDist,
  filteredGovs, filteredDistricts, filteredVillages, filteredCamps,
  flatAreas, onFlatAreaSelect,
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
    {selectedGov && flatAreas.length > 0 && (
      <LocationFilterSection
        title={stripAdmin(labels.level2 || (isArabic ? 'المنطقة' : 'Area'))}
        items={flatAreas.map(a => {
          const raw = isArabic ? a.nameAr : a.nameEn;
          const districtSuffix = a.parentDistrict
            ? stripAdmin(isArabic ? a.parentDistrict.nameAr : a.parentDistrict.nameEn)
            : '';
          return {
            slug: a.slug,
            nameAr: a.isDistrict
              ? stripAdmin(a.nameAr)
              : `${a.nameAr}${districtSuffix ? ` — ${districtSuffix}` : ''}`,
            nameEn: a.isDistrict
              ? stripAdmin(a.nameEn)
              : `${a.nameEn}${districtSuffix ? ` — ${districtSuffix}` : ''}`,
          };
        })}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        onItemSelect={(item) => {
          const original = flatAreas.find(a => a.slug === item.slug);
          if (original && onFlatAreaSelect) onFlatAreaSelect(original);
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
