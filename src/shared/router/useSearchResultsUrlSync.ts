import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/ui.slice';

/**
 * Syncs store.searchQuery ↔ URL ?q= on the /search screen only.
 *
 * Kept separate from useUrlSync because that file is at its Rule 14
 * limit (148/150). This hook is scoped, additive, and never touches
 * any other screen's URL behavior.
 *
 * Write path: searchQuery changes → /search?q=...
 * Read path: URL changes (back/forward/deep link) → store.searchQuery
 *
 * Race guard: navigate(replace:true) does not commit location.search
 * synchronously. Without lastWrittenRef, the read effect fires with
 * the stale URL and reverts store.searchQuery to the previous value,
 * causing a second search RPC to run with the old query.
 */
export function useSearchResultsUrlSync(): void {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = useUIStore((s) => s.searchQuery);
  const currentScreen = useUIStore((s) => s.currentScreen);
  const lastWrittenRef = useRef<string | null>(null);

  // Write: store → URL. Runs only on the search-results screen.
  useEffect(() => {
    if (currentScreen !== 'search-results') return;
    if (location.pathname !== '/search') return;

    const params = new URLSearchParams(location.search);
    const urlQ = params.get('q') ?? '';
    const trimmed = searchQuery.trim();

    if (trimmed === urlQ) return;

    if (trimmed) {
      params.set('q', trimmed);
    } else {
      params.delete('q');
    }

    const qs = params.toString();
    const next = `/search${qs ? '?' + qs : ''}`;
    const current = location.pathname + location.search;

    if (next === current) return;

    lastWrittenRef.current = next;
    navigate(next, { replace: true });
  }, [currentScreen, searchQuery, location.pathname, location.search, navigate]);

  // Read: URL → store. Handles back/forward and deep-link entry.
  useEffect(() => {
    if (location.pathname !== '/search') return;

    const currentUrl = location.pathname + location.search;

    if (lastWrittenRef.current === currentUrl) {
      lastWrittenRef.current = null;
      return;
    }

    lastWrittenRef.current = null;

    const urlQ = (new URLSearchParams(location.search).get('q') ?? '').trim();
    const store = useUIStore.getState();

    if (urlQ && urlQ !== store.searchQuery) {
      useUIStore.setState({ searchQuery: urlQ });
    }
  }, [location.pathname, location.search]);
}
