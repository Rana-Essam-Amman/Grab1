import { UserProfile, RegisteredAccount } from '@/types';
import { globalStorage } from '@/shared/lib/marketStorage';

export const INITIAL_MOCK_USERS: RegisteredAccount[] = [
  { email: 'demo@deals.com', phone: '791234567', countryCode: 'JO', password: 'password123', firstName: 'Demo', lastName: 'User', status: 'Active' },
  { email: 'taken@deals.com', phone: '792222222', countryCode: 'JO', password: 'password123', firstName: 'Tareq', lastName: 'Khaled', status: 'Active' },
  { email: 'registered@deals.com', phone: '3123456', countryCode: 'LB', password: 'password123', firstName: 'Rami', lastName: 'Ahmad', status: 'Active' },
];

export function getInitialSession(): {
  authStatus: 'authenticated' | 'unauthenticated';
  user: UserProfile | null;
  sessionToken: string | null;
} {
  try {
    const savedToken = globalStorage().get<string>('catch_token');
    const savedUser = globalStorage().get<UserProfile | string>('catch_user');

    if (savedUser && savedToken) {
      interface StoredUser { id?: string; email?: string; countryCode?: string; isRevoked?: boolean; [k: string]: unknown }
      const parsed = (typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser) as unknown as StoredUser;
      if (
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.email === 'string' &&
        parsed.email.trim().length > 0 &&
        !parsed.isRevoked
      ) {
        return {
          authStatus: 'authenticated',
          user: parsed as unknown as UserProfile,
          sessionToken: savedToken,
        };
      }
    }
  } catch {
    // Fallback on parse failure
  }
  return {
    authStatus: 'unauthenticated',
    user: null,
    sessionToken: null,
  };
}

export function getInitialRegisteredUsers(): RegisteredAccount[] {
  try {
    const saved = globalStorage().get<RegisteredAccount[] | string>('catch_registered_users');
    if (saved) {
      const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback on parse failure
  }
  return INITIAL_MOCK_USERS;
}
