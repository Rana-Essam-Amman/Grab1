import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useState, useMemo } from 'react';
import { ListingCard } from '@/shared/components';
import { categoryBySlug } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-[#f9f8f4] pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Search Header */}
      <div className="p-4 bg-white border-b border-[#e7e3d8] flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-[#f2eee3] flex items-center justify-center text-[#4a4845] hover:bg-[#e7e3d8]"
        >
          <BackIcon size={18} />
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'ابحث في الصفقات...' : 'Search deals...'}
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-[#f9f8f4] border border-[#e7e3d8] text-xs text-[#1a1918] focus:outline-none focus:border-[#1B2A4A]"
          />
          <Search size={16} className={`absolute ${isArabic ? 'right-3' : 'left-3'} text-[#8c8982]`} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute ${isArabic ? 'left-3' : 'right-3'} text-xs text-[#8c8982]`}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {categoryFilter && (
        <div className="px-4 py-2 bg-[#f2eee3]/60 border-b border-[#e7e3d8] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#1a1918] font-bold">
            <span>{isArabic ? 'تصفية حسب:' : 'Filter:'}</span>
            <span className="text-[#1B2A4A] font-cairo">{activeFilterName}</span>
          </div>
          <button
            onClick={() => setCategoryFilter(null)}
            className="text-[11px] text-[#8c8982] hover:text-[#1a1918] underline font-cairo cursor-pointer"
          >
            {isArabic ? 'إزالة الفلتر' : 'Clear filter'}
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="px-4.5 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1a1918]">
          {isArabic ? 'نتائج البحث' : 'Search Results'}
        </h2>
        
        <div className="flex items-center gap-2.5">
          {/* Layout Toggle */}
          <button
            onClick={() => setFeedLayout((prev) => (prev === 'list' ? 'grid' : 'list'))}
            className="w-8 h-8 rounded-xl border border-[#e7e3d8] bg-white hover:bg-[#f2eee3] text-[#4a4845] flex items-center justify-center transition-colors cursor-pointer"
            title={isArabic ? 'تغيير طريقة العرض' : 'Toggle layout'}
            type="button"
          >
            {feedLayout === 'list' ? (
              <LayoutGrid size={15} />
            ) : (
              <List size={15} />
            )}
          </button>
          <span className="text-xs text-[#8c8982]">
            {results.length} {isArabic ? 'إعلان متوفر' : 'listings available'}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="p-4.5 flex-1">
        {results.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#f2eee3] flex items-center justify-center text-[#8c8982]">
              <Search size={22} />
            </div>
            <div className="text-sm font-bold text-[#1a1918]">
              {isArabic ? 'لا توجد نتائج في بلدك الحالي' : 'No results found in your current country'}
            </div>
            <p className="text-xs text-[#8c8982] max-w-xs">
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
