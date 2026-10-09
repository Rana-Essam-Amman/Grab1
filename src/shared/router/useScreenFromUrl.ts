import { useLocation } from 'react-router-dom';
import { resolvePath } from './paths';
import { pathToTab } from './tabPaths';
import type { ScreenType, TabType } from '@/store/ui.slice.types';

/**
 * Derive the current screen + active tab SYNCHRONOUSLY from the URL.
 *
 * Called by MainNavigator so the first render already shows the correct
 * screen. The store (ui.slice) remains synced by useUrlSync for other
 * consumers — but MainNavigator does NOT wait for that.
 *
 * Fixes:
 *   - Global first-paint flicker (was: render 'main' → effect → render correct)
 *   - /categories/sub refresh returning to Home
 */
export function useScreenFromUrl(): {
  readonly currentScreen: ScreenType;
  readonly activeTab: TabType;
} {
  const location = useLocation();

  const tab = pathToTab(location.pathname);
  if (tab) {
    return { currentScreen: 'main', activeTab: tab };
  }

  const match = resolvePath(location.pathname);
  if (match) {
    return { currentScreen: match.screen, activeTab: 'explore' };
  }

  return { currentScreen: 'main', activeTab: 'explore' };
}
