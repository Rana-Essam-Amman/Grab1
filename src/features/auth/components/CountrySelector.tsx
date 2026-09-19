import React from 'react';
import { Global } from 'iconsax-react';
import { countries } from '@/data/countries';
import { getFlagEmoji } from '../helpers/phoneValidation';

export interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
  isArabic: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  isArabic,
  disabled = false,
  size = 'lg',
  label,
}) => {
  const heightClass = size === 'sm' ? 'h-10 text-xs px-3' : size === 'md' ? 'h-11 px-3 text-sm' : 'h-12 px-4 text-sm md:text-base';
  
  return (
    <div>
      {label !== undefined ? (
        label && (
          <label className="block text-sm font-bold text-ink mb-2 flex items-center gap-1.5">
            <Global size={15} variant="Linear" color="#E57E25" />
            {label}
          </label>
        )
      ) : (
        <label className="block text-sm font-bold text-ink mb-2 flex items-center gap-1.5">
          <Global size={15} variant="Linear" color="#E57E25" />
          {isArabic ? 'اختر بلد السوق الحالي *' : 'Choose Market Country *'}
        </label>
      )}
      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          disabled={disabled}
          className={`w-full ${heightClass} rounded-xl bg-surface border border-border text-ink font-semibold appearance-none focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50`}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {getFlagEmoji(c.code)} {isArabic ? c.nameAr : c.nameEn}
            </option>
          ))}
        </select>
        <div className="absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-ink-muted">
          ▼
        </div>
      </div>
    </div>
  );
};
