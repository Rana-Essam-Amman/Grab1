import { useCallback, useState } from 'react';
import { signInWithFacebook } from '../services/authService';

export interface UseFacebookSignInReturn {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly signIn: () => Promise<void>;
  readonly clearError: () => void;
}

export function useFacebookSignIn(): UseFacebookSignInReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await signInWithFacebook();
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // On success, browser redirects to Facebook — no state reset needed.
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, error, signIn, clearError };
}
