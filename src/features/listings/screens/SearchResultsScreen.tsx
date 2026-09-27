import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useState, useMemo } from 'react';
import { ListingCard } from '@/shared/components';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { ArrowLeft, ArrowRight, SearchNormal1, Grid1, RowVertical } from 'iconsax-react';
import { ExploreFilterBar } from '@/features/explore/components/ExploreFilterBar';
import { SearchResultsEmpty } from '../components/SearchResultsEmpty';
import { normalizeArabic } from '@/data/arabicNormalize';

export const SearchResultsScreen: React.FC = () => {
  const {
    isArabic, navigateTo, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter,
    minPriceFilter, setMinPriceFilter, maxPriceFilter, setMaxPriceFilter,
    neighborhoodFilter, setNeighborhoodFilter, browseCountryCode, browseCityEn
  } = useUI();
  const { listings } = useListings();

  const [feedLayout, setFeedLayout] = useState<'list' | 'grid'>('list');
  const [filterMode, setFilterMode] = useState<'city' | 'all'>('city');

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const handleBack = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setMinPriceFilter(null);
    setMaxPriceFilter(null);
    setNeighborhoodFilter(null);
    navigateTo('main');
  };

  const marketListings = useMemo(
    () => filterListingsByMarket(listings, browseCountryCode),
    [listings, browseCountryCode]
  );

  const results = useMemo(() => {
    return marketListings.filter((l) => {
      if (categoryFilter && l.categorySlug !== categoryFilter && l.subcategorySlug !== categoryFilter) {
        return false;
      }
      const priceNum = Number(l.price);
      if (minPriceFilter !== null && !isNaN(priceNum) && priceNum < minPriceFilter) return false;
      if (maxPriceFilter !== null && !isNaN(priceNum) && priceNum > maxPriceFilter) return false;
      if (neighborhoodFilter && l.neighborhood !== neighborhoodFilter) return false;
      if (filterMode === 'city' && browseCityEn && l.city !== browseCityEn) return false;
      if (searchQuery.trim()) {
        const q = normalizeArabic(searchQuery);
        if (!q) return true;
        const haystack = normalizeArabic([
          l.title || '',
          l.description || '',
          l.city || '',
          l.neighborhood || '',
          (l as any).make || '',
          (l as any).year || '',
        ].join(' '));
        return haystack.includes(q);
      }
      return true;
    });
  }, [marketListings, categoryFilter, minPriceFilter, maxPriceFilter, neighborhoodFilter, filterMode, browseCityEn, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Search Header (Sticky) */}
      <div className="p-4 pb-2.5 bg-[#1a2238] border-b border-white/10 flex flex-col gap-2 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} aria-label="Back" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer">
            <BackIcon size={18} variant="Linear" color="#FFFFFF" />
          </button>

          <div className="flex-1 relative flex items-center">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={isArabic ? 'ابحث في الصفقات...' : 'Search deals...'} className="w-full h-10 pl-9 pr-9 rounded-xl bg-canvas border border-line text-xs text-ink focus:outline-none focus:border-brand" />
            <SearchNormal1 size={16} variant="Linear" className={`absolute ${isArabic ? 'right-3' : 'left-3'} text-ink-muted`} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute ${isArabic ? 'left-3' : 'right-3'} text-xs text-ink-muted cursor-pointer`}>
                ✕
              </button>
            )}
          </div>
        </div>

        <ExploreFilterBar
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          feedLayout={feedLayout}
          setFeedLayout={setFeedLayout}
          totalListingsCount={results.length}
          minPriceFilter={minPriceFilter}
          setMinPriceFilter={setMinPriceFilter}
          maxPriceFilter={maxPriceFilter}
          setMaxPriceFilter={setMaxPriceFilter}
          activeNeighborhood={neighborhoodFilter}
          setActiveNeighborhood={setNeighborhoodFilter}
          activeSearchText={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      </div>

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
          <SearchResultsEmpty isArabic={isArabic} />
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
