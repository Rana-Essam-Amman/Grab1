import { useState, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUI } from '@/hooks/useUI';
import { cleanAndVerifyPhone } from '../helpers/phoneValidation';
import { publishDraftAfterAuth } from '../helpers/publishDraftAfterAuth';

export interface UseLoginFormOptions {
  onToast?: (msg: string) => void;
}

export interface UseLoginFormReturn {
  selectedCountry: string;
  setSelectedCountry: (country: any) => void;
  phone: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  handleToggleShowPassword: () => void;
  error: string;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  isArabic: boolean;
}

export const useLoginForm = ({ onToast }: UseLoginFormOptions = {}): UseLoginFormReturn => {
  const { browseCountryCode, isArabic } = useUI();
  const [selectedCountry, setSelectedCountry] = useState(browseCountryCode || 'JO');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setError('');
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  }, []);

  const handleToggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const phoneVerify = cleanAndVerifyPhone(phone, selectedCountry);
    if (!phoneVerify.isValid) {
      setError(isArabic ? phoneVerify.errorMsgAr : phoneVerify.errorMsgEn);
      return;
    }

    if (!password) {
      setError(isArabic ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    try {
      const { registeredUsers, loginDirectly } = useAuthStore.getState();
      const userMatch = registeredUsers.find(
        (u) => u.phone === phoneVerify.cleaned && u.countryCode === selectedCountry && u.password === password
      );

      if (!userMatch) {
        setError(isArabic ? 'رقم الهاتف أو كلمة المرور غير صحيحة' : 'Invalid phone number or password');
        return;
      }

      loginDirectly(userMatch.email, userMatch.phone, userMatch.countryCode, userMatch.firstName);
      publishDraftAfterAuth(userMatch.phone, userMatch.firstName, userMatch.countryCode);
      if (onToast) {
        onToast(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || 'Login failed');
    }
  }, [phone, selectedCountry, password, isArabic, onToast]);

  return {
    selectedCountry,
    setSelectedCountry,
    phone,
    handlePhoneChange,
    password,
    handlePasswordChange,
    showPassword,
    handleToggleShowPassword,
    error,
    handleLoginSubmit,
    isArabic,
  };
};
