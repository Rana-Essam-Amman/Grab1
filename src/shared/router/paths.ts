/**
 * Screen ↔ URL mapping.
 *
 * Phase 2b/2c: entity IDs (listingId, sellerPhone, threadId) travel in the URL so 
 * refresh, share, back, and deep links all restore the correct screen.
 *
 * The store remains the runtime source of truth; useUrlSync keeps the 
 * URL in sync. Callsites keep using navigateTo('screen') after setting 
 * setSelectedListingId / setSelectedSellerPhone / setSelectedThreadId.
 */

import type { ScreenType } from '@/store/ui.slice.types';
import type { MarketCode } from '@/shared/lib/marketGate';
import { parseListingPath } from './listingPaths';
import { parseCategoryPath } from './categoryPaths';

/** Entity IDs that may travel in a URL. Null means "not set". */
export interface RouteParams {
  readonly listingId?: string | null;
  readonly sellerPhone?: string | null;
  readonly threadId?: string | null;
  readonly market?: MarketCode | null;
  readonly category?: string | null;
  readonly subcategory?: string | null;
}

/** Result of resolving a URL back to a screen + its params. */
export interface PathMatch {
  readonly screen: ScreenType;
  readonly params: RouteParams;
}

/** Static (no-param) path table — single source of truth for both directions. */
const STATIC_SCREEN_TO_PATH: Record<Exclude<ScreenType, 'listing-detail' | 'seller-profile' | 'thread'>, string> = {
  'main': '/',
  'search-results': '/search',
  'messages': '/messages',
  'my-listings': '/my-ads',
  'wishlist': '/wishlist',
  'notifications': '/notifications',
  'profile': '/profile',
  'edit-profile': '/profile/edit',
  'settings': '/settings',
  'sub-categories': '/categories/sub',
  'post-ad-entry': '/post-ad',
  'post-category': '/post-ad/category',
  'post-category-pick': '/post-ad/category-pick',
  'post-subcategory': '/post-ad/subcategory',
  'post-photos': '/post-ad/photos',
  'post-location': '/post-ad/location',
  'post-details': '/post-ad/details',
  'post-ai-draft': '/post-ad/ai-draft',
  'post-ai-review': '/post-ad/ai-review',
  'post-ai-capture': '/post-ad/ai-capture',
  'post-publish-success': '/post-ad/success',
  'edit-post': '/post-ad/edit',
  'login': '/login',
  'register': '/register',
  'confirm': '/confirm',
  'terms': '/terms',
  'pricing': '/pricing',
  'privacy': '/privacy',
  'support': '/support',
  'safety': '/safety',
  'about': '/about',
};

const STATIC_PATH_TO_SCREEN: Record<string, ScreenType> = Object.fromEntries(
  Object.entries(STATIC_SCREEN_TO_PATH).map(([screen, path]) => [path, screen as ScreenType])
) as Record<string, ScreenType>;

/** Map a ScreenType (+ optional params) to a URL path. */
export function screenToPath(screen: ScreenType, params?: RouteParams): string {
  if (screen === 'listing-detail') {
    return params?.listingId ? `/listing/${encodeURIComponent(params.listingId)}` : '/listing';
  }
  if (screen === 'seller-profile') {
    return params?.sellerPhone ? `/seller/${encodeURIComponent(params.sellerPhone)}` : '/seller';
  }
  if (screen === 'edit-post') {
    return params?.listingId
      ? `/post-ad/edit/${encodeURIComponent(params.listingId)}`
      : '/post-ad/edit';
  }
  if (screen === 'thread') return params?.threadId ? `/messages/${encodeURIComponent(params.threadId)}` : '/messages/thread';
  if (screen === 'sub-categories' && params?.category) return `/categories/sub/${encodeURIComponent(params.category)}`;
  return STATIC_SCREEN_TO_PATH[screen] ?? '/';
}

/** Resolve a URL pathname to its screen + entity params. Returns null on no match. */
export function resolvePath(pathname: string): PathMatch | null {
  // Strip trailing slash (except root)
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  const cat = parseCategoryPath(clean);
  if (cat) {
    return {
      screen: 'main',
      params: { market: cat.market, category: cat.category, subcategory: cat.subcategory },
    };
  }

  const seoListing = parseListingPath(clean);
  if (seoListing) {
    return {
      screen: 'listing-detail',
      params: { listingId: seoListing.id },
    };
  }

  // Dynamic: /listing/:id
  const listingMatch = clean.match(/^\/listing\/([^/]+)$/);
  if (listingMatch) return { screen: 'listing-detail', params: { listingId: decodeURIComponent(listingMatch[1]) } };

  // Dynamic: /seller/:phone
  const sellerMatch = clean.match(/^\/seller\/([^/]+)$/);
  if (sellerMatch) return { screen: 'seller-profile', params: { sellerPhone: decodeURIComponent(sellerMatch[1]) } };

  // Legacy base paths without id (kept for backward-compat round-trip tests)
  if (clean === '/listing') return { screen: 'listing-detail', params: {} };
  if (clean === '/seller') return { screen: 'seller-profile', params: {} };
  if (clean === '/messages/thread') return { screen: 'thread', params: {} };

  // Dynamic: /messages/:id (must come AFTER the /messages/thread check)
  const threadMatch = clean.match(/^\/messages\/([^/]+)$/);
  if (threadMatch) return { screen: 'thread', params: { threadId: decodeURIComponent(threadMatch[1]) } };

  // Dynamic: /post-ad/edit/:id (legacy /post-ad/edit remains static)
  const editMatch = clean.match(/^\/post-ad\/edit\/([^/]+)$/);
  if (editMatch) {
    return {
      screen: 'edit-post',
      params: { listingId: decodeURIComponent(editMatch[1]) },
    };
  }

  const subCatMatch = clean.match(/^\/categories\/sub\/([^/]+)$/);
  if (subCatMatch) return { screen: 'sub-categories', params: { category: decodeURIComponent(subCatMatch[1]) } };

  const screen = STATIC_PATH_TO_SCREEN[clean];
  if (screen) return { screen, params: {} };
  return null;
}

/** Backward-compatible thin wrapper — returns just the screen. */
export function pathToScreen(pathname: string): ScreenType | null {
  return resolvePath(pathname)?.screen ?? null;
}
