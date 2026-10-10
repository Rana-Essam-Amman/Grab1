import React, { useMemo } from 'react';
import { locationsWithOther as locationsEn, locationsArWithOther as locationsAr } from '@/data/locations';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';

export interface LocationFilterSectionProps {
  readonly isArabic: boolean;
  readonly countryCode: string;
  readonly activeCity: string;
  readonly activeNeighborhood: string | null;
  readonly onCityChange: (cityEn: string, cityAr: string) => void;
  readonly onNeighborhoodChange: (neighborhood: string | null) => void;
}

const QUICK_PICK_COUNT = 6;

const chipClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
    active ? 'bg-brand border-brand text-white' : 'bg-surface border-border text-ink'
  }`;

export const LocationFilterSection: React.FC<LocationFilterSectionProps> = ({
  isArabic, countryCode, activeCity, activeNeighborhood, onCityChange, onNeighborhoodChange,
}) => {
  const cities = useMemo(() => {
    const en = locationsEn[countryCode] || {};
    const arKeys = Object.keys(locationsAr[countryCode] || {});
    return Object.keys(en).map((key, i) => ({ key, cityEn: key, cityAr: arKeys[i] || key }));
  }, [countryCode]);
  const cityOptions = useMemo(() => cities.map((c) => (isArabic ? c.cityAr : c.cityEn)), [cities, isArabic]);
  const activeCityLabel = cities.find((c) => c.cityEn === activeCity);
  const quickCities = cities.slice(0, QUICK_PICK_COUNT);
  const selectCity = (label: string) => {
    const m = cities.find((c) => (isArabic ? c.cityAr : c.cityEn) === label);
    if (m) onCityChange(m.cityEn, m.cityAr);
  };

  const neighborhoods = useMemo(() => {
    if (!activeCity) return [];
    const en = locationsEn[countryCode]?.[activeCity] || [];
    const enKeys = Object.keys(locationsEn[countryCode] || {});
    const arKeys = Object.keys(locationsAr[countryCode] || {});
    const ar = locationsAr[countryCode]?.[arKeys[enKeys.indexOf(activeCity)] || activeCity] || [];
    return en.map((n, i) => ({ key: n, nameEn: n, nameAr: ar[i] || n }));
  }, [countryCode, activeCity]);
  const neighOptions = useMemo(() => neighborhoods.map((n) => (isArabic ? n.nameAr : n.nameEn)), [neighborhoods, isArabic]);
  const activeNeighLabel = neighborhoods.find((n) => n.nameEn === activeNeighborhood);
  const quickNeighs = neighborhoods.slice(0, QUICK_PICK_COUNT);
  const selectNeigh = (label: string) => {
    const m = neighborhoods.find((n) => (isArabic ? n.nameAr : n.nameEn) === label);
    onNeighborhoodChange(m ? m.nameEn : null);
  };

  return (
    <div className="flex flex-col gap-3" data-testid="location-filter-section">
      <div>
        <p className="text-[11px] font-bold text-ink-muted mb-2">{isArabic ? 'المدينة' : 'City'}</p>
        <div className="flex flex-wrap gap-2 mb-2" data-testid="location-city-quickpicks">
          {quickCities.map((c) => (
            <button key={c.key} type="button" data-testid="filter-city-quickpick" data-slug={c.cityEn}
              onClick={() => onCityChange(c.cityEn, c.cityAr)} className={chipClass(activeCity === c.cityEn)}>
              {isArabic ? c.cityAr : c.cityEn}
            </button>
          ))}
        </div>
        <div data-testid="filter-city-dropdown">
          <SearchableDropdown options={cityOptions} value={activeCityLabel ? (isArabic ? activeCityLabel.cityAr : activeCityLabel.cityEn) : ''}
            onChange={selectCity} placeholder={isArabic ? 'ابحث عن مدينة...' : 'Search city...'} isArabic={isArabic} />
        </div>
      </div>

      {neighborhoods.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-ink-muted mb-2">{isArabic ? 'المنطقة' : 'Neighborhood'}</p>
          <div className="flex flex-wrap gap-2 mb-2" data-testid="location-neighborhood-quickpicks">
            <button type="button" data-testid="filter-neighborhood-all" onClick={() => onNeighborhoodChange(null)}
              className={chipClass(!activeNeighborhood)}>
              {isArabic ? 'الكل' : 'All'}
            </button>
            {quickNeighs.map((n) => (
              <button key={n.key} type="button" data-testid="filter-neighborhood-quickpick" data-slug={n.nameEn}
                onClick={() => onNeighborhoodChange(activeNeighborhood === n.nameEn ? null : n.nameEn)}
                className={chipClass(activeNeighborhood === n.nameEn)}>
                {isArabic ? n.nameAr : n.nameEn}
              </button>
            ))}
          </div>
          <div data-testid="filter-neighborhood-dropdown">
            <SearchableDropdown options={neighOptions} value={activeNeighLabel ? (isArabic ? activeNeighLabel.nameAr : activeNeighLabel.nameEn) : ''}
              onChange={selectNeigh} placeholder={isArabic ? 'ابحث عن حي...' : 'Search neighborhood...'} isArabic={isArabic} />
          </div>
        </div>
      )}
    </div>
  );
};
