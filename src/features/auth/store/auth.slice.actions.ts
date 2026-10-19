import { AuthState } from './auth.slice.types';
import { globalStorage } from '@/shared/lib/marketStorage';
import { signOut } from '../services/authService';
import { saveFeedLayout } from '@/shared/lib/profilesService';

type SetState = (fn: (state: AuthState) => void) => void;
type GetState = () => AuthState;

export const createAuthActions = (set: SetState, get: GetState) => ({
  logout: () => {
    void signOut().catch(() => {
      // Ignore network errors — local logout still proceeds
    });

    globalStorage().remove('catch_user');
    globalStorage().remove('catch_token');
    set((state) => {
      state.user = null;
      state.sessionToken = null;
      state.authStatus = 'unauthenticated';
      state.isAnonymous = false; // Reset anonymous state
    });
  },

  verifySession: async () => {
    return Boolean(get().sessionToken);
  },

  setFeedLayout: (layout: 'list' | 'grid') => {
    set((state) => {
      state.feedLayout = layout;
    });
    const userId = get().user?.id;
    if (userId) {
      void saveFeedLayout(userId, layout).catch(() => {
        // non-fatal — local state already updated
      });
    }
  },
});
