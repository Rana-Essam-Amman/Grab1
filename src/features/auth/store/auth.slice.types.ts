import { UserProfile, RegisteredAccount } from '@/types';

export interface AuthState {
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  isAnonymous: boolean;
  user: UserProfile | null;
  sessionToken: string | null;
  registrationPendingUser: Partial<UserProfile> | null;
  registeredUsers: RegisteredAccount[];

  // Actions
  beginRegistration: (userData: Partial<UserProfile>) => void;
  confirmRegistration: (fallbackCountryCode?: string) => void;
  logout: () => void;
  loginDirectly: (email: string, phone?: string, countryCode?: string, firstName?: string) => void;
  verifySession: () => Promise<boolean>;
  registerNewUser: (userData: RegisteredAccount) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateAvatar: (dataUrl: string | null) => void;
}
