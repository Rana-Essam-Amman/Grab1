import { useCallback, useState } from 'react';
import { signInWithGoogle } from '../services/authService';

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
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // On success, browser redirects to Google — no state reset needed.
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, error, signIn, clearError };
}
