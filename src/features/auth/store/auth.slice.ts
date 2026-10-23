import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AuthState } from './auth.slice.types';
import { getInitialSession } from './auth.slice.helpers';
import { createAuthActions } from './auth.slice.actions';
import { fetchOwnProfile } from '@/shared/lib/profilesFetchService';

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => {
      const initialSession = getInitialSession();

      return {
        authStatus: initialSession.authStatus,
        isAnonymous: false,
        profileHydrated: false,
        user: initialSession.user,
        sessionToken: initialSession.sessionToken,
        feedLayout: 'list',

        updateUser: (updates) => {
          set((state) => {
            if (state.user) {
              state.user = { ...state.user, ...updates };
            }
          });
        },

        setUser: (user) => {
          set((state) => {
            state.user = user;
          });
        },

        updateAvatar: (dataUrl) => {
          set((state) => {
            if (state.user) {
              if (dataUrl === null) {
                delete state.user.avatar;
                delete state.user.avatarUrl;
              } else {
                state.user.avatar = dataUrl;
                state.user.avatarUrl = dataUrl;
              }
            }
          });
        },

        ...createAuthActions(
          set as unknown as (fn: (state: AuthState) => void) => void,
          get as unknown as () => AuthState
        ),
      };
    }),
    {
      name: 'catch_auth',
      partialize: (state) => ({
        user: state.user,
        sessionToken: state.sessionToken,
        feedLayout: state.feedLayout,
        authStatus: state.authStatus,
      }),
    }
  )
);

export async function hydrateProfile(): Promise<void> {
  try {
    const current = useAuthStore.getState().user;
    if (!current?.id) return;

    const result = await fetchOwnProfile(current.id);
    if (!result.ok) return;

    const latest = useAuthStore.getState().user;
    if (!latest || latest.id !== current.id) return;

    const profile = result.profile;
    const patch: {
      phone?: string;
      nickname?: string;
      browseMarket?: 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | null;
      countryCode?: string | undefined;
    } = {};

    if (!result.phoneError && profile.phone) patch.phone = profile.phone;
    if (profile.nickname) patch.nickname = profile.nickname;
    if (profile.browse_market) patch.browseMarket = profile.browse_market;

    // F5 fix: always reflect the DB value for country_code.
    // - If DB has a value → set it (overrides any stale persisted value).
    // - If DB is null/empty → set `undefined` explicitly, which clears the
    //   stale value in the Zustand store (spread with an explicit key
    //   overrides even when the value is undefined). persist's partialize
    //   will drop the key on the next serialization.
    patch.countryCode =
      profile.country_code && profile.country_code.length > 0
        ? profile.country_code
        : undefined;

    useAuthStore.getState().updateUser(patch);

    if (profile.feed_layout === 'list' || profile.feed_layout === 'grid') {
      useAuthStore.setState({ feedLayout: profile.feed_layout });
    }
  } catch {
    // network failure must not block sign-in
  } finally {
    useAuthStore.setState({ profileHydrated: true });
  }
}
