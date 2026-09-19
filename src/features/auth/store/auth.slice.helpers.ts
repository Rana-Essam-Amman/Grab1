import { UserProfile, RegisteredAccount } from '@/types';
import { globalStorage } from '@/shared/lib/marketStorage';
import {
  StoredUserSchema,
  UserProfileSchema,
  RegisteredAccountsArraySchema,
} from '../schemas/auth.schema';

export const INITIAL_MOCK_USERS: RegisteredAccount[] = [
  { email: 'demo@deals.com', phone: '791234567', countryCode: 'JO', password: 'password123', firstName: 'Demo', lastName: 'User', status: 'active' },
  { email: 'taken@deals.com', phone: '792222222', countryCode: 'JO', password: 'password123', firstName: 'Tareq', lastName: 'Khaled', status: 'active' },
  { email: 'registered@deals.com', phone: '3123456', countryCode: 'LB', password: 'password123', firstName: 'Rami', lastName: 'Ahmad', status: 'active' },
];

export function getInitialSession(): {
  authStatus: 'authenticated' | 'unauthenticated';
  user: UserProfile | null;
  sessionToken: string | null;
} {
  try {
    const savedToken = globalStorage().get<string>('catch_token');
    const savedUser = globalStorage().get<unknown>('catch_user');

    if (!savedUser || !savedToken) {
      return { authStatus: 'unauthenticated', user: null, sessionToken: null };
    }

    const rawObj = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
    const storedResult = StoredUserSchema.safeParse(rawObj);

    if (!storedResult.success || storedResult.data.isRevoked) {
      return { authStatus: 'unauthenticated', user: null, sessionToken: null };
    }

    const profileResult = UserProfileSchema.safeParse(rawObj);
    if (!profileResult.success) {
      return { authStatus: 'unauthenticated', user: null, sessionToken: null };
    }

    return {
      authStatus: 'authenticated',
      user: profileResult.data as UserProfile,
      sessionToken: savedToken,
    };
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
    const saved = globalStorage().get<unknown>('catch_registered_users');
    if (!saved) return INITIAL_MOCK_USERS;

    const rawObj = typeof saved === 'string' ? JSON.parse(saved) : saved;
    const result = RegisteredAccountsArraySchema.safeParse(rawObj);
    if (result.success && result.data.length > 0) {
      return result.data as RegisteredAccount[];
    }
  } catch {
    // Fallback on parse failure
  }
  return INITIAL_MOCK_USERS;
}
