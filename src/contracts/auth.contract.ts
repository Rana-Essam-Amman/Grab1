import type { UserProfile, RegisteredAccount } from '@/types';

export interface AuthStoreContract {
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  user: UserProfile | null;
  sessionToken: string | null;
  registeredUsers: RegisteredAccount[];
  loginDirectly: (email: string, phone?: string, countryCode?: string, firstName?: string) => void;
  logout: () => void;
  beginRegistration: (userData: Partial<UserProfile>) => void;
  confirmRegistration: (fallbackCountryCode?: string) => void;
  verifySession: () => Promise<boolean>;
  registerNewUser: (userData: RegisteredAccount) => void;
}
