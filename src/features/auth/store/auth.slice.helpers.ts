import { UserProfile } from '@/types';
import { globalStorage } from '@/shared/lib/marketStorage';
import {
  StoredUserSchema,
  UserProfileSchema,
} from '../schemas/auth.schema';

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
