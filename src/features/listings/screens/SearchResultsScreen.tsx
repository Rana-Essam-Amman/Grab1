import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ListingCard } from '@/shared/components';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { ArrowLeft, ArrowRight, SearchNormal1, Grid1, RowVertical } from 'iconsax-react';
import { ExploreFilterBar } from '@/shared/components/filters/ExploreFilterBar';
import { SearchResultsEmpty } from '../components/SearchResultsEmpty';
import { filterListings } from '@/shared/lib/filterListings';

export const SearchResultsScreen: React.FC = () => {
  const {
    isArabic, navigateTo, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter,
    minPriceFilter, setMinPriceFilter, maxPriceFilter, setMaxPriceFilter,
    neighborhoodFilter, setNeighborhoodFilter, browseCountryCode, browseCityEn, browseCityAr
  } = useUI();
  const { listings } = useListings();

  const { feedLayout, setFeedLayout: setFeedLayoutStore } = useAuth();
  const setFeedLayout = useCallback<Dispatch<SetStateAction<'list' | 'grid'>>>(
    (action) => {
      const next = typeof action === 'function' ? action(feedLayout) : action;
      setFeedLayoutStore(next);
    },
    [feedLayout, setFeedLayoutStore]
  );
  const [filterMode, setFilterMode] = useState<'city' | 'all'>('city');

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const handleBack = () => {
    setSearchQuery(''); setCategoryFilter(null); setMinPriceFilter(null); setMaxPriceFilter(null); setNeighborhoodFilter(null); navigateTo('main');
  };

  const marketListings = useMemo(() => filterListingsByMarket(listings, browseCountryCode), [listings, browseCountryCode]);

  const results = useMemo(() => {
    return filterListings(marketListings, {
      market: browseCountryCode,
      searchQuery,
      categorySlug: categoryFilter,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      neighborhood: neighborhoodFilter,
      cityAr: browseCityAr,
      cityEn: browseCityEn,
      filterMode: searchQuery.trim() ? 'all' : filterMode,
    });
  }, [marketListings, browseCountryCode, searchQuery, categoryFilter, minPriceFilter, maxPriceFilter, neighborhoodFilter, browseCityAr, browseCityEn, filterMode]);

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
              <button onClick={() => setSearchQuery('')} className={`absolute ${isArabic ? 'left-3' : 'right-3'} text-xs text-ink-muted cursor-pointer`}>✕</button>
            )}
          </div>
        </div>

        <ExploreFilterBar
          filterMode={filterMode} setFilterMode={setFilterMode} feedLayout={feedLayout} setFeedLayout={setFeedLayout}
          totalListingsCount={results.length} minPriceFilter={minPriceFilter} setMinPriceFilter={setMinPriceFilter}
          maxPriceFilter={maxPriceFilter} setMaxPriceFilter={setMaxPriceFilter} activeNeighborhood={neighborhoodFilter}
          setActiveNeighborhood={setNeighborhoodFilter} activeSearchText={searchQuery} onClearSearch={() => setSearchQuery('')}
          onDarkBackground={true}
        />
      </div>

      {/* Results Header */}
      <div className="px-4.5 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink">{isArabic ? 'نتائج البحث' : 'Search Results'}</h2>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFeedLayout((prev) => (prev === 'list' ? 'grid' : 'list'))}
            className="w-8 h-8 rounded-xl border border-line bg-surface hover:bg-surface-raised text-ink-muted flex items-center justify-center transition-colors cursor-pointer"
            title={isArabic ? 'تغيير طريقة العرض' : 'Toggle layout'}
            type="button"
          >
            {feedLayout === 'list' ? <Grid1 size={15} variant="Linear" /> : <RowVertical size={15} variant="Linear" />}
          </button>
          <span className="text-xs text-ink-muted">{results.length} {isArabic ? 'إعلان متوفر' : 'listings available'}</span>
        </div>
      </div>

      {/* Results List */}
      <div className="p-4.5 flex-1">
        {results.length === 0 ? (
          <SearchResultsEmpty isArabic={isArabic} />
        ) : (
          <div className={feedLayout === 'grid' ? "grid grid-cols-2 gap-3.5" : "flex flex-col gap-3.5"}>
            {results.map((item) => <ListingCard key={item.id} listing={item} layout={feedLayout === 'list' ? 'horizontal' : 'grid'} />)}
          </div>
        )}
      </div>
    </div>
  );
};
