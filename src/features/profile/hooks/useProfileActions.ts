import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { globalStorage } from '@/shared/lib/marketStorage';
import {
  ALL_MARKETS,
  USER_GLOBAL_KEYS,
  USER_LEGACY_KEYS,
  getAllUserKeysForMarket,
  isBumpKey,
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

    // Remove bump counters (dynamic keys not enumerable via the registry).
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && isBumpKey(k)) toRemove.push(k);
      }
      for (const k of toRemove) {
        try { localStorage.removeItem(k); } catch {}
      }
    } catch {}

    for (const key of USER_LEGACY_KEYS) {
      try { localStorage.removeItem(key); } catch {}
    }

    logout();
    setActiveTab('explore');
    navigateTo('main');
  }, [logout, setActiveTab, navigateTo, user?.phone]);

  return { handleLogout, handleDeleteAccount };
}
