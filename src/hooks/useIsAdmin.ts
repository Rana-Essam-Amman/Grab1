import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error) throw error;
        setIsAdmin(data === true);
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }
    void checkAdmin();
  }, []);

  return { isAdmin, isLoading };
}
