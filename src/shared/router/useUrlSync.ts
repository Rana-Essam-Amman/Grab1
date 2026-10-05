import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, resolvePath } from './paths';

/**
 * Two-way sync between the store and the browser URL.
 *
 * ─────────────────────────────────────────────────────────────────
 * ROOT FIX (this file, module scope): Before React renders anything,
 * we read the current URL once and hydrate the store. This eliminates
 * the race condition that caused "refresh goes Home" — by the time any
 * component (or any hook/effect) runs, the store already matches the URL.
 * ─────────────────────────────────────────────────────────────────
 *
 * Why module scope: ES modules evaluate synchronously when first imported.
 * Since this file is imported by App.tsx (top of the tree), this runs
 * before ReactDOM renders <App />. Zero React lifecycle involvement,
 * zero stale closures, zero flash.
 */
if (typeof window !== 'undefined') {
  const initialMatch = resolvePath(window.location.pathname);
  if (initialMatch) {
    const store = useUIStore.getState();
    const nextListingId = initialMatch.params.listingId ?? null;
    const nextSellerPhone = initialMatch.params.sellerPhone ?? null;
    const nextThreadId = initialMatch.params.threadId ?? null;

    // Only write if something actually differs — avoids a redundant 
    // store update on the first navigation after a real app boot.
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

/**
 * Reactive URL ↔ store sync for subsequent navigations, back/forward, 
 * and share-link entry (deep links after the app has booted).
 *
 * MUST be mounted exactly once, inside <RouterProvider>.
 */
export function useUrlSync(): void {
  const navigate = useNavigate();
  const location = useLocation();

  const currentScreen = useUIStore((s) => s.currentScreen);
  const selectedListingId = useUIStore((s) => s.selectedListingId);
  const selectedSellerPhone = useUIStore((s) => s.selectedSellerPhone);
  const selectedThreadId = useUIStore((s) => s.selectedThreadId);

  const setSelectedListingId = useUIStore((s) => s.setSelectedListingId);
  const setSelectedSellerPhone = useUIStore((s) => s.setSelectedSellerPhone);
  const setSelectedThreadId = useUIStore((s) => s.setSelectedThreadId);

  const lastPathRef = useRef<string | null>(null);

  // --- URL → Store (popstate, in-app link clicks, back/forward) -------
  useLayoutEffect(() => {
    const match = resolvePath(location.pathname);
    if (!match) return;

    const store = useUIStore.getState();
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

    // Also clear stale entity ids when navigating to a screen that 
    // doesn't use them (e.g., from /listing/x to /settings).
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

  // --- Store → URL (user-initiated navigateTo calls) -----------------
  useEffect(() => {
    const latest = useUIStore.getState();
    const target = screenToPath(latest.currentScreen, {
      listingId: latest.selectedListingId,
      sellerPhone: latest.selectedSellerPhone,
      threadId: latest.selectedThreadId,
    });
    if (target === location.pathname) return;
    if (lastPathRef.current === target) return;
    lastPathRef.current = target;
    navigate(target, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, selectedListingId, selectedSellerPhone, selectedThreadId]);
}
