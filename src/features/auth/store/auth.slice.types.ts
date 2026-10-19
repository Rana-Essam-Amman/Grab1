import { UserProfile } from '@/types';

export interface AuthState {
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  isAnonymous: boolean;
  profileHydrated: boolean;
  user: UserProfile | null;
  sessionToken: string | null;
  feedLayout: 'list' | 'grid';

  // Actions
  logout: () => void;
  verifySession: () => Promise<boolean>;
  updateUser: (updates: Partial<UserProfile>) => void;
  setUser: (user: UserProfile) => void;
  updateAvatar: (dataUrl: string | null) => void;
  setFeedLayout: (layout: 'list' | 'grid') => void;
}
