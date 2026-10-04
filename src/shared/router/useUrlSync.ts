import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, resolvePath } from './paths';

/**
 * Two-way sync between the store and the browser URL.
 *
 * Store is source of truth (Phase 1/2b/2c). This hook mirrors the current 
 * screen + entity IDs to the URL, and restores them from the URL on 
 * mount / back / deep-link.
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

  // Prevent feedback loops between the two effects.
  const lastPathRef = useRef<string | null>(null);

  // --- URL → Store ---------------------------------------------------
  // useLayoutEffect so this runs BEFORE the browser paints. Without it, 
  // refresh on /listing/:id briefly flashes Home before the listing 
  // mounts (documented fix: React docs + SO).
  useLayoutEffect(() => {
    const match = resolvePath(location.pathname);
    if (!match) return;

    const store = useUIStore.getState();

    if (match.params.listingId && store.selectedListingId !== match.params.listingId) {
      setSelectedListingId(match.params.listingId);
    }
    if (match.params.sellerPhone && store.selectedSellerPhone !== match.params.sellerPhone) {
      setSelectedSellerPhone(match.params.sellerPhone);
    }
    if (match.params.threadId && store.selectedThreadId !== match.params.threadId) {
      setSelectedThreadId(match.params.threadId);
    }

    // URL sync is NOT user navigation — reconcile state WITHOUT appending 
    // to screenHistory. Otherwise popstate (browser back) grows history 
    // indefinitely.
    if (match.screen !== store.currentScreen) {
      useUIStore.setState({ currentScreen: match.screen });
    }

    lastPathRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // --- Store → URL ---------------------------------------------------
  useEffect(() => {
    const target = screenToPath(currentScreen, {
      listingId: selectedListingId,
      sellerPhone: selectedSellerPhone,
      threadId: selectedThreadId,
    });
    if (target === location.pathname) return;
    if (lastPathRef.current === target) return;
    lastPathRef.current = target;
    navigate(target, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, selectedListingId, selectedSellerPhone, selectedThreadId]);
}
