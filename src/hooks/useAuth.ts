import { useAuthStore } from '@/features/auth/store/auth.slice';
import { UserProfile } from '../types';

export interface AuthContextType {
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  isAnonymous: boolean;
  user: UserProfile | null;
  registered: boolean;
  sessionToken: string | null;
  logout: () => void;
  loginDirectly: (email: string, phone?: string, countryCode?: string, firstName?: string) => void;
  verifySession: () => Promise<boolean>;
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
    logout: store.logout,
    loginDirectly: store.loginDirectly,
    verifySession: store.verifySession,
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
