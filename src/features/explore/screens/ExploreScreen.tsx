import { useUI } from '@/hooks/useUI';
import { useMonetization } from '@/hooks/useMonetization';
import React, { useMemo, useCallback, useState } from 'react';
import { SearchBar } from '@/features/explore/components/SearchBar';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { useExploreListings } from '../hooks/useExploreListings';
import { ExploreVoidedNoticeBanner } from '../components/ExploreVoidedNoticeBanner';
import { ExploreTopSections } from '../components/ExploreTopSections';
import { ExploreQuotaPaywallModal } from '../components/ExploreQuotaPaywallModal';
import { FiltersTriggerBar } from '../components/filters/FiltersTriggerBar';
import { ExploreListingFeed } from '@/features/explore/components/ExploreListingFeed';

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
  const { isQuotaExhausted, setIsQuotaExhausted } = useMonetization();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  React.useEffect(() => {
    setSearchQuery(debouncedSearch.trim());
  }, [debouncedSearch, setSearchQuery]);

  const {
    setFilterMode, feedLayout, setFeedLayout, activeSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters,
    hasMore, isLoadingMore, onLoadMore, hasAnyFilter
  } = useExploreListings();

  const currentPackage = useMemo(() => {
    return MONETIZATION_MATRIX.packages[browseCountryCode] || MONETIZATION_MATRIX.packages['JO'];
  }, [browseCountryCode]);

  const handleStartPost = useCallback(() => {
    setIsQuotaExhausted(false);
    navigateTo('post-ad-entry');
  }, [setIsQuotaExhausted, navigateTo]);

  const handlePostWithSearch = useCallback(() => {
    navigateTo('post-ad-entry');
  }, [navigateTo]);

  const handleExpandSearch = useCallback(() => {
    setFilterMode('all');
  }, [setFilterMode]);

  const handleSearchSubmit = useCallback(() => {
    if (!searchInput.trim()) return;
    setSearchQuery(searchInput.trim());
    navigateTo('search-results');
  }, [searchInput, setSearchQuery, navigateTo]);

  return (
    <div 
      className={`max-w-[440px] mx-auto w-full flex flex-col gap-5 pt-0 pb-28 px-4 bg-surface ${isArabic ? 'font-cairo' : ''}`} dir={isArabic ? "rtl" : "ltr"}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="sticky top-0 z-20 bg-canvas pt-3 pb-2 -mx-4 px-4">
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

      {/* Listings Feed */}
      <ExploreListingFeed
        listings={displayListings}
        feedLayout={feedLayout}
        hasActiveFilters={hasAnyFilter}
        onResetFilters={handleResetAllFilters}
        activeSearchText={activeSearchText}
        onPostWithSearch={handlePostWithSearch}
        onExpandSearch={handleExpandSearch}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore}
      />

      {/* The Native Quota Exhaustion Paywall Modal */}
      <ExploreQuotaPaywallModal
        isOpen={isQuotaExhausted}
        onClose={() => setIsQuotaExhausted(false)}
        onStartPost={handleStartPost}
        isArabic={isArabic}
        turboAdCost={currentPackage.turboAdCost}
        currencySymbol={currentPackage.currencySymbol}
      />
    </div>
  );
};
