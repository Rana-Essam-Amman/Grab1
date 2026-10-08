import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { EXPLORE_CONFIG } from '@/config/explore.config';
import { UseExploreListingsReturn } from './useExploreListings.types';
import { countCityListings, computeAdaptiveFilterMode } from './useExploreListings.helpers';
import { filterListings } from '@/shared/lib/filterListings';

export function useExploreListings(): UseExploreListingsReturn {
  const {
    isArabic, searchQuery, setSearchQuery, setCategoryFilter, categoryFilter,
    browseCountryCode, browseCityAr, browseCityEn, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, neighborhoodFilter, setNeighborhoodFilter,
  } = useUI();
  const { listings, hasMore, isLoadingMore, loadMore } = useListings();
  const [userFilterMode, setUserFilterMode] = useState<'city' | 'all' | null>(null);
  const { feedLayout, setFeedLayout: setFeedLayoutStore } = useAuth();

  const setFeedLayout = useCallback<Dispatch<SetStateAction<'list' | 'grid'>>>(
    (action) => {
      const next = typeof action === 'function' ? action(feedLayout) : action;
      setFeedLayoutStore(next);
    },
    [feedLayout, setFeedLayoutStore]
  );

  const [voidedNotice, setVoidedNotice] = useState<string | null>(null);
  const activeSearchText = searchQuery;
  const setActiveSearchText = setSearchQuery;
  const activeNeighborhood = neighborhoodFilter;
  const setActiveNeighborhood = setNeighborhoodFilter;

  const handleResetAllFilters = useCallback(() => {
    setCategoryFilter(null); setMinPriceFilter(null); setMaxPriceFilter(null);
    setNeighborhoodFilter(null); setSearchQuery(''); setVoidedNotice(null);
  }, [setCategoryFilter, setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setSearchQuery]);

  const marketListings = useMemo(() => filterListingsByMarket(listings, browseCountryCode), [listings, browseCountryCode]);
  const cityCount = useMemo(() => countCityListings(marketListings, browseCityAr, browseCityEn), [marketListings, browseCityAr, browseCityEn]);
  const filterMode = useMemo(() => computeAdaptiveFilterMode(userFilterMode, cityCount, EXPLORE_CONFIG.CITY_MIN_DENSITY), [userFilterMode, cityCount]);

  const setFilterMode = useCallback<Dispatch<SetStateAction<'city' | 'all'>>>((action) => {
    setUserFilterMode((prev) => typeof action === 'function' ? action(prev ?? 'city') : action);
  }, []);

  const displayListings = useMemo(() => {
    return filterListings(marketListings, {
      market: browseCountryCode,
      searchQuery: (activeSearchText || searchQuery || '').trim(),
      categorySlug: categoryFilter,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      neighborhood: activeNeighborhood,
      cityAr: browseCityAr,
      cityEn: browseCityEn,
      filterMode,
    });
  }, [marketListings, browseCountryCode, activeSearchText, searchQuery, categoryFilter, minPriceFilter, maxPriceFilter, activeNeighborhood, browseCityAr, browseCityEn, filterMode]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    void loadMore();
  }, [hasMore, isLoadingMore, loadMore]);

  return {
    allListings: listings, filterMode, setFilterMode, feedLayout, setFeedLayout, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, activeNeighborhood, setActiveNeighborhood, activeSearchText, setActiveSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters, isArabic, browseCountryCode, browseCityAr, browseCityEn,
    hasMore,
    isLoadingMore,
    onLoadMore: handleLoadMore,
  };
}
