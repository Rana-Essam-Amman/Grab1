import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';

export interface GoogleProfile {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatarUrl: string;
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  try {
    const redirectTo = `${window.location.origin}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function signInWithFacebook(): Promise<{ error: string | null }> {
  try {
    const redirectTo = `${window.location.origin}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo,
      },
    });
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session;
  } catch {
    return null;
  }
}

export type SupabaseAuthEvent =
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

export function onAuthStateChange(
  callback: (event: SupabaseAuthEvent, session: Session | null) => void
): { unsubscribe: () => void } {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event as SupabaseAuthEvent, session);
  });
  return { unsubscribe: () => data.subscription.unsubscribe() };
}

export function extractGoogleProfile(user: User): GoogleProfile | null {
  if (!user) return null;
  const meta = user.user_metadata || {};
  const fullName: string = meta.full_name || meta.name || '';
  const nameParts = fullName.trim().split(/\s+/);
  return {
    id: user.id,
    email: user.email || '',
    firstName: meta.first_name || nameParts[0] || '',
    lastName: meta.last_name || nameParts.slice(1).join(' ') || '',
    avatarUrl: meta.avatar_url || meta.picture || '',
  };
}

export interface PasswordSignInResult {
  readonly success: boolean;
  readonly userId?: string;
  readonly email?: string;
  readonly errorMessageAr?: string;
  readonly errorMessageEn?: string;
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<PasswordSignInResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (!error && data.user) {
      return {
        success: true,
        userId: data.user.id,
        email: data.user.email || undefined,
      };
    }

    const code = (error as { code?: string } | null)?.code || 'unknown';
    const messages: Record<string, { ar: string; en: string }> = {
      invalid_credentials: {
        ar: 'البريد أو كلمة المرور غير صحيحة',
        en: 'Invalid email or password',
      },
      email_not_confirmed: {
        ar: 'يرجى تأكيد بريدك الإلكتروني أولاً',
        en: 'Please confirm your email first',
      },
      over_request_rate_limit: {
        ar: 'عدد المحاولات كبير. حاول لاحقاً',
        en: 'Too many attempts. Try again later',
      },
    };
    const m = messages[code] || {
      ar: 'حدث خطأ. حاول مرة أخرى',
      en: 'Something went wrong. Please try again',
    };
    return {
      success: false,
      errorMessageAr: m.ar,
      errorMessageEn: m.en,
    };
  } catch {
    return {
      success: false,
      errorMessageAr: 'حدث خطأ. حاول مرة أخرى',
      errorMessageEn: 'Something went wrong. Please try again',
    };
  }
}
