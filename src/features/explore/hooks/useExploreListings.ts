import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { EXPLORE_CONFIG } from '@/config/explore.config';
import { UseExploreListingsReturn } from './useExploreListings.types';
import { parsePrice, matchPrice, matchNeighborhood, matchSearch, countCityListings, computeAdaptiveFilterMode, sortListingsByPriority } from './useExploreListings.helpers';

export function useExploreListings(): UseExploreListingsReturn {
  const {
    isArabic,
    searchQuery,
    setSearchQuery,
    setCategoryFilter,
    categoryFilter,
    browseCountryCode,
    browseCityAr,
    browseCityEn,
    minPriceFilter,
    setMinPriceFilter,
    maxPriceFilter,
    setMaxPriceFilter,
    neighborhoodFilter,
    setNeighborhoodFilter,
  } = useUI();
  const { listings } = useListings();

  const [userFilterMode, setUserFilterMode] = useState<'city' | 'all' | null>(null);
  const [feedLayout, setFeedLayout] = useState<'list' | 'grid'>('list');
  const [voidedNotice, setVoidedNotice] = useState<string | null>(null);

  const activeSearchText = searchQuery;
  const setActiveSearchText = setSearchQuery;
  const activeNeighborhood = neighborhoodFilter;
  const setActiveNeighborhood = setNeighborhoodFilter;

  const handleResetAllFilters = useCallback(() => {
    setCategoryFilter(null);
    setMinPriceFilter(null);
    setMaxPriceFilter(null);
    setNeighborhoodFilter(null);
    setSearchQuery('');
    setVoidedNotice(null);
  }, [setCategoryFilter, setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setSearchQuery]);

  const marketListings = useMemo(
    () => filterListingsByMarket(listings, browseCountryCode),
    [listings, browseCountryCode]
  );

  const cityCount = useMemo(
    () => countCityListings(marketListings, browseCityAr, browseCityEn),
    [marketListings, browseCityAr, browseCityEn]
  );

  const filterMode = useMemo(
    () => computeAdaptiveFilterMode(userFilterMode, cityCount, EXPLORE_CONFIG.CITY_MIN_DENSITY),
    [userFilterMode, cityCount]
  );

  const setFilterMode = useCallback<Dispatch<SetStateAction<'city' | 'all'>>>((action) => {
    setUserFilterMode((prev) => {
      const resolved = typeof action === 'function' ? action(prev ?? 'city') : action;
      return resolved;
    });
  }, []);

  const displayListings = useMemo(() => {
    const effectiveSearch = (activeSearchText || searchQuery || '').trim();
    const filtered = marketListings.filter((item) => {
      if (categoryFilter && item.categorySlug !== categoryFilter && item.subcategorySlug !== categoryFilter) return false;
      if (!matchPrice(item, minPriceFilter, maxPriceFilter)) return false;
      if (activeNeighborhood && !matchNeighborhood(item, activeNeighborhood)) return false;
      if (!matchSearch(item, effectiveSearch)) return false;
      const isSearching = Boolean(
        (activeSearchText || searchQuery || '').trim()
      );
      if (!isSearching && filterMode === 'city' && !activeNeighborhood) {
        return item.city === browseCityAr || item.city === browseCityEn || !item.city;
      }
      return true;
    });

    return [...filtered].sort(sortListingsByPriority);
  }, [marketListings, categoryFilter, minPriceFilter, maxPriceFilter, activeNeighborhood, activeSearchText, searchQuery, filterMode, browseCityAr, browseCityEn]);

  return {
    allListings: listings, filterMode, setFilterMode, feedLayout, setFeedLayout, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, activeNeighborhood, setActiveNeighborhood, activeSearchText, setActiveSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters, isArabic, browseCountryCode, browseCityAr, browseCityEn,
  };
}
