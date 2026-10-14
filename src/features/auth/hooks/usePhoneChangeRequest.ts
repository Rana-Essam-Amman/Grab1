import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { useAuthStore } from '../store/auth.slice';
import { requestPhoneChange } from '@/shared/lib/profilesService';

export interface PendingPhoneChange {
  readonly id: string;
  readonly requested_phone: string;
  readonly reason: string;
  readonly status: 'pending';
  readonly created_at: string;
}

export function usePhoneChangeRequest() {
  const userId = useAuthStore((s) => s.user?.id);
  const [pending, setPending] = useState<PendingPhoneChange | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setPending(null);
      return;
    }
    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from('phone_change_requests')
        .select('id, requested_phone, reason, status, created_at')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .maybeSingle();
      if (queryError) throw queryError;
      setPending(data as PendingPhoneChange | null);
      setError(null);
    } catch (err) {
      console.warn('[usePhoneChangeRequest] refresh failed', err);
      setError('Could not load phone-change request');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submit = useCallback(async (
    phone: string,
    reason: string
  ): Promise<boolean> => {
    if (!userId || pending) {
      setError('A pending request already exists or sign-in is required');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const id = await requestPhoneChange(phone, reason);
      if (!id) {
        setError('Could not submit phone-change request');
        return false;
      }
      await refresh();
      return true;
    } finally {
      setLoading(false);
    }
  }, [userId, pending, refresh]);

  return { pending, loading, error, submit, refresh };
}
