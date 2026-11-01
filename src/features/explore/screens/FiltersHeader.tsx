import React from 'react';
import { ArrowLeft, ArrowRight, Setting4 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { BrandMark } from '@/shared/components/BrandMark';

export const FiltersHeader: React.FC<{ readonly isArabic: boolean; readonly onBack: () => void }> = ({ isArabic, onBack }) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  return (
    <header className="px-4 py-3 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label={isArabic ? 'رجوع' : 'Back'} className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center p-0">
        <BackIcon size={18} variant="Linear" color="#FFFFFF" />
      </Button>
      <Setting4 size={20} variant="Bold" color="#FFFFFF" />
      <h1 className="text-base font-bold text-white flex-1">{isArabic ? 'فلترة' : 'Filters'}</h1>
      <BrandMark isArabic={isArabic} />
    </header>
  );
};
