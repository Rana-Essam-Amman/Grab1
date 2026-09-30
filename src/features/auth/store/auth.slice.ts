import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AuthState } from './auth.slice.types';
import { getInitialSession, getInitialRegisteredUsers } from './auth.slice.helpers';
import { createAuthActions } from './auth.slice.actions';

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => {
      const initialSession = getInitialSession();
      const initialUsers = getInitialRegisteredUsers();

      return {
        authStatus: initialSession.authStatus,
        isAnonymous: false,
        user: initialSession.user,
        sessionToken: initialSession.sessionToken,
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
        authStatus: state.authStatus,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);

