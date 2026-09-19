import React, { useMemo } from 'react';
import { Grid1, RowVertical } from 'iconsax-react';

export interface ExploreFilterChipsBarProps {
  isArabic: boolean;
  filterMode: 'city' | 'all';
  onFilterModeChange: (mode: 'city' | 'all') => void;
  feedLayout: 'list' | 'grid';
  onFeedLayoutChange: (layout: 'list' | 'grid') => void;
  listingCount: number;
  browseCityAr: string;
  browseCityEn: string;
  categoryFilter: string | null;
  activeCategoryTitle?: string;
  minPriceFilter: number | null;
  maxPriceFilter: number | null;
  activeCurrency: string;
  activeNeighborhood?: string | null;
  onOpenDrawer: (drawer: 'category' | 'price' | 'location') => void;
}

export const ExploreFilterChipsBar: React.FC<ExploreFilterChipsBarProps> = React.memo(({
  isArabic, filterMode, onFilterModeChange, feedLayout, onFeedLayoutChange, listingCount, browseCityAr, browseCityEn,
  categoryFilter, activeCategoryTitle, minPriceFilter, maxPriceFilter, activeCurrency, activeNeighborhood, onOpenDrawer,
}) => {
  const isPriceActive = minPriceFilter !== null || maxPriceFilter !== null;

  const priceChipText = useMemo(() => {
    if (minPriceFilter === null && maxPriceFilter === null) {
      return isArabic ? 'السعر الأقصى' : 'Max Price';
    }
    if (minPriceFilter !== null && maxPriceFilter === null) {
      return isArabic 
        ? `أكثر من ${minPriceFilter.toLocaleString()} ${activeCurrency}` 
        : `Over ${minPriceFilter.toLocaleString()} ${activeCurrency}`;
    }
    if (minPriceFilter === null && maxPriceFilter !== null) {
      return isArabic 
        ? `أقل من ${maxPriceFilter.toLocaleString()} ${activeCurrency}` 
        : `Under ${maxPriceFilter.toLocaleString()} ${activeCurrency}`;
    }
    return `${minPriceFilter?.toLocaleString()} - ${maxPriceFilter?.toLocaleString()} ${activeCurrency}`;
  }, [minPriceFilter, maxPriceFilter, isArabic, activeCurrency]);

  const chipBaseClass = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-line text-ink text-xs font-medium hover:border-line-strong transition-colors flex-shrink-0 cursor-pointer";

  return (
    <div className="flex flex-col gap-2 font-cairo">
      {/* Task 1: Chips in one horizontal row */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-2 -mx-4">
        <button
          type="button"
          onClick={() => onOpenDrawer('location')}
          className={chipBaseClass}
        >
          <span>{isArabic ? 'المنطقة' : 'Area'}</span>
          <span className="text-[10px] opacity-70">/</span>
          <span>{activeNeighborhood || (isArabic ? browseCityAr : browseCityEn)}</span>
          <span className="text-[8px] opacity-70">▼</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterModeChange('all')}
          className={chipBaseClass}
        >
          <span>{isArabic ? 'كل الدولة' : 'Entire Country'}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenDrawer('category')}
          className={chipBaseClass}
        >
          <span>{categoryFilter ? activeCategoryTitle : (isArabic ? 'القسم' : 'Category')}</span>
          <span className="text-[8px] opacity-70">▼</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenDrawer('price')}
          className={chipBaseClass}
        >
          <span>{priceChipText}</span>
          <span className="text-[8px] opacity-70">▼</span>
        </button>
      </div>

      {/* Task 4: Move listings count as small text below chips row, alongside layout toggler */}
      <div className="flex items-center justify-between px-4 pb-1">
        <p className="text-xs text-ink-muted">
          {listingCount} {isArabic ? 'إعلان' : 'listings'}
        </p>

        <button
          type="button"
          onClick={() => onFeedLayoutChange(feedLayout === 'list' ? 'grid' : 'list')}
          className="w-8 h-8 rounded-xl border border-line bg-transparent hover:bg-gray-50 text-ink flex items-center justify-center transition-colors cursor-pointer"
          title={isArabic ? 'تغيير طريقة العرض' : 'Toggle layout'}
        >
          {feedLayout === 'list' ? <Grid1 size={15} variant="Linear" /> : <RowVertical size={15} variant="Linear" />}
        </button>
      </div>
    </div>
  );
});

ExploreFilterChipsBar.displayName = 'ExploreFilterChipsBar';
