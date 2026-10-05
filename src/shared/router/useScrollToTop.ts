import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reset window scroll to top whenever the URL pathname changes.
 *
 * React Router v6 does NOT restore scroll on navigation. Without this, 
 * opening a listing lands scrolled to the bottom (wherever the previous 
 * page left the viewport).
 *
 * Uses useLayoutEffect so the scroll happens BEFORE paint — the user 
 * never sees the previous scroll position on the new screen.
 *
 * NOTE: react-router-dom is restricted to src/shared/router/**. This hook 
 * lives in src/shared/hooks/ but is intentional: it's routing glue and 
 * has no other react-router usage.
 */
export function useScrollToTop(): void {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
