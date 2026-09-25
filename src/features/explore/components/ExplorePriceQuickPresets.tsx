import React from 'react';
import { TickCircle } from 'iconsax-react';

export interface ExplorePriceQuickPresetsProps {
  isArabic: boolean;
  minInput: string;
  maxInput: string;
  setMinInput: (v: string) => void;
  setMaxInput: (v: string) => void;
}

export const ExplorePriceQuickPresets: React.FC<ExplorePriceQuickPresetsProps> = ({
  isArabic, minInput, maxInput, setMinInput, setMaxInput
}) => {
  const rangePresets = [
    { min: null, max: 5000, label: isArabic ? 'أقل من 5K' : 'Under 5K' },
    { min: 5000, max: 15000, label: '5K - 15K' },
    { min: 15000, max: 50000, label: '15K - 50K' },
    { min: 50000, max: null, label: isArabic ? 'أكثر من 50K' : '50K+' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold text-[#64748B]">{isArabic ? 'خيارات شائعة للسعر' : 'Popular Price Ranges'}</span>
      <div className="grid grid-cols-2 gap-2">
        {rangePresets.map((preset, idx) => {
          const pMin = minInput.trim() ? parseFloat(minInput) : null;
          const pMax = maxInput.trim() ? parseFloat(maxInput) : null;
          const isSelected = pMin === preset.min && pMax === preset.max;
          return (
            <button 
              key={idx} 
              type="button" 
              onClick={() => { setMinInput(preset.min?.toString() ?? ''); setMaxInput(preset.max?.toString() ?? ''); }} 
              className={`h-10 px-4 rounded-full text-sm font-bold flex items-center justify-between transition-all active:scale-[0.98] ${
                isSelected 
                  ? 'bg-[#1a2238] text-white' 
                  : 'bg-[#DDE3EC] text-[#0F172A]'
              }`}
            >
              <span className="truncate">{preset.label}</span>
              {isSelected && <TickCircle size={14} variant="Bold" color="#E57E25" className="shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
