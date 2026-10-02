import type { Session } from '@supabase/supabase-js';
import { extractGoogleProfile } from '../services/authService';
import { isAnonymousUser } from '../services/anonymousSession';
import { marketStorage } from '@/shared/lib/marketStorage';
import { isValidMarketCode } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';
import { useUIStore } from '@/store/ui.slice';
import type { ScreenType } from '@/store/ui.slice.types';
import type { UserProfile } from '@/types';

export function mapSessionToUser(session: Session | null): UserProfile | null {
  if (!session?.user) return null;
  // Anonymous path kept for backward-compat with any old sessions; new flow
  // never creates them (ensureAnonymousSession is a no-op).
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
  // Market is read from the UI store snapshot — the same market the user
  // was on when the pending flag was written.
  const market = useUIStore.getState().browseCountryCode;
  if (!isValidMarketCode(market)) return;
  const store = marketStorage(market as MarketCode);

  const pendingEntry = store.get<string>('pending_post_entry');
  if (pendingEntry === 'true') {
    store.remove('pending_post_entry');
    setTimeout(() => {
      useUIStore.getState().navigateTo('post-ad-entry');
    }, 200);
    return;
  }

  const pending = store.get<string>('pending_publish');
  const screen = store.get<string>('pending_publish_screen');
  if (pending === 'true' && screen) {
    store.remove('pending_publish');
    store.remove('pending_publish_screen');
    setTimeout(() => {
      useUIStore.getState().navigateTo(screen as ScreenType);
    }, 200);
  }
}
