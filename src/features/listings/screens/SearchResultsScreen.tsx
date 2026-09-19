import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useState, useMemo } from 'react';
import { ListingCard } from '@/shared/components';
import { categoryBySlug } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { ArrowLeft, ArrowRight, SearchNormal1, Grid1, RowVertical } from 'iconsax-react';

export const SearchResultsScreen: React.FC = () => {
  const { isArabic, goBack, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, browseCountryCode } = useUI();
  const { listings } = useListings();

  const [feedLayout, setFeedLayout] = useState<'list' | 'grid'>('list');

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const activeSubcategory = categoryFilter ? findSubcategoryBySlug(categoryFilter) : undefined;
  const filteredCategory = categoryFilter ? categoryBySlug(categoryFilter) : null;
  const activeFilterName = activeSubcategory
    ? (isArabic ? activeSubcategory.nameAr : activeSubcategory.nameEn)
    : filteredCategory && filteredCategory.slug === categoryFilter
    ? (isArabic ? filteredCategory.nameAr : filteredCategory.nameEn)
    : categoryFilter;

  const marketListings = useMemo(
    () => filterListingsByMarket(listings, browseCountryCode),
    [listings, browseCountryCode]
  );

  const results = useMemo(() => {
    return marketListings.filter((l) => {
      if (categoryFilter && l.categorySlug !== categoryFilter && l.subcategorySlug !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = l.title.toLowerCase().includes(q);
        const inDesc = l.description.toLowerCase().includes(q);
        const inCity = l.city.toLowerCase().includes(q);
        return inTitle || inDesc || inCity;
      }
      return true;
    });
  }, [marketListings, categoryFilter, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Search Header */}
      <div className="p-4 bg-surface border-b border-line flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-surface-raised flex items-center justify-center text-ink-muted hover:bg-surface-sunken"
        >
          <BackIcon size={18} variant="Linear" />
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'ابحث في الصفقات...' : 'Search deals...'}
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-canvas border border-line text-xs text-ink focus:outline-none focus:border-brand"
          />
          <SearchNormal1 size={16} variant="Linear" className={`absolute ${isArabic ? 'right-3' : 'left-3'} text-ink-muted`} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute ${isArabic ? 'left-3' : 'right-3'} text-xs text-ink-muted`}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {categoryFilter && (
        <div className="px-4 py-2 bg-surface-raised/60 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink font-bold">
            <span>{isArabic ? 'تصفية حسب:' : 'Filter:'}</span>
            <span className="text-brand font-cairo">{activeFilterName}</span>
          </div>
          <button
            onClick={() => setCategoryFilter(null)}
            className="text-[11px] text-ink-muted hover:text-ink underline font-cairo cursor-pointer"
          >
            {isArabic ? 'إزالة الفلتر' : 'Clear filter'}
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="px-4.5 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink">
          {isArabic ? 'نتائج البحث' : 'Search Results'}
        </h2>
        
        <div className="flex items-center gap-2.5">
          {/* Layout Toggle */}
          <button
            onClick={() => setFeedLayout((prev) => (prev === 'list' ? 'grid' : 'list'))}
            className="w-8 h-8 rounded-xl border border-line bg-surface hover:bg-surface-raised text-ink-muted flex items-center justify-center transition-colors cursor-pointer"
            title={isArabic ? 'تغيير طريقة العرض' : 'Toggle layout'}
            type="button"
          >
            {feedLayout === 'list' ? (
              <Grid1 size={15} variant="Linear" />
            ) : (
              <RowVertical size={15} variant="Linear" />
            )}
          </button>
          <span className="text-xs text-ink-muted">
            {results.length} {isArabic ? 'إعلان متوفر' : 'listings available'}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="p-4.5 flex-1">
        {results.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-ink-muted">
              <SearchNormal1 size={22} variant="Linear" />
            </div>
            <div className="text-sm font-bold text-ink">
              {isArabic ? 'لا توجد نتائج في بلدك الحالي' : 'No results found in your current country'}
            </div>
            <p className="text-xs text-ink-muted max-w-xs">
              {isArabic
                ? 'جرب البحث بكلمات أخرى أو اختر قسماً عاماً'
                : 'Try adjusting your search terms or clearing category filters'}
            </p>
          </div>
        ) : (
          <div className={feedLayout === 'grid' ? "grid grid-cols-2 gap-3.5" : "flex flex-col gap-3.5"}>
            {results.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                layout={feedLayout === 'list' ? 'horizontal' : 'grid'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
