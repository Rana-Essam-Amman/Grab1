import React from 'react';
import { X } from 'lucide-react';

export interface ExploreActiveCategoryBannerProps {
  isArabic: boolean;
  activeCategoryTitle?: string;
  activeCategory?: string;
  categoryLabelAr?: string;
  categoryLabelEn?: string;
  onClearCategory: () => void;
}

export const ExploreActiveCategoryBanner: React.FC<ExploreActiveCategoryBannerProps> = React.memo(({
  isArabic, activeCategoryTitle, activeCategory, categoryLabelAr, categoryLabelEn, onClearCategory,
}) => {
  const displayTitle = activeCategoryTitle || (isArabic ? categoryLabelAr : categoryLabelEn) || activeCategory || '';

  return (
    <div className="flex items-center justify-between bg-surface rounded-2xl px-3.5 py-2.5 border-none shadow-2xs font-cairo">
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-muted font-medium">{isArabic ? 'تصفية حسب:' : 'Filtered by:'}</span>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{displayTitle}</span>
      </div>
      <button type="button" onClick={onClearCategory} className="text-xs font-bold text-ink-soft hover:text-danger flex items-center gap-1 cursor-pointer">
        <span>{isArabic ? 'إلغاء التصفية' : 'Clear filter'}</span>
        <X size={14} />
      </button>
    </div>
  );
});

ExploreActiveCategoryBanner.displayName = 'ExploreActiveCategoryBanner';
