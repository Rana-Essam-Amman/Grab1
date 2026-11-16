
import { useCallback, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { supabase } from '@/shared/lib/supabase';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteInFlightRef = useRef(false);

  const handleLogout = useCallback(() => {
    logout();
    setActiveTab('explore');
    navigateTo('main');
  }, [logout, setActiveTab, navigateTo]);

  const clearLocalUserData = useCallback(() => {
    for (const key of USER_GLOBAL_KEYS) {
      try { localStorage.removeItem(key); } catch {}
    }

    for (const market of ALL_MARKETS) {
      const keys = getAllUserKeysForMarket(market);
      for (const key of keys) {
        try { localStorage.removeItem(key); } catch {}
      }
    }

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
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    if (deleteInFlightRef.current || !user) return;

    deleteInFlightRef.current = true;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
      });

      if (error || !data?.success) {
        const msg = error?.message || data?.error || 'Deletion failed';
        setDeleteError(msg);
        return;
      }

      clearLocalUserData();
      logout();
      setActiveTab('explore');
      navigateTo('main');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Network error');
    } finally {
      deleteInFlightRef.current = false;
      setIsDeleting(false);
    }
  }, [user, clearLocalUserData, logout, setActiveTab, navigateTo]);

  const clearDeleteError = useCallback(() => setDeleteError(null), []);

  return {
    handleLogout,
    handleDeleteAccount,
    isDeleting,
    deleteError,
    clearDeleteError,
  };
}
