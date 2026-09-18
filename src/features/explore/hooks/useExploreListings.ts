import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { Listing } from '@/types';

export interface UseExploreListingsReturn {
  allListings: Listing[];
  filterMode: 'city' | 'all';
  setFilterMode: Dispatch<SetStateAction<'city' | 'all'>>;
  feedLayout: 'list' | 'grid';
  setFeedLayout: Dispatch<SetStateAction<'list' | 'grid'>>;
  minPriceFilter: number | null;
  setMinPriceFilter: (p: number | null) => void;
  maxPriceFilter: number | null;
  setMaxPriceFilter: (p: number | null) => void;
  activeNeighborhood: string | null;
  setActiveNeighborhood: (n: string | null) => void;
  activeSearchText: string;
  setActiveSearchText: (t: string) => void;
  voidedNotice: string | null;
  setVoidedNotice: (n: string | null) => void;
  displayListings: Listing[];
  handleResetAllFilters: () => void;
  isArabic: boolean;
  browseCountryCode: string;
  browseCityAr: string;
  browseCityEn: string;
}

export function useExploreListings(): UseExploreListingsReturn {
  const { isArabic, searchQuery, setSearchQuery, setCategoryFilter, categoryFilter, browseCountryCode, browseCityAr, browseCityEn } = useUI();
  const { listings } = useListings();

  const [filterMode, setFilterMode] = useState<'city' | 'all'>('city');
  const [feedLayout, setFeedLayout] = useState<'list' | 'grid'>('list');
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | null>(null);
  const [activeSearchText, setActiveSearchText] = useState<string>('');
  const [voidedNotice, setVoidedNotice] = useState<string | null>(null);

  const handleResetAllFilters = useCallback(() => {
    setCategoryFilter(null);
    setMinPriceFilter(null);
    setMaxPriceFilter(null);
    setActiveNeighborhood(null);
    setActiveSearchText('');
    setSearchQuery('');
    setVoidedNotice(null);
  }, [setCategoryFilter, setSearchQuery]);

  const marketListings = useMemo(() => filterListingsByMarket(listings, browseCountryCode), [listings, browseCountryCode]);

  const displayListings = useMemo(() => {
    const filtered = marketListings.filter((item) => {
      if (categoryFilter && item.categorySlug !== categoryFilter && item.subcategorySlug !== categoryFilter) return false;
      if (minPriceFilter !== null && minPriceFilter !== undefined && minPriceFilter > 0) {
        const cleanPrice = Number(String(item.price).replace(/,/g, '').trim());
        if (!isNaN(cleanPrice) && cleanPrice < minPriceFilter) return false;
      }
      if (maxPriceFilter !== null && maxPriceFilter !== undefined && maxPriceFilter > 0) {
        const cleanPrice = Number(String(item.price).replace(/,/g, '').trim());
        if (!isNaN(cleanPrice) && cleanPrice > maxPriceFilter) return false;
      }
      if (activeNeighborhood) {
        const target = activeNeighborhood.trim().toLowerCase();
        const itemNeigh = (item.neighborhood || '').trim().toLowerCase();
        const itemCity = (item.city || '').trim().toLowerCase();
        const match = itemNeigh === target || itemCity === target || itemNeigh.includes(target) || target.includes(itemNeigh) || itemCity.includes(target) || target.includes(itemCity);
        if (!match) return false;
      }
      const effectiveSearch = (activeSearchText || searchQuery || '').trim().toLowerCase();
      if (effectiveSearch) {
        const inTitle = (item.title || '').toLowerCase().includes(effectiveSearch);
        const inDesc = (item.description || '').toLowerCase().includes(effectiveSearch);
        const inCat = (item.categorySlug || '').toLowerCase().includes(effectiveSearch);
        if (!inTitle && !inDesc && !inCat) return false;
      }
      if (filterMode === 'city' && !activeNeighborhood) {
        return item.city === browseCityAr || item.city === browseCityEn || !item.city;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (Boolean(a.isPremium) !== Boolean(b.isPremium)) return (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0);
      return new Date(b.lastBumpedAt || b.createdAt || 0).getTime() - new Date(a.lastBumpedAt || a.createdAt || 0).getTime();
    });
  }, [marketListings, categoryFilter, minPriceFilter, maxPriceFilter, activeNeighborhood, activeSearchText, searchQuery, filterMode, browseCityAr, browseCityEn]);

  return {
    allListings: listings, filterMode, setFilterMode, feedLayout, setFeedLayout, minPriceFilter, setMinPriceFilter,
    maxPriceFilter, setMaxPriceFilter, activeNeighborhood, setActiveNeighborhood, activeSearchText, setActiveSearchText,
    voidedNotice, setVoidedNotice, displayListings, handleResetAllFilters, isArabic, browseCountryCode, browseCityAr, browseCityEn,
  };
}
