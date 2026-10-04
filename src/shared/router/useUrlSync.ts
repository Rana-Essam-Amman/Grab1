import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, resolvePath } from './paths';

/**
 * Two-way sync between the store and the browser URL.
 *
 * Store is source of truth (Phase 1/2b). This hook mirrors the current 
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

  const navigateTo = useUIStore((s) => s.navigateTo);
  const setSelectedListingId = useUIStore((s) => s.setSelectedListingId);
  const setSelectedSellerPhone = useUIStore((s) => s.setSelectedSellerPhone);

  // Prevent feedback loops between the two effects.
  const lastPathRef = useRef<string | null>(null);

  // --- URL → Store ---------------------------------------------------
  useEffect(() => {
    const match = resolvePath(location.pathname);
    if (!match) return;

    const store = useUIStore.getState();

    if (match.params.listingId && store.selectedListingId !== match.params.listingId) {
      setSelectedListingId(match.params.listingId);
    }
    if (match.params.sellerPhone && store.selectedSellerPhone !== match.params.sellerPhone) {
      setSelectedSellerPhone(match.params.sellerPhone);
    }
    if (match.screen !== store.currentScreen) {
      navigateTo(match.screen);
    }

    lastPathRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // --- Store → URL ---------------------------------------------------
  useEffect(() => {
    const target = screenToPath(currentScreen, {
      listingId: selectedListingId,
      sellerPhone: selectedSellerPhone,
    });
    if (target === location.pathname) return;
    if (lastPathRef.current === target) return;
    lastPathRef.current = target;
    navigate(target, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, selectedListingId, selectedSellerPhone]);
}
