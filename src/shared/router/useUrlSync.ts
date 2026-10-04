import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';
import { screenToPath, pathToScreen } from './paths';

/**
 * Two-way sync between the store's currentScreen and the browser URL.
 *
 * Store is source of truth (Phase 1). This hook keeps the URL mirrored 
 * so refresh, share, and back-button all work.
 *
 * MUST be mounted exactly once, inside a <BrowserRouter>, before any 
 * screen renders.
 */
export function useUrlSync(): void {
  const navigate = useNavigate();
  const location = useLocation();

  const currentScreen = useUIStore((s) => s.currentScreen);
  const navigateTo = useUIStore((s) => s.navigateTo);

  // Avoid feedback loop: track the last path we pushed vs what we 
  // observed from location.
  const lastPathRef = useRef<string | null>(null);

  // --- URL → Store ---------------------------------------------------
  // On first mount: hydrate store from URL.
  useEffect(() => {
    const fromUrl = pathToScreen(location.pathname);
    if (!fromUrl) return;
    const currentStore = useUIStore.getState().currentScreen;
    if (fromUrl !== currentStore) {
      navigateTo(fromUrl);
    }
    lastPathRef.current = location.pathname;
    // Run once on mount + on popstate (location changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // --- Store → URL ---------------------------------------------------
  useEffect(() => {
    const target = screenToPath(currentScreen);
    if (target === location.pathname) return;
    if (lastPathRef.current === target) return;
    lastPathRef.current = target;
    navigate(target, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen]);
}
