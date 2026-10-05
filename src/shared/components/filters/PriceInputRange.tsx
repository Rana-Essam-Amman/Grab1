import React from 'react';

interface PriceInputRangeProps {
  isArabic: boolean;
  minInput: string;
  maxInput: string;
  setMinInput: (v: string) => void;
  setMaxInput: (v: string) => void;
  currencySymbol: string;
}

export const PriceInputRange: React.FC<PriceInputRangeProps> = ({
  isArabic, minInput, maxInput, setMinInput, setMaxInput, currencySymbol
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-ink">{isArabic ? 'من' : 'From'}</label>
        <div className="relative">
          <input 
            type="number" 
            value={minInput} 
            onChange={(e) => setMinInput(e.target.value)} 
            placeholder={isArabic ? 'الحد الأدنى' : 'Min Price'} 
            className="w-full h-12 px-4 rounded-xl bg-surface border-2 border-border text-sm text-ink outline-none focus:border-accent" 
          />
          <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted font-bold">{currencySymbol}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-ink">{isArabic ? 'إلى' : 'To'}</label>
        <div className="relative">
          <input 
            type="number" 
            value={maxInput} 
            onChange={(e) => setMaxInput(e.target.value)} 
            placeholder={isArabic ? 'الحد الأعلى' : 'Max Price'} 
            className="w-full h-12 px-4 rounded-xl bg-surface border-2 border-border text-sm text-ink outline-none focus:border-accent" 
          />
          <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted font-bold">{currencySymbol}</span>
        </div>
      </div>
    </div>
  );
};
