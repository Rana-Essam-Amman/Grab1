import React, { useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { Listing } from '@/types';
import { FeaturedDealsCarousel } from './FeaturedDealsCarousel';
import { TrustSignal } from './TrustSignal';
import { TrendingSection } from './TrendingSection';
import { ExploreCategoryGrid } from './ExploreCategoryGrid';

interface ExploreTopSectionsProps { readonly displayListings: readonly Listing[]; }

export const ExploreTopSections: React.FC<ExploreTopSectionsProps> = ({ displayListings }) => {
  const { isArabic, browseCountryCode, setSelectedListingId, navigateTo, setCategoryFilter, setSelectedParentCategory, setActiveTab } = useUI();

  const featuredListings = useMemo(() => {
    const premium = displayListings.filter((l) => l.isPremium);
    const rest = displayListings
      .filter((l) => !l.isPremium)
      .sort((a, b) => (b.views || 0) - (a.views || 0));
    return [...premium, ...rest].slice(0, 3);
  }, [displayListings]);
  const trendingListings = useMemo(() => [...displayListings].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6), [displayListings]);

  const handleFeaturedClick = useCallback((id: string) => {
    setSelectedListingId(id);
    navigateTo('listing-detail');
  }, [setSelectedListingId, navigateTo]);

  const handleTrendingClick = useCallback((id: string) => {
    setSelectedListingId(id); navigateTo('listing-detail');
  }, [setSelectedListingId, navigateTo]);

  const handleCategoryClick = useCallback((catSlug: string) => {
    setSelectedParentCategory(catSlug); navigateTo('sub-categories');
  }, [setSelectedParentCategory, navigateTo]);

  const handleViewAllCategories = useCallback(() => {
    setCategoryFilter(null); setActiveTab('categories'); navigateTo('main');
  }, [setCategoryFilter, setActiveTab, navigateTo]);

  const marketLabel = {
    JO: isArabic ? 'عمّان' : 'Amman', SA: isArabic ? 'الرياض' : 'Riyadh',
    PS: isArabic ? 'القدس' : 'Jerusalem', LB: isArabic ? 'بيروت' : 'Beirut',
    SY: isArabic ? 'دمشق' : 'Damascus',
  }[browseCountryCode] || browseCountryCode;

  return (
    <>
      {featuredListings.length > 0 && (
        <FeaturedDealsCarousel
          listings={featuredListings}
          isArabic={isArabic}
          onListingClick={handleFeaturedClick}
        />
      )}
      <TrustSignal market={marketLabel} listingsCount={displayListings.length} isArabic={isArabic} />
      {trendingListings.length > 0 && <TrendingSection listings={trendingListings} isArabic={isArabic} onListingClick={handleTrendingClick} />}
      <ExploreCategoryGrid isArabic={isArabic} onViewAll={handleViewAllCategories} onCategoryClick={handleCategoryClick} />
    </>
  );
};
