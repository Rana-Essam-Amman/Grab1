import { supabase } from '@/shared/lib/supabase';

export interface ErrorPayload {
  readonly message: string;
  readonly stack?: string;
  readonly componentStack?: string;
  readonly url?: string;
  readonly metadata?: Record<string, unknown>;
}

const BUILD_VERSION = (import.meta.env.VITE_APP_VERSION as string | undefined) || '1.0.0';

export async function logError(payload: ErrorPayload): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from('error_logs').insert({
      user_id: userData.user?.id || null,
      message: payload.message.slice(0, 2000),
      stack: (payload.stack || '').slice(0, 5000),
      component_stack: (payload.componentStack || '').slice(0, 5000),
      url: payload.url || (typeof window !== 'undefined' ? window.location.href : ''),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      build_version: BUILD_VERSION,
      metadata: payload.metadata || {},
    });
  } catch {
    // Silent fail: logging must never crash the app.
  }
}
