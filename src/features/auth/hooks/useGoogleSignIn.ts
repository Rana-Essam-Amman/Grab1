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

  const signIn = useCallback(async (): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // OAuth succeeded. Keep the loading state while the browser
      // navigates to Google. The page will unload during the redirect.
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to connect to Google. Please try again.';

      setError(message);
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    signIn,
    clearError,
  };
}
