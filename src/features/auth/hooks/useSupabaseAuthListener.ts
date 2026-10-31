import { useEffect } from 'react';
import { hydrateProfile, useAuthStore } from '../store/auth.slice';
import { onAuthStateChange } from '../services/authService';
import { ensureAnonymousSession, isAnonymousUser } from '../services/anonymousSession';
import { mapSessionToUser, resumePendingNavigation } from './authListenerHelpers';
import { supabase } from '@/shared/lib/supabase';
import { useUIStore } from '@/store/ui.slice';
import { useListingsStore } from '@/features/listings';
import { toast } from 'sonner';

function resumePendingWishlist(): void {
  const ui = useUIStore.getState();
  const pendingId = ui.pendingWishlistId;
  if (!pendingId) return;
  const listing = useListingsStore.getState().listings.find((l) => l.id === pendingId);
  if (listing) {
    useListingsStore.getState().toggleWishlist(listing.id, listing.countryCode);
    toast.success(ui.isArabic ? 'تم حفظ الإعلان في المفضلة ✓' : 'Saved to favorites ✓');
  }
  ui.setPendingWishlistId(null);
}

function clearAuthState(): void {
  useAuthStore.setState({
    user: null,
    sessionToken: null,
    authStatus: 'unauthenticated',
    isAnonymous: false,
    profileHydrated: false,
  });
  useListingsStore.setState({ listings: [], wishlist: [] });
}

export function useSupabaseAuthListener(): void {
  useEffect(() => {
    void ensureAnonymousSession();
    let isInitialized = false;
    let signedOutTimer: ReturnType<typeof setTimeout> | null = null;

    const { unsubscribe } = onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') isInitialized = true;

      // Cancel any pending SIGNED_OUT check when a real session arrives
      if (signedOutTimer && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        clearTimeout(signedOutTimer);
        signedOutTimer = null;
      }

      if (event === 'SIGNED_OUT') {
        if (!isInitialized) return;

        // 1. Intentional logout: user pressed "logout" → clear immediately
        let intentional = false;
        try {
          intentional = sessionStorage.getItem('__intentional_logout') === '1';
          if (intentional) sessionStorage.removeItem('__intentional_logout');
        } catch {
          // sessionStorage unavailable — treat as unintentional
        }

        if (intentional) {
          clearAuthState();
          return;
        }

        // 2. Transient SIGNED_OUT (token refresh race): wait, then verify
        //    Supabase may emit SIGNED_OUT before it recovers the session.
        if (signedOutTimer) clearTimeout(signedOutTimer);
        signedOutTimer = setTimeout(() => {
          signedOutTimer = null;
          void supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
              // Session recovered — ignore the transient SIGNED_OUT
              return;
            }
            clearAuthState();
          }).catch(() => {
            clearAuthState();
          });
        }, 1500);
        return;
      }

      if (!session) return;

      if (event === 'TOKEN_REFRESHED') {
        useAuthStore.setState({
          sessionToken: session.access_token,
          isAnonymous: isAnonymousUser(session.user),
        });
        return;
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
        const user = mapSessionToUser(session);
        if (!user) return;

        const stillAnon = isAnonymousUser(session.user);
        const wasAnon = useAuthStore.getState().isAnonymous;

        useAuthStore.setState({
          user,
          sessionToken: session.access_token,
          authStatus: 'authenticated',
          isAnonymous: stillAnon,
          profileHydrated: false,
        });
        void hydrateProfile();

        if (event === 'SIGNED_IN') {
          const uiState = useUIStore.getState();
          if (uiState.activeTab !== 'explore') uiState.setActiveTab('explore');
        }

        const justLinked = !stillAnon && wasAnon;
        const freshSignIn = !stillAnon && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION');
        if (justLinked || freshSignIn) {
          const pendingChat = localStorage.getItem('pending_chat_listing');
          if (pendingChat) {
            localStorage.removeItem('pending_chat_listing');
            useUIStore.getState().setSelectedListingId(pendingChat);
            useUIStore.getState().navigateTo('listing-detail');
            return;
          }
          resumePendingNavigation();
          resumePendingWishlist();
        }
      }
    });

    return () => {
      if (signedOutTimer) clearTimeout(signedOutTimer);
      unsubscribe();
    };
  }, []);
}
