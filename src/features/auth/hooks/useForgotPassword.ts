import { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import {
  verifyForgotPasswordInputs,
  findRegisteredUserMatch,
} from '../helpers/forgotPasswordValidation';

export interface UseForgotPasswordOptions {
  onToast?: (msg: string) => void;
}

export interface UseForgotPasswordReturn {
  selectedCountry: string;
  setSelectedCountry: (country: any) => void;
  phone: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  error: string;
  successMsg: string;
  handleForgotPasswordReset: (e: React.FormEvent) => Promise<void>;
  isArabic: boolean;
}

export const useForgotPassword = ({ onToast }: UseForgotPasswordOptions = {}): UseForgotPasswordReturn => {
  const { browseCountryCode, isArabic } = useUI();
  const [selectedCountry, setSelectedCountry] = useState(browseCountryCode || 'JO');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setError('');
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  }, []);

  const handleForgotPasswordReset = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const validation = verifyForgotPasswordInputs({ phone, selectedCountry, email, isArabic });
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const userMatch = findRegisteredUserMatch(validation.cleanedPhone!, selectedCountry, email);

      if (!userMatch) {
        setError(
          isArabic
            ? 'لم يتم العثور على حساب مطابقة لهذا الرقم والبريد الإلكتروني'
            : 'No matching account found with this phone and email'
        );
        setLoading(false);
        return;
      }

      const msg = isArabic
        ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}`
        : `Password reset link sent to ${email}`;
      setSuccessMsg(msg);
      if (onToast) onToast(msg);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }, [phone, selectedCountry, email, isArabic, onToast]);

  return {
    selectedCountry,
    setSelectedCountry,
    phone,
    handlePhoneChange,
    email,
    handleEmailChange,
    loading,
    error,
    successMsg,
    handleForgotPasswordReset,
    isArabic,
  };
};
