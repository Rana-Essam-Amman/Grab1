import type { User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';

export function isAnonymousUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.is_anonymous === true;
}

export async function ensureAnonymousSession(): Promise<{ created: boolean; error: string | null }> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      return { created: false, error: null };
    }
    const { error } = await supabase.auth.signInAnonymously();
    if (error) return { created: false, error: error.message };
    return { created: true, error: null };
  } catch (err) {
    return { created: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function linkAnonymousToGoogle(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
