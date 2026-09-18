import type { UserProfile, RegisteredAccount } from '@/types';

export interface AuthStoreContract {
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  user: UserProfile | null;
  sessionToken: string | null;
  registeredUsers: RegisteredAccount[];
  loginDirectly: (...args: any[]) => void;
  logout: () => void;
  beginRegistration: (...args: any[]) => void;
  confirmRegistration: (...args: any[]) => void;
  verifySession: () => Promise<boolean>;
  registerNewUser: (...args: any[]) => void;
}
