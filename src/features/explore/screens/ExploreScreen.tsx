import { useUI } from '@/hooks/useUI';
import React, { useCallback, useState } from 'react';
import { SearchBar } from '@/features/explore/components/SearchBar';
import { useExploreListings } from '../hooks/useExploreListings';
import { ExploreVoidedNoticeBanner } from '../components/ExploreVoidedNoticeBanner';
import { ExploreTopSections } from '../components/ExploreTopSections';
import { FiltersTriggerBar } from '../components/filters/FiltersTriggerBar';
import { ExploreListingsSections } from '../components/ExploreListingsSections';
import { SearchRelatedBanner } from '@/features/listings/components/SearchRelatedBanner';
import { useListings } from '@/hooks/useListings';

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export const ExploreScreen: React.FC = () => {
  const { isArabic, browseCountryCode, navigateTo, setSearchQuery, isSearchFocused, setIsSearchFocused } = useUI();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 600);

  React.useEffect(() => {
    setSearchQuery(debouncedSearch.trim());
  }, [debouncedSearch, setSearchQuery]);

  const {
    setFilterMode, feedLayout, setFeedLayout, activeSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters,
    hasMore, isLoadingMore, onLoadMore, hasAnyFilter,
    isInitialLoading, lastSyncFailed,
  } = useExploreListings();
  const { searchBanner, searchRelatedHeader, tier2Listings } = useListings();

  const handlePostWithSearch = useCallback(() => {
    navigateTo('post-ad-entry');
  }, [navigateTo]);

  const handleExpandSearch = useCallback(() => {
    setFilterMode('all');
  }, [setFilterMode]);

  const handleSearchSubmit = useCallback(() => {
    if (!searchInput.trim()) return;
    setSearchQuery(searchInput.trim());
  }, [searchInput, setSearchQuery]);

  const showTier2 = tier2Listings.length >= 2;
  const hasTier1 = displayListings.length > 0;

  return (
    <div
      className={`max-w-[440px] mx-auto w-full flex flex-col gap-5 pt-0 pb-28 px-4 bg-surface ${isArabic ? 'font-cairo' : ''}`}
      dir={isArabic ? "rtl" : "ltr"}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="sticky top-[73px] z-40 bg-canvas pt-3 pb-2 -mx-4 px-4">
        <SearchBar
          isArabic={isArabic}
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearchSubmit}
          onFocusChange={setIsSearchFocused}
        />
        <div className="mt-2">
          <FiltersTriggerBar
            feedLayout={feedLayout}
            onFeedLayoutChange={setFeedLayout}
          />
        </div>
      </div>

      {/* Cross-Border Tripwire Void Notice */}
      {voidedNotice && (
        <ExploreVoidedNoticeBanner
          isArabic={isArabic}
          voidedNotice={voidedNotice}
          browseCountryCode={browseCountryCode}
          onDismiss={() => setVoidedNotice(null)}
        />
      )}

      {!isSearchFocused && (
        <ExploreTopSections displayListings={displayListings} />
      )}

      <SearchRelatedBanner banner={searchBanner} relatedHeader={searchRelatedHeader} />

      {/* Listings Feed + Tier 2 Section */}
      <ExploreListingsSections
        primaryFeedProps={{
          listings: displayListings,
          feedLayout,
          hasActiveFilters: hasAnyFilter,
          onResetFilters: handleResetAllFilters,
          activeSearchText,
          onPostWithSearch: handlePostWithSearch,
          onExpandSearch: handleExpandSearch,
          hasMore,
          isLoadingMore,
          onLoadMore,
          isInitialLoading,
          lastSyncFailed,
        }}
        tier2Listings={tier2Listings}
        isArabic={isArabic}
        showTier2={showTier2}
        hasTier1={hasTier1}
      />
    </div>
  );
};
