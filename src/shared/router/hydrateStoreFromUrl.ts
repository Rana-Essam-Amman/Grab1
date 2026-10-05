import { useUIStore } from '@/store/ui.slice';
import { resolvePath } from './paths';
import { pathToTab } from './tabPaths';

/**
 * Hydrate the UI store from the current URL BEFORE React renders.
 * Eliminates the race condition that caused "refresh goes Home".
 * Call at module scope in useUrlSync.ts, exactly once.
 */
export function hydrateStoreFromUrl(path: string): void {
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
