import { useUIStore } from '@/store/ui.slice';
import { globalStorage } from '@/shared/lib/marketStorage';
import { resolvePath } from './paths';
import { pathToTab } from './tabPaths';
import { syncStoreFromFilterUrl } from './filtersUrl';

/**
 * Hydrate the UI store from the current URL BEFORE React renders.
 * Eliminates the race condition that caused "refresh goes Home".
 * Call at module scope in useUrlSync.ts, exactly once.
 */
export function hydrateStoreFromUrl(path: string, search: string): void {
  const initialTab = pathToTab(path);
  const store = useUIStore.getState();

  if (initialTab) {
    if (store.currentScreen !== 'main' || store.activeTab !== initialTab) {
      useUIStore.setState({ currentScreen: 'main', activeTab: initialTab });
    }
    return;
  }

  const initialMatch = resolvePath(path);
  if (!initialMatch) return;

  const market = initialMatch.params.market ?? null;
  const category = initialMatch.params.category ?? null;
  const subcategory = initialMatch.params.subcategory ?? null;

  // Sub-categories: restore parent category from /categories/sub/:slug
  if (initialMatch.screen === 'sub-categories' && category) {
    useUIStore.setState({ selectedParentCategory: category });
  }

  if (market && market !== store.browseCountryCode) {
    useUIStore.setState({
      browseCountryCode: market,
      browseMarketOverride: market,
    });
    try {
      globalStorage().set('catch_browse_market_override', market);
    } catch { /* ignore */ }
  }

  if (category) {
    useUIStore.setState({
      categoryFilter: category,
      subcategoryFilter: subcategory,
      selectedParentCategory: category,
      activeTab: 'explore',
    });
  }

  syncStoreFromFilterUrl(search);

  // Search results: restore ?q= from the URL so refresh preserves the query.
  if (initialMatch.screen === 'search-results') {
    const q = new URLSearchParams(search).get('q');
    if (q && q.trim() !== store.searchQuery) {
      useUIStore.setState({ searchQuery: q.trim() });
    }
  }

  const nextListingId = initialMatch.params.listingId ?? null;
  const nextSellerPhone = initialMatch.params.sellerPhone ?? null;
  const nextThreadId = initialMatch.params.threadId ?? null;

  if (
    store.currentScreen !== initialMatch.screen ||
    store.selectedListingId !== nextListingId ||
    store.selectedSellerPhone !== nextSellerPhone ||
    store.selectedThreadId !== nextThreadId
  ) {
    useUIStore.setState({
      currentScreen: initialMatch.screen,
      selectedListingId: nextListingId,
      selectedSellerPhone: nextSellerPhone,
      selectedThreadId: nextThreadId,
    });
  }
}
