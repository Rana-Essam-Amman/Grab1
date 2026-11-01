
import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAdmin() {
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error) throw error;

        if (isMounted) {
          setIsAdmin(data === true);
        }
      } catch {
        if (isMounted) {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isAdmin, isLoading };
}
