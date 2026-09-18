import { cleanAndVerifyPhone } from './phoneValidation';
import { useAuthStore } from '@/features/auth/store/auth.slice';

export interface VerifyForgotPasswordInput {
  phone: string;
  selectedCountry: string;
  email: string;
  isArabic: boolean;
}

export interface VerifyForgotPasswordResult {
  isValid: boolean;
  error?: string;
  cleanedPhone?: string;
}

export const verifyForgotPasswordInputs = ({
  phone,
  selectedCountry,
  email,
  isArabic,
}: VerifyForgotPasswordInput): VerifyForgotPasswordResult => {
  const phoneVerify = cleanAndVerifyPhone(phone, selectedCountry);
  if (!phoneVerify.isValid) {
    return {
      isValid: false,
      error: isArabic ? phoneVerify.errorMsgAr : phoneVerify.errorMsgEn,
    };
  }

  if (!email.trim() || !email.includes('@')) {
    return {
      isValid: false,
      error: isArabic
        ? 'يرجى إدخال بريد إلكتروني صالح'
        : 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    cleanedPhone: phoneVerify.cleaned,
  };
};

export const findRegisteredUserMatch = (
  cleanedPhone: string,
  countryCode: string,
  email: string
) => {
  const registeredUsers = useAuthStore.getState().registeredUsers;
  const targetEmail = email.trim().toLowerCase();
  return registeredUsers.find(
    (u) =>
      u.phone === cleanedPhone &&
      u.countryCode === countryCode &&
      u.email.toLowerCase() === targetEmail
  );
};
