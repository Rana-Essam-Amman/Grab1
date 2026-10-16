import { useState, useCallback, useRef, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { validateEmail } from '../helpers/registerValidation';
import { submitEmailPasswordLogin } from '../helpers/authSubmitHelper';

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
    return () => { mountedRef.current = false; };
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

  const handleLoginSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      const emailError = validateEmail(email, isArabic);
      if (emailError) { setError(emailError); return; }
      if (!password) {
        setError(isArabic ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
        return;
      }

      setLoading(true);
      const res = await submitEmailPasswordLogin(email, password, isArabic, browseCountryCode);
      if (mountedRef.current) {
        if (res.success) {
          onToast?.(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
        } else {
          setError(isArabic ? res.errorAr || '' : res.errorEn || '');
        }
        setLoading(false);
      }
    },
    [email, password, isArabic, browseCountryCode, onToast]
  );

  return {
    email, handleEmailChange,
    password, handlePasswordChange,
    showPassword, handleToggleShowPassword,
    error, loading, handleLoginSubmit, isArabic,
  };
};
