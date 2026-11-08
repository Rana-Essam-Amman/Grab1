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
  readonly selectedGovernorate?: Governorate | null;
  readonly filteredGovs: readonly Governorate[];
  readonly filteredDistricts: readonly District[];
  readonly filteredVillages: readonly Village[];
  readonly filteredCamps: readonly RefugeeCamp[];
  readonly flatAreas: readonly {
    id: string;
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
  isArabic, labels, activeNeighborhood, selectedGov, selectedDist, selectedGovernorate,
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
          const cleanAr = stripAdmin(a.nameAr);
          const cleanEn = stripAdmin(a.nameEn);
          const govAr = selectedGovernorate?.nameAr ?? '';
          const govEn = selectedGovernorate?.nameEn ?? '';
          const districtCollidesAr = a.isDistrict && cleanAr === govAr;
          const districtCollidesEn = a.isDistrict && cleanEn === govEn;
          const districtSuffixAr = a.parentDistrict
            ? stripAdmin(a.parentDistrict.nameAr)
            : '';
          const districtSuffixEn = a.parentDistrict
            ? stripAdmin(a.parentDistrict.nameEn)
            : '';
          return {
            slug: a.id,
            nameAr: a.isDistrict
              ? `${cleanAr}${districtCollidesAr ? ' (منطقة)' : ''}`
              : `${a.nameAr}${districtSuffixAr ? ` — ${districtSuffixAr}` : ''}`,
            nameEn: a.isDistrict
              ? `${cleanEn}${districtCollidesEn ? ' (Area)' : ''}`
              : `${a.nameEn}${districtSuffixEn ? ` — ${districtSuffixEn}` : ''}`,
          };
        })}
        isArabic={isArabic}
        activeNeighborhood={activeNeighborhood}
        selectedSlug={selectedDist ? `district:${selectedDist}` : undefined}
        onItemSelect={(item) => {
          const original = flatAreas.find(a => a.id === item.slug);
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
