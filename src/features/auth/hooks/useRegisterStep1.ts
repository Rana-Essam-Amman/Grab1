import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { cleanAndVerifyPhone } from '../helpers/phoneValidation';
import { MarketCode } from '@/shared/lib/marketGate';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDuplicateAccount
} from '../helpers/registerValidation';

interface UseRegisterStep1Options {
  onStageCredentials: (phone: string, pass: string, email: string, first: string, country: MarketCode, token: string) => void;
  onToast?: (msg: string) => void;
}

export const useRegisterStep1 = ({ onStageCredentials, onToast }: UseRegisterStep1Options) => {
  const { isArabic, browseCountryCode } = useUI();
  const { registerNewUser, registeredUsers } = useAuth();

  const [selectedCountry, setSelectedCountry] = useState<MarketCode>(browseCountryCode || 'JO');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const clearErr = () => setError('');
  
  const handleCountrySelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => { setSelectedCountry(e.target.value as MarketCode); clearErr(); }, []);
  const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setFirstName(e.target.value); clearErr(); }, []);
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setPhone(e.target.value); clearErr(); }, []);
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clearErr(); }, []);
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); clearErr(); }, []);
  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setConfirmPassword(e.target.value); clearErr(); }, []);
  const handleToggleShowPassword = useCallback(() => setShowPassword(p => !p), []);
  const handleToggleShowConfirmPassword = useCallback(() => setShowConfirmPassword(p => !p), []);

  const handleRegisterUnified = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    clearErr();

    const verification = cleanAndVerifyPhone(phone, selectedCountry);
    if (!verification.isValid) return setError(isArabic ? verification.errorMsgAr : verification.errorMsgEn);

    const emailErr = validateEmail(email, isArabic);
    if (emailErr) return setError(emailErr);

    const passErr = validatePassword(password, isArabic);
    if (passErr) return setError(passErr);

    const confErr = validateConfirmPassword(password, confirmPassword, isArabic);
    if (confErr) return setError(confErr);

    const dupErr = validateDuplicateAccount(email, verification.cleaned, selectedCountry, registeredUsers, isArabic);
    if (dupErr) return setError(dupErr);

    if (registerNewUser) {
      registerNewUser({
        firstName: firstName.trim() || 'Sufyan', email: email.trim(), phone: verification.cleaned,
        countryCode: selectedCountry, password: password, status: 'Pending'
      });
    }

    const token = 'SECURE-TOKEN-' + Math.floor(100000 + Math.random() * 900000);
    setTimeout(() => onToast?.(`[Demo Mode] Verification token sent to ${email.trim()}`), 1200);
    onStageCredentials(verification.cleaned, password, email.trim(), firstName.trim(), selectedCountry, token);
  }, [phone, selectedCountry, isArabic, email, password, confirmPassword, registeredUsers, firstName, registerNewUser, onStageCredentials, onToast]);

  return {
    isArabic, selectedCountry, firstName, phone, email, password, confirmPassword,
    showPassword, showConfirmPassword, error,
    handleCountrySelectChange, handleFirstNameChange, handlePhoneChange, handleEmailChange,
    handlePasswordChange, handleConfirmPasswordChange, handleToggleShowPassword,
    handleToggleShowConfirmPassword, handleRegisterUnified,
  };
};
