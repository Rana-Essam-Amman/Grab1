import React from 'react';
import { TickCircle } from 'iconsax-react';
import type { SortBy } from '@/shared/router/filterParams';

export interface SortFilterSectionProps {
  readonly isArabic: boolean;
  readonly activeSort: SortBy;
  readonly onChange: (sort: SortBy) => void;
}

const OPTIONS: readonly { readonly value: SortBy; readonly labelAr: string; readonly labelEn: string }[] = [
  { value: 'newest', labelAr: 'الأحدث', labelEn: 'Newest first' },
  { value: 'price-asc', labelAr: 'الأرخص أولاً', labelEn: 'Price: low to high' },
  { value: 'price-desc', labelAr: 'الأغلى أولاً', labelEn: 'Price: high to low' },
];

export const SortFilterSection: React.FC<SortFilterSectionProps> = ({
  isArabic, activeSort, onChange,
}) => (
  <div className="flex flex-col">
    {OPTIONS.map((opt) => {
      const isActive = activeSort === opt.value;
      return (
        <button
          key={opt.value}
          data-testid="filter-sort-option"
          data-value={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full flex items-center justify-between px-3 py-3 text-sm font-bold rounded-xl transition-colors ${
            isActive ? 'bg-accent/10 text-accent' : 'text-ink hover:bg-canvas'
          }`}
        >
          <span>{isArabic ? opt.labelAr : opt.labelEn}</span>
          {isActive && <TickCircle size={18} variant="Bold" color="currentColor" />}
        </button>
      );
    })}
  </div>
);
