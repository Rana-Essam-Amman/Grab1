import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AuthState } from './auth.slice.types';
import { getInitialSession, getInitialRegisteredUsers } from './auth.slice.helpers';
import { createAuthActions } from './auth.slice.actions';
import { fetchProfile } from '@/shared/lib/profilesService';

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => {
      const initialSession = getInitialSession();
      const initialUsers = getInitialRegisteredUsers();

      return {
        authStatus: initialSession.authStatus,
        isAnonymous: false,
        profileHydrated: false,
        user: initialSession.user,
        sessionToken: initialSession.sessionToken,
        feedLayout: 'list',
        registrationPendingUser: null,
        registeredUsers: initialUsers,

        beginRegistration: (userData) => {
          set((state) => {
            state.registrationPendingUser = userData;
          });
        },

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
          // Necessary: bypass zustand's internal typing
          set as unknown as (fn: (state: AuthState) => void) => void,
          // Necessary: bypass zustand's internal typing
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
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);


/**
 * Fetch the user's Supabase profile after sign-in and hydrate local 
 * state with fields that are not present in the OAuth session 
 * (phone, nickname).
 *
 * Runs once per auth event. Idempotent.
 * Uses `finally` so profileHydrated flips true even on failure.
 */
export async function hydrateProfile(): Promise<void> {
  try {
    const current = useAuthStore.getState().user;
    if (!current?.id) return;
    const profile = await fetchProfile(current.id);
    if (!profile) return;
    const latest = useAuthStore.getState().user;
    if (!latest || latest.id !== current.id) return;

    const patch: { phone?: string; nickname?: string } = {};
    if (profile.phone) patch.phone = profile.phone;
    if (profile.nickname) patch.nickname = profile.nickname;

    if (Object.keys(patch).length > 0) {
      useAuthStore.getState().updateUser(patch);
    }

    // Feed layout preference (Supabase = source of truth)
    if (profile.feed_layout === 'list' || profile.feed_layout === 'grid') {
      useAuthStore.setState({ feedLayout: profile.feed_layout });
    }
  } catch {
    // network failure must not block sign-in
  } finally {
    useAuthStore.setState({ profileHydrated: true });
  }
}
