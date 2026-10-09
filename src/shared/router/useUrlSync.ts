import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, resolvePath } from './paths';
import { buildListingPath } from './listingPaths';
import { useListingsStore } from '@/features/listings';
import { tabToPath, pathToTab } from './tabPaths';
import { buildCategoryPath } from './categoryPaths';
import { hydrateStoreFromUrl } from './hydrateStoreFromUrl';
import { syncStoreFromFilterUrl, buildFilterQueryFromStore } from './filtersUrl';

if (typeof window !== 'undefined') {
  hydrateStoreFromUrl(window.location.pathname, window.location.search);
}

export function useUrlSync(): void {
  const navigate = useNavigate();
  const location = useLocation();

  const currentScreen = useUIStore((s) => s.currentScreen);
  const activeTab = useUIStore((s) => s.activeTab);
  const selectedListingId = useUIStore((s) => s.selectedListingId);
  const selectedSellerPhone = useUIStore((s) => s.selectedSellerPhone);
  const selectedThreadId = useUIStore((s) => s.selectedThreadId);
  const listings = useListingsStore((s) => s.listings);
  const categoryFilter = useUIStore((s) => s.categoryFilter);
  const subcategoryFilter = useUIStore((s) => s.subcategoryFilter);
  const minPriceFilter = useUIStore((s) => s.minPriceFilter);
  const maxPriceFilter = useUIStore((s) => s.maxPriceFilter);
  const neighborhoodFilter = useUIStore((s) => s.neighborhoodFilter);
  const sortBy = useUIStore((s) => s.sortBy);
  const browseCountryCode = useUIStore((s) => s.browseCountryCode);
  const selectedParentCategory = useUIStore((s) => s.selectedParentCategory);

  const setSelectedListingId = useUIStore((s) => s.setSelectedListingId);
  const setSelectedSellerPhone = useUIStore((s) => s.setSelectedSellerPhone);
  const setSelectedThreadId = useUIStore((s) => s.setSelectedThreadId);

  const lastPathRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const store = useUIStore.getState();
    const tab = pathToTab(location.pathname);

    if (tab) {
      if (store.currentScreen !== 'main' || store.activeTab !== tab) {
        useUIStore.setState({ currentScreen: 'main', activeTab: tab });
      }
      lastPathRef.current = location.pathname;
      return;
    }

    const match = resolvePath(location.pathname);
    const pathCat = match?.params.category ?? null;
    const pathSub = match?.params.subcategory ?? null;
    if ((match?.screen === 'main' && pathCat) || location.pathname === '/') {
      const nextCat = location.pathname === '/' ? null : pathCat;
      const nextSub = location.pathname === '/' ? null : pathSub;
      if (store.categoryFilter !== nextCat || store.subcategoryFilter !== nextSub) {
        useUIStore.setState({ categoryFilter: nextCat, subcategoryFilter: nextSub, selectedParentCategory: nextCat });
      }
      syncStoreFromFilterUrl(location.search);
      lastPathRef.current = location.pathname + location.search;
      return;
    }
    if (!match) return;

    const nextListingId = match.params.listingId ?? null;
    const nextSellerPhone = match.params.sellerPhone ?? null;
    const nextThreadId = match.params.threadId ?? null;

    if (match.params.listingId && store.selectedListingId !== match.params.listingId) {
      setSelectedListingId(match.params.listingId);
    }
    if (match.params.sellerPhone && store.selectedSellerPhone !== match.params.sellerPhone) {
      setSelectedSellerPhone(match.params.sellerPhone);
    }
    if (match.params.threadId && store.selectedThreadId !== match.params.threadId) {
      setSelectedThreadId(match.params.threadId);
    }

    if (match.screen !== store.currentScreen) {
      useUIStore.setState({ currentScreen: match.screen });
    }

    if (!nextListingId && store.selectedListingId) {
      useUIStore.setState({ selectedListingId: null });
    }
    if (!nextSellerPhone && store.selectedSellerPhone) {
      useUIStore.setState({ selectedSellerPhone: null });
    }
    if (!nextThreadId && store.selectedThreadId) {
      useUIStore.setState({ selectedThreadId: null });
    }

    if (match.screen === 'main') {
      syncStoreFromFilterUrl(location.search);
    }

    lastPathRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useEffect(() => {
    const latest = useUIStore.getState();
    let target: string;

    if (latest.currentScreen === 'main') {
      if (latest.activeTab === 'explore') {
        const slug = latest.subcategoryFilter ?? latest.categoryFilter;
        target = slug
          ? buildCategoryPath(latest.browseCountryCode, slug)
          : tabToPath(latest.activeTab);
        target += buildFilterQueryFromStore();
      } else {
        target = tabToPath(latest.activeTab);
      }
    } else if (latest.currentScreen === 'sub-categories' && latest.selectedParentCategory) {
      target = screenToPath('sub-categories', { category: latest.selectedParentCategory });
    } else if (latest.currentScreen === 'listing-detail' && latest.selectedListingId) {
      const current = resolvePath(window.location.pathname);
      if (current?.screen === 'listing-detail' && current.params.listingId === latest.selectedListingId) {
        return;
      }
      const listing = useListingsStore.getState().listings.find((item) => item.id === latest.selectedListingId);
      target = listing
        ? buildListingPath({
            id: listing.id,
            title: listing.title,
            countryCode: listing.countryCode,
            categorySlug: listing.categorySlug,
          })
        : `/listing/${latest.selectedListingId}`;
    } else if (latest.currentScreen === 'filters') {
      // Preserve /filters query params (owned by useFiltersUrlSync).
      target = '/filters' + location.search;
    } else {
      target = screenToPath(latest.currentScreen, {
        listingId: latest.selectedListingId,
        sellerPhone: latest.selectedSellerPhone,
        threadId: latest.selectedThreadId,
      });
    }

    if (target === location.pathname + location.search) return;
    if (lastPathRef.current === target) return;

    lastPathRef.current = target;
    navigate(target, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, activeTab, selectedListingId, selectedSellerPhone, selectedThreadId, listings, categoryFilter, subcategoryFilter, minPriceFilter, maxPriceFilter, neighborhoodFilter, sortBy, browseCountryCode, selectedParentCategory]);
}
