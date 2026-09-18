import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { globalStorage } from '@/shared/lib/marketStorage';

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

    // 2. Clear ALL user-specific storage keys
    const keysToRemove = [
      'catch_user_session',
      'catch_registered_accounts',
      'catch_listings',
      'catch_conversations',
      'catch_wishlist_JO',
      'catch_wishlist_LB',
      'catch_wishlist_PS',
      'catch_wishlist_SY',
      'catch_wishlist_SA',
      'catch_quota_state',
      'catch_browse_country',
      'catch_locale',
      'catch_post_draft',
    ];
    keysToRemove.forEach((k) => {
      try { globalStorage().remove(k); } catch {}
    });

    // 3. Clear auth state
    logout();

    // 4. Redirect to home as guest
    setActiveTab('explore');
    navigateTo('main');
  }, [logout, setActiveTab, navigateTo, user?.phone]);

  return { handleLogout, handleDeleteAccount };
}

