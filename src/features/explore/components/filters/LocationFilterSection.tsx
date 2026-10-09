import React, { useMemo } from 'react';
import { locationsWithOther as locationsEn, locationsArWithOther as locationsAr } from '@/data/locations';

export interface LocationFilterSectionProps {
  readonly isArabic: boolean;
  readonly countryCode: string;
  readonly activeCity: string;
  readonly activeNeighborhood: string | null;
  readonly onCityChange: (cityEn: string, cityAr: string) => void;
  readonly onNeighborhoodChange: (neighborhood: string | null) => void;
}

export const LocationFilterSection: React.FC<LocationFilterSectionProps> = ({
  isArabic, countryCode, activeCity, activeNeighborhood, onCityChange, onNeighborhoodChange,
}) => {
  const cities = useMemo(() => {
    const en = locationsEn[countryCode] || {};
    const ar = locationsAr[countryCode] || {};
    const enKeys = Object.keys(en);
    const arKeys = Object.keys(ar);
    return enKeys.map((key, i) => ({
      key,
      cityEn: key,
      cityAr: arKeys[i] || key,
    }));
  }, [countryCode]);

  const neighborhoods = useMemo(() => {
    if (!activeCity) return [];
    const en = locationsEn[countryCode]?.[activeCity] || [];
    const enKeys = Object.keys(locationsEn[countryCode] || {});
    const arKeys = Object.keys(locationsAr[countryCode] || {});
    const arCity = arKeys[enKeys.indexOf(activeCity)] || activeCity;
    const ar = locationsAr[countryCode]?.[arCity] || [];
    return en.map((n, i) => ({ key: n, nameEn: n, nameAr: ar[i] || n }));
  }, [countryCode, activeCity]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-bold text-ink-muted mb-2">
          {isArabic ? 'المدينة' : 'City'}
        </p>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => {
            const isActive = activeCity === c.cityEn;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => onCityChange(c.cityEn, c.cityAr)}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                  isActive ? 'bg-brand border-brand text-white' : 'bg-surface border-border text-ink'
                }`}
              >
                {isArabic ? c.cityAr : c.cityEn}
              </button>
            );
          })}
        </div>
      </div>

      {neighborhoods.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-ink-muted mb-2">
            {isArabic ? 'المنطقة' : 'Neighborhood'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNeighborhoodChange(null)}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                !activeNeighborhood ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </button>
            {neighborhoods.map((n) => {
              const isActive = activeNeighborhood === n.nameEn;
              return (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => onNeighborhoodChange(isActive ? null : n.nameEn)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                    isActive ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'
                  }`}
                >
                  {isArabic ? n.nameAr : n.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
