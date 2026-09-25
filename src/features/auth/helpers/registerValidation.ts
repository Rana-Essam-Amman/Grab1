import { RegisteredAccount } from '@/types';
import { MarketCode } from '@/shared/lib/marketGate';

export const validateEmail = (email: string, isArabic: boolean): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return isArabic ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string, isArabic: boolean): string | null => {
  if (password.length < 6) {
    return isArabic ? 'يجب أن تتكون كلمة المرور من 6 خانات على الأقل' : 'Password must be at least 6 characters';
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirm: string, isArabic: boolean): string | null => {
  if (password !== confirm) {
    return isArabic ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match';
  }
  return null;
};

export const validateDuplicateAccount = (
  email: string,
  phoneCleaned: string,
  country: MarketCode,
  registeredUsers: RegisteredAccount[],
  isArabic: boolean
): string | null => {
  const exists = registeredUsers.some(
    (user: RegisteredAccount) =>
      user.status !== 'pending' && (
        user.email.toLowerCase() === email.trim().toLowerCase() ||
        (user.phone === phoneCleaned && user.countryCode === country)
      )
  );

  if (exists) {
    return isArabic
      ? 'رقم الهاتف أو البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.'
      : 'Phone number or email is already registered. Please sign in.';
  }
  return null;
};
