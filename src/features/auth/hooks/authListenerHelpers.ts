import type { Session } from '@supabase/supabase-js';
import { extractGoogleProfile } from '../services/authService';
import { isAnonymousUser } from '../services/anonymousSession';
import { globalStorage } from '@/shared/lib/marketStorage';
import { useUIStore } from '@/store/ui.slice';
import type { ScreenType } from '@/store/ui.slice.types';
import type { UserProfile } from '@/types';

export function mapSessionToUser(session: Session | null): UserProfile | null {
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

export function resumePendingNavigation(): void {
  const pendingEntry = globalStorage().get<string>('catch_pending_post_entry');
  if (pendingEntry === 'true') {
    globalStorage().remove('catch_pending_post_entry');
    setTimeout(() => {
      useUIStore.getState().navigateTo('post-ad-entry');
    }, 200);
    return;
  }

  const pending = globalStorage().get<string>('catch_pending_publish');
  const screen = globalStorage().get<string>('catch_pending_publish_screen');
  if (pending === 'true' && screen) {
    globalStorage().remove('catch_pending_publish');
    globalStorage().remove('catch_pending_publish_screen');
    setTimeout(() => {
      useUIStore.getState().navigateTo(screen as ScreenType);
    }, 200);
  }
}
