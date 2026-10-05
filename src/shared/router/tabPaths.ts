/**
 * Bottom-nav tab ↔ URL helpers.
 * Tabs are rendered inside `currentScreen === 'main'` but need distinct
 * URLs so refresh / back / deep-link all work.
 */

export type TabSlug = 'categories' | 'messages' | 'my-ads';

export function tabToPath(tab: string | undefined): string {
  switch (tab) {
    case 'categories': return '/categories';
    case 'messages': return '/messages';
    case 'my-ads': return '/my-ads';
    default: return '/';
  }
}

export function pathToTab(pathname: string): TabSlug | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (clean === '/categories') return 'categories';
  if (clean === '/messages') return 'messages';
  if (clean === '/my-ads') return 'my-ads';
  return null;
}
