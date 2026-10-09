import React, { useMemo } from 'react';
import { Setting4, Grid1, RowVertical, CloseCircle } from 'iconsax-react';
import { useUI } from '@/hooks/useUI';
import { categoryBySlug } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';

export interface FiltersTriggerBarProps {
  readonly feedLayout: 'list' | 'grid';
  readonly onFeedLayoutChange: (layout: 'list' | 'grid') => void;
}

export const FiltersTriggerBar: React.FC<FiltersTriggerBarProps> = ({ feedLayout, onFeedLayoutChange }) => {
  const {
    isArabic, navigateTo, categoryFilter, subcategoryFilter, minPriceFilter, maxPriceFilter,
    neighborhoodFilter, sortBy, activeCurrency, attrsFilter,
    setCategoryFilter, setSubcategoryFilter,
    setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setSortBy,
    setAttrsFilter,
  } = useUI();

  const categoryTitle = useMemo(() => {
    if (subcategoryFilter) {
      const sub = findSubcategoryBySlug(subcategoryFilter);
      if (sub) return isArabic ? sub.nameAr : sub.nameEn;
    }
    if (categoryFilter) {
      const cat = categoryBySlug(categoryFilter);
      if (cat) return isArabic ? cat.nameAr : cat.nameEn;
    }
    return null;
  }, [categoryFilter, subcategoryFilter, isArabic]);

  const priceTitle = useMemo(() => {
    if (minPriceFilter === null && maxPriceFilter === null) return null;
    const min = minPriceFilter?.toLocaleString() ?? '';
    const max = maxPriceFilter?.toLocaleString() ?? '';
    if (minPriceFilter !== null && maxPriceFilter === null) return `${min}+ ${activeCurrency}`;
    if (minPriceFilter === null && maxPriceFilter !== null) return `${max} ${activeCurrency}`;
    return `${min}-${max} ${activeCurrency}`;
  }, [minPriceFilter, maxPriceFilter, activeCurrency]);

  const sortTitle = sortBy === 'price-asc' ? (isArabic ? 'الأرخص' : 'Cheapest') : sortBy === 'price-desc' ? (isArabic ? 'الأغلى' : 'Most expensive') : null;
  const attrsCount = Object.keys(attrsFilter).length;
  const activeCount = (categoryFilter || subcategoryFilter ? 1 : 0) + (minPriceFilter !== null || maxPriceFilter !== null ? 1 : 0) + (neighborhoodFilter ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0) + (attrsCount > 0 ? 1 : 0);
  const chip = (label: string, onClear: () => void) => (
    <button type="button" onClick={onClear} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent bg-accent/10 text-accent text-xs font-bold shrink-0 cursor-pointer">
      <span className="truncate max-w-[120px]">{label}</span>
      <CloseCircle size={14} variant="Bold" color="currentColor" />
    </button>
  );

  const handleClearAll = () => {
    setCategoryFilter(null); setSubcategoryFilter(null);
    setMinPriceFilter(null); setMaxPriceFilter(null);
    setNeighborhoodFilter(null); setSortBy('newest');
    setAttrsFilter({});
  };

  return (
    <div className="flex flex-row items-center gap-2 font-cairo">
      <button type="button" onClick={() => navigateTo('filters')} className="relative flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-brand text-white text-xs font-bold shadow-xs hover:bg-brand-strong transition-colors shrink-0 cursor-pointer" aria-label={isArabic ? 'فتح الفلترة' : 'Open filters'}>
        <Setting4 size={14} variant="Bold" color="currentColor" />
        <span>{isArabic ? 'فلترة' : 'Filters'}</span>
        {activeCount > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-black flex items-center justify-center">{activeCount}</span>}
      </button>
      <div className="flex-1 flex flex-row items-center gap-2 overflow-x-auto no-scrollbar min-w-0">
        {categoryTitle && chip(categoryTitle, () => { setCategoryFilter(null); setSubcategoryFilter(null); })}
        {priceTitle && chip(priceTitle, () => { setMinPriceFilter(null); setMaxPriceFilter(null); })}
        {neighborhoodFilter && chip(neighborhoodFilter, () => setNeighborhoodFilter(null))}
        {sortTitle && chip(sortTitle, () => setSortBy('newest'))}
        {attrsCount > 0 && chip(isArabic ? `${attrsCount} مواصفات` : `${attrsCount} specs`, () => setAttrsFilter({}))}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] font-bold text-ink-muted hover:text-danger shrink-0 px-1 cursor-pointer"
          >
            {isArabic ? 'مسح الكل' : 'Clear all'}
          </button>
        )}
      </div>
      <button type="button" onClick={() => onFeedLayoutChange(feedLayout === 'list' ? 'grid' : 'list')} className="w-9 h-9 rounded-xl border border-accent bg-surface hover:bg-accent/5 flex items-center justify-center transition-colors cursor-pointer shrink-0" title={isArabic ? 'تغيير طريقة العرض' : 'Toggle layout'}>
        {feedLayout === 'list' ? <Grid1 size={16} variant="Bold" color="currentColor" className="text-accent" /> : <RowVertical size={16} variant="Bold" color="currentColor" className="text-accent" />}
      </button>
    </div>
  );
};
