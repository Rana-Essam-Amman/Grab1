import React from 'react';

interface CountrySelectorTabsProps {
  filteredCountries: Array<{ code: 'JO' | 'LB' | 'PS' | 'SY' | 'SA'; nameEn: string; nameAr: string; flagUrl: string }>;
  selectedCountry: string;
  isArabic: boolean;
  handleCountryChange: (code: string) => void;
}

export const CountrySelectorTabs: React.FC<CountrySelectorTabsProps> = ({
  filteredCountries,
  selectedCountry,
  isArabic,
  handleCountryChange,
}) => {
  return (
    <div className={`p-3 bg-surface border-b border-border grid gap-1.5 ${filteredCountries.length === 1 ? 'grid-cols-1' : 'grid-cols-5'}`}>
      {filteredCountries.map((c) => {
        const isSelected = c.code === selectedCountry;
        return (
          <button
            key={c.code}
            onClick={() => handleCountryChange(c.code)}
            className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
              isSelected
                ? 'border-primary bg-surface text-primary font-bold shadow-xs'
                : 'border-border text-ink-muted hover:border-primary/40'
            }`}
          >
            <img src={c.flagUrl} alt={c.nameEn} className="w-5 h-3.5 object-cover rounded-[2px]" />
            <span className="text-[10px] sm:text-[11px] truncate w-full text-center">{isArabic ? c.nameAr : c.nameEn}</span>
          </button>
        );
      })}
    </div>
  );
};
