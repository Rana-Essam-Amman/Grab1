import { useUI } from '@/hooks/useUI';
import { useMonetization } from '@/hooks/useMonetization';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { SearchBar } from '@/features/explore/components/SearchBar';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { useExploreListings } from '../hooks/useExploreListings';
import { ExploreVoidedNoticeBanner } from '../components/ExploreVoidedNoticeBanner';
import { ExploreTopSections } from '../components/ExploreTopSections';
import { ExploreQuotaPaywallModal } from '../components/ExploreQuotaPaywallModal';
import { FiltersTriggerBar } from '../components/filters/FiltersTriggerBar';
import { ExploreListingFeed } from '@/features/explore/components/ExploreListingFeed';
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
  const DEBUG_MODE = new URLSearchParams(window.location.search).has('debug');
  const { isArabic, browseCountryCode, navigateTo, setSearchQuery, isSearchFocused, setIsSearchFocused } = useUI();
  const { isQuotaExhausted, setIsQuotaExhausted } = useMonetization();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 600);

  React.useEffect(() => {
    setSearchQuery(debouncedSearch.trim());
  }, [debouncedSearch, setSearchQuery]);

  // Lock body scroll while search takeover is active
  useEffect(() => {
    if (isSearchFocused) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchFocused]);

  const {
    setFilterMode, feedLayout, setFeedLayout, activeSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters,
    hasMore, isLoadingMore, onLoadMore, hasAnyFilter
  } = useExploreListings();
  const { searchBanner, searchRelatedHeader } = useListings();

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
  }, [searchInput, setSearchQuery]);

  return (
    <div
      className={`max-w-[440px] mx-auto w-full flex flex-col gap-5 pt-0 pb-28 px-4 bg-surface ${isArabic ? 'font-cairo' : ''} ${isSearchFocused ? 'overflow-hidden' : ''}`}
      dir={isArabic ? "rtl" : "ltr"}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className={
          isSearchFocused
            ? 'fixed top-0 left-0 right-0 z-[100] bg-canvas pt-[env(safe-area-inset-top)] px-4 pb-2'
            : 'bg-canvas pt-3 pb-2 -mx-4 px-4'
        }
        style={DEBUG_MODE ? { outline: '3px solid red', background: 'rgba(255,0,0,0.1)' } : undefined}
      >
        {DEBUG_MODE && (
          <div style={{position:'fixed',top:0,left:0,background:'red',color:'white',fontSize:'12px',padding:'2px 6px',zIndex:9999}}>
            WRAPPER fixed:true
          </div>
        )}
        <SearchBar
          isArabic={isArabic}
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearchSubmit}
          onFocusChange={setIsSearchFocused}
        />
        {!isSearchFocused && (
          <div className="mt-2">
            <FiltersTriggerBar
              feedLayout={feedLayout}
              onFeedLayoutChange={setFeedLayout}
            />
          </div>
        )}
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
