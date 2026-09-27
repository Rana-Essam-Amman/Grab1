import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { EXPLORE_CONFIG } from '@/config/explore.config';
import { UseExploreListingsReturn } from './useExploreListings.types';
import { matchPrice, matchNeighborhood, countCityListings, computeAdaptiveFilterMode, sortListingsByPriority, scoreListing } from './useExploreListings.helpers';
import { searchCategories } from '@/data/searchIndex';

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
    const matchedCategorySlugs = effectiveSearch
      ? new Set(searchCategories(effectiveSearch).map((c) => c.slug))
      : null;

    const scored = marketListings
      .filter((item) => {
        if (item.status === 'sold' || item.status === 'archived') return false;
        if (categoryFilter && item.categorySlug !== categoryFilter && item.subcategorySlug !== categoryFilter) return false;
        if (!matchPrice(item, minPriceFilter, maxPriceFilter)) return false;
        if (activeNeighborhood && !matchNeighborhood(item, activeNeighborhood)) return false;
        return true;
      })
      .map((item) => {
        if (!effectiveSearch) {
          return { item, score: 1, categoryHit: false };
        }
        const inCategory = Boolean(matchedCategorySlugs && matchedCategorySlugs.has(item.categorySlug));
        const score = inCategory ? Math.max(scoreListing(item, effectiveSearch), 15) : scoreListing(item, effectiveSearch);
        return { item, score, categoryHit: inCategory };
      })
      .filter((entry) => {
        if (!effectiveSearch) return true;
        return entry.categoryHit || entry.score > 0;
      });

    const filtered = scored.map((s) => s.item);
    const isSearching = Boolean(effectiveSearch);
    if (isSearching) {
      const sortedScored = [...scored].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return sortListingsByPriority(a.item, b.item);
      });
      // Preserve any subsequent filter logic by re-applying the original city check
      const finalScored = sortedScored.filter(({ item }) => {
        if (!effectiveSearch && filterMode === 'city' && !activeNeighborhood) {
          return item.city === browseCityAr || item.city === browseCityEn || !item.city;
        }
        return true;
      });
      return finalScored.map((s) => s.item);
    }

    const finalFiltered = filtered.filter((item) => {
      if (!effectiveSearch && filterMode === 'city' && !activeNeighborhood) {
        return item.city === browseCityAr || item.city === browseCityEn || !item.city;
      }
      return true;
    });
    return [...finalFiltered].sort(sortListingsByPriority);
  }, [marketListings, categoryFilter, minPriceFilter, maxPriceFilter, activeNeighborhood, activeSearchText, searchQuery, filterMode, browseCityAr, browseCityEn]);

  return {
    allListings: listings, filterMode, setFilterMode, feedLayout, setFeedLayout, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, activeNeighborhood, setActiveNeighborhood, activeSearchText, setActiveSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters, isArabic, browseCountryCode, browseCityAr, browseCityEn,
  };
}
