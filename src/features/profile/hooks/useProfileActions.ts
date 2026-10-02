import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { globalStorage } from '@/shared/lib/marketStorage';
import {
  ALL_MARKETS,
  USER_GLOBAL_KEYS,
  USER_LEGACY_KEYS,
  getAllUserKeysForMarket,
} from '@/shared/lib/userDataRegistry';

export function useProfileActions() {
  const { logout, user } = useAuth();
  const { navigateTo, setActiveTab } = useUI();

  const handleLogout = useCallback(() => {
    logout();
    setActiveTab('explore');
    navigateTo('main');
  }, [logout, setActiveTab, navigateTo]);

  const handleDeleteAccount = useCallback(() => {
    try {
      const phoneHash = user?.phone
        ? btoa(user.phone).replace(/=/g, '').slice(0, 16)
        : 'unknown';
      const fingerprint = {
        phoneHash,
        deletedAt: new Date().toISOString(),
      };
      globalStorage().set(`catch_deletion_fingerprint_${phoneHash}`, fingerprint);
    } catch {}

    for (const key of USER_GLOBAL_KEYS) {
      try { localStorage.removeItem(key); } catch {}
    }

    for (const market of ALL_MARKETS) {
      const keys = getAllUserKeysForMarket(market);
      for (const key of keys) {
        try { localStorage.removeItem(key); } catch {}
      }
    }

    for (const key of USER_LEGACY_KEYS) {
      try { localStorage.removeItem(key); } catch {}
    }

    logout();
    setActiveTab('explore');
    navigateTo('main');
  }, [logout, setActiveTab, navigateTo, user?.phone]);

  return { handleLogout, handleDeleteAccount };
}
