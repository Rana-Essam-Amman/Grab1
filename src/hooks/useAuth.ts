import { useAuthStore } from '@/features/auth/store/auth.slice';
import { UserProfile, RegisteredAccount } from '../types';

export interface AuthContextType {
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  isAnonymous: boolean;
  user: UserProfile | null;
  registered: boolean;
  sessionToken: string | null;
  registrationPendingUser: Partial<UserProfile> | null;
  registeredUsers: RegisteredAccount[];
  beginRegistration: (userData: Partial<UserProfile>) => void;
  confirmRegistration: (fallbackCountryCode?: string) => void;
  logout: () => void;
  loginDirectly: (email: string, phone?: string, countryCode?: string, firstName?: string) => void;
  verifySession: () => Promise<boolean>;
  registerNewUser: (userData: RegisteredAccount) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateAvatar: (dataUrl: string | null) => void;
  feedLayout: 'list' | 'grid';
  setFeedLayout: (layout: 'list' | 'grid') => void;
}

export const useAuth = (): AuthContextType => {
  const store = useAuthStore();
  const registered = Boolean(store.user && store.sessionToken && !store.isAnonymous);

  return {
    authStatus: store.authStatus,
    isAnonymous: store.isAnonymous,
    user: store.user,
    registered,
    sessionToken: store.sessionToken,
    registrationPendingUser: store.registrationPendingUser,
    registeredUsers: store.registeredUsers,
    beginRegistration: store.beginRegistration,
    confirmRegistration: store.confirmRegistration,
    logout: store.logout,
    loginDirectly: store.loginDirectly,
    verifySession: store.verifySession,
    registerNewUser: store.registerNewUser,
    updateUser: store.updateUser,
    updateAvatar: store.updateAvatar,
    feedLayout: store.feedLayout,
    setFeedLayout: store.setFeedLayout,
  };
};

export const useUser = () => {
  const user = useAuthStore((s) => s.user);
  const authStatus = useAuthStore((s) => s.authStatus);

  return { user, authStatus };
};

