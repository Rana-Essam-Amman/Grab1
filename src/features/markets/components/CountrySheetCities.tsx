import React from 'react';
import { TickCircle } from 'iconsax-react';
import { Icon } from '@iconify/react';

interface CountrySheetCitiesProps {
  readonly citiesEn: string[];
  readonly citiesAr: string[];
  readonly selectedCountry: string;
  readonly browseCountryCode: string;
  readonly browseCityEn: string;
  readonly browseCityAr: string;
  readonly isArabic: boolean;
  readonly handleCitySelect: (idx: number) => void;
}

export const CountrySheetCities: React.FC<CountrySheetCitiesProps> = ({
  citiesEn,
  citiesAr,
  selectedCountry,
  browseCountryCode,
  browseCityEn,
  browseCityAr,
  isArabic,
  handleCitySelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
      {citiesEn.map((cityEn, idx) => {
        const cityAr = citiesAr[idx] || cityEn;
        const isCurrent =
          browseCountryCode === selectedCountry &&
          (isArabic ? browseCityAr === cityAr : browseCityEn === cityEn);
        
        return (
          <button
            key={cityEn}
            onClick={() => handleCitySelect(idx)}
            className={`h-14 rounded-full flex items-center justify-between px-4 gap-2 transition-all active:scale-[0.98] ${
              isCurrent
                ? 'bg-[#1a2238] text-white font-bold'
                : 'bg-[#DDE3EC] text-[#0F172A] font-bold'
            }`}
          >
            <span className="text-sm truncate flex-1 text-start">
              {isArabic ? cityAr : cityEn}
            </span>
            {isCurrent ? (
              <TickCircle size={16} variant="Bold" color="#E57E25" className="shrink-0" />
            ) : (
              <Icon icon="noto:round-pushpin" width={14} height={14} className="shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};
