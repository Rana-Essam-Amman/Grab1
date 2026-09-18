import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AuthState } from './auth.slice.types';
import { getInitialSession, getInitialRegisteredUsers } from './auth.slice.helpers';
import { createAuthActions } from './auth.slice.actions';
import type { AuthRepository } from '../data/repositories/AuthRepository';
import { LocalStorageAuthAdapter } from '../data/adapters/LocalStorageAuthAdapter';

const authRepository: AuthRepository = new LocalStorageAuthAdapter();

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => {
      const initialSession = getInitialSession();
      const initialUsers = getInitialRegisteredUsers();

      return {
        authStatus: initialSession.authStatus,
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
              const updatedUser = { ...state.user, ...updates };
              state.user = updatedUser;
              authRepository.updateProfile({
                name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
                avatarUrl: updatedUser.avatarUrl || updatedUser.avatar,
              }).catch(console.error);
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
              authRepository.updateProfile({
                avatarUrl: dataUrl || undefined,
              }).catch(console.error);
            }
          });
        },

        ...createAuthActions(set as any, get as any),
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

