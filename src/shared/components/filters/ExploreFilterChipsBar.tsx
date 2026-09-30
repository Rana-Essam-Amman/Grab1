import React, { useMemo } from 'react';
import { Grid1, RowVertical } from 'iconsax-react';
import { FilterChip } from './FilterChip';
export interface ExploreFilterChipsBarProps {
  isArabic: boolean; filterMode: 'city' | 'all'; onFilterModeChange: (mode: 'city' | 'all') => void;
  feedLayout: 'list' | 'grid'; onFeedLayoutChange: (layout: 'list' | 'grid') => void;
  listingCount: number; browseCityAr: string; browseCityEn: string;
  categoryFilter: string | null; activeCategoryTitle?: string;
  minPriceFilter: number | null; maxPriceFilter: number | null; activeCurrency: string;
  activeNeighborhood?: string | null; onOpenDrawer: (drawer: 'category' | 'price' | 'location') => void;
  onClearCategory?: () => void; onClearPrice?: () => void; onClearNeighborhood?: () => void;
  readonly activeSearchText?: string; readonly onClearSearch?: () => void;
  readonly onDarkBackground?: boolean;
}

export const ExploreFilterChipsBar: React.FC<ExploreFilterChipsBarProps> = React.memo(({
  isArabic, filterMode: _filterMode, onFilterModeChange: _onFilterModeChange, feedLayout, onFeedLayoutChange, listingCount: _listingCount, browseCityAr, browseCityEn,
  categoryFilter, activeCategoryTitle, minPriceFilter, maxPriceFilter, activeCurrency, activeNeighborhood, onOpenDrawer,
  onClearCategory, onClearPrice, onClearNeighborhood, activeSearchText, onClearSearch,
  onDarkBackground = false,
}) => {
  const isPriceActive = minPriceFilter !== null || maxPriceFilter !== null;
  const priceChipText = useMemo(() => {
    if (minPriceFilter === null && maxPriceFilter === null) return isArabic ? 'السعر' : 'Price';
    const minS = minPriceFilter?.toLocaleString();
    const maxS = maxPriceFilter?.toLocaleString();
    if (minPriceFilter !== null && maxPriceFilter === null) return isArabic ? `+${minS} ${activeCurrency}` : `>${minS} ${activeCurrency}`;
    if (minPriceFilter === null && maxPriceFilter !== null) return isArabic ? `-${maxS} ${activeCurrency}` : `<${maxS} ${activeCurrency}`;
    return `${minS}-${maxS} ${activeCurrency}`;
  }, [minPriceFilter, maxPriceFilter, isArabic, activeCurrency]);

  return (
    <div className="flex flex-row items-center gap-2 px-4 pb-2 -mx-4 font-cairo">
      <div className="flex-1 flex flex-row items-center gap-2 overflow-x-auto no-scrollbar min-w-0">
        <FilterChip
          isArabic={isArabic}
          isActive={!!activeNeighborhood}
          label={isArabic ? 'المنطقة' : 'Area'}
          value={activeNeighborhood || (isArabic ? browseCityAr : browseCityEn)}
          onClick={() => onOpenDrawer('location')}
          onClear={activeNeighborhood && onClearNeighborhood ? onClearNeighborhood : undefined}
          onDarkBackground={onDarkBackground}
        />

        <FilterChip
          isArabic={isArabic}
          isActive={!!categoryFilter}
          label={categoryFilter ? (activeCategoryTitle || '') : (isArabic ? 'القسم' : 'Category')}
          value=""
          onClick={() => onOpenDrawer('category')}
          onClear={categoryFilter && onClearCategory ? onClearCategory : undefined}
          onDarkBackground={onDarkBackground}
        />

        <FilterChip
          isArabic={isArabic}
          isActive={isPriceActive}
          label={priceChipText}
          value=""
          onClick={() => onOpenDrawer('price')}
          onClear={isPriceActive && onClearPrice ? onClearPrice : undefined}
          onDarkBackground={onDarkBackground}
        />

        {activeSearchText && (
          <FilterChip
            isArabic={isArabic}
            isActive={true}
            label={isArabic ? 'بحث' : 'Search'}
            value={activeSearchText}
            onClick={() => {}}
            onClear={onClearSearch}
            onDarkBackground={onDarkBackground}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => onFeedLayoutChange(feedLayout === 'list' ? 'grid' : 'list')}
        className="w-8 h-8 rounded-xl border border-[#E57E25] bg-white hover:bg-[#E57E25]/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        title={isArabic ? 'تغيير طريقة العرض' : 'Toggle layout'}
      >
        {feedLayout === 'list' ? (
          <Grid1 size={15} variant="Bold" color="#E57E25" />
        ) : (
          <RowVertical size={15} variant="Bold" color="#E57E25" />
        )}
      </button>
    </div>
  );
});

ExploreFilterChipsBar.displayName = 'ExploreFilterChipsBar';
