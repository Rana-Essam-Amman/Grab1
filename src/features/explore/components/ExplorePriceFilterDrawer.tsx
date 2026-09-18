import React, { useState, useEffect } from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { ExplorePriceQuickPresets } from './ExplorePriceQuickPresets';
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
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60]"
          onClick={onClose}
        />
      )}
      <Drawer 
        open={open} 
        onOpenChange={(isOpen) => !isOpen && onClose()} 
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col gap-4 font-cairo">
          {/* Close Button Only */}
          <div className="relative w-full h-8 mb-2">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-lg cursor-pointer border-none"
              aria-label="Close"
            >
              <span className="text-lg font-bold">×</span>
            </button>
          </div>
        {/* Form elements */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[55vh] pe-1 -me-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink">{isArabic ? 'من' : 'From'}</label>
              <div className="flex items-center bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                <input type="number" value={minInput} onChange={(e) => setMinInput(e.target.value)} placeholder={isArabic ? 'الحد الأدنى' : 'Min Price'} className="w-full bg-transparent border-none text-sm font-bold font-cairo outline-none" />
                <span className="text-xs text-ink-soft ms-1">{currencySymbol}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink">{isArabic ? 'إلى' : 'To'}</label>
              <div className="flex items-center bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                <input type="number" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} placeholder={isArabic ? 'الحد الأعلى' : 'Max Price'} className="w-full bg-transparent border-none text-sm font-bold font-cairo outline-none" />
                <span className="text-xs text-ink-soft ms-1">{currencySymbol}</span>
              </div>
            </div>
          </div>
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
              className="w-full py-3 bg-brand text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isArabic ? 'تطبيق' : 'Apply'}
            </button>
            <button 
              type="button" 
              onClick={handleClear} 
              className="w-full py-2.5 rounded-xl bg-surface-sunken text-ink border border-line text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {isArabic ? 'مسح الفلتر' : 'Clear Filter'}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
    </>
  );
});

ExplorePriceFilterDrawer.displayName = 'ExplorePriceFilterDrawer';
