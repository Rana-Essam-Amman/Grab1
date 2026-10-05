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
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {filteredCountries.map((c) => {
        const isSelected = c.code === selectedCountry;
        return (
          <button
            key={c.code}
            onClick={() => handleCountryChange(c.code)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border shrink-0 transition-all cursor-pointer ${
              isSelected
                ? 'border-brand bg-brand text-white font-bold'
                : 'border-border bg-surface-sunken text-ink-muted hover:border-accent'
            }`}
          >
            <img src={c.flagUrl} alt={c.nameEn} className="w-4 h-3 object-cover rounded-[2px]" />
            <span className="text-xs">{isArabic ? c.nameAr : c.nameEn}</span>
          </button>
        );
      })}
    </div>
  );
};
