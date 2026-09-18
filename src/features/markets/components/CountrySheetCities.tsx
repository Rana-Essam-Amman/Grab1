import React from 'react';
import { Check } from 'lucide-react';

interface CountrySheetCitiesProps {
  citiesEn: string[];
  citiesAr: string[];
  selectedCountry: string;
  browseCountryCode?: string | null;
  browseCityEn?: string | null;
  browseCityAr?: string | null;
  isArabic: boolean;
  handleCitySelect: (idx: number) => void;
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
    <div className="flex flex-col gap-2 pt-1 font-cairo">
      <div className="text-xs font-bold text-ink-muted mb-2 px-1">
        {isArabic ? 'المدن والمحافظات المتاحة' : 'Available Cities & Governorates'}
      </div>
      <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
        {citiesEn.map((cityEn, idx) => {
          const cityAr = citiesAr[idx] || cityEn;
          const isCurrent =
            browseCountryCode === selectedCountry &&
            (isArabic ? browseCityAr === cityAr : browseCityEn === cityEn);
          return (
            <button
              key={cityEn}
              onClick={() => handleCitySelect(idx)}
              className={`w-full px-4 py-3 rounded-2xl border transition-all flex items-center justify-between text-start cursor-pointer ${
                isCurrent 
                  ? 'bg-brand text-white border-brand font-bold' 
                  : 'bg-surface-sunken border-line text-ink hover:border-line-strong'
              }`}
            >
              <span className="text-sm">{isArabic ? cityAr : cityEn}</span>
              {isCurrent && <Check size={16} className="text-accent shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
