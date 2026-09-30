import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useAuthStore } from '../store/auth.slice';
import { onAuthStateChange, extractGoogleProfile } from '../services/authService';
import { ensureAnonymousSession, isAnonymousUser } from '../services/anonymousSession';
import type { UserProfile } from '@/types';

function mapSessionToUser(session: Session | null): UserProfile | null {
  if (!session?.user) return null;

  if (isAnonymousUser(session.user)) {
    return {
      firstName: 'زائر',
      lastName: '',
      email: '',
      phone: '',
      countryCode: 'JO',
    };
  }

  const profile = extractGoogleProfile(session.user);
  if (!profile) return null;
  const countryCode = (session.user.user_metadata?.country_code as string) || 'JO';
  return {
    firstName: profile.firstName || 'User',
    lastName: profile.lastName || '',
    email: profile.email,
    phone: '',
    countryCode,
    avatar: profile.avatarUrl || undefined,
    avatarUrl: profile.avatarUrl || undefined,
  };
}

export function useSupabaseAuthListener(): void {
  useEffect(() => {
    void ensureAnonymousSession();

    const { unsubscribe } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        useAuthStore.setState({
          user: null,
          sessionToken: null,
          authStatus: 'unauthenticated',
          isAnonymous: false,
        });
        return;
      }

      if (event === 'TOKEN_REFRESHED' && session) {
        useAuthStore.setState({
          sessionToken: session.access_token,
          isAnonymous: isAnonymousUser(session.user),
        });
        return;
      }

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        const user = mapSessionToUser(session);
        if (user) {
          useAuthStore.setState({
            user,
            sessionToken: session.access_token,
            authStatus: 'authenticated',
            isAnonymous: isAnonymousUser(session.user),
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);
}
