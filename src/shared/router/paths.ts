/**
 * Screen ↔ URL mapping.
 *
 * Phase 1 of the URL-routing migration: URL is a MIRROR of the store's 
 * currentScreen. Follow-up commits will move individual screens to 
 * useParams() and eventually remove the switch entirely.
 *
 * Screens that take an entity id (listing, thread, seller) currently 
 * still rely on the store (selectedListingId etc). Their URLs use a 
 * generic placeholder for now; the entity is read from the store on 
 * refresh via the initial state. See follow-up plans.
 */

import type { ScreenType } from '@/store/ui.slice.types';

/** Map a ScreenType to a URL path. Returns '/' if unknown. */
export function screenToPath(screen: ScreenType): string {
  switch (screen) {
    case 'main':                     return '/';
    case 'listing-detail':           return '/listing';
    case 'seller-profile':           return '/seller';
    case 'search-results':           return '/search';
    case 'messages':                 return '/messages';
    case 'thread':                   return '/messages/thread';
    case 'my-listings':              return '/my-ads';
    case 'wishlist':                 return '/wishlist';
    case 'notifications':            return '/notifications';
    case 'profile':                  return '/profile';
    case 'edit-profile':             return '/profile/edit';
    case 'settings':                 return '/settings';
    case 'sub-categories':           return '/categories/sub';
    case 'post-ad-entry':            return '/post-ad';
    case 'post-category':            return '/post-ad/category';
    case 'post-category-pick':       return '/post-ad/category-pick';
    case 'post-subcategory':         return '/post-ad/subcategory';
    case 'post-photos':              return '/post-ad/photos';
    case 'post-location':            return '/post-ad/location';
    case 'post-details':             return '/post-ad/details';
    case 'post-ai-draft':            return '/post-ad/ai-draft';
    case 'post-ai-review':           return '/post-ad/ai-review';
    case 'post-ai-capture':          return '/post-ad/ai-capture';
    case 'post-publish-success':     return '/post-ad/success';
    case 'edit-post':                return '/post-ad/edit';
    case 'login':                    return '/login';
    case 'register':                 return '/register';
    case 'confirm':                  return '/confirm';
    case 'terms':                    return '/terms';
    case 'privacy':                  return '/privacy';
    case 'support':                  return '/support';
    case 'safety':                   return '/safety';
    case 'about':                    return '/about';
    default:                         return '/';
  }
}

/** Map a URL path to a ScreenType. Returns null if no match. */
export function pathToScreen(pathname: string): ScreenType | null {
  // Strip trailing slash (except root)
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  switch (clean) {
    case '/':                        return 'main';
    case '/listing':                 return 'listing-detail';
    case '/seller':                  return 'seller-profile';
    case '/search':                  return 'search-results';
    case '/messages':                return 'messages';
    case '/messages/thread':         return 'thread';
    case '/my-ads':                  return 'my-listings';
    case '/wishlist':                return 'wishlist';
    case '/notifications':           return 'notifications';
    case '/profile':                 return 'profile';
    case '/profile/edit':            return 'edit-profile';
    case '/settings':                return 'settings';
    case '/categories':              return 'main';
    case '/categories/sub':          return 'sub-categories';
    case '/post-ad':                 return 'post-ad-entry';
    case '/post-ad/category':        return 'post-category';
    case '/post-ad/category-pick':   return 'post-category-pick';
    case '/post-ad/subcategory':     return 'post-subcategory';
    case '/post-ad/photos':          return 'post-photos';
    case '/post-ad/location':        return 'post-location';
    case '/post-ad/details':         return 'post-details';
    case '/post-ad/ai-draft':        return 'post-ai-draft';
    case '/post-ad/ai-review':       return 'post-ai-review';
    case '/post-ad/ai-capture':      return 'post-ai-capture';
    case '/post-ad/success':         return 'post-publish-success';
    case '/post-ad/edit':            return 'edit-post';
    case '/login':                   return 'login';
    case '/register':                return 'register';
    case '/confirm':                 return 'confirm';
    case '/terms':                   return 'terms';
    case '/privacy':                 return 'privacy';
    case '/support':                 return 'support';
    case '/safety':                  return 'safety';
    case '/about':                   return 'about';
    default:                         return null;
  }
}
