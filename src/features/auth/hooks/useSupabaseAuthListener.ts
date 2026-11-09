import { useEffect } from 'react';
import { hydrateProfile, useAuthStore } from '../store/auth.slice';
import { onAuthStateChange } from '../services/authService';
import { isAnonymousUser } from '../services/anonymousSession';
import { mapSessionToUser, resumePendingNavigation } from './authListenerHelpers';
import { clearAuthState, resumePendingWishlist } from '../helpers/authStateHelpers';
import { useUIStore } from '@/store/ui.slice';

export function useSupabaseAuthListener(): void {
  useEffect(() => {
    const { unsubscribe } = onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' && !session) {
        useAuthStore.setState({
          user: null,
          sessionToken: null,
          authStatus: 'unauthenticated',
          isAnonymous: false,
          profileHydrated: false,
        });
        return;
      }

      if (event === 'SIGNED_OUT') {
        clearAuthState();
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

      if (
        event === 'SIGNED_IN' ||
        event === 'INITIAL_SESSION' ||
        event === 'USER_UPDATED'
      ) {
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
      unsubscribe();
    };
  }, []);
}
