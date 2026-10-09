import React from 'react';
import { ArrowLeft, ArrowRight, Setting4 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { useUI } from '@/hooks/useUI';

/**
 * Full-page filter screen (shell).
 * PR 1 registers the route + basic layout. Sections come in PR 2.
 */
export const FiltersScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="flex flex-col min-h-screen bg-surface" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="px-4 py-3 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label={isArabic ? 'رجوع' : 'Back'} className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center p-0">
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </Button>
        <Setting4 size={20} variant="Bold" color="#FFFFFF" />
        <h1 className="text-base font-bold text-white flex-1">
          {isArabic ? 'فلترة' : 'Filters'}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Setting4 size={48} variant="Linear" className="text-ink-muted mb-3" />
        <p className="text-sm text-ink-muted">
          {isArabic ? 'قسم الفلترة — قيد التطوير' : 'Filter screen — coming soon'}
        </p>
      </div>
    </div>
  );
};
