import React, { useMemo } from 'react';
import { Grid1, RowVertical } from 'iconsax-react';
import { FilterChip } from './FilterChip';

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
  onClearCategory?: () => void;
  onClearPrice?: () => void;
  onClearNeighborhood?: () => void;
}

export const ExploreFilterChipsBar: React.FC<ExploreFilterChipsBarProps> = React.memo(({
  isArabic, filterMode, onFilterModeChange, feedLayout, onFeedLayoutChange, listingCount, browseCityAr, browseCityEn,
  categoryFilter, activeCategoryTitle, minPriceFilter, maxPriceFilter, activeCurrency, activeNeighborhood, onOpenDrawer,
  onClearCategory, onClearPrice, onClearNeighborhood,
}) => {
  const isPriceActive = minPriceFilter !== null || maxPriceFilter !== null;

  const priceChipText = useMemo(() => {
    if (minPriceFilter === null && maxPriceFilter === null) {
      return isArabic ? 'السعر' : 'Price';
    }
    if (minPriceFilter !== null && maxPriceFilter === null) {
      return isArabic 
        ? `+${minPriceFilter.toLocaleString()} ${activeCurrency}` 
        : `>${minPriceFilter.toLocaleString()} ${activeCurrency}`;
    }
    if (minPriceFilter === null && maxPriceFilter !== null) {
      return isArabic 
        ? `-${maxPriceFilter.toLocaleString()} ${activeCurrency}` 
        : `<${maxPriceFilter.toLocaleString()} ${activeCurrency}`;
    }
    return `${minPriceFilter?.toLocaleString()}-${maxPriceFilter?.toLocaleString()} ${activeCurrency}`;
  }, [minPriceFilter, maxPriceFilter, isArabic, activeCurrency]);

  const getChipClass = (isActive: boolean) => 
    `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 flex-shrink-0 cursor-pointer select-none ${
      isActive 
        ? "bg-accent/10 border-accent/40 text-accent font-semibold shadow-sm" 
        : "bg-surface border-line text-ink hover:border-line-strong hover:bg-canvas"
    }`;

  return (
    <div className="flex flex-col gap-2 font-cairo">
      {/* Scrollable Chips Row */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-2 -mx-4">
        {/* Area Filter Chip */}
        <FilterChip
          isArabic={isArabic}
          isActive={!!activeNeighborhood}
          label={isArabic ? 'المنطقة' : 'Area'}
          value={activeNeighborhood || (isArabic ? browseCityAr : browseCityEn)}
          onClick={() => onOpenDrawer('location')}
          onClear={activeNeighborhood && onClearNeighborhood ? onClearNeighborhood : undefined}
        />

        {/* Entire Country Filter Chip */}
        <button
          type="button"
          onClick={() => onFilterModeChange(filterMode === 'all' ? 'city' : 'all')}
          className={getChipClass(filterMode === 'all')}
        >
          <span>{isArabic ? 'كل الدولة' : 'Entire Country'}</span>
        </button>

        {/* Category Filter Chip */}
        <FilterChip
          isArabic={isArabic}
          isActive={!!categoryFilter}
          label={categoryFilter ? (activeCategoryTitle || '') : (isArabic ? 'القسم' : 'Category')}
          value=""
          onClick={() => onOpenDrawer('category')}
          onClear={categoryFilter && onClearCategory ? onClearCategory : undefined}
        />

        {/* Price Filter Chip */}
        <FilterChip
          isArabic={isArabic}
          isActive={isPriceActive}
          label={priceChipText}
          value=""
          onClick={() => onOpenDrawer('price')}
          onClear={isPriceActive && onClearPrice ? onClearPrice : undefined}
        />
      </div>

      {/* Listings Count & Layout Toggle */}
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
