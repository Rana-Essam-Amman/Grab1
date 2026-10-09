import React from 'react';
import { Input } from '@/shared/ui/Input';

export interface PriceRangeFilterSectionProps {
  readonly isArabic: boolean;
  readonly minPrice: number | null;
  readonly maxPrice: number | null;
  readonly currencySymbol: string;
  readonly onChange: (min: number | null, max: number | null) => void;
}

interface Preset {
  readonly labelAr: string;
  readonly labelEn: string;
  readonly min: number | null;
  readonly max: number | null;
}

const PRESETS: readonly Preset[] = [
  { labelAr: 'حتى 100',      labelEn: 'Under 100',    min: null, max: 100 },
  { labelAr: '100 - 500',    labelEn: '100 - 500',    min: 100,  max: 500 },
  { labelAr: '500 - 2000',   labelEn: '500 - 2000',   min: 500,  max: 2000 },
  { labelAr: '2000 - 10000', labelEn: '2000 - 10000', min: 2000, max: 10000 },
  { labelAr: 'فوق 10000',    labelEn: 'Above 10000',  min: 10000, max: null },
];

function parseNum(s: string): number | null {
  const v = s.replace(/[^\d]/g, '');
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export const PriceRangeFilterSection: React.FC<PriceRangeFilterSectionProps> = ({
  isArabic, minPrice, maxPrice, currencySymbol, onChange,
}) => {
  const isActivePreset = (p: Preset) => p.min === minPrice && p.max === maxPrice;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-bold text-ink-muted mb-1 block">
            {isArabic ? 'من' : 'From'}
          </label>
          <Input
            type="text"
            inputMode="numeric"
            value={minPrice ?? ''}
            onChange={(e) => onChange(parseNum(e.target.value), maxPrice)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-ink-muted mb-1 block">
            {isArabic ? 'إلى' : 'To'}
          </label>
          <Input
            type="text"
            inputMode="numeric"
            value={maxPrice ?? ''}
            onChange={(e) => onChange(minPrice, parseNum(e.target.value))}
            placeholder={isArabic ? 'بلا حد' : 'No limit'}
          />
        </div>
      </div>

      <div className="text-[11px] text-ink-muted text-center">
        {currencySymbol}
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const active = isActivePreset(p);
          return (
            <button
              key={p.labelEn}
              type="button"
              onClick={() => onChange(active ? null : p.min, active ? null : p.max)}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                active
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-surface border-border text-ink hover:bg-canvas'
              }`}
            >
              {isArabic ? p.labelAr : p.labelEn}
            </button>
          );
        })}
      </div>
    </div>
  );
};
