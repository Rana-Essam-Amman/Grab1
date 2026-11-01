import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkAdmin() {
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error) throw error;
        if (mounted) setIsAdmin(data === true);
      } catch {
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    void checkAdmin();
    return () => {
      mounted = false;
    };
  }, []);

  return { isAdmin, isLoading };
}
