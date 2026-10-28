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
    const now = new Date().getTime();

    // 1. Determine which premium ads are still active (14 days check)
    const activePremium = displayListings.filter((l) => {
      if (!l.isPremium) return false;
      if (l.premiumExpiresAt) {
        const expiryTime = new Date(l.premiumExpiresAt).getTime();
        if (expiryTime < now) return false; // Expired
      }
      return true;
    });

    // 2. Shuffle the active premium ads so everyone gets a fair chance
    const shuffledPremium = [...activePremium].sort(() => Math.random() - 0.5);

    // 3. Get Organic ads (not premium, or expired premium) sorted by views
    const organic = displayListings
      .filter((l) => !activePremium.includes(l))
      .sort((a, b) => (b.views || 0) - (a.views || 0));

    // 4. Build a Fair Hybrid Array (Max 3 items)
    const fairHero: Listing[] = [];

    // Slot 1 & 2: Take up to 2 Active Premium ads
    fairHero.push(...shuffledPremium.slice(0, 2));

    // Slot 3: ALWAYS reserve one spot for an Organic ad (to give free sellers a chance)
    if (organic.length > 0) {
      fairHero.push(organic[0]);
    } else if (shuffledPremium.length > 2) {
      // Fallback: if no organic ads exist, fill with another premium
      fairHero.push(shuffledPremium[2]);
    }

    // Final trim to ensure we don't exceed 3 cards
    return fairHero.slice(0, 3);
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
