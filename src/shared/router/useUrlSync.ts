import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, resolvePath } from './paths';

/**
 * Two-way sync between the store and the browser URL.
 *
 * Store is source of truth. URL mirrors it so refresh, share, back, and 
 * deep links all work.
 *
 * MUST be mounted exactly once, inside <RouterProvider>.
 */
export function useUrlSync(): void {
  const navigate = useNavigate();
  const location = useLocation();

  // These are only used to re-trigger the Store→URL effect when they 
  // change. The actual values are read fresh inside the effect (below) so 
  // we never use stale closure values from the render before URL→Store 
  // hydration — that was the root cause of "refresh goes Home".
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
  // mounts.
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
    // Read FRESH values from the store. Do NOT use closure values above — 
    // during the first run after a refresh they can be stale ('main' for 
    // currentScreen), which would navigate back to '/' and lose the 
    // deep link.
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
