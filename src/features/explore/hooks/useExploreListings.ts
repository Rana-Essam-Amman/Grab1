import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { EXPLORE_CONFIG } from '@/config/explore.config';
import { UseExploreListingsReturn } from './useExploreListings.types';
import { countCityListings, computeFilterModeWithCapital } from './useExploreListings.helpers';
import { filterListings } from '@/shared/lib/filterListings';

export function useExploreListings(): UseExploreListingsReturn {
  const {
    isArabic, searchQuery, setSearchQuery, setCategoryFilter, categoryFilter,
    browseCountryCode, browseCityAr, browseCityEn, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, neighborhoodFilter, setNeighborhoodFilter,
    sortBy, subcategoryFilter, setSubcategoryFilter,
    attrsFilter, setAttrsFilter, setSortBy,
  } = useUI();
  const { listings, hasMore, isLoadingMore, loadMore } = useListings();
  const [userFilterMode, setUserFilterMode] = useState<'city' | 'all' | null>('all');
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
    setCategoryFilter(null); setSubcategoryFilter(null);
    setMinPriceFilter(null); setMaxPriceFilter(null);
    setNeighborhoodFilter(null); setSearchQuery(''); setVoidedNotice(null);
    setAttrsFilter({}); setSortBy('newest');
  }, [setCategoryFilter, setSubcategoryFilter, setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setSearchQuery, setAttrsFilter, setSortBy]);

  const marketListings = useMemo(() => filterListingsByMarket(listings, browseCountryCode), [listings, browseCountryCode]);
  const cityCount = useMemo(() => countCityListings(marketListings, browseCityAr, browseCityEn), [marketListings, browseCityAr, browseCityEn]);

  const filterMode = useMemo(
    () => computeFilterModeWithCapital(browseCountryCode, browseCityEn, userFilterMode, cityCount, EXPLORE_CONFIG.CITY_MIN_DENSITY),
    [browseCountryCode, browseCityEn, userFilterMode, cityCount],
  );

  const setFilterMode = useCallback<Dispatch<SetStateAction<'city' | 'all'>>>((action) => {
    setUserFilterMode((prev) => typeof action === 'function' ? action(prev ?? 'all') : action);
  }, []);

  const displayListings = useMemo(() => {
    const hasActiveSearch = searchQuery.trim().length > 0;
    return filterListings(marketListings, {
      market: browseCountryCode,
      searchQuery: hasActiveSearch ? searchQuery : '',
      categorySlug: subcategoryFilter ?? categoryFilter,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      neighborhood: activeNeighborhood,
      cityAr: browseCityAr,
      cityEn: browseCityEn,
      filterMode,
      sortBy,
      attrs: attrsFilter,
      preserveOrder: hasActiveSearch,
    });
  }, [marketListings, browseCountryCode, searchQuery, categoryFilter, subcategoryFilter, minPriceFilter, maxPriceFilter, activeNeighborhood, browseCityAr, browseCityEn, filterMode, sortBy, attrsFilter]);

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
    hasAnyFilter: Boolean(
      categoryFilter || subcategoryFilter || minPriceFilter !== null || maxPriceFilter !== null ||
      activeNeighborhood || searchQuery || Object.keys(attrsFilter).length > 0 || sortBy !== 'newest'
    ),
  };
}
