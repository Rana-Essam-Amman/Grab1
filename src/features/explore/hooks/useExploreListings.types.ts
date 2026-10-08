import { Dispatch, SetStateAction } from 'react';
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
  readonly hasMore: boolean;
  readonly isLoadingMore: boolean;
  readonly onLoadMore: () => void;
}
