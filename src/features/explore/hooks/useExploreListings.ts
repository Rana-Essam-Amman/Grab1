import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { Listing } from '@/types';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { EXPLORE_CONFIG } from '@/config/explore.config';
import { UseExploreListingsReturn } from './useExploreListings.types';
import { matchPrice, matchNeighborhood, countCityListings, computeAdaptiveFilterMode, sortListingsByPriority, scoreListing } from './useExploreListings.helpers';
import { searchCategories } from '@/data/searchIndex';

export function useExploreListings(): UseExploreListingsReturn {
  const {
    isArabic, searchQuery, setSearchQuery, setCategoryFilter, categoryFilter,
    browseCountryCode, browseCityAr, browseCityEn, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, neighborhoodFilter, setNeighborhoodFilter,
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
    const q = (activeSearchText || searchQuery || '').trim();
    const matchedCategorySlugs = q ? new Set(searchCategories(q).map((c) => c.slug)) : null;

    const scored = marketListings
      .filter((item) => {
        if (item.status === 'sold' || item.status === 'archived') return false;
        if (categoryFilter && item.categorySlug !== categoryFilter && item.subcategorySlug !== categoryFilter) return false;
        if (!matchPrice(item, minPriceFilter, maxPriceFilter)) return false;
        if (activeNeighborhood && !matchNeighborhood(item, activeNeighborhood)) return false;
        return true;
      })
      .map((item) => {
        if (!q) return { item, score: 1, categoryHit: false };
        const inCategory = Boolean(matchedCategorySlugs?.has(item.categorySlug));
        const score = inCategory ? Math.max(scoreListing(item, q), 15) : scoreListing(item, q);
        return { item, score, categoryHit: inCategory };
      })
      .filter((entry) => !q || entry.categoryHit || entry.score > 0);

    const checkCity = (item: Listing) => {
      if (q || filterMode !== 'city' || activeNeighborhood) return true;
      return item.city === browseCityAr || item.city === browseCityEn || !item.city;
    };

    if (q) {
      return [...scored]
        .sort((a, b) => b.score !== a.score ? b.score - a.score : sortListingsByPriority(a.item, b.item))
        .filter(entry => checkCity(entry.item))
        .map((s) => s.item);
    }
    const finalFiltered = scored.map(s => s.item).filter(checkCity);
    return [...finalFiltered].sort(sortListingsByPriority);
  }, [marketListings, categoryFilter, minPriceFilter, maxPriceFilter, activeNeighborhood, activeSearchText, searchQuery, filterMode, browseCityAr, browseCityEn]);

  return {
    allListings: listings, filterMode, setFilterMode, feedLayout, setFeedLayout, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, activeNeighborhood, setActiveNeighborhood, activeSearchText, setActiveSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters, isArabic, browseCountryCode, browseCityAr, browseCityEn,
  };
}
