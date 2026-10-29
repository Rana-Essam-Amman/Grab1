import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

const ADMIN_EMAIL = 'sufyanyounis83@gmail.com';

export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email?.toLowerCase();
      setIsAdmin(email === ADMIN_EMAIL);
      setIsLoading(false);
    });
  }, []);

  return { isAdmin, isLoading };
}
