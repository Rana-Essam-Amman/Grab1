import React, { useState, useEffect } from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { CloseCircle } from 'iconsax-react';
import { ExplorePriceQuickPresets } from './ExplorePriceQuickPresets';

import { PriceInputRange } from './PriceInputRange';

export interface ExplorePriceFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  isArabic: boolean;
  activeMinPrice: number | null;
  activeMaxPrice: number | null;
  onApplyRange: (min: number | null, max: number | null) => void;
  currencySymbol: string;
}

export const ExplorePriceFilterDrawer: React.FC<ExplorePriceFilterDrawerProps> = React.memo(({
  open, onClose, isArabic, activeMinPrice, activeMaxPrice, onApplyRange, currencySymbol,
}) => {
  const [minInput, setMinInput] = useState(activeMinPrice?.toString() ?? '');
  const [maxInput, setMaxInput] = useState(activeMaxPrice?.toString() ?? '');

  useEffect(() => {
    setMinInput(activeMinPrice?.toString() ?? '');
    setMaxInput(activeMaxPrice?.toString() ?? '');
  }, [activeMinPrice, activeMaxPrice, open]);

  const handleApply = () => {
    let minVal = minInput.trim() ? parseFloat(minInput) : null;
    let maxVal = maxInput.trim() ? parseFloat(maxInput) : null;
    if (minVal !== null && isNaN(minVal)) minVal = null;
    if (maxVal !== null && isNaN(maxVal)) maxVal = null;
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      const temp = minVal;
      minVal = maxVal;
      maxVal = temp;
    }
    onApplyRange(minVal, maxVal);
    onClose();
  };

  const handleClear = () => {
    setMinInput('');
    setMaxInput('');
    onApplyRange(null, null);
    onClose();
  };

  return (
    <Drawer 
      open={open} 
      onOpenChange={(isOpen) => !isOpen && onClose()} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col gap-3 font-cairo">
        {/* Close button (top-start) */}
        <div className="flex items-start justify-start">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-95"
          >
            <CloseCircle size={18} variant="Bold" color="currentColor" />
          </button>
        </div>

        {/* Form elements */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
          <PriceInputRange
            isArabic={isArabic}
            minInput={minInput}
            maxInput={maxInput}
            setMinInput={setMinInput}
            setMaxInput={setMaxInput}
            currencySymbol={currencySymbol}
          />

          <ExplorePriceQuickPresets
            isArabic={isArabic}
            minInput={minInput}
            maxInput={maxInput}
            setMinInput={setMinInput}
            setMaxInput={setMaxInput}
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button 
              type="button" 
              onClick={handleApply} 
              className="w-full h-14 rounded-full bg-brand text-white font-bold active:scale-[0.98] transition-all"
            >
              {isArabic ? 'تطبيق' : 'Apply'}
            </button>
            <button 
              type="button" 
              onClick={handleClear} 
              className="w-full h-12 rounded-full bg-surface-sunken text-ink font-bold active:scale-[0.98] transition-all"
            >
              {isArabic ? 'مسح الفلتر' : 'Clear Filter'}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
});

ExplorePriceFilterDrawer.displayName = 'ExplorePriceFilterDrawer';
