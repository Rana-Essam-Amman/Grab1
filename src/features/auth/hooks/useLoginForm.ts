import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUI } from '@/hooks/useUI';
import { signInWithEmailPassword } from '../services/authService';
import { validateEmail } from '../helpers/registerValidation';
import { publishDraftAfterAuth } from '../helpers/publishDraftAfterAuth';

export interface UseLoginFormOptions {
  onToast?: (msg: string) => void;
}

export interface UseLoginFormReturn {
  email: string;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  handleToggleShowPassword: () => void;
  error: string;
  loading: boolean;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  isArabic: boolean;
}

export const useLoginForm = (
  { onToast }: UseLoginFormOptions = {}
): UseLoginFormReturn => {
  const { browseCountryCode, isArabic } = useUI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setError('');
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setError('');
    },
    []
  );

  const handleToggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const waitForSession = useCallback(
    (userId: string): Promise<boolean> =>
      new Promise((resolve) => {
        let settled = false;
        let unsubscribe = () => {};
        const finish = (matched: boolean) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          unsubscribe();
          resolve(matched);
        };
        const timeout = setTimeout(() => finish(false), 3000);
        const hasSession = () => {
          const state = useAuthStore.getState();
          return Boolean(state.sessionToken && state.user?.id === userId);
        };

        unsubscribe = useAuthStore.subscribe(() => {
          if (hasSession()) finish(true);
        });
        if (hasSession()) finish(true);
      }),
    []
  );

  const handleLoginSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      const emailError = validateEmail(email, isArabic);
      if (emailError) {
        setError(emailError);
        return;
      }

      if (!password) {
        setError(isArabic ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
        return;
      }

      setLoading(true);
      try {
        const result = await signInWithEmailPassword(email, password);
        if (!result.success || !result.userId) {
          if (mountedRef.current) {
            setError(
              isArabic
                ? result.errorMessageAr || 'حدث خطأ. حاول مرة أخرى'
                : result.errorMessageEn || 'Something went wrong. Please try again'
            );
          }
          return;
        }

        const state = useAuthStore.getState();
        const alreadySignedIn = Boolean(
          state.sessionToken && state.user?.id === result.userId
        );
        const sessionReady = alreadySignedIn || await waitForSession(result.userId);

        if (!sessionReady) {
          if (mountedRef.current) {
            setError(
              isArabic
                ? 'تعذر إكمال تسجيل الدخول. حاول مرة أخرى'
                : 'Could not complete sign in. Please try again'
            );
          }
          return;
        }

        const user = useAuthStore.getState().user;
        if (user?.phone) {
          publishDraftAfterAuth(
            user.phone,
            user.firstName || 'Seller',
            user.countryCode || browseCountryCode || 'JO'
          );
        }

        if (mountedRef.current) {
          onToast?.(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
        }
      } catch {
        if (mountedRef.current) {
          setError(
            isArabic
              ? 'حدث خطأ. حاول مرة أخرى'
              : 'Something went wrong. Please try again'
          );
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [email, password, isArabic, browseCountryCode, onToast, waitForSession]
  );

  return {
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    showPassword,
    handleToggleShowPassword,
    error,
    loading,
    handleLoginSubmit,
    isArabic,
  };
};
