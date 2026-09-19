import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { useMonetization } from '@/hooks/useMonetization';
import React, { useMemo, useCallback } from 'react';
import { AiAssistantBox } from '@/features/explore/components/AiAssistantBox';
import { ExploreFilterBar } from '@/features/explore/components/ExploreFilterBar';
import { ExploreListingFeed } from '@/features/explore/components/ExploreListingFeed';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { useExploreListings } from '../hooks/useExploreListings';
import { ExploreVoidedNoticeBanner } from '../components/ExploreVoidedNoticeBanner';
import { ExploreCategoryGrid } from '../components/ExploreCategoryGrid';
import { ExploreQuotaPaywallModal } from '../components/ExploreQuotaPaywallModal';
import { FeaturedDealCard } from '../components/FeaturedDealCard';
import { TrustSignal } from '../components/TrustSignal';
import { TrendingSection } from '../components/TrendingSection';

export const ExploreScreen: React.FC = () => {
  const { isArabic, setCategoryFilter, setSelectedParentCategory, navigateTo, setActiveTab, categoryFilter, browseCountryCode, setSelectedListingId } = useUI();
  const { startPostFlow } = useDraft();
  const { isQuotaExhausted, setIsQuotaExhausted } = useMonetization();

  const {
    filterMode, setFilterMode, feedLayout, setFeedLayout, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, activeNeighborhood, setActiveNeighborhood, activeSearchText, setActiveSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters
  } = useExploreListings();

  const currentPackage = useMemo(() => {
    return MONETIZATION_MATRIX.packages[browseCountryCode] || MONETIZATION_MATRIX.packages['JO'];
  }, [browseCountryCode]);

  const featuredListing = useMemo(
    () => displayListings.find((l) => l.isPremium) || displayListings[0],
    [displayListings]
  );

  const trendingListings = useMemo(
    () => [...displayListings].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6),
    [displayListings]
  );

  const handleFeaturedClick = useCallback(() => {
    if (featuredListing) {
      setSelectedListingId(featuredListing.id);
      navigateTo('listing-detail');
    }
  }, [featuredListing, setSelectedListingId, navigateTo]);

  const handleTrendingClick = useCallback((id: string) => {
    setSelectedListingId(id);
    navigateTo('listing-detail');
  }, [setSelectedListingId, navigateTo]);

  const handleCategoryClick = useCallback((catSlug: string) => {
    setSelectedParentCategory(catSlug);
    navigateTo('sub-categories');
  }, [setSelectedParentCategory, navigateTo]);

  const handleViewAllCategories = useCallback(() => {
    setCategoryFilter(null);
    setActiveTab('categories');
    navigateTo('main');
  }, [setCategoryFilter, setActiveTab, navigateTo]);

  const handleStartPost = useCallback(() => {
    setIsQuotaExhausted(false);
    startPostFlow();
  }, [setIsQuotaExhausted, startPostFlow]);

  const marketLabel = {
    JO: isArabic ? 'عمّان' : 'Amman',
    SA: isArabic ? 'الرياض' : 'Riyadh',
    PS: isArabic ? 'القدس' : 'Jerusalem',
    LB: isArabic ? 'بيروت' : 'Beirut',
    SY: isArabic ? 'دمشق' : 'Damascus',
  }[browseCountryCode] || browseCountryCode;

  return (
    <div 
      className={`max-w-[440px] mx-auto w-full flex flex-col gap-2 pb-24 px-4 bg-surface ${isArabic ? 'font-cairo' : ''}`} dir={isArabic ? "rtl" : "ltr"}
      style={{ WebkitOverflowScrolling: 'touch', paddingTop: '8px' }}
    >
      {/* UNIFIED AI ASSISTANT & SEARCH ENGINE LAYER */}
      <AiAssistantBox
        setMaxPriceFilter={setMaxPriceFilter}
        setActiveNeighborhood={setActiveNeighborhood}
        setActiveSearchText={setActiveSearchText}
        setVoidedNotice={setVoidedNotice}
      />

      {/* Cross-Border Tripwire Void Notice */}
      {voidedNotice && (
        <ExploreVoidedNoticeBanner
          isArabic={isArabic}
          voidedNotice={voidedNotice}
          browseCountryCode={browseCountryCode}
          onDismiss={() => setVoidedNotice(null)}
        />
      )}

      {featuredListing && (
        <FeaturedDealCard
          listing={featuredListing}
          isArabic={isArabic}
          onClick={handleFeaturedClick}
        />
      )}

      <TrustSignal
        market={marketLabel}
        listingsCount={displayListings.length}
        isArabic={isArabic}
      />

      {trendingListings.length > 0 && (
        <TrendingSection
          listings={trendingListings}
          isArabic={isArabic}
          onListingClick={handleTrendingClick}
        />
      )}

      {/* Category Horizontal / Grid Scroller */}
      <ExploreCategoryGrid
        isArabic={isArabic}
        onViewAll={handleViewAllCategories}
        onCategoryClick={handleCategoryClick}
      />

      {/* FILTER BAR & DRAWER CONTROLS */}
      <ExploreFilterBar
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        feedLayout={feedLayout}
        setFeedLayout={setFeedLayout}
        totalListingsCount={displayListings.length}
        minPriceFilter={minPriceFilter}
        setMinPriceFilter={setMinPriceFilter}
        maxPriceFilter={maxPriceFilter}
        setMaxPriceFilter={setMaxPriceFilter}
        activeNeighborhood={activeNeighborhood}
        setActiveNeighborhood={setActiveNeighborhood}
      />

      {/* Listings Feed */}
      <ExploreListingFeed
        listings={displayListings}
        feedLayout={feedLayout}
        hasActiveFilters={Boolean(categoryFilter || minPriceFilter !== null || maxPriceFilter !== null || activeNeighborhood || activeSearchText)}
        onResetFilters={handleResetAllFilters}
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
