import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, resolvePath } from './paths';
import { buildListingPath } from './listingPaths';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { tabToPath, pathToTab } from './tabPaths';
import { buildCategoryPath } from './categoryPaths';
import { hydrateStoreFromUrl } from './hydrateStoreFromUrl';

/**
 * Two-way sync between the store and the browser URL.
 *
 * Store is source of truth. URL mirrors it so refresh, share, back, and
 * deep links all work — including the bottom-nav tabs (categories /
 * messages / my-ads), which used to share the path '/' and therefore
 * lost their identity on refresh.
 *
 * MUST be mounted exactly once, inside <RouterProvider>.
 */

// Module-scope: hydrate the store from the current URL BEFORE React
// renders. Eliminates the race condition that caused "refresh goes Home".
if (typeof window !== 'undefined') {
  hydrateStoreFromUrl(window.location.pathname);
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
  const browseCountryCode = useUIStore((s) => s.browseCountryCode);

  const setSelectedListingId = useUIStore((s) => s.setSelectedListingId);
  const setSelectedSellerPhone = useUIStore((s) => s.setSelectedSellerPhone);
  const setSelectedThreadId = useUIStore((s) => s.setSelectedThreadId);

  const lastPathRef = useRef<string | null>(null);

  // --- URL → Store ---------------------------------------------------
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

    lastPathRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // --- Store → URL ---------------------------------------------------
  useEffect(() => {
    const latest = useUIStore.getState();
    let target: string;

    if (latest.currentScreen === 'main') {
      // Category pages take priority: /{market}/{category}
      if (latest.activeTab === 'explore' && latest.categoryFilter) {
        target = buildCategoryPath(latest.browseCountryCode, latest.categoryFilter);
      } else {
        target = tabToPath(latest.activeTab);
      }
    } else if (latest.currentScreen === 'listing-detail' && latest.selectedListingId) {
      // Skip write if current URL already resolves to this listing.
      // Prevents: SEO URL → legacy URL → SEO URL flicker while data loads.
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
    } else {
      target = screenToPath(latest.currentScreen, {
        listingId: latest.selectedListingId,
        sellerPhone: latest.selectedSellerPhone,
        threadId: latest.selectedThreadId,
      });
    }

    if (target === location.pathname) return;
    if (lastPathRef.current === target) return;

    lastPathRef.current = target;
    navigate(target, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, activeTab, selectedListingId, selectedSellerPhone, selectedThreadId, listings, categoryFilter, browseCountryCode]);
}
