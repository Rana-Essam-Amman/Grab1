import { useEffect } from 'react';
import { hydrateProfile, useAuthStore } from '../store/auth.slice';
import { onAuthStateChange } from '../services/authService';
import { ensureAnonymousSession, isAnonymousUser } from '../services/anonymousSession';
import { mapSessionToUser, resumePendingNavigation } from './authListenerHelpers';
import { useUIStore } from '@/store/ui.slice';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { toast } from 'sonner';

function resumePendingWishlist(): void {
  const ui = useUIStore.getState();
  const pendingId = ui.pendingWishlistId;
  if (!pendingId) return;

  const listingsStore = useListingsStore.getState();
  const listing = listingsStore.listings.find((l) => l.id === pendingId);

  if (listing) {
    listingsStore.toggleWishlist(listing.id, listing.countryCode);
    toast.success(
      ui.isArabic
        ? 'تم حفظ الإعلان في المفضلة ✓'
        : 'Saved to favorites ✓'
    );
  }

  ui.setPendingWishlistId(null);
}

export function useSupabaseAuthListener(): void {
  useEffect(() => {
    void ensureAnonymousSession();

    const { unsubscribe } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        useAuthStore.setState({
          user: null,
          sessionToken: null,
          authStatus: 'unauthenticated',
          isAnonymous: false,
          profileHydrated: false,
        });
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

        const justLinked = !stillAnon && wasAnon;
        const freshSignIn = !stillAnon && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION');
        if (justLinked || freshSignIn) {
          resumePendingNavigation();
          resumePendingWishlist();
        }
      }
    });

    return () => unsubscribe();
  }, []);
}
