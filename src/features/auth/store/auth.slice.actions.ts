import { AuthState } from './auth.slice.types';
import { UserProfile } from '@/types';
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
    });
  },

  loginDirectly: (email: string, phone?: string, countryCode?: string, firstName?: string) => {
    const savedBrowseCountry = globalStorage().get<string>('catch_browse_country') || 'JO';
    const finalCountry = countryCode || savedBrowseCountry;
    const newUser: UserProfile = {
      firstName: firstName || 'Test',
      lastName: 'User',
      email: email || 'test@example.com',
      phone: phone || '+962799999999',
      countryCode: finalCountry,
    };
    const token = 'token-' + Date.now();

    globalStorage().set('catch_user', newUser);
    globalStorage().set('catch_token', token);

    set((state) => {
      state.user = newUser;
      state.sessionToken = token;
      state.authStatus = 'authenticated';
      state.isAnonymous = true; // ✅ السطر الجديد: إجبار النظام على معرفة أنه زائر
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
