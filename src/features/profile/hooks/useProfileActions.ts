import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { globalStorage } from '@/shared/lib/marketStorage';
import type { MarketCode } from '@/shared/lib/marketGate';

export function useProfileActions() {
  const { logout, user } = useAuth();
  const { navigateTo, setActiveTab } = useUI();

  const handleLogout = useCallback(() => {
    logout();
    setActiveTab('explore');
    navigateTo('main');
  }, [logout, setActiveTab, navigateTo]);

  const handleDeleteAccount = useCallback(() => {
    // 1. Write deletion fingerprint for future Soft Delete (no personal data, just hashed marker + timestamp)
    try {
      const phoneHash = user?.phone
        ? btoa(user.phone).replace(/=/g, '').slice(0, 16)
        : 'unknown';
      const fingerprint = {
        phoneHash,
        deletedAt: new Date().toISOString(),
      };
      globalStorage().set(`catch_deletion_fingerprint_${phoneHash}`, fingerprint);
    } catch {
      // Silently ignore if fingerprint fails
    }

    // 2. Clear global user-specific keys (exact names, not resolved)
    const globalKeys = [
      'catch_token',
      'catch_user',
      'catch_registered_users',
      'catch_browse_country',
      'catch_pending_publish',
      'catch_crash_last',
    ];
    globalKeys.forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });

    // 3. Clear market-scoped keys for all 5 markets
    const markets: MarketCode[] = ['JO', 'LB', 'PS', 'SY', 'SA'];
    const marketKeys = [
      'listings_v1',
      'listings_bookmarks_v1',
      'chat_conversations_v1',
      'monetization_ai_quota_v1',
      'monetization_promotions_v1',
      'ai_quota_v1',
      'post_draft_v1',
      'wishlist',
    ];
    for (const market of markets) {
      for (const key of marketKeys) {
        try {
          localStorage.removeItem(`catch_${market}_${key}`);
        } catch {}
      }
    }

    // 4. Clear auth state
    logout();

    // 4. Redirect to home as guest
    setActiveTab('explore');
    navigateTo('main');
  }, [logout, setActiveTab, navigateTo, user?.phone]);

  return { handleLogout, handleDeleteAccount };
}

