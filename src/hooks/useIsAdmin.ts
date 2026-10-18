import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

const ADMIN_EMAIL = 'sufyanyounis83@gmail.com';

export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email?.toLowerCase();
      setIsAdmin(email === ADMIN_EMAIL);
    });
  }, []);
  return isAdmin;
}
