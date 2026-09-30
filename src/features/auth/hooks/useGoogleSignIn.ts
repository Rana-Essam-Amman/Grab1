import { useCallback, useState } from 'react';
import { signInWithGoogle } from '../services/authService';
import { linkAnonymousToGoogle } from '../services/anonymousSession';
import { useAuthStore } from '../store/auth.slice';

export interface UseGoogleSignInReturn {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly signIn: () => Promise<void>;
  readonly clearError: () => void;
}

export function useGoogleSignIn(): UseGoogleSignInReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // If already in an anonymous session, LINK (preserves listings).
    // Otherwise start a fresh Google sign-in.
    const isAnon = useAuthStore.getState().isAnonymous;
    const result = isAnon ? await linkAnonymousToGoogle() : await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // On success, browser redirects to Google — no state reset needed.
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, error, signIn, clearError };
}
