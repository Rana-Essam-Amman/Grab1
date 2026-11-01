import { supabase } from '@/shared/lib/supabase';

const INTENTIONAL_LOGOUT_KEY = '__intentional_logout';
const GRACE_PERIOD_MS = 1500;

export interface SignedOutHandler {
  /** Called on every SIGNED_OUT event. Decides whether to clear state. */
  handleSignOut: () => void;
  /** Cancels a pending grace period (e.g., a real SIGNED_IN arrived). */
  cancel: () => void;
}

export interface SignedOutHandlerOptions {
  /** Invoked when the sign-out is confirmed and state must be cleared. */
  onConfirmedSignOut: () => void;
}

/**
 * Handles Supabase SIGNED_OUT events safely.
 *
 * - Intentional logout (user pressed "logout"): clear immediately.
 * - Transient SIGNED_OUT (token refresh race): wait 1.5s, verify with
 *   getSession(), only clear if the session is truly gone.
 *
 * Transient SIGNED_OUT fires during deploys/refreshes when token rotation
 * races with the auth listener. Clearing immediately causes phantom logouts.
 */
export function createSignedOutHandler({ onConfirmedSignOut }: SignedOutHandlerOptions): SignedOutHandler {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cancel = (): void => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const handleSignOut = (): void => {
    // 1. Intentional logout path — clear immediately, no delay
    let intentional = false;
    try {
      intentional = sessionStorage.getItem(INTENTIONAL_LOGOUT_KEY) === '1';
      if (intentional) sessionStorage.removeItem(INTENTIONAL_LOGOUT_KEY);
    } catch {
      // sessionStorage unavailable — treat as unintentional
    }

    if (intentional) {
      cancel();
      onConfirmedSignOut();
      return;
    }

    // 2. Transient path — wait, verify with getSession(), then clear
    cancel();
    timer = setTimeout(() => {
      timer = null;
      void supabase.auth
        .getSession()
        .then(({ data }) => {
          if (data.session) return; // session recovered — ignore transient SIGNED_OUT
          onConfirmedSignOut();
        })
        .catch(() => {
          onConfirmedSignOut();
        });
    }, GRACE_PERIOD_MS);
  };

  return { handleSignOut, cancel };
}
