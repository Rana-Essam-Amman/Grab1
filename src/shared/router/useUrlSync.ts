import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, resolvePath } from './paths';

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

// Bottom-nav tabs are rendered inside `currentScreen === 'main'` but 
// need distinct URLs so refresh/back/deep-link all work.
type TabSlug = 'categories' | 'messages' | 'my-ads';

function tabToPath(tab: string | undefined): string {
  switch (tab) {
    case 'categories': return '/categories';
    case 'messages': return '/messages';
    case 'my-ads': return '/my-ads';
    default: return '/';
  }
}

function pathToTab(pathname: string): TabSlug | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (clean === '/categories') return 'categories';
  if (clean === '/messages') return 'messages';
  if (clean === '/my-ads') return 'my-ads';
  return null;
}

// Module-scope: hydrate the store from the current URL BEFORE React 
// renders. Eliminates the race condition that caused "refresh goes Home".
if (typeof window !== 'undefined') {
  const path = window.location.pathname;
  const initialTab = pathToTab(path);
  const store = useUIStore.getState();

  if (initialTab) {
    if (store.currentScreen !== 'main' || store.activeTab !== initialTab) {
      useUIStore.setState({ currentScreen: 'main', activeTab: initialTab });
    }
  } else {
    const initialMatch = resolvePath(path);
    if (initialMatch) {
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
  }
}

export function useUrlSync(): void {
  const navigate = useNavigate();
  const location = useLocation();

  const currentScreen = useUIStore((s) => s.currentScreen);
  const activeTab = useUIStore((s) => s.activeTab);
  const selectedListingId = useUIStore((s) => s.selectedListingId);
  const selectedSellerPhone = useUIStore((s) => s.selectedSellerPhone);
  const selectedThreadId = useUIStore((s) => s.selectedThreadId);

  const setSelectedListingId = useUIStore((s) => s.setSelectedListingId);
  const setSelectedSellerPhone = useUIStore((s) => s.setSelectedSellerPhone);
  const setSelectedThreadId = useUIStore((s) => s.setSelectedThreadId);

  const lastPathRef = useRef<string | null>(null);

  // --- URL → Store ---------------------------------------------------
  useLayoutEffect(() => {
    const store = useUIStore.getState();
    const tab = pathToTab(location.pathname);

    // Bottom-nav tab URLs
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

    // Clear stale entity ids when navigating away from a screen that used them.
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
      target = tabToPath(latest.activeTab);
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
  }, [currentScreen, activeTab, selectedListingId, selectedSellerPhone, selectedThreadId]);
}
